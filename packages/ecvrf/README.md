# ECVRF

A production-grade TypeScript implementation of Elliptic Curve Verifiable Random Function (ECVRF) using secp256k1.

## About

This library provides a robust implementation of the ECVRF (Verifiable Random Function) using the secp256k1 elliptic curve. The implementation is based on cryptographic standards and designed for production use.

### Features

- Standards-compliant ECVRF implementation
- Deterministic outputs for the same inputs
- Robust error handling
- Comprehensive test coverage
- Well-documented API
- Suitable for production use

## Installation

```bash
# Using npm
npm install ecvrf

# Using yarn
yarn add ecvrf

# Using bun
bun add ecvrf
```

## Usage

### Basic Example

```typescript
import { generateKeyPair, prove, verify, proofToHash } from 'ecvrf';
import { utf8ToBytes, bytesToHex } from 'ecvrf/utils';

// Generate a key pair (or use your existing keys)
const { sk, pk } = await generateKeyPair();
console.log('Private key:', bytesToHex(sk));
console.log('Public key:', pk);

// Create a message (can be any data)
const message = utf8ToBytes('My message to prove');

// Generate a proof
const { proof, gamma } = await prove(sk, message);
console.log('Proof:', proof);

// Verify the proof
const isValid = await verify(pk, message, proof);
console.log('Verification result:', isValid); // Should be true

// Convert the proof to a deterministic hash
const hash = await proofToHash(gamma);
console.log('VRF output hash:', bytesToHex(hash));
```

### API Reference

#### `generateKeyPair(): Promise<{ sk: Uint8Array; pk: string }>`

Generates a new ECVRF key pair.

- Returns: A promise resolving to an object containing:
  - `sk`: Private key as a `Uint8Array`
  - `pk`: Public key as a hex string (compressed format)

#### `prove(sk: Uint8Array, alpha: Uint8Array): Promise<{ proof: string; gamma: string }>`

Generates an ECVRF proof for a message using a private key.

- Parameters:
  - `sk`: Private key as a `Uint8Array`
  - `alpha`: Message as a `Uint8Array`
- Returns: A promise resolving to an object containing:
  - `proof`: The ECVRF proof as a hex string
  - `gamma`: The gamma point of the proof as a hex string

#### `verify(pkHex: string, alpha: Uint8Array, proof: string): Promise<boolean>`

Verifies an ECVRF proof.

- Parameters:
  - `pkHex`: Public key as a hex string
  - `alpha`: Original message as a `Uint8Array`
  - `proof`: The ECVRF proof to verify as a hex string
- Returns: A promise resolving to a boolean indicating if the proof is valid

#### `proofToHash(gammaHex: string): Promise<Uint8Array>`

Converts the gamma point of an ECVRF proof to a deterministic hash.

- Parameters:
  - `gammaHex`: The gamma point as a hex string
- Returns: A promise resolving to a 32-byte `Uint8Array` containing the hash

#### Utility Functions

- `utf8ToBytes(str: string): Uint8Array`: Converts a UTF-8 string to bytes
- `bytesToHex(bytes: Uint8Array): string`: Converts bytes to a hex string
- `hexToBytes(hex: string): Uint8Array`: Converts a hex string to bytes

## Use Cases

- Random beacon
- Provably fair games and lotteries
- Unpredictable but verifiable selections
- Proof of resource ownership
- Cryptographic sortition
- Leader election in distributed systems

## Development

### Prerequisites

- Node.js >= 16
- npm, yarn, or bun

### Setup

```bash
# Clone the repository
git clone https://your-repo/ecvrf.git
cd ecvrf

# Install dependencies
npm install
```

### Build

```bash
npm run build
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test vectors and run vector tests
npm run test:vectors

# Run test coverage
npm run test:coverage
```

## Security

This library has been designed for production use, but as with any cryptographic library:

- Properly secure your private keys
- Keep dependencies up to date
- Review any changes to the code before deploying to production
- Consider a security audit for critical applications

## License

MIT 