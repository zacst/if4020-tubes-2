import React, { useState, useEffect } from 'react';
import { Upload, FileText, Lock, Check, X } from 'lucide-react'; 

// IMPORTS
import { encrypt_and_store, buildCertificateURL } from "../certificate/certificateUtils";
import { hashCertificate } from "../crypto/cryptoUtils";
import { issueCertificate } from '../utils/web3Services';

const IssueCertificatePage = ({ account, connectWallet }) => {
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [formData, setFormData] = useState({ studentName: '', nim: '' });
  const [pdfFile, setPdfFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // FIX 1: Reset state when account changes (e.g. after Logout/Login)
  useEffect(() => {
    setErrorMessage('');
    setGeneratedLink(null);
    setPdfFile(null);
    setFormData({ studentName: '', nim: '' });
  }, [account]);

  const handleSubmit = async () => {
    setErrorMessage(''); // Clear previous errors
    
    // VALIDATION
    if (!account) {
        setErrorMessage("Wallet not connected.");
        return;
    }
    if (!pdfFile) {
        setErrorMessage("Please select a PDF file to upload.");
        return;
    }
    
    setLoading(true);

    try {
      // 1. Prepare File
      const buffer = await pdfFile.arrayBuffer();
      const docHash = hashCertificate(buffer);

      // 2. Encrypt & Store (IPFS)
      const { cid, aesKey } = await encrypt_and_store(pdfFile);

      // 3. Issue on Blockchain
      // Note: issueCertificate must get a FRESH signer internally!
      const { certificateId, txHash } = await issueCertificate(docHash, cid);

      // 4. Generate Magic Link
      const magicUrl = buildCertificateURL(cid, aesKey, certificateId);
      setGeneratedLink(magicUrl);

    } catch (error) {
      console.error("Full Error Object:", error);

      // ERROR PARSING
      let msg = "An unexpected error occurred.";

      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
          msg = "Transaction rejected. You denied the signature.";
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
          msg = "Insufficient funds. You need more Sepolia ETH.";
      } else if (error.code === 'NETWORK_ERROR') {
          msg = "Network error. Check your internet connection.";
      } else if (error.message && error.message.includes("user rejected")) {
          msg = "User rejected the request.";
      } else if (error.reason) {
          msg = `Transaction failed: ${error.reason}`;
      } else if (error.message) {
          msg = error.message.length > 100 ? "Transaction failed. Check console for details." : error.message;
      }

      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // RENDER: Admin Access Check
  if (!account) {
    return (
       <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-96 bg-white rounded-xl shadow-sm border border-gray-200">
         <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
         </div>
         <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
         <p className="text-gray-500 mb-6">Please connect your wallet to issue certificates.</p>
         <button 
            onClick={connectWallet} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
         >
            Connect Wallet
         </button>
       </div>
    );
  }

  // RENDER: Main Form
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Issue New Certificate</h2>
          <span className="font-mono text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm border border-blue-100">
            {account.slice(0,6)}...{account.slice(-4)}
          </span>
        </div>

        {/* Error Message UI */}
        {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r shadow-sm flex justify-between items-start animate-fade-in">
                <div className="flex-1">
                    <p className="font-bold text-sm">Action Failed</p>
                    <p className="text-sm mt-1">{errorMessage}</p>
                </div>
                <button onClick={() => setErrorMessage('')} className="ml-4 text-red-400 hover:text-red-900">
                    <X className="w-5 h-5" />
                </button>
            </div>
        )}

        {/* Success / Form View */}
        {generatedLink ? (
           <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center animate-fade-in">
             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-600" />
             </div>
             <h3 className="text-xl font-bold text-green-900 mb-2">Certificate Issued!</h3>
             <p className="text-gray-600 mb-4">Share this magic link with the student:</p>
             <div className="bg-white p-3 rounded border border-green-200 font-mono text-xs break-all mb-4 text-gray-700 shadow-inner">
                {generatedLink}
             </div>
             <button 
                onClick={() => {
                    setGeneratedLink(null);
                    setPdfFile(null);
                    setFormData({ studentName: '', nim: '' });
                }} 
                className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
             >
                Issue Another Certificate
             </button>
           </div>
        ) : (
          <div className="space-y-6">
             <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                    <input 
                        type="text" 
                        value={formData.studentName} 
                        onChange={(e) => setFormData({...formData, studentName: e.target.value})} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                        placeholder="e.g. John Doe" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIM / Student ID</label>
                    <input 
                        type="text" 
                        value={formData.nim} 
                        onChange={(e) => setFormData({...formData, nim: e.target.value})} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                        placeholder="e.g. 13521001" 
                    />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Certificate PDF</label>
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${pdfFile ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
                    <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={(e) => setPdfFile(e.target.files[0])} 
                        className="hidden" 
                        id="pdf-upload" 
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                      <FileText className={`w-12 h-12 mb-2 ${pdfFile ? 'text-blue-600' : 'text-gray-400'}`} />
                      <p className={`text-sm ${pdfFile ? 'font-medium text-blue-900' : 'text-gray-500'}`}>
                        {pdfFile ? pdfFile.name : 'Click to upload PDF document'}
                      </p>
                    </label>
                </div>
             </div>

             <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center"
             >
               {loading ? (
                   <>
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                     Processing...
                   </>
               ) : "Generate & Sign Certificate"}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueCertificatePage;