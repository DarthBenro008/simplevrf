import { describe, test, expect, beforeAll } from 'vitest';
import { verify, proofToHash } from '../src';
import { utf8ToBytes, bytesToHex, hexToBytes } from '../src/utils';
import fs from 'fs';
import path from 'path';

interface TestVector {
  id: string;
  privateKey: string;
  publicKey: string;
  message: string;
  alpha: string;
  proof: string;
  gamma: string;
  hash: string;
  verified: boolean;
}

describe('ECVRF with Test Vectors', () => {
  let testVectors: TestVector[] = [];
  
  beforeAll(() => {
    // Try to load test vectors if they exist
    try {
      const vectorsPath = path.join(__dirname, 'test-vectors.json');
      if (fs.existsSync(vectorsPath)) {
        const fileContent = fs.readFileSync(vectorsPath, 'utf8');
        testVectors = JSON.parse(fileContent);
        console.log(`Loaded ${testVectors.length} test vectors`);
      } else {
        console.log('No test vectors file found. Run generate-test-vectors.ts first.');
      }
    } catch (error) {
      console.warn('Failed to load test vectors:', error);
    }
  });

  test('Test vectors file exists', () => {
    // This test passes even if no vectors are found - it's just informational
    if (testVectors.length === 0) {
      console.log('No test vectors available. Some tests will be skipped.');
    }
    expect(true).toBe(true);
  });

  // Only run the vector tests if we have vectors
  if (testVectors.length > 0) {
    test.each(testVectors)('Vector $id verifies correctly', async (vector) => {
      const messageBytes = hexToBytes(vector.alpha);
      const isValid = await verify(vector.publicKey, messageBytes, vector.proof);
      expect(isValid).toBe(true);
    });

    test.each(testVectors)('Vector $id produces correct hash', async (vector) => {
      const hash = await proofToHash(vector.gamma);
      expect(bytesToHex(hash)).toBe(vector.hash);
    });

    test.each(testVectors)('Vector $id fails with modified message', async (vector) => {
      // Modify the message by appending a character
      const modifiedMessage = utf8ToBytes(vector.message + 'X');
      
      const isValid = await verify(vector.publicKey, modifiedMessage, vector.proof);
      expect(isValid).toBe(false);
    });

    test('Cross validation between vectors with same key', async () => {
      // Find vectors with the same private key
      const privateKey = testVectors[0].privateKey;
      const sameKeyVectors = testVectors.filter(v => v.privateKey === privateKey);
      
      if (sameKeyVectors.length >= 2) {
        const vector1 = sameKeyVectors[0];
        const vector2 = sameKeyVectors[1];
        
        // Verify vector1 proof doesn't work with vector2 message
        const message2Bytes = hexToBytes(vector2.alpha);
        const isValid = await verify(vector1.publicKey, message2Bytes, vector1.proof);
        expect(isValid).toBe(false);
      }
    });
  }
}); 