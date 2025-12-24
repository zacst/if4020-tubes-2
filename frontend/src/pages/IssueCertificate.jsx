import React, { useState } from 'react';
import { Upload, FileText, Lock, Check } from 'lucide-react';
import { ethers } from 'ethers';
import { mockUploadAndEncrypt, mockIssueCertificate } from '../utils/mockServices';
import { encrypt_and_store, buildCertificateURL } from "../certificate/certificateUtils";
import { hashCertificate, sign_hash } from "../crypto/cryptoUtils";

const IssueCertificatePage = () => {
  // AUTH STATE
  const [account, setAccount] = useState('');
  
  // FORM STATE
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(null);
  
  const [formData, setFormData] = useState({
    studentName: '',
    nim: '',
    birthPlace: '',
    birthDate: '',
    program: '',
    degree: '',
    issueDate: '',
  });
  const [pdfFile, setPdfFile] = useState(null);

  // 1. ADMIN LOGIN FUNCTION (Nonce Challenge)
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // Simulate Nonce Challenge (Tubes 1 style)
      const nonce = `Login Request: ${Date.now()}`;
      await signer.signMessage(nonce); // This opens MetaMask popup
      setAccount(await signer.getAddress());
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleSubmit = async () => {
    if(!pdfFile) return alert("Please upload a PDF");
    setLoading(true);

    try {
      // Get Signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Hash certificate
      const buffer = await pdfFile.arrayBuffer();
      const documentHash = hashCertificate(buffer);

      // Sign hash using ECDSA
      const signature = await sign_hash(documentHash, signer);

      // Encrypt & Store to IPFS
      const { cid, aesKey } = await encrypt_and_store(pdfFile);

      // Step B: Issue on Blockchain (Member 1's Job)
      const { txHash } = await mockIssueCertificate(documentHash, cid, signature);

      // This URL contains the location (CID), the Key (aesKey), and the ID (txHash)
      const magicUrl = buildCertificateURL(cid, aesKey, txHash);
      setGeneratedLink(magicUrl);

    } catch (error) {
      console.error(error);
      alert("Error issuing certificate");
    } finally {
      setLoading(false);
    }
  };

  // IF NOT LOGGED IN, SHOW LOGIN BUTTON
  if (!account) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-96 bg-white rounded-xl shadow-sm border border-gray-200">
         <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
         </div>
         <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
         <p className="text-gray-600 mb-6">Connect your wallet to issue certificates.</p>
         <button 
          onClick={connectWallet}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
         >
           Connect Wallet (MetaMask)
         </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Issue New Certificate</h2>
              <p className="text-sm text-gray-600">Connected: <span className="font-mono text-blue-600">{account.slice(0,6)}...{account.slice(-4)}</span></p>
            </div>
          </div>
        </div>

        {/* SUCCESS STATE */}
        {generatedLink ? (
           <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Check className="w-6 h-6 text-green-600" />
             </div>
             <h3 className="text-xl font-bold text-green-900 mb-2">Certificate Issued Successfully!</h3>
             <p className="text-gray-600 mb-4">Send this link to the student. It allows them to verify and decrypt their diploma.</p>
             <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm break-all mb-4">
               {generatedLink}
             </div>
             <button onClick={() => setGeneratedLink(null)} className="text-blue-600 font-medium hover:underline">
               Issue Another
             </button>
           </div>
        ) : (
          /* FORM */
          <div className="space-y-6">
            {/* Student Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" value={formData.studentName} onChange={(e) => setFormData({...formData, studentName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., RIVALDO THAMRIN NASUTION" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NIM</label>
                  <input type="text" value={formData.nim} onChange={(e) => setFormData({...formData, nim: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., 11223029" />
                </div>
              </div>
              {/* Added other fields briefly for brevity, keep your original full fields here */}
            </div>

            {/* PDF Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Certificate Document</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} className="hidden" id="pdf-upload" />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-2">{pdfFile ? pdfFile.name : 'Click to upload PDF certificate'}</p>
                  <p className="text-sm text-gray-500">PDF file will be encrypted with AES before storage</p>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Encrypting & Signing..." : "Generate & Sign Certificate"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueCertificatePage;