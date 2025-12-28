import CryptoJS from "crypto-js";

// Enkripsi sertifikat ijazah dengan AES-256 
export function aesEncrypt(arrayBuffer, aesKey) {
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  return CryptoJS.AES.encrypt(wordArray, aesKey).toString();
}

// Fungsi hash ijazah menggunakan SHA-256
export function hashCertificate(arrayBuffer) {
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  // Returns Hex String
  return CryptoJS.SHA256(wordArray).toString();
}