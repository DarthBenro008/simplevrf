# SimpleVRF Worker

The SimpleVRF Worker is an off-chain service that listens for VRF (Verifiable Random Function) requests from the SimpleVRF Fuel contract, generates proofs, and submits them back to the contract.

## Overview

The worker performs the following functions:

1. Monitors the SimpleVRF contract for unfinalized requests
2. Generates VRF proofs using the ECVRF algorithm
3. Submits proofs back to the contract
4. Handles contract callbacks with the generated random values

## Prerequisites

- Node.js (latest LTS version recommended)
- Bun package manager
- Access to a Fuel network node (testnet or mainnet)
- A funded wallet with private key

## Environment Variables

The worker requires the following environment variables:

```bash
PROVIDER_URL="https://testnet.fuel.network/v1/graphql"  # Fuel network provider URL
SIMPLEVRF_CONTRACT_ID="0x..."  # The deployed SimpleVRF contract ID
WALLET_SECRET="0x..."  # Private key of the wallet that will submit proofs
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

## Running the Worker

To start the worker:

```bash
bun run start
```

The worker will:

- Connect to the specified Fuel network
- Check for unfinalized requests every 5 seconds
- Generate and submit proofs for any pending requests
- Log transaction IDs and request statuses

## Architecture

The worker is built using:

- TypeScript for type safety
- Fuel SDK for blockchain interaction
- ECVRF package for proof generation
- SimpleVRF Fuel contract API for contract interaction

## How It Works

1. The worker connects to the Fuel network using the provided provider URL
2. It initializes a wallet using the provided private key
3. Every x seconds, it checks for unfinalized requests using `get_unfinalized_requests()`
4. For each unfinalized request:
   - Generates a VRF proof using the wallet's private key and request seed
   - Chunks the proof into the required format
   - Submits the proof to the contract
   - Waits for transaction confirmation
   - Logs the result

## Error Handling

The worker includes error handling for:

- Missing environment variables
- Invalid proof generation
- Transaction failures
- Network connectivity issues

## Monitoring

The worker logs:

- Unfinalized request checks
- Proof generation status
- Transaction IDs
- Request fulfillment status
