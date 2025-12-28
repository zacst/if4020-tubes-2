import { ethers } from "ethers";
import CertificateRegistryABI from "../artifacts/CertificateRegistry.json";

// !!! REPLACE WITH YOUR DEPLOYED ADDRESS !!!
const CONTRACT_ADDRESS = "0xc2270c044063187663a805672f3684C94FE90ab8";

const getContract = async (needSigner = false) => {
  if (!window.ethereum) throw new Error("No Wallet Found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  if (needSigner) {
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CertificateRegistryABI.abi, signer);
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CertificateRegistryABI.abi, provider);
};

export const issueCertificate = async (docHash, cid) => {
  try {
    const contract = await getContract(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // 1. Sign Hash (Required by Person A's Contract)
    console.log("Signing Hash...");
    const signature = await signer.signMessage(ethers.getBytes("0x" + docHash));

    // 2. Send Transaction
    console.log("Sending to Blockchain...");
    const tx = await contract.issueCertificate(docHash, cid, signature);
    await tx.wait();

    // 3. Calc ID (Matches Solidity Logic)
    const certificateId = ethers.solidityPackedKeccak256(["string"], [docHash]);

    return { txHash: tx.hash, certificateId };
  } catch (error) {
    console.error("Blockchain Error:", error);
    throw error;
  }
};

export const verifyCertificate = async (certificateId) => {
  try {
    const contract = await getContract(false);
    const cert = await contract.getCertificate(certificateId);
    
    // Check if timestamp is 0 (Means not found)
    if (Number(cert.timestamp) === 0) return null;

    return {
      isValid: cert.isValid,
      documentHash: cert.documentHash,
      ipfsCid: cert.fileUrl,
      issuer: cert.issuer,
      timestamp: Number(cert.timestamp) * 1000,
      revocationReason: cert.revocationReason
    };
  } catch (error) {
    return null;
  }
};

export const revokeCertificate = async (certificateId, reason) => {
  const contract = await getContract(true);
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const signature = await signer.signMessage(ethers.getBytes(certificateId));
  const tx = await contract.revokeCertificate(certificateId, reason, signature);
  await tx.wait();
  return true;
};