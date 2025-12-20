// src/utils/mockServices.ts

// MOCK MEMBER 2 WORK (Encryption & Storage)
export const mockUploadAndEncrypt = async (file: File, metadata: any) => {
  console.log("encrypting file...", file.name);
  console.log("Metadata to embed:", metadata);
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake 2s delay

  return {
    cid: "QmFakeIPFSHash" + Math.random().toString(36).substring(7), // Random Fake IPFS CID
    aesKey: "secret-aes-key-" + Date.now(), // Fake Key
    fileHash: "0x" + Math.random().toString(16).substring(2) + "..." // Fake SHA256
  };
};

// MOCK MEMBER 1 WORK (Smart Contract Issue)
export const mockIssueCertificate = async (fileHash: string, cid: string) => {
  console.log("Writing to Blockchain...");
  await new Promise((resolve) => setTimeout(resolve, 2000)); 

  return {
    txHash: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", // Example Sepolia Hash
    blockNumber: 123456
  };
};

// MOCK MEMBER 1 WORK (Smart Contract Verify)
export const mockVerifyCertificate = async (identifier: string) => {
  console.log("Querying Blockchain for:", identifier);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate a valid response
  return {
    isValid: true,
    studentName: 'RIVALDO THAMRIN NASUTION',
    nim: '11223029',
    program: 'Teknik Sipil',
    degree: 'SARJANA TEKNIK',
    issueDate: '2026-03-26',
    issuer: '0xAdminAddress...',
    txHash: identifier.startsWith("0x") ? identifier : "0x123...abc",
    timestamp: Date.now()
  };
};

// MOCK MEMBER 1 WORK (Revoke)
export const mockRevokeCertificate = async (id: string, reason: string) => {
  console.log("Revoking on Blockchain:", id, reason);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return true;
};