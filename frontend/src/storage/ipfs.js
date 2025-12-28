console.log("PINATA KEY:", import.meta.env.VITE_PINATA_API_KEY);
console.log("PINATA SECRET:", import.meta.env.VITE_PINATA_SECRET_KEY);

fetch("https://api.pinata.cloud/data/testAuthentication", {
  headers: {
    pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
    pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
  },
})
  .then(r => r.json())
  .then(res => console.log("PINATA AUTH TEST:", res));

// Fungsi menyimpan file ke IPFS
export async function uploadToIPFS(encryptedData) {
  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
        pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
      },
      body: JSON.stringify({ encryptedData }),
    }
  );

  const result = await response.json();
  return result.IpfsHash;
}