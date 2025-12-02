import React from 'react';
import { FileText } from 'lucide-react';

const TransactionsPage = () => {
  const transactions = [
    {
      id: 1,
      type: 'Issue',
      txHash: '0x1234567890abcdef',
      student: 'RIVALDO THAMRIN NASUTION',
      nim: '11223029',
      timestamp: '2025-12-01 10:30:00',
      status: 'Confirmed',
    },
    {
      id: 2,
      type: 'Issue',
      txHash: '0xabcdef1234567890',
      student: 'SITI AMINAH',
      nim: '11223030',
      timestamp: '2025-12-01 09:15:00',
      status: 'Confirmed',
    },
    {
      id: 3,
      type: 'Revoke',
      txHash: '0x9876543210fedcba',
      student: 'BUDI SANTOSO',
      nim: '11223028',
      timestamp: '2025-11-30 14:20:00',
      status: 'Confirmed',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-600">View all certificate transactions on the blockchain</p>
            </div>
          </div>
          <a
            href="https://sepolia.etherscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            View on Etherscan
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">NIM</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transaction Hash</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Timestamp</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.type === 'Issue' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{tx.student}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{tx.nim}</td>
                  <td className="py-3 px-4 text-sm font-mono text-blue-600">{tx.txHash}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{tx.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;