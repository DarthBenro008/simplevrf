import {
  generateVRFKeyPair,
  proveVRF,
  verifyVRF,
  vrfProofToHash,
  hexToBytes,
  bytesToHex,
  type ChunkedProof
} from "@simplevrf/ecvrf";
import { getRandomB256, arrayify, Wallet, Provider, WalletUnlocked } from "fuels";
import { ProjectivePoint } from '@noble/secp256k1';
import { SimplevrfFuel } from "./sway-contracts-api";
import type { ChunkedProofInput } from "./sway-contracts-api/contracts/SimplevrfFuel";

async function main() {
  const provider = new Provider("https://testnet.fuel.network/v1/graphql");
  if (!process.env.SIMPLEVRF_CONTRACT_ID || !process.env.WALLET_SECRET) {
    throw new Error("SIMPLEVRF_CONTRACT_ID and WALLET_SECRET must be set");
  }
  const wallet = new WalletUnlocked(process.env.WALLET_SECRET!, provider);
  const simpleVrfContract = new SimplevrfFuel(process.env.SIMPLEVRF_CONTRACT_ID!, wallet)
  setInterval(async () => {
    console.log("Checking for unfinalized requests...");
    await fullfillRequest(simpleVrfContract, wallet)
  }, 5000);
}

async function fullfillRequest(contract: SimplevrfFuel, wallet: WalletUnlocked) {
  const unfinalizedRequests = await contract.functions.get_unfinalized_requests().get();
  unfinalizedRequests.value.forEach(async (request) => {
    console.log(`Fullfilling request ${request.num}`);
    const { proofHex, gammaHex } = await proveVRF(wallet.privateKey, request.seed);
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
    const vrfProof = vrfProofToHash(proofHex);

    const chunkedProofInput: ChunkedProofInput = {
      p1: chunkedProof.p1,
      p2: chunkedProof.p2,
      p3: chunkedProof.p3,
      p4: chunkedProof.p4,
      proof: vrfProof
    }

    // send data to the contract
    const tx = await contract.functions
    .submit_proof(request.seed, chunkedProofInput)
    .addContracts([request.callback_contract.ContractId?.bits.toString() ?? ""])
    .call();
    const result = await tx.waitForResult();
    console.log(`Submitted proof for request ${request.seed} with transaction id ${result.transactionId}`);
  });
}


async function testingProof() {
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