import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { verifyCertificate } from '../utils/web3Services';

const VerifyCertificatePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); // ID from Blockchain
    if (id) {
        setSearchQuery(id);
        handleVerify(id);
    }
  }, []);

  const handleVerify = async (queryOverride) => {
    const query = queryOverride || searchQuery;
    if(!query) return;

    setIsVerifying(true);
    setVerificationResult(null);

    const data = await verifyCertificate(query);
    setVerificationResult(data || { notFound: true });
    setIsVerifying(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
         <h2 className="text-2xl font-bold mb-4">Verify Certificate</h2>
         <div className="flex space-x-2">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-4 py-2 border rounded-lg" placeholder="Certificate ID..." />
            <button onClick={() => handleVerify(null)} disabled={isVerifying} className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
               {isVerifying ? "..." : "Verify"}
            </button>
         </div>
      </div>

      {verificationResult && (
        <div className={`rounded-xl shadow-sm border p-8 ${verificationResult.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
           {verificationResult.notFound ? (
             <div className="flex items-center space-x-4 text-red-900">
               <XCircle className="w-8 h-8 text-red-600" />
               <div><h3 className="text-xl font-bold">Certificate Not Found</h3></div>
             </div>
           ) : (
             <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${verificationResult.isValid ? 'bg-green-100' : 'bg-red-100'}`}>
                   {verificationResult.isValid ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
                </div>
                <div className="flex-1">
                   <h3 className={`text-xl font-bold mb-2 ${verificationResult.isValid ? 'text-green-900' : 'text-red-900'}`}>
                      {verificationResult.isValid ? 'Certificate Valid' : 'Revoked / Invalid'}
                   </h3>
                   <div className="text-sm space-y-2">
                      <p><strong>Issuer:</strong> {verificationResult.issuer}</p>
                      <p><strong>Date:</strong> {new Date(verificationResult.timestamp).toLocaleDateString()}</p>
                      {!verificationResult.isValid && <p className="text-red-600"><strong>Reason:</strong> {verificationResult.revocationReason}</p>}
                   </div>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};
export default VerifyCertificatePage;