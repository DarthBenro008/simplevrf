import { Command } from "commander";
import { getContract } from "../config";

export const feeCommands = new Command("fee")
  .description("Manage fees for the SimpleVrf contract");

feeCommands
  .command("get")
  .description("Get fee for an asset")
  .argument("<asset_id>", "Asset ID")
  .action(async (assetId: string) => {
    try {
      const contract = getContract();
      const assetIdInput = { bits: assetId };
      const result = await contract.functions.get_fee(assetIdInput).get();
      console.log(`Fee for asset ${assetId}: ${result}`);
    } catch (error) {
      console.error("Error getting fee:", error);
    }
  });

feeCommands
  .command("set")
  .description("Set fee for an asset")
  .argument("<asset_id>", "Asset ID")
  .argument("<amount>", "Fee amount")
  .action(async (assetId: string, amount: string) => {
    try {
      const contract = getContract();
      const assetIdInput = { bits: assetId };
      const result = await contract.functions.set_fee(assetIdInput, parseInt(amount)).call();
      const txResult = await result.waitForResult();
      console.log(`Fee set successfully. Transaction ID: ${txResult.transactionId}`);
    } catch (error) {
      console.error("Error setting fee:", error);
    }
  }); 