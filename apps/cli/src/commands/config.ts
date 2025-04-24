import { Command } from "commander";
import { setNode, setContractAddress, setPrivateKey, getConfig, getWallet } from "../config";

export const configCommands = new Command("config")
  .description("Manage CLI configuration");

configCommands
  .command("node")
  .description("Set the network node")
  .argument("<node>", "Network node (testnet/mainnet)")
  .action((node: string) => {
    if (node !== "testnet" && node !== "mainnet") {
      console.error("Node must be either 'testnet' or 'mainnet'");
      return;
    }
    setNode(node);
    console.log(`Node set to ${node}`);
  });

configCommands
  .command("wallet")
  .description("Set the wallet private key")
  .argument("<private_key>", "Wallet private key")
  .action(async (privateKey: string) => {
    setPrivateKey(privateKey);
    const wallet = getWallet();
    console.log(`Wallet set. Public key: ${wallet.address.toString()}`);
  });

configCommands
  .command("contract")
  .description("Set the SimpleVrf contract address")
  .argument("<address>", "Contract address")
  .action((address: string) => {
    setContractAddress(address);
    console.log(`Contract address set to ${address}`);
  });

configCommands
  .command("show")
  .description("Show current configuration")
  .action(async () => {
    const config = getConfig();
    console.log("Current configuration:");
    console.log(`Node: ${config.node}`);
    console.log(`Contract address: ${config.contractAddress || "Not set"}`);
    
    if (config.privateKey) {
      try {
        const wallet = getWallet();
        console.log(`Wallet public key: ${wallet.address.toString()}`);
      } catch (error) {
        console.log("Wallet: Invalid private key");
      }
    } else {
      console.log("Wallet: Not set");
    }
  }); 