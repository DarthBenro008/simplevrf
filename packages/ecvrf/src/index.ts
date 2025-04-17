import { utils as nobleUtils, ProjectivePoint, CURVE } from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { utf8ToBytes, concatBytes, hexToBytes, bytesToHex } from './utils';

// Constants
const G = ProjectivePoint.BASE;
const DOMAIN = utf8ToBytes('ECVRF-secp256k1-SHA256-TAI');
const SUITE_STRING = Uint8Array.from([0x01]);  // 0x01 = suite string for secp256k1-SHA256

/**
 * Create a tagged hash (BIP-340 style)
 * @param tag - The tag string
 * @param messages - The messages to hash
 * @returns A SHA256 hash of the tagged message
 */
function taggedHash(tag: string, ...messages: Uint8Array[]): Uint8Array {
  const tagBytes = utf8ToBytes(tag);
  const tagHash = sha256(tagBytes);
  const concatenated = concatBytes(tagHash, tagHash, ...messages);
  return sha256(concatenated);
}

/**
 * Convert bytes to a BigInt number
 * @param bytes - The byte array to convert
 * @returns A BigInt representation of the bytes
 */
function bytesToNumber(bytes: Uint8Array): bigint {
  return BigInt('0x' + bytesToHex(bytes));
}

/**
 * Hash an input to a valid curve point
 * More robust implementation of hash-to-curve
 * @param alpha - The input to hash
 * @returns A valid curve point
 */
async function hashToCurve(alpha: Uint8Array): Promise<ProjectivePoint> {
  // Combine domain separation tag with the input
  const combinedInput = concatBytes(SUITE_STRING, DOMAIN, alpha);
  
  // Iteratively try to find a valid point
  for (let counter = 0; counter < 256; counter++) {
    // Add counter to ensure we get different points for different attempts
    const attempt = concatBytes(combinedInput, Uint8Array.from([counter]));
    const hash = sha256(attempt);
    
    try {
      // Convert hash to a potential private key
      const privateKey = hash.slice(0, 32);
      
      // Try to create a point using the hash as a private key
      // This is a common approach for hash-to-curve in VRF implementations
      const point = ProjectivePoint.fromPrivateKey(privateKey);
      
      // Return the point (deterministic for the same input)
      return point;
    } catch {
      // If point creation fails, try again with a different counter
      continue;
    }
  }
  
  // This is extremely unlikely to happen with 256 attempts
  throw new Error('Could not hash to curve after maximum attempts');
}

/**
 * Generate a new ECVRF key pair
 * @returns An object containing private key (sk) and public key (pk)
 */
export async function generateKeyPair(): Promise<{ sk: Uint8Array; pk: string }> {
  const sk = nobleUtils.randomPrivateKey();
  const pubKey = ProjectivePoint.fromPrivateKey(sk);
  
  // Return the public key in compressed form for efficiency
  return { 
    sk, 
    pk: pubKey.toHex(true) 
  };
}

/**
 * Create an ECVRF proof for the given message using the private key
 * @param sk - The private key
 * @param alpha - The message to create a proof for
 * @returns An object containing the proof and gamma point
 */
export async function prove(sk: Uint8Array, alpha: Uint8Array): Promise<{ proof: string; gamma: string }> {
  // Convert private key to scalar
  const x = bytesToNumber(sk);
  
  // Public key corresponding to sk
  const Y = ProjectivePoint.fromPrivateKey(sk);
  
  // Hash the input to a curve point
  const H = await hashToCurve(alpha);
  
  // Calculate gamma = H^x (the VRF output)
  const gamma = H.multiply(x);
  
  // Choose a random k for the non-interactive zero-knowledge proof
  const k = bytesToNumber(nobleUtils.randomPrivateKey());
  
  // Calculate k·G and k·H for the proof
  const kG = G.multiply(k);
  const kH = H.multiply(k);
  
  // Calculate the challenge c = H(G,H,Y,gamma,k·G,k·H)
  const c = taggedHash(
    'ECVRF_challenge',
    G.toRawBytes(true),
    H.toRawBytes(true),
    Y.toRawBytes(true),
    gamma.toRawBytes(true),
    kG.toRawBytes(true),
    kH.toRawBytes(true)
  );
  
  const cNum = bytesToNumber(c);
  
  // Calculate s = k + c·x mod n
  const s = (k + cNum * x) % CURVE.n;
  
  // The proof consists of gamma, c, and s
  const gammaHex = gamma.toHex(true);  // Use compressed form
  const cHex = bytesToHex(c);
  const sHex = s.toString(16).padStart(64, '0');
  
  const proof = gammaHex + cHex + sHex;
  
  return {
    proof,
    gamma: gammaHex
  };
}

/**
 * Verify an ECVRF proof
 * @param pkHex - The public key in hex format
 * @param alpha - The original message
 * @param proof - The proof to verify
 * @returns True if the proof is valid, false otherwise
 */
export async function verify(pkHex: string, alpha: Uint8Array, proof: string): Promise<boolean> {
  try {
    // The proof string length should be correct
    // 66 chars for compressed gamma + 64 chars for c + 64 chars for s
    if (proof.length !== 194) {
      return false;
    }
    
    // Split the proof into its components
    const gammaHex = proof.slice(0, 66);  // 33 bytes compressed
    const cHex = proof.slice(66, 130);    // 32 bytes
    const sHex = proof.slice(130, 194);   // 32 bytes
    
    // Parse the public key, gamma point, and the scalars c and s
    const Y = ProjectivePoint.fromHex(pkHex);
    const gamma = ProjectivePoint.fromHex(gammaHex);
    const c = BigInt('0x' + cHex);
    const s = BigInt('0x' + sHex);
    
    // Hash the input to a curve point
    const H = await hashToCurve(alpha);
    
    // Calculate U = s·G - c·Y
    const sG = G.multiply(s);
    const cY = Y.multiply(c);
    const U = sG.add(cY.negate());
    
    // Calculate V = s·H - c·gamma
    const sH = H.multiply(s);
    const cGamma = gamma.multiply(c);
    const V = sH.add(cGamma.negate());
    
    // Recalculate the challenge c' = H(G,H,Y,gamma,U,V)
    const cPrime = taggedHash(
      'ECVRF_challenge',
      G.toRawBytes(true),
      H.toRawBytes(true),
      Y.toRawBytes(true),
      gamma.toRawBytes(true),
      U.toRawBytes(true),
      V.toRawBytes(true)
    );
    
    // The proof is valid if c' = c
    return bytesToHex(cPrime) === cHex;
  } catch (error) {
    // If any step fails (e.g., invalid point encoding), the proof is invalid
    console.error('Verification error:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

/**
 * Convert an ECVRF proof gamma value to a hash
 * @param gammaHex - The gamma component of the proof in hex format
 * @returns A 32-byte hash derived from gamma
 */
export async function proofToHash(gammaHex: string): Promise<Uint8Array> {
  try {
    // Parse the gamma point
    const gamma = ProjectivePoint.fromHex(gammaHex);
    
    // Hash the gamma point to produce the final VRF output
    return taggedHash('ECVRF_hash', SUITE_STRING, gamma.toRawBytes(true));
  } catch (error) {
    // If gamma is invalid, throw an error
    throw new Error(`Invalid gamma value: ${error instanceof Error ? error.message : String(error)}`);
  }
}
