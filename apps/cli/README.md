# SimpleVRF CLI

A command-line interface for interacting with the SimpleVRF contract on Fuel.

## Installation

```bash
# Install dependencies
bun install
```

## Configuration

Before using the CLI, you need to set up your configuration:

```bash
# Set node type (mainnet/testnet)
bun start config node mainnet

# Set contract address
bun start config contract <contract_address>

# Set wallet private key
bun start config wallet <private_key>

# Show current configuration
bun start config show
```

## Available Commands

### Configuration Commands

```bash
# Show current configuration
bun start config show

# Set network node (testnet/mainnet)
bun start config node <node_type>

# Set contract address
bun start config contract <contract_address>

# Set wallet private key
bun start config wallet <private_key>
```

### Fee Commands

```bash
# Get fee for an asset
bun start fee get <asset_id>

# Set fee for an asset
bun start fee set <asset_id> <amount>
```

### Request Commands

```bash
# Get total number of requests
bun start request count

# Get request by number
bun start request num <request_number>

# Get request by seed
bun start request seed <request_seed>
```

### Authority Commands

```bash
# Get all authorities
bun start authorities get

# Add a new authority
bun start authorities set <authority_address>

# Remove an authority
bun start authorities remove <authority_address>
```

### Withdraw Commands

```bash
# Withdraw fees (supports ETH or any asset ID)
bun start withdraw <asset_id> <amount>
```

## Examples

### Setting up for Mainnet

```bash
# Configure for mainnet
bun start config node mainnet
bun start config contract 0x27df32291e3507935c7ac8bc10c965ccca6a6e3c8ac510f0c9ca8546feefca9e
bun start config wallet <your_private_key>

# Check configuration
bun start config show
```

### Managing Fees

```bash
# Set fee for an asset
bun start fee set <asset_id> 100

# Get fee for an asset
bun start fee get <asset_id>
```

### Managing Requests

```bash
# Get total number of requests
bun start request count

# Get specific request by number
bun start request num 1

# Get request by seed
bun start request seed <seed>
```

### Managing Authorities

```bash
# Add a new authority
bun start authorities set <authority_address>

# List all authorities
bun start authorities get

# Remove an authority
bun start authorities remove <authority_address>
```

### Withdrawing Funds

```bash
# Withdraw ETH
bun start withdraw ETH 100

# Withdraw other assets
bun start withdraw <asset_id> <amount>
```

## Notes

- The ETH asset ID is automatically handled when using "ETH" as the asset identifier
- All amounts should be provided in the smallest unit (wei for ETH)
- Make sure to keep your private key secure and never share it
