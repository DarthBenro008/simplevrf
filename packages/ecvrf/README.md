# ECVRF

A production-grade TypeScript implementation of Elliptic Curve Verifiable Random Function (ECVRF) using secp256k1, following RFC 9381 for suite ECVRF-SECP256k1-SHA256-TAI.

## About

This library provides a robust implementation of the ECVRF (Verifiable Random Function) using the secp256k1 elliptic curve. The implementation is based on cryptographic standards and designed for production use.

### Features

- Standards-compliant ECVRF implementation following RFC 9381
- Support for secp256k1 curve
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
import { 
  generateVRFKeyPair, 
  proveVRF, 
  verifyVRF, 
  vrfProofToHash,
  hexToBytes,
  bytesToHex,
  utf8ToBytes 
} from 'ecvrf';

// Generate a key pair
const { sk, pk } = generateVRFKeyPair();
console.log('Private key:', sk);
console.log('Public key:', pk);

// Create a message (can be any data)
const message = 'My message to prove';
const messageBytes = utf8ToBytes(message);
const messageHex = bytesToHex(messageBytes);

// Generate a proof
const { proofHex, gammaHex } = proveVRF(sk, messageHex);
console.log('Proof:', proofHex);

// Verify the proof
const isValid = verifyVRF(pk, messageHex, {
  p1: proofHex.slice(0, 66),  // First 32 bytes
  p2: proofHex.slice(66, 130), // Next 32 bytes
  p3: proofHex.slice(130, 194), // Next 32 bytes
  p4: parseInt(proofHex.slice(194), 16) // Last byte
});
console.log('Verification result:', isValid); // Should be true

// Convert the proof to a deterministic hash
const hash = vrfProofToHash(proofHex);
console.log('VRF output hash:', hash);
```

### API Reference

#### `generateVRFKeyPair(): { sk: string; pk: string }`

Generates a new ECVRF key pair.

- Returns: An object containing:
  - `sk`: Private key as a hex string
  - `pk`: Public key as a hex string

#### `proveVRF(privateKeyHex: string, alphaHex: string): { proofHex: string; gammaHex: string }`

Generates an ECVRF proof for a message using a private key.

- Parameters:
  - `privateKeyHex`: Private key as a hex string
  - `alphaHex`: Message as a hex string
- Returns: An object containing:
  - `proofHex`: The ECVRF proof as a hex string
  - `gammaHex`: The gamma point of the proof as a hex string

#### `verifyVRF(publicKeyHex: string, alphaHex: string, chunkedProof: ChunkedProof): boolean`

Verifies an ECVRF proof.

- Parameters:
  - `publicKeyHex`: Public key as a hex string
  - `alphaHex`: Original message as a hex string
  - `chunkedProof`: The ECVRF proof split into chunks
- Returns: A boolean indicating if the proof is valid

#### `vrfProofToHash(proofHex: string): string`

Converts an ECVRF proof to a deterministic hash.

- Parameters:
  - `proofHex`: The ECVRF proof as a hex string
- Returns: A hex string containing the hash

#### Utility Functions

- `hexToBytes(hex: string): Uint8Array`: Converts a hex string to bytes
- `bytesToHex(bytes: Uint8Array): string`: Converts bytes to a hex string
- `utf8ToBytes(str: string): Uint8Array`: Converts a UTF-8 string to bytes
- `concatHex(...hexes: string[]): string`: Concatenates hex strings
- `padHex(hex: string, length: number): string`: Pads a hex string to a specified length
- `concatBytes(...arrays: Uint8Array[]): Uint8Array`: Concatenates byte arrays

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

Copyright 2025 Hemanth Krishna
Licensed under MIT License : https://opensource.org/licenses/MIT