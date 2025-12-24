import CryptoJS from "crypto-js";
import { ethers } from "ethers";

// Enkripsi sertifikat ijazah dengan AES-256 
export function aesEncrypt(arrayBuffer, aesKey) {
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  return CryptoJS.AES.encrypt(wordArray, aesKey).toString();
}

// Fungsi hash ijazah menggunakan SHA-256
export function hashCertificate(arrayBuffer) {
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  return CryptoJS.SHA256(wordArray).toString();
}


// Fungsi tanda tangan hash
export async function sign_hash(hash, signer) {
  return await signer.signMessage(hash);
}

// Fungsi konfirmasi tanda tangan
export function verify_signature(hash, signature, expectedAddress) {
  const recoveredAddress = ethers.verifyMessage(hash, signature);
  return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
}
