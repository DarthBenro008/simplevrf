import { ProjectivePoint, CURVE, utils as nobleUtils } from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha256';
import { concatBytes, randomBytes } from '@noble/hashes/utils'; // Use noble utils

// Constants from RFC 9381 for suite ECVRF-SECP256k1-SHA256-TAI
const SUITE_ID = 0x01;
const COFACTOR = 1;
//const FIELD_MODULUS = CURVE.P;
const CURVE_ORDER = CURVE.n;
const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);

// Helper to convert hex string (with or without 0x) to Uint8Array
export function hexToBytes(hex: string): Uint8Array {
  if (typeof hex !== 'string') {
    throw new Error(`Invalid input type for hexToBytes: expected string, got ${typeof hex}`);
  }
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (cleanHex.length % 2 !== 0) {
    throw new Error('Invalid hex string length');
  }
  try {
    return Buffer.from(cleanHex, 'hex');
  } catch (e) {
    throw new Error(`Invalid hex string characters: ${e}`);
  }
}

// Helper to convert Uint8Array to hex string with 0x prefix
export function bytesToHex(bytes: Uint8Array): string {
  return '0x' + Buffer.from(bytes).toString('hex');
}

// Helper to convert Uint8Array to BigInt
function bytesToBigInt(bytes: Uint8Array): bigint {
  return BigInt(bytesToHex(bytes));
}

// Helper to convert BigInt to Uint8Array (32 bytes for scalar, CURVE.n size)
function bigIntToBytes(num: bigint): Uint8Array {
  if (num < ZERO) throw new Error("BigInt must be non-negative");
  let hex = num.toString(16);
  if (hex.length % 2 !== 0) hex = '0' + hex; // Ensure even length
  const len = 32 * 2; // 32 bytes for secp256k1 scalar
  hex = hex.padStart(len, '0'); // Pad to 32 bytes
  return hexToBytes(hex);
}

// Helper: Point to Octet String (Compressed)
function pointToBytes(point: ProjectivePoint): Uint8Array {
  return point.toRawBytes(true);
}

// Helper: Octet String to Point
export function bytesToPoint(bytes: Uint8Array): ProjectivePoint {
  const hexInput = bytesToHex(bytes).slice(2); // Get hex without 0x
  // --- TEMPORARY DEBUG LOG --- 
  // console.log(`[DEBUG ecvrf] bytesToPoint attempting ProjectivePoint.fromHex with: '${hexInput}' (Length: ${hexInput.length})`);
  // --- END DEBUG LOG ---
  try {
    // Use ProjectivePoint.fromHex directly which handles compressed format
    const point = ProjectivePoint.fromHex(hexInput); // fromHex needs NO prefix
    point.assertValidity(); // Check if point is on curve
    return point;
  } catch (error) {
    // --- TEMPORARY DEBUG LOG --- 
    // console.error(`[DEBUG ecvrf] ProjectivePoint.fromHex failed for input: '${hexInput}'`, error);
    // --- END DEBUG LOG ---
    throw new Error(`Failed to convert bytes to point: ${error instanceof Error ? error.message : error}`);
  }
}

// Hash function (SHA256)
function H(input: Uint8Array): Uint8Array {
  return sha256(input);
}

// Nonce generation (RFC 6979 style, simplified here)
function generateNonce(sk: bigint, h: Uint8Array): bigint {
  // WARNING: This is NOT a proper RFC6979 implementation.
  // For production, use a robust library like `micro-ft-nonce` or `rfc6979`.
  // This simplified version uses SK + hash for demonstration.
  const seed = concatBytes(bigIntToBytes(sk), h);
  let k = bytesToBigInt(H(seed)) % CURVE_ORDER;
  if (k === ZERO) k = ONE; // Avoid zero nonce
  return k;
}


// --- ECVRF Functions (Based on RFC 9381 Sections 5.1, 5.2, 5.3, 5.4.4) ---

