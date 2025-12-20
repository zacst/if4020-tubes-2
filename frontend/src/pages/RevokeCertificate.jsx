import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import { mockRevokeCertificate } from '../utils/mockServices';

const RevokeCertificatePage = () => {
  const [certificateId, setCertificateId] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleRevoke = async () => {
    if (!certificateId || !reason) return alert("Fill all fields");
    setStatus('loading');
    
    await mockRevokeCertificate(certificateId, reason);
    
    setStatus('success');
    setCertificateId('');
    setReason('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Revoke Certificate</h2>
            <p className="text-sm text-gray-600">Mark a certificate as invalid</p>
          </div>
        </div>

        {status === 'success' && (
             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                 <strong>Success!</strong> The certificate has been revoked on the blockchain.
             </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Warning:</strong> Revoking a certificate is permanent and cannot be undone. This action will be recorded on the blockchain.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Certificate ID / Transaction Hash</label>
            <input type="text" value={certificateId} onChange={(e) => setCertificateId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" placeholder="0x..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Revocation</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" placeholder="Describe the reason..." />
          </div>

          <div className="flex space-x-4 pt-4">
            <button 
                onClick={handleRevoke} 
                disabled={status === 'loading'}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? "Processing..." : "Revoke Certificate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevokeCertificatePage;