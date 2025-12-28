import React, { useEffect, useState } from 'react';
import { FileText, ExternalLink, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { ethers } from 'ethers';

// 1. CONFIGURATION
const CONTRACT_ADDRESS = "0xc2270c044063187663a805672f3684C94FE90ab8"; 

// 2. FIXED ABI (Must match your Solidity EXACTLY)
const CONTRACT_ABI = [
  // Old: "event CertificateIssued(bytes32 indexed certificateId, string ipfsHash)",
  // New (Correct):
  "event CertificateIssued(bytes32 indexed certificateId, address indexed issuer, string documentHash)",
  
  // Old: "event CertificateRevoked(bytes32 indexed certificateId, string reason)"
  // New (Correct):
  "event CertificateRevoked(bytes32 indexed certificateId, address indexed revoker, string reason)"
];

const TransactionsPage = ({ account }) => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all'); 
  const [debugStatus, setDebugStatus] = useState('Initializing...');

  const fetchHistory = async () => {
    // console.clear(); 
    console.log("%c--- STARTING FETCH (FIXED ABI) ---", "color: green; font-weight: bold;");
    
    if (!window.ethereum) return;
    
    setLoading(true);
    setDebugStatus("Scanning Blockchain...");

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        // 1. Fetch Events
        const issueFilter = contract.filters.CertificateIssued();
        const revokeFilter = contract.filters.CertificateRevoked();

        const [issueEvents, revokeEvents] = await Promise.all([
             contract.queryFilter(issueFilter),
             contract.queryFilter(revokeFilter)
        ]);

        console.log(`✅ Success! Found ${issueEvents.length} Issues and ${revokeEvents.length} Revokes.`);

        if (issueEvents.length === 0 && revokeEvents.length === 0) {
            setDebugStatus("No transactions found on this contract.");
            setLoading(false);
            setAllTransactions([]);
            return;
        }

        // 2. Process Events
        const processEvents = async (events, type) => {
            const processed = [];
            const reversedEvents = [...events].reverse();

            for (const event of reversedEvents) {
                try {
                    const block = await event.getBlock();
                    const tx = await event.getTransaction(); 
                    
                    if(!tx) continue;

                    // 3. CAREFUL MAPPING (Updated for new ABI)
                    // Solidity: event CertificateIssued(certificateId, issuer, documentHash);
                    // args[0] = id, args[1] = issuer, args[2] = documentHash
                    
                    let detailText = "";
                    if (type === 'Issue') {
                        // We show Document Hash because IPFS url is not in the event
                        const rawHash = event.args[2] || ""; 
                        detailText = "Doc Hash: " + rawHash.substring(0, 10) + "...";
                    } else {
                        // Revoke: event CertificateRevoked(id, revoker, reason)
                        // args[2] is reason
                        detailText = "Reason: " + event.args[2];
                    }

                    processed.push({
                      id: event.transactionHash + type,
                      type: type,
                      txHash: event.transactionHash,
                      from: tx.from.toLowerCase(),
                      certificateId: event.args[0], // certificateId is always first
                      detail: detailText,
                      timestamp: new Date(block.timestamp * 1000).toLocaleString(),
                      rawTimestamp: block.timestamp
                    });
                } catch (err) {
                    console.error(`Error processing event:`, err);
                }
            }
            return processed;
        };

        const issues = await processEvents(issueEvents, 'Issue');
        const revokes = await processEvents(revokeEvents, 'Revoke');

        const combined = [...issues, ...revokes].sort((a, b) => b.rawTimestamp - a.rawTimestamp);
        
        setAllTransactions(combined);
        setDebugStatus(`Loaded ${combined.length} transactions.`);

    } catch (error) {
        console.error("Fetch Error:", error);
        setDebugStatus(`Error: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [account]);

  // Filter Logic
  useEffect(() => {
    if (viewMode === 'mine' && account) {
        const myTx = allTransactions.filter(tx => tx.from === account.toLowerCase());
        setFilteredTransactions(myTx);
    } else {
        setFilteredTransactions(allTransactions);
    }
  }, [viewMode, allTransactions, account]);

  return (
    <div className="space-y-6">
      {/* Debug Bar (Optional, remove later) */}
      {/* <div className="bg-gray-100 text-xs p-2 text-center text-gray-500">{debugStatus}</div> */}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-600">Blockchain events from Sepolia</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
             <button onClick={fetchHistory} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
             </button>

             <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
                <button 
                    onClick={() => setViewMode('all')}
                    className={`px-3 py-1.5 rounded-md transition-all ${viewMode === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setViewMode('mine')}
                    disabled={!account}
                    className={`px-3 py-1.5 rounded-md transition-all flex items-center ${
                        viewMode === 'mine' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-900'
                    } ${!account ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Filter className="w-3 h-3 mr-1" />
                    My Tx
                </button>
             </div>

             <a href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 hidden sm:flex items-center">
                Contract <ExternalLink className="w-3 h-3 ml-2"/>
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Cert ID</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Detail</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">From</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Time</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!loading && filteredTransactions.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-gray-300 mb-2"/>
                          <p>No records found.</p>
                      </div>
                  </td></tr>
              ) : (
                  filteredTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          tx.type === 'Issue' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-gray-600" title={tx.certificateId}>
                          {tx.certificateId.substring(0, 6)}...
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{tx.detail}</td>
                      <td className="py-3 px-4 text-sm font-mono">
                          {account && tx.from === account.toLowerCase() 
                            ? <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">YOU</span> 
                            : <span className="text-gray-500">{tx.from.substring(0, 6)}...</span>
                          }
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">{tx.timestamp}</td>
                      <td className="py-3 px-4">
                          <a href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">
                              <ExternalLink className="w-4 h-4"/>
                          </a>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;