// 5.4.4. Hash To Curve Try And Increment
function hashToCurveTAI(alpha: Uint8Array): ProjectivePoint {
  const PK_STRING = new Uint8Array([SUITE_ID]);
  let ctr = 0;
  while (ctr < 256) {
    const ctr_octet = new Uint8Array([ctr]);
    const hash_input = concatBytes(PK_STRING, alpha, ctr_octet);
    const h = H(hash_input);
    try {
      // Pass generated hash `h` directly to bytesToPoint, which expects 33 bytes (prefix + hash)
      const point = bytesToPoint(concatBytes(new Uint8Array([0x02]), h.slice(0, 32))); // Attempt prefix 0x02 with 32 hash bytes
      // COFACTOR is 1 for secp256k1, so point.multiply(COFACTOR) is just the point itself.
      // Check if point is the identity element (point at infinity)
      if (point.equals(ProjectivePoint.ZERO)) continue; 
      return point;
    } catch (e) {
        // Try prefix 0x03 if 0x02 failed
        try {
            const point = bytesToPoint(concatBytes(new Uint8Array([0x03]), h.slice(0, 32))); // Attempt prefix 0x03 with 32 hash bytes
            if (point.equals(ProjectivePoint.ZERO)) continue; // Check if point is identity
            return point;
        } catch (e2) {
             // continue if neither worked
        }
    }
    ctr++;
  }
  throw new Error('hashToCurveTAI: Failed to hash to curve');
}

// 5.1. ECVRF Proving
export function prove(privateKeyHex: string, alpha: Uint8Array): { proof: Uint8Array; gamma: ProjectivePoint } {
  const skBytes = hexToBytes(privateKeyHex);
  const sk = bytesToBigInt(skBytes);
  if (sk === ZERO || sk >= CURVE_ORDER) {
    throw new Error('Invalid private key');
  }
  const pkPoint = ProjectivePoint.fromPrivateKey(skBytes); // Public key point Y

  // Step 1 & 2: H = HashToCurve(Y, alpha)
  const H_point = hashToCurveTAI(alpha); // Note: RFC uses Y in hash, simpler TAI version omits it for this suite

  // Step 3: Gamma = H^x
  const Gamma = H_point.multiply(sk);

  // Step 4: k = NonceGeneration(SK, H)
  // Using simplified nonce here. For spec compliance, use RFC6979.
  const k = generateNonce(sk, pointToBytes(H_point));

  // Step 5: c = HashPoints(H, Gamma, kG = G*k, kH = H*k)
  const kG = ProjectivePoint.BASE.multiply(k);
  const kH = H_point.multiply(k);
  const c_input = concatBytes(
    pointToBytes(ProjectivePoint.BASE),
    pointToBytes(H_point),
    pointToBytes(pkPoint),
    pointToBytes(Gamma),
    pointToBytes(kG),
    pointToBytes(kH)
  );
  // Hash function needs domain separation - using simple hash for now
  // Ideally: H2(suite_id, 0x01, c_input)
  const c_hash = H(concatBytes(new Uint8Array([SUITE_ID, 0x01]), c_input)); // Use constant 1 for challenge generation hash
  const c = bytesToBigInt(c_hash); // Challenge scalar

  // Step 6: s = (k + c*x) mod q
  const s = (k + c * sk) % CURVE_ORDER;

  // Step 7: proof = point_to_string(Gamma) || int_to_string(c, n) || int_to_string(s, n)
  const proof = concatBytes(
    pointToBytes(Gamma),  // 33 bytes
    bigIntToBytes(c),      // 32 bytes
    bigIntToBytes(s)       // 32 bytes
  );
  // Total proof length = 33 + 32 + 32 = 97 bytes

  return { proof, gamma: Gamma };
}

