import { Provider, WalletUnlocked } from "fuels";
import { SimplevrfFuel } from "@simplevrf/sway-contracts-api";
import fs from "fs";
import path from "path";
import os from "os";

export interface Config {
  node: "testnet" | "mainnet";
  contractAddress: string;
  privateKey: string;
}

const CONFIG_DIR = path.join(os.homedir(), ".simplevrf");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

// Ensure config directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Initialize config with default values
let config: Config = {
  node: "testnet",
  contractAddress: "",
  privateKey: "",
};

// Load config from file if it exists
if (fs.existsSync(CONFIG_FILE)) {
  try {
    const savedConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    config = { ...config, ...savedConfig };
  } catch (error) {
    console.error("Error loading config file:", error);
  }
}

function saveConfig() {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Error saving config file:", error);
  }
}

export function getConfig(): Config {
  return { ...config };
}

export function setNode(node: "testnet" | "mainnet") {
  config.node = node;
  saveConfig();
}

export function setContractAddress(address: string) {
  config.contractAddress = address;
  saveConfig();
}

export function setPrivateKey(privateKey: string) {
  config.privateKey = privateKey;
  saveConfig();
}

export function getProvider() {
  const url = config.node === "testnet" 
    ? "https://testnet.fuel.network/v1/graphql"
    : "https://mainnet.fuel.network/v1/graphql";
  return new Provider(url);
}

export function getWallet() {
  if (!config.privateKey) {
    throw new Error("Wallet private key not set. Please set it using 'config wallet set <private-key>'");
  }
  return new WalletUnlocked(config.privateKey, getProvider());
}

export function getContract() {
  if (!config.contractAddress) {
    throw new Error("Contract address not set. Please set it using 'config contract set <address>'");
  }
  return new SimplevrfFuel(config.contractAddress, getWallet());
} 