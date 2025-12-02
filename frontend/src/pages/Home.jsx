    import React from 'react';
import { Shield, CheckCircle, FileText } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          Secure Digital Certificates
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Blockchain-powered certificate issuance and verification system for Institut Teknologi Bandung
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Immutable Records</h3>
          <p className="text-gray-600">Certificates stored on blockchain cannot be altered or tampered with</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Verification</h3>
          <p className="text-gray-600">Verify certificate authenticity in seconds using blockchain technology</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Encrypted Storage</h3>
          <p className="text-gray-600">Certificate data encrypted with AES and stored securely off-chain</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">1,234</div>
            <div className="text-blue-100">Certificates Issued</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">5,678</div>
            <div className="text-blue-100">Verifications</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">99.9%</div>
            <div className="text-blue-100">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;