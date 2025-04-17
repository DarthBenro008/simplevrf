import { generateKeyPair, prove, verify, proofToHash } from '../src';
import { utf8ToBytes, bytesToHex, hexToBytes } from '../src/utils';
import fs from 'fs';

async function generateTestVectors() {
  console.log('Generating ECVRF test vectors...');
  
  // Vector 1: Using a fixed key and message
  const privateKey = hexToBytes('c9afa9d845ba75166b5c215767b1d6934e50c3db36e89b127b8a622b120f6721');
  // Derive public key from private key
  const pk = await import('@noble/secp256k1').then(({ ProjectivePoint }) => 
    ProjectivePoint.fromPrivateKey(privateKey).toHex()
  );
  
  const messages = [
    'sample',
    '',
    'test message',
    'ECVRF test vector with longer input to test variable length messages'
  ];
  
  const vectors = [];
  
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const alpha = utf8ToBytes(message);
    
    const { proof, gamma } = await prove(privateKey, alpha);
    const isValid = await verify(pk, alpha, proof);
    const hash = await proofToHash(gamma);
    
    vectors.push({
      vectorId: i + 1,
      privateKey: bytesToHex(privateKey),
      publicKey: pk,
      message,
      alpha: bytesToHex(alpha),
      proof,
      gamma,
      hash: bytesToHex(hash),
      verified: isValid
    });
    
    console.log(`Generated vector ${i + 1} for message: "${message}"`);
  }
  
  // Generate one more vector with random key
  const { sk, pk: randomPk } = await generateKeyPair();
  const message = 'random key test';
  const alpha = utf8ToBytes(message);
  
  const { proof, gamma } = await prove(sk, alpha);
  const isValid = await verify(randomPk, alpha, proof);
  const hash = await proofToHash(gamma);
  
  vectors.push({
    vectorId: vectors.length + 1,
    privateKey: bytesToHex(sk),
    publicKey: randomPk,
    message,
    alpha: bytesToHex(alpha),
    proof,
    gamma,
    hash: bytesToHex(hash),
    verified: isValid
  });
  
  console.log(`Generated vector ${vectors.length} with random key`);
  
  // Write vectors to file
  const vectorsJson = JSON.stringify(vectors, null, 2);
  fs.writeFileSync('./test/test-vectors.json', vectorsJson);
  
  console.log('Test vectors written to test/test-vectors.json');
  
  // Print one vector for immediate use
  console.log('\nSample vector for use in tests:');
  console.log(JSON.stringify(vectors[0], null, 2));
}

generateTestVectors().catch(console.error); 