import { Command } from "commander";
import { getContract } from "../config";

export const authorityCommands = new Command("authorities")
  .description("Manage authorities for the SimpleVrf contract");

authorityCommands
  .command("get")
  .description("Get all authorities")
  .action(async () => {
    try {
      const contract = getContract();
      const result = await contract.functions.get_authorities().get();
      console.log("Authorities:", result.value);
    } catch (error) {
      console.error("Error getting authorities:", error);
    }
  });

authorityCommands
  .command("set")
  .description("Add an authority")
  .argument("<address>", "Authority address")
  .action(async (address: string) => {
    try {
      const contract = getContract();
      const addressInput = { bits: address };
      const result = await contract.functions.add_authority(addressInput).call();
      const txResult = await result.waitForResult();
      console.log(`Authority added successfully. Transaction ID: ${txResult.transactionId}`);
    } catch (error) {
      console.error("Error adding authority:", error);
    }
  });

authorityCommands
  .command("remove")
  .description("Remove an authority")
  .argument("<address>", "Authority address")
  .action(async (address: string) => {
    try {
      const contract = getContract();
      const addressInput = { bits: address };
      const result = await contract.functions.remove_authority(addressInput).call();
      const txResult = await result.waitForResult();
      console.log(`Authority removed successfully. Transaction ID: ${txResult.transactionId}`);
    } catch (error) {
      console.error("Error removing authority:", error);
    }
  }); 