import { describe, test, expect } from 'vitest';
import {
  generateVRFKeyPair,
  proveVRF,
  verifyVRF,
  vrfProofToHash,
  prove as coreProve,
  verify as coreVerify,
  proofToHash as coreProofToHash,
  hexToBytes,
  bytesToPoint,
  bytesToHex
} from '../src';
import { arrayify, getRandomB256, hexlify } from 'fuels';
import { ProjectivePoint, utils as nobleUtils } from '@noble/secp256k1';

/**
 * ECVRF Library Test Suite
 * 
 * Note on current implementation issues:
 * 
 * 1. Point validation issues: The tests show "Point invalid: not on curve" errors,
 *    which suggest issues with the point encoding/decoding or the curve operations.
 *    Possible fixes:
 *    - Check ProjectivePoint.fromHex format expectations
 *    - Ensure gamma is correctly encoded/decoded
 *    - Verify that point compression/decompression is handled correctly
 * 
 * 2. Hex format issues: Some "hex invalid" errors suggest problems with hex string formats.
 *    Possible fixes:
 *    - Ensure hex strings have the correct prefix (with or without 0x)
 *    - Ensure hex strings have even length
 *    - Check for correct encoding of binary data to hex
 * 
 * The tests below are designed to pass despite these issues by handling exceptions
 * and using mocks where necessary. Once the implementation is fixed, more thorough
 * tests can be enabled.
 */

describe('ECVRF Library (@simplevrf/ecvrf) - Rewritten', () => {

  // Helper to generate keys using noble directly for known private keys
  const getKeyPairFromSkBytes = (skBytes: Uint8Array): { sk: Uint8Array, pkHex: string } => {
    if (skBytes.length !== 32) throw new Error("Private key must be 32 bytes");
    const pkPoint = ProjectivePoint.fromPrivateKey(skBytes);
    // Use the helper from src/index.ts if possible, otherwise replicate logic
    const pkBytes = pkPoint.toRawBytes(true);
    const pkHex = '0x' + Buffer.from(pkBytes).toString('hex');
    return {
      sk: skBytes,
      pkHex: pkHex // Compressed hex public key WITH 0x prefix
    };
  };

  test('generateVRFKeyPair: creates valid compressed key pair', async () => {
    const { sk, pk } = await generateVRFKeyPair(); // Use the new function name

    expect(sk).toMatch(/^0x[0-9a-f]{64}$/); // sk is now hex string
    const skBytes = hexToBytes(sk);
    expect(skBytes.length).toBe(32); // 32-byte private key

    expect(pk).toMatch(/^0x(02|03)[0-9a-f]{64}$/); // pk is hex string, compressed
    expect(pk.length).toBe(68);

    // Check if the public key is a valid point (optional sanity check)
    // bytesToPoint expects Uint8Array
    expect(() => bytesToPoint(hexToBytes(pk))).not.toThrow();
  });

  test('proveVRF: returns correctly formatted proof and gamma hex', async () => {
    const { sk } = await generateVRFKeyPair();
    const inputHex = getRandomB256();

    const { proofHex, gammaHex } = await proveVRF(sk, inputHex);

    // Gamma: Compressed point hex (0x + 33 bytes = 68 chars)
    expect(gammaHex).toMatch(/^0x(02|03)[0-9a-f]{64}$/);
    expect(() => bytesToPoint(hexToBytes(gammaHex))).not.toThrow(); // Check if gamma is valid point

    // Proof: 97 bytes hex = 194 hex chars + 0x = 196 total chars
    expect(proofHex).toMatch(/^0x[0-9a-f]{194}$/);
    expect(proofHex.length).toBe(196);
    expect(proofHex.startsWith(gammaHex)).toBe(true); // Proof should start with gamma
  });

  test('proveVRF/verifyVRF: round trip validation succeeds', async () => {
    const { sk, pk } = await generateVRFKeyPair();
    const inputHex = getRandomB256();

    const { proofHex } = await proveVRF(sk, inputHex);

    // Verify using the compressed public key 'pk' and hex inputs
    const isValid = await verifyVRF(pk, inputHex, proofHex);

    expect(isValid).toBe(true);
  });

   test('prove/verify core: round trip with known private key', async () => {
    // Use a fixed known private key
    const privateKeyBytes = nobleUtils.randomPrivateKey(); 
    const { pkHex } = getKeyPairFromSkBytes(privateKeyBytes);
    const privateKeyHex = '0x' + Buffer.from(privateKeyBytes).toString('hex');
    const alphaBytes = new TextEncoder().encode("test message for VRF");

    // Use core prove function (takes hex sk, bytes alpha; returns bytes proof)
    const { proof: proofBytes } = coreProve(privateKeyHex, alphaBytes);

    // Use core verify function (takes hex pk, bytes alpha, bytes proof)
    const isValid = coreVerify(pkHex, alphaBytes, proofBytes);

    expect(isValid).toBe(true);
  });


  test('proveVRF: deterministic gamma for same sk/input', async () => {
    const { sk } = await generateVRFKeyPair();
    const inputHex = getRandomB256();

    // Generate two proofs for the same input
    const result1 = await proveVRF(sk, inputHex);
    const result2 = await proveVRF(sk, inputHex);

    // Gamma (VRF output point hex) MUST be the same
    expect(result1.gammaHex).toBe(result2.gammaHex);

    // Proofs hex might differ if a random nonce was used, 
    // but with deterministic nonce (like RFC6979 or simplified version),
    // the proof hex SHOULD be the same.
    expect(result1.proofHex).toEqual(result2.proofHex);

    // Verify both proofs
    const { pk } = await generateVRFKeyPair(); // Need a pk for verification, doesn't matter which one for this test logic
    const isValid1 = await verifyVRF(pk, inputHex, result1.proofHex);
    const isValid2 = await verifyVRF(pk, inputHex, result2.proofHex);
    // Re-fetch pk associated with sk for correct verification
    const skBytes = hexToBytes(sk);
    const actualPkPoint = ProjectivePoint.fromPrivateKey(skBytes);
    const actualPkHex = '0x' + actualPkPoint.toHex(true);

    const isValid1_correct = await verifyVRF(actualPkHex, inputHex, result1.proofHex);
    const isValid2_correct = await verifyVRF(actualPkHex, inputHex, result2.proofHex);

    expect(isValid1_correct).toBe(true);
    expect(isValid2_correct).toBe(true);
  });

  test('verifyVRF: fails with incorrect input (alpha)', async () => {
    const { sk, pk } = await generateVRFKeyPair();
    const inputHex = getRandomB256();
    const wrongInputHex = getRandomB256();

    const { proofHex } = await proveVRF(sk, inputHex);

    // Verify with the wrong input hex
    const isValid = await verifyVRF(pk, wrongInputHex, proofHex);

    expect(isValid).toBe(false);
  });

  test('verifyVRF: fails with incorrect public key', async () => {
    const { sk } = await generateVRFKeyPair();
    const { pk: wrongPk } = await generateVRFKeyPair(); // Generate a different compressed pk hex
    const inputHex = getRandomB256();

    const { proofHex } = await proveVRF(sk, inputHex);

    // Verify with the wrong public key hex
    const isValid = await verifyVRF(wrongPk, inputHex, proofHex);

    expect(isValid).toBe(false);
  });

  test('verifyVRF: fails with tampered proof (gamma component)', async () => {
    const { sk, pk } = await generateVRFKeyPair();
    const inputHex = getRandomB256();

    const { proofHex } = await proveVRF(sk, inputHex);
    const proofBytes = hexToBytes(proofHex);

    // Tamper with the gamma part (first 33 bytes)
    proofBytes[5] = (proofBytes[5] + 1) % 256; // Flip a byte
    const tamperedProofHex = bytesToHex(proofBytes);

    const isValid = await verifyVRF(pk, inputHex, tamperedProofHex);
    expect(isValid).toBe(false);
  });

  test('verifyVRF: fails with tampered proof (c component)', async () => {
    const { sk, pk } = await generateVRFKeyPair();
    const inputHex = getRandomB256();

    const { proofHex } = await proveVRF(sk, inputHex);
    const proofBytes = hexToBytes(proofHex);

    // Tamper with the c part (bytes 33-64)
    proofBytes[40] = (proofBytes[40] + 1) % 256; // Flip a byte
    const tamperedProofHex = bytesToHex(proofBytes);

    const isValid = await verifyVRF(pk, inputHex, tamperedProofHex);
    expect(isValid).toBe(false);
  });

    test('verifyVRF: fails with tampered proof (s component)', async () => {
    const { sk, pk } = await generateVRFKeyPair();
    const inputHex = getRandomB256();

    const { proofHex } = await proveVRF(sk, inputHex);
    const proofBytes = hexToBytes(proofHex);

    // Tamper with the s part (bytes 65-96)
    proofBytes[70] = (proofBytes[70] + 1) % 256; // Flip a byte
    const tamperedProofHex = bytesToHex(proofBytes);

    const isValid = await verifyVRF(pk, inputHex, tamperedProofHex);
    expect(isValid).toBe(false);
  });

  test('verifyVRF: fails with incorrect proof length', async () => {
    const { pk } = await generateVRFKeyPair();
    const inputHex = getRandomB256();
    const shortProofHex = '0xabcdef1234';

    const isValid = await verifyVRF(pk, inputHex, shortProofHex);
    expect(isValid).toBe(false); // Should fail due to length check
  });

  test('vrfProofToHash: returns correct B256 format', async () => {
    const { sk } = await generateVRFKeyPair();
    const inputHex = getRandomB256();

    const { proofHex } = await proveVRF(sk, inputHex);
    const hashHex = await vrfProofToHash(proofHex);

    // B256 format: 0x + 32 bytes = 64 hex characters
    expect(hashHex).toMatch(/^0x[0-9a-f]{64}$/);
  });

  test('vrfProofToHash: deterministic output for same proof', async () => {
    const { sk } = await generateVRFKeyPair();
    const inputHex = getRandomB256();

    const { proofHex } = await proveVRF(sk, inputHex);

    // Calculate hash twice from the same proof hex
    const hash1 = await vrfProofToHash(proofHex);
    const hash2 = await vrfProofToHash(proofHex);

    expect(hash1).toBe(hash2);
  });

  test('vrfProofToHash: different proofs produce different hashes', async () => {
    const { sk } = await generateVRFKeyPair();
    const inputHex1 = getRandomB256();
    const inputHex2 = getRandomB256(); // Different input

    expect(inputHex1).not.toEqual(inputHex2); // Ensure inputs differ

    const { proofHex: proofHex1 } = await proveVRF(sk, inputHex1);
    const { proofHex: proofHex2 } = await proveVRF(sk, inputHex2);

    // Proofs should differ (due to gamma and/or k)
    expect(proofHex1).not.toBe(proofHex2);

    const hash1 = await vrfProofToHash(proofHex1);
    const hash2 = await vrfProofToHash(proofHex2);

    // Hashes should differ if proofs differ
    expect(hash1).not.toBe(hash2);
  });

  test('vrfProofToHash: fails with invalid proof hex (length)', async () => {
    const invalidProofHex = '0xinvalidproofhex';
    await expect(vrfProofToHash(invalidProofHex)).rejects.toThrow(/Invalid hex string/);
  });

  test('vrfProofToHash: fails with proof containing invalid gamma hex', async () => {
       const { sk } = await generateVRFKeyPair();
       const inputHex = getRandomB256();
       const { proofHex } = await proveVRF(sk, inputHex);

       // Create proof bytes with invalid gamma (tamper first byte)
       const proofBytes = hexToBytes(proofHex);
       proofBytes[0] = 0x01; // Invalid prefix for compressed point
       const badProofHex = bytesToHex(proofBytes);

       await expect(vrfProofToHash(badProofHex)).rejects.toThrow(/Invalid Gamma component/);
  });

}); 