// 5.3. ECVRF Verifying
export function verify(publicKeyHex: string, alpha: Uint8Array, proof: Uint8Array): boolean {
  try {
    // --- TEMPORARY DEBUG LOG ---
    // console.log(`[DEBUG verify] typeof publicKeyHex (at start): ${typeof publicKeyHex}`);
    // --- END DEBUG LOG ---
    const pkBytes = hexToBytes(publicKeyHex);
    
    // --- TEMPORARY DEBUG LOG --- 
    // console.log(`[DEBUG ecvrf verify] Trying to parse Public Key Hex: '${publicKeyHex}'`);
    // console.log(`[DEBUG ecvrf verify] Public Key bytes length: ${pkBytes.length}`);
    // --- END DEBUG LOG ---
    const pkPoint = bytesToPoint(pkBytes); // Public key Y

    // Step 1: Decode proof = Gamma_string || c_string || s_string
    if (proof.length !== 97) {
      console.error('Invalid proof length');
      return false;
    }
    const gammaBytes = proof.slice(0, 33);
    const cBytes = proof.slice(33, 65);
    const sBytes = proof.slice(65, 97);

    // --- TEMPORARY DEBUG LOG --- 
    // console.log(`[DEBUG ecvrf verify] Trying to parse Gamma bytes (Length: ${gammaBytes.length})`);
    // --- END DEBUG LOG ---
    const Gamma = bytesToPoint(gammaBytes);
    const c = bytesToBigInt(cBytes);
    const s = bytesToBigInt(sBytes);

    // Step 2: H = HashToCurve(Y, alpha)
    const H_point = hashToCurveTAI(alpha);

    // Step 3: Validate Y and Gamma (implicitly done by bytesToPoint)
    // Step 4: U = s*G - c*Y => U = s*G + (- (c*Y))
    const sG = ProjectivePoint.BASE.multiply(s);
    const cY = pkPoint.multiply(c);
    const U = sG.add(cY.negate()); // Use add(negate()) instead of subtract

    // Step 5: V = s*H - c*Gamma => V = s*H + (- (c*Gamma))
    const sH = H_point.multiply(s);
    const cGamma = Gamma.multiply(c);
    const V = sH.add(cGamma.negate()); // Use add(negate()) instead of subtract

    // Step 6: c' = HashPoints(G, H, Y, Gamma, U, V)
    const c_prime_input = concatBytes(
      pointToBytes(ProjectivePoint.BASE),
      pointToBytes(H_point),
      pointToBytes(pkPoint),
      pointToBytes(Gamma),
      pointToBytes(U),
      pointToBytes(V)
    );
    // Hash function needs domain separation
    const c_prime_hash = H(concatBytes(new Uint8Array([SUITE_ID, 0x01]), c_prime_input)); // Use constant 1 for challenge generation hash
    const c_prime = bytesToBigInt(c_prime_hash);

    // Step 7: Check c' == c
    return c === c_prime;
  } catch (error) {
    console.error(`Verification failed: ${error instanceof Error ? error.message : error}`);
    return false;
  }
}

// 5.2. ECVRF Proof To Hash
export function proofToHash(proof: Uint8Array): Uint8Array {
  // Step 1: Decode proof to get Gamma
  if (proof.length !== 97) {
    throw new Error('Invalid proof length for hashing');
  }
  const gammaBytes = proof.slice(0, 33);
  let Gamma: ProjectivePoint;
  try {
      Gamma = bytesToPoint(gammaBytes);
  } catch (e) {
      throw new Error(`Cannot hash proof: Invalid Gamma component. ${e}`);
  }

  // Step 2: hash = H(suite_id || 0x03 || point_to_string(Gamma))
  const hash_input = concatBytes(
    new Uint8Array([SUITE_ID, 0x03]), // Use constant 3 for proof-to-hash
    pointToBytes(Gamma)
  );
  const hash = H(hash_input);
  return hash; // Return 32-byte hash
}

// --- Wrapper/Exported Functions ---

export function generateVRFKeyPair(): { sk: string; pk: string } {
  let skBytes: Uint8Array;
  let sk: bigint;
  // Keep generating until a valid key is found (non-zero, less than curve order)
  do {
    skBytes = randomBytes(32);
    sk = bytesToBigInt(skBytes);
  } while (sk === ZERO || sk >= CURVE_ORDER);
  
  const pkPoint = ProjectivePoint.fromPrivateKey(skBytes);
  return {
    sk: bytesToHex(skBytes),
    pk: bytesToHex(pointToBytes(pkPoint)) // Compressed public key hex
  };
}

export function proveVRF(privateKeyHex: string, alphaHex: string): { proofHex: string; gammaHex: string } {
  const alphaBytes = hexToBytes(alphaHex);
  const { proof: proofBytes, gamma } = prove(privateKeyHex, alphaBytes);
  return {
    proofHex: bytesToHex(proofBytes),
    gammaHex: bytesToHex(pointToBytes(gamma))
  };
}

// --- New Exported Type for Chunked Proof ---
/**
 * Represents the 97-byte VRF proof split into Fuel-compatible types.
 * p1: Bytes 0-31
 * p2: Bytes 32-63
 * p3: Bytes 64-95
 * p4: Byte 96
 */
export interface ChunkedProof {
    p1: string; // b256 hex string (0x...)
    p2: string; // b256 hex string (0x...)
    p3: string; // b256 hex string (0x...)
    p4: number; // u8
}

// Updated verifyVRF to accept ChunkedProof and remove async
export function verifyVRF(publicKeyHex: string, alphaHex: string, chunkedProof: ChunkedProof): boolean {
  try {
      // --- TEMPORARY DEBUG LOG --- 
      // console.log(`[DEBUG verifyVRF] typeof alphaHex: ${typeof alphaHex}`);
      // console.log(`[DEBUG verifyVRF] typeof chunkedProof.p1: ${typeof chunkedProof.p1}`);
      // console.log(`[DEBUG verifyVRF] typeof chunkedProof.p2: ${typeof chunkedProof.p2}`);
      // console.log(`[DEBUG verifyVRF] typeof chunkedProof.p3: ${typeof chunkedProof.p3}`);
      // --- END DEBUG LOG ---

      const alphaBytes = hexToBytes(alphaHex); // Calls hexToBytes

      // Reconstruct the 97-byte proof from chunks
      const p1Bytes = hexToBytes(chunkedProof.p1); // Calls hexToBytes
      const p2Bytes = hexToBytes(chunkedProof.p2); // Calls hexToBytes
      const p3Bytes = hexToBytes(chunkedProof.p3); // Calls hexToBytes
      // Ensure p4 is a valid u8
      if (chunkedProof.p4 < 0 || chunkedProof.p4 > 255 || !Number.isInteger(chunkedProof.p4)) {
          throw new Error('Invalid p4 value (must be a u8)');
      }
      const p4Bytes = new Uint8Array([chunkedProof.p4]);

      // Check chunk lengths
      if (p1Bytes.length !== 32 || p2Bytes.length !== 32 || p3Bytes.length !== 32) {
          throw new Error('Invalid b256 chunk length in proof');
      }

      const proofBytes = concatBytes(p1Bytes, p2Bytes, p3Bytes, p4Bytes);

      if (proofBytes.length !== 97) {
          // This should ideally not happen if concat works correctly
          throw new Error('Internal error: Reconstructed proof length is not 97');
      }

      // --- TEMPORARY DEBUG LOG ---
      // console.log(`[DEBUG verifyVRF] typeof publicKeyHex (before calling verify): ${typeof publicKeyHex}`);
      // --- END DEBUG LOG ---

      // Call the core verify function with reconstructed bytes
      return verify(publicKeyHex, alphaBytes, proofBytes); // Core verify is synchronous
  } catch (error) {
      console.error(`verifyVRF failed during input processing: ${error}`);
      return false;
  }
}

export function vrfProofToHash(proofHex: string): string {
  const proofBytes = hexToBytes(proofHex);
  const hashBytes = proofToHash(proofBytes);
  return bytesToHex(hashBytes); // Return B256 hex hash
}
