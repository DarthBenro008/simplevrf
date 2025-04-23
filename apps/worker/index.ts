import {
  generateVRFKeyPair,
  proveVRF,
  verifyVRF,
  vrfProofToHash,
  hexToBytes,
  bytesToHex,
  type ChunkedProof
} from "@simplevrf/ecvrf";
import { getRandomB256, arrayify, Wallet } from "fuels";
import { ProjectivePoint } from '@noble/secp256k1';

async function main() {
  try {
    // --- Key Generation (using Fuel Wallet) ---
    console.log("Generating Fuel wallet...");
    const wallet = Wallet.generate();
    const privateKeyBytes = arrayify(wallet.privateKey);
    const privateKeyHex = wallet.privateKey; // Keep hex for proveVRF

    // Derive the COMPRESSED public key using noble secp256k1
    const publicKeyPoint = ProjectivePoint.fromPrivateKey(privateKeyBytes);
    const publicKeyHex = '0x' + publicKeyPoint.toHex(true); // Get 33-byte compressed hex WITH 0x prefix

    console.log("Private key (hex):", privateKeyHex);
    console.log("Public key (Compressed hex):", publicKeyHex);

    // --- Input Generation ---
    const inputHex = getRandomB256();
    console.log("Random input (hex):", inputHex);

    // --- VRF Proof Generation ---
    console.log("\nGenerating proof using proveVRF...");
    const { proofHex, gammaHex } = await proveVRF(privateKeyHex, inputHex);
    console.log("VRF proof (hex string):", proofHex);
    console.log("VRF gamma (hex string - compressed point):", gammaHex);

    // --- Convert proofHex to ChunkedProof format ---
    const proofBytes = hexToBytes(proofHex); // Use helper from ecvrf package
    if (proofBytes.length !== 97) {
      throw new Error(`Generated proofBytes has unexpected length: ${proofBytes.length}`);
    }

    const chunkedProof: ChunkedProof = {
        p1: bytesToHex(proofBytes.slice(0, 32)),   // b256 hex
        p2: bytesToHex(proofBytes.slice(32, 64)),  // b256 hex
        p3: bytesToHex(proofBytes.slice(64, 96)),  // b256 hex
        p4: proofBytes[96] as number                         // u8 number
    };
    console.log("\nProof converted to ChunkedProof format:");
    console.log(chunkedProof);

    // --- VRF Proof Verification ---
    console.log("\nVerifying proof using verifyVRF (with ChunkedProof)...");
    // Pass hex public key, hex input alpha, and the chunked proof object
    const isValid = await verifyVRF(publicKeyHex, inputHex, chunkedProof);
    console.log("Proof verification result:", isValid);

    if (!isValid) {
      console.error("\n--- Verification Failed ---");
      console.error("Inputs provided to verifyVRF:");
      console.error("  Public Key (Compressed hex):", publicKeyHex);
      console.error("  Input (Hex):", inputHex);
      console.error("  Chunked Proof:", chunkedProof);
      throw new Error("Proof verification failed. See logs for details.");
    }

    // --- VRF Hash Calculation --- 
    // Note: The B256 value is the HASH derived from the proof, not the proof itself.
    console.log("\nCalculating B256 hash from proof using vrfProofToHash...");
    const hashHex = await vrfProofToHash(proofHex); // proofToHash still takes original proofHex
    console.log("VRF hash derived from proof (hex B256):", hashHex);
    console.log(` -> Hash Length: ${hashHex.length} chars`); // Should be 66

    console.log("\n✅ VRF flow completed successfully!");

  } catch (error) {
    console.error("\n❌ Worker Error:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      // console.error(error.stack); // Optional: full stack trace
    }
  }
}

main().catch(console.error);