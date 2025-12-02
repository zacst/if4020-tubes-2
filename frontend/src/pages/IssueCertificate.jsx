import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

const IssueCertificatePage = () => {
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

  const handleSubmit = () => {
    console.log('Submitting certificate...', formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Upload className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Issue New Certificate</h2>
            <p className="text-sm text-gray-600">Create and publish a new digital certificate</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., RIVALDO THAMRIN NASUTION"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIM
                </label>
                <input
                  type="text"
                  value={formData.nim}
                  onChange={(e) => setFormData({...formData, nim: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 11223029"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Place
                </label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Sibolga"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Date
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program of Study
                </label>
                <input
                  type="text"
                  value={formData.program}
                  onChange={(e) => setFormData({...formData, program: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Teknik Sipil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({...formData, degree: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., SARJANA TEKNIK"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date
              </label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* PDF Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Certificate Document</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  {pdfFile ? pdfFile.name : 'Click to upload PDF certificate'}
                </p>
                <p className="text-sm text-gray-500">
                  PDF file will be encrypted with AES before storage
                </p>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Generate & Sign Certificate
            </button>
            <button
              onClick={() => setFormData({studentName: '', nim: '', birthPlace: '', birthDate: '', program: '', degree: '', issueDate: ''})}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCertificatePage;