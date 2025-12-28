import React, { useState } from 'react';
import { XCircle, X, Lock } from 'lucide-react'; 
import { revokeCertificate } from '../utils/web3Services';

const RevokeCertificatePage = ({ account, connectWallet }) => {
  const [certificateId, setCertificateId] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Guard Clause: Require Login
  if (!account) {
    return (
       <div className="max-w-3xl mx-auto flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-sm border border-gray-200 mt-10">
         <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-red-600" />
         </div>
         <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
         <p className="text-gray-500 mb-6">You must be an admin to revoke certificates.</p>
         <button 
            onClick={connectWallet} 
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
         >
            Connect Wallet
         </button>
       </div>
    );
  }

  const handleRevoke = async () => {
    setErrorMessage('');
    setStatus('loading');

    if (!certificateId || !reason) {
      setErrorMessage("Please fill in all fields.");
      setStatus('idle');
      return;
    }

    try {
        await revokeCertificate(certificateId, reason);
        setStatus('success');
        setCertificateId('');
        setReason('');
    } catch(e) {
        console.error(e);
        const msg = e.reason || e.message || "Revoke transaction failed.";
        setErrorMessage(msg);
        setStatus('idle');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
             </div>
             <h2 className="text-2xl font-bold text-gray-900">Revoke Certificate</h2>
           </div>
           {/* Show connected account */}
           <span className="font-mono text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
              {account.slice(0,6)}...{account.slice(-4)}
           </span>
        </div>

        {/* Success Message */}
        {status === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Success! Certificate revocation submitted to blockchain.
            </div>
        )}

        {/* Error Message */}
        {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
                <span>{errorMessage}</span>
                <button onClick={() => setErrorMessage('')}><X className="w-4 h-4" /></button>
            </div>
        )}

        <div className="space-y-6">
           <div>
             <label className="block text-sm font-medium mb-2">Certificate ID (Hash)</label>
             <input 
                type="text" 
                value={certificateId} 
                onChange={(e) => setCertificateId(e.target.value)} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                placeholder="0x..." 
             />
           </div>
           <div>
             <label className="block text-sm font-medium mb-2">Reason for Revocation</label>
             <textarea 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                rows={4} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                placeholder="Reason..." 
             />
           </div>
           <button 
              onClick={handleRevoke} 
              disabled={status === 'loading'} 
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg disabled:opacity-50 hover:bg-red-700 transition-colors"
           >
              {status === 'loading' ? "Processing Revocation..." : "Revoke Certificate"}
           </button>
        </div>
      </div>
    </div>
  );
};
export default RevokeCertificatePage;