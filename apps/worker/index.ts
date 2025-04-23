import { generateVRFKeyPair, proveVRF, verifyVRF, vrfProofToHash } from "@simplevrf/ecvrf";
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
    // Pass hex private key and hex input alpha
    const { proofHex, gammaHex } = await proveVRF(privateKeyHex, inputHex);
    console.log("VRF proof (hex string):", proofHex);
    console.log("VRF gamma (hex string - compressed point):", gammaHex);
    console.log(` -> Proof Length: ${proofHex.length} chars`); // Should be 196
    console.log(` -> Gamma Length: ${gammaHex.length} chars`); // Should be 68

    // --- VRF Proof Verification ---
    console.log("\nVerifying proof using verifyVRF...");
    // Pass hex public key, hex input alpha, and hex proof
    const isValid = await verifyVRF(publicKeyHex, inputHex, proofHex);
    console.log("Proof verification result:", isValid);

    if (!isValid) {
      console.error("\n--- Verification Failed ---");
      console.error("Inputs provided to verifyVRF:");
      console.error("  Public Key (Compressed hex):", publicKeyHex);
      console.error("  Input (Hex):", inputHex);
      console.error("  Proof (hex):", proofHex);
      // NOTE: Internal error likely occurred within verifyVRF (e.g., point parsing)
      // Check the console logs for specific errors from the ecvrf package.
      throw new Error("Proof verification failed. See logs for details.");
    }

    // --- VRF Hash Calculation --- 
    // Note: The B256 value is the HASH derived from the proof, not the proof itself.
    console.log("\nCalculating B256 hash from proof using vrfProofToHash...");
    const hashHex = await vrfProofToHash(proofHex);
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