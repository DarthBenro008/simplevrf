import { Command } from "commander";
import { getContract } from "../config";
import { bn } from "fuels";

const ETH_ASSET_ID = "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07";

export const withdrawCommands = new Command("withdraw")
  .description("Withdraw fees from the SimpleVrf contract")
  .argument("<asset_id>", "Asset ID or 'ETH' for native asset")
  .argument("<amount>", "Amount to withdraw")
  .action(async (assetId: string, amount: string) => {
    try {
      const contract = getContract();
      const finalAssetId = assetId.toUpperCase() === "ETH" ? ETH_ASSET_ID : assetId;
      const assetIdInput = { bits: finalAssetId };
      const amountInput = bn(amount);
      const result = await contract.functions.withdraw(assetIdInput, amountInput).call();
      const txResult = await result.waitForResult();
      console.log(`Withdrawal successful. Transaction ID: ${txResult.transactionId}`);
    } catch (error) {
      console.error("Error withdrawing fees:", error);
    }
  }); 