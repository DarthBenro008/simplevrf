import { Command } from "commander";
import { getContract } from "../config";

export const requestCommands = new Command("request")
  .description("Manage VRF requests");

requestCommands
  .command("count")
  .description("Get total number of requests")
  .action(async () => {
    try {
      const contract = getContract();
      const result = await contract.functions.get_request_count().get();
      console.log(`Total requests: ${result.value}`);
    } catch (error) {
      console.error("Error getting request count:", error);
    }
  });

requestCommands
  .command("num")
  .description("Get request by number")
  .argument("<num>", "Request number")
  .action(async (num: string) => {
    try {
      const contract = getContract();
      const result = await contract.functions.get_request_by_num(parseInt(num)).get();
      console.log(`Request ${num}:`, result.value);
    } catch (error) {
      console.error("Error getting request:", error);
    }
  });

requestCommands
  .command("seed")
  .description("Get request by seed")
  .argument("<seed>", "Request seed")
  .action(async (seed: string) => {
    try {
      const contract = getContract();
      const result = await contract.functions.get_request(seed).get();
      console.log(`Request with seed ${seed}:`, result.value);
    } catch (error) {
      console.error("Error getting request by seed:", error);
    }
  }); 