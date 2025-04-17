import { generateKeyPair, prove, verify, proofToHash } from '../src';
import { utf8ToBytes, bytesToHex, hexToBytes } from '../src/utils';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM module replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestVector {
  id: string;
  privateKey: string;
  publicKey: string;
  message: string;
  alpha: string; // hex encoded message bytes
  proof: string;
  gamma: string;
  hash: string;
  verified: boolean;
}

async function generateTestVectors() {
  console.log('Generating ECVRF test vectors...');
  
  const vectors: TestVector[] = [];
  
  // Fixed private key (a known good test key from Bitcoin/secp256k1 test vectors)
  const privateKey1 = hexToBytes('c9afa9d845ba75166b5c215767b1d6934e50c3db36e89b127b8a622b120f6721');
  
  // Generate public key from the private key
  const publicKey1 = (await Promise.resolve().then(async () => {
    const { ProjectivePoint } = await import('@noble/secp256k1');
    return ProjectivePoint.fromPrivateKey(privateKey1).toHex(true);
  }));
  
  console.log(`Using fixed private key: ${bytesToHex(privateKey1)}`);
  console.log(`Corresponding public key: ${publicKey1}`);
  
  // Test with various messages
  const messages = [
    'sample',
    '',  // empty message
    'abc',
    'test message',
    'ECVRF test vector for secp256k1',
    'This is a longer message to test with the ECVRF implementation'
  ];
  
  // Generate vectors for fixed key
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const alpha = utf8ToBytes(message);
    
    try {
      const { proof, gamma } = await prove(privateKey1, alpha);
      const hash = await proofToHash(gamma);
      const isValid = await verify(publicKey1, alpha, proof);
      
      const vector: TestVector = {
        id: `fixed-key-${i + 1}`,
        privateKey: bytesToHex(privateKey1),
        publicKey: publicKey1,
        message: message,
        alpha: bytesToHex(alpha),
        proof: proof,
        gamma: gamma,
        hash: bytesToHex(hash),
        verified: isValid
      };
      
      vectors.push(vector);
      console.log(`Generated vector ${i + 1} for message: "${message}"`);
    } catch (error) {
      console.error(`Error generating vector for message "${message}":`, error);
    }
  }
  
  // Generate a vector with random key
  try {
    const { sk, pk } = await generateKeyPair();
    const message = 'random key test';
    const alpha = utf8ToBytes(message);
    
    const { proof, gamma } = await prove(sk, alpha);
    const hash = await proofToHash(gamma);
    const isValid = await verify(pk, alpha, proof);
    
    const vector: TestVector = {
      id: 'random-key-1',
      privateKey: bytesToHex(sk),
      publicKey: pk,
      message: message,
      alpha: bytesToHex(alpha),
      proof: proof,
      gamma: gamma,
      hash: bytesToHex(hash),
      verified: isValid
    };
    
    vectors.push(vector);
    console.log(`Generated vector with random key for message: "${message}"`);
  } catch (error) {
    console.error('Error generating random key vector:', error);
  }
  
  // Write vectors to file
  const outputPath = path.join(__dirname, 'test-vectors.json');
  fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2));
  
  console.log(`Test vectors written to ${outputPath}`);
  
  // Verify all vectors
  console.log('\nVerifying all test vectors...');
  for (const vector of vectors) {
    const messageBytes = hexToBytes(vector.alpha);
    const isValid = await verify(vector.publicKey, messageBytes, vector.proof);
    console.log(`Vector ${vector.id} - verified: ${isValid}`);
  }
}

// Run the generator
generateTestVectors().catch(error => {
  console.error('Error generating test vectors:', error);
  process.exit(1);
}); 