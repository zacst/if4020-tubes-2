import CryptoJS from "crypto-js";
import { aesEncrypt } from "../crypto/cryptoUtils";
import { uploadToIPFS } from "../storage/ipfs";

// Melakukan enkripsi dan menyimpan file ijazah di IPFS
export async function encrypt_and_store(file) {
  const aesKey = CryptoJS.lib.WordArray.random(32).toString();
  const buffer = await file.arrayBuffer();

  const encryptedData = aesEncrypt(buffer, aesKey);
  const cid = await uploadToIPFS(encryptedData);

  return { cid, aesKey };
}

// Fungsi membuat URL Ijazah agar bisa diverifikasi
export function buildCertificateURL(cid, aesKey, txHash) {
  const base = `${window.location.origin}/certificate`;
  return `${base}?cid=${cid}&key=${aesKey}&tx=${txHash}`;
}