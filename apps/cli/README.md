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
bun start config set node mainnet

# Set contract address
bun start config set contract <contract_address>

# Set wallet private key
bun start config set wallet <private_key>
```

## Available Commands

### Configuration Commands

```bash
# Show current configuration
bun start config show

# Set configuration values
bun start config set <key> <value>
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
# Get request details
bun start request get <request_id>

# Create a new request
bun start request create <asset_id> <amount>
```

### Authority Commands

```bash
# Get all authorities
bun start authorities get

# Add a new authority
bun start authorities add <authority_address>

# Remove an authority
bun start authorities remove <authority_address>
```

### Withdraw Commands

```bash
# Withdraw ETH
bun start withdraw ETH <amount>

# Withdraw other assets
bun start withdraw <asset_id> <amount>
```

## Examples

### Setting up for Mainnet

```bash
# Configure for mainnet
bun start config set node mainnet
bun start config set contract 0x27df32291e3507935c7ac8bc10c965ccca6a6e3c8ac510f0c9ca8546feefca9e
bun start config set wallet <your_private_key>

# Check configuration
bun start config show
```

### Managing Fees

```bash
# Set fee for ETH
bun start fee set ETH 100

# Get fee for ETH
bun start fee get ETH
```

### Creating and Managing Requests

```bash
# Create a new request
bun start request create ETH 100

# Check request status
bun start request get <request_id>
```

### Managing Authorities

```bash
# Add a new authority
bun start authorities add <authority_address>

# List all authorities
bun start authorities get
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
