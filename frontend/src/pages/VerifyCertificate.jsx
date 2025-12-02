import React, { useState } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';

const VerifyCertificatePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = () => {
    setVerificationResult({
      valid: true,
      studentName: 'RIVALDO THAMRIN NASUTION',
      nim: '11223029',
      program: 'Teknik Sipil',
      degree: 'SARJANA TEKNIK',
      issueDate: '26 Maret 2026',
      txHash: '0x1234...5678',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Verify Certificate</h2>
            <p className="text-sm text-gray-600">Check the authenticity of a digital certificate</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate ID / Transaction Hash / NIM
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter certificate ID, transaction hash, or student NIM"
              />
              <button
                onClick={handleVerify}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>

      {verificationResult && (
        <div className={`rounded-xl shadow-sm border p-8 ${
          verificationResult.valid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              verificationResult.valid ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {verificationResult.valid ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 ${
                verificationResult.valid ? 'text-green-900' : 'text-red-900'
              }`}>
                {verificationResult.valid ? 'Certificate Valid' : 'Certificate Invalid'}
              </h3>
              
              {verificationResult.valid && (
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Student Name:</span>
                      <p className="text-gray-900">{verificationResult.studentName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">NIM:</span>
                      <p className="text-gray-900">{verificationResult.nim}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Program:</span>
                      <p className="text-gray-900">{verificationResult.program}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Degree:</span>
                      <p className="text-gray-900">{verificationResult.degree}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Issue Date:</span>
                      <p className="text-gray-900">{verificationResult.issueDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Transaction:</span>
                      <p className="text-blue-600 font-mono text-xs">{verificationResult.txHash}</p>
                    </div>
                  </div>
                  
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Download Certificate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificatePage;