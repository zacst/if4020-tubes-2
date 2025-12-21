# Smart Contract for Certificate Registry

This directory contains the Smart Contract for the Certificate Registry system, fulfilling the role of **Person A**.

## Prerequisites

- Node.js installed.
- An Ethereum wallet (e.g., MetaMask) with some Sepolia ETH.
- An Infura or Alchemy API key for Sepolia network access.
- An Etherscan API key (optional, for verification).

## Setup

1.  Navigate to this directory:
    ```bash
    cd smart_contract
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Open `.env` and fill in your details:
      - `SEPOLIA_URL`: Your RPC URL (e.g., from Infura or Alchemy).
      - `PRIVATE_KEY`: The private key of the account deploying the contract (Export from MetaMask). **Do not share this key!**
      - `ETHERSCAN_API_KEY`: Your Etherscan API key for contract verification.

## Compilation

To compile the smart contract:

```bash
npx hardhat compile
```

## Deployment

To deploy the contract to the Sepolia testnet:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

After deployment, the console will output the deployed contract address. Save this address! You will need it for the Frontend integration.

## Contract Functions

The `CertificateRegistry.sol` contract implements the following:

-   **`issueCertificate(string _documentHash, string _fileUrl, bytes _signature)`**:
    -   Issues a new certificate.
    -   Stores the document hash, file URL (IPFS/Storage), issuer address, and signature.
    -   Generates a unique Certificate ID based on the document hash.
    -   Emits `CertificateIssued` event.

-   **`revokeCertificate(bytes32 _certificateId, string _reason, bytes _signature)`**:
    -   Revokes an existing certificate.
    -   Sets `isValid` to `false`.
    -   Stores the revocation reason and signature.
    -   Emits `CertificateRevoked` event.

-   **`addIssuer(address _issuer)` / `removeIssuer(address _issuer)`**:
    -   Allows the owner to manage authorized issuers (Bonus requirement).

-   **`setOwner(address _newOwner)`**:
    -   Allows transferring ownership of the contract.

-   **`getCertificate(bytes32 _certificateId)`**:
    -   Retrieves certificate details.

## Testing

To run tests (you can add tests in `test/` folder):

```bash
npx hardhat test
```
