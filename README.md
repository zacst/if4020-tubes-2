# Sistem Pencatatan Ijazah Digital Berbasis Blockchain (Sepolia Testnet)

Proyek ini adalah prototipe sistem penerbitan, penyimpanan, dan verifikasi ijazah digital yang memanfaatkan teknologi Blockchain (Ethereum Sepolia Testnet) untuk menjamin integritas (immutability) dan penyimpanan Off-chain (IPFS) untuk efisiensi data.

## 📋 Deskripsi Sistem & Arsitektur

Sistem ini menggunakan pendekatan **Hybrid Storage** untuk menyeimbangkan keamanan dan biaya:

1.  **On-Chain (Blockchain):** Menyimpan metadata kritis berupa Hash Dokumen (SHA-256), Status Ijazah (Valid/Revoked), Tanda Tangan Issuer, dan Timestamp.
2.  **Off-Chain (IPFS):** Menyimpan file fisik Ijazah (PDF) yang telah dienkripsi menggunakan algoritma simetris AES untuk menjaga privasi data mahasiswa.

Tujuan utama sistem adalah mencegah pemalsuan ijazah, transparansi data, sekaligus menjaga kerahasiaan dokumen pribadi.

---

## 👥 Anggota Kelompok & Pembagian Tugas

Proyek ini dikerjakan oleh 3 anggota dengan rincian sebagai berikut:

### 1. Smart Contract & Blockchain Engineer
* **Nama:** Ahmad Farid Mudrika
* **NIM:** 13522008
* **Tanggung Jawab:**
    * Mengembangkan Smart Contract menggunakan **Solidity**.
    * Implementasi fungsi `issueCertificate` dan `revokeCertificate`.
    * Deployment kontrak ke **Sepolia Testnet**.
    * Memastikan efisiensi struktur data (Struct) pada ledger.

### 2. Cryptography & Storage Specialist
* **Nama:** Nicholas Francis Aditjandra
* **NIM:** 18221005
* **Tanggung Jawab:**
    * Implementasi enkripsi simetris (**AES**) untuk file PDF sebelum diunggah.
    * Implementasi hashing dokumen (**SHA-256**) untuk integritas data.
    * Integrasi penyimpanan terdesentralisasi (**IPFS/Pinata**).
    * Manajemen kunci enkripsi (Key Management Logic).

### 3. Frontend & System Integration
* **Nama:** Zachary Samuel Tobing
* **NIM:** 13522016
* **Tanggung Jawab:**
    * Mengembangkan antarmuka pengguna (UI) menggunakan **React (Vite)** dan **Tailwind CSS**.
    * Implementasi autentikasi Admin menggunakan **Wallet Signature (Nonce Challenge)**.
    * Integrasi Frontend dengan Blockchain menggunakan **Ethers.js**.
    * Merancang alur verifikasi publik ("Magic Link" auto-verification).
    * Menyatukan modul Kriptografi dan Blockchain ke dalam aplikasi web.

---

## 🛠️ Tech Stack & Dependensi

Berikut adalah teknologi utama dan dependensi yang digunakan untuk membangun sistem ini. Daftar lengkap versi pustaka dapat dilihat pada file `package.json`.

* **Frontend Framework:** React (Vite)
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **Blockchain Interaction:** Ethers.js (v6)
* **Cryptography:** Crypto-JS (AES, SHA256)
* **Routing:** React-router-dom

**Daftar Dependensi Utama (`package.json`):**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "ethers": "^6.9.0",
    "crypto-js": "^4.2.0",
    "lucide-react": "^0.292.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5"
  }
}
```

## 🚀 Fitur & Daftar Fungsi
### 1. Autentikasi Admin (Signature Challenge)
- Hanya Admin Institusi yang dapat mengakses halaman penerbitan dan pencabutan.
- Autentikasi menggunakan dompet kripto (MetaMask).
- User menandatangani pesan acak (Nonce) untuk membuktikan kepemilikan Private Key tanpa mengirimkan kunci tersebut ke jaringan.

### 2. Penerbitan Ijazah (Issue Certificate)
Fungsi Utama: Menerbitkan ijazah baru ke blockchain.

Alur:
- File PDF dienkripsi menggunakan AES.
- Hash SHA-256 dari dokumen asli dihitung.
- File terenkripsi diunggah ke IPFS untuk mendapatkan CID.
- Hash dokumen + CID dikirim ke Smart Contract Sepolia.

Output: Tautan Verifikasi (Magic Link) yang berisi lokasi file dan kunci dekripsi.

### 3. Verifikasi Publik (Verify)
Fungsi Utama: Memverifikasi keaslian ijazah oleh pihak ketiga (Perusahaan/Publik).

Akses: Terbuka untuk umum tanpa login.

*Fitur Magic Link: Mendukung verifikasi otomatis melalui URL Parameter (?tx=...&cid=...&key=...).*

Mekanisme:
- Memeriksa apakah ID transaksi ada di Blockchain.
- Memeriksa status isRevoked pada Smart Contract.
- Jika valid, sistem mendekripsi file dari IPFS menggunakan kunci yang tersedia di URL.

### 4. Pencabutan Ijazah (Revoke)
Fungsi Utama: Membatalkan ijazah yang salah input atau bermasalah.

Mekanisme: Admin mengirim transaksi untuk mengubah status ijazah di Blockchain menjadi isRevoked = true.

Dampak: Ijazah yang dicabut akan muncul sebagai "INVALID" atau "REVOKED" pada halaman verifikasi, meskipun file fisiknya masih ada.

## 💻 Cara Menjalankan Program (Installation)
Pastikan Anda telah menginstal Node.js dan memiliki ekstensi browser MetaMask.

**Langkah 1: Clone Repository**

```Bash

git clone <repository_url_anda>
cd <nama_folder_project>
```

**Langkah 2: Instal Dependensi**

```Bash

npm install
```

**Langkah 3: Konfigurasi Environment (Opsional) Buat file .env jika ingin mengubah konfigurasi default (misalnya API Key Pinata atau alamat Contract baru).**

```Code snippet

VITE_CONTRACT_ADDRESS=0xAlamatContractAnda
```

**Langkah 4: Jalankan Development Server**

```Bash

npm run dev
```

Langkah 5: Akses Aplikasi Buka browser dan akses alamat localhost yang tertera di terminal (biasanya `http://localhost:5173`).
