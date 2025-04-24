import {
  proveVRF,
  vrfProofToHash,
  hexToBytes,
  bytesToHex,
  type ChunkedProof
} from "@simplevrf/ecvrf";
import { Provider, WalletUnlocked } from "fuels";
import { SimplevrfFuel } from "@simplevrf/sway-contracts-api";
import type { ChunkedProofInput } from "@simplevrf/sway-contracts-api/dist/contracts/SimplevrfFuel";

async function main() {
  const provider = new Provider(process.env.PROVIDER_URL ?? "https://testnet.fuel.network/v1/graphql");
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

main().catch(console.error);