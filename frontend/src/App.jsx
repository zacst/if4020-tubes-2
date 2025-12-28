import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import IssueCertificatePage from './pages/IssueCertificate';
import RevokeCertificatePage from './pages/RevokeCertificate';
import VerifyCertificatePage from './pages/VerifyCertificate.jsx';
import TransactionsPage from './pages/Transactions';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [account, setAccount] = useState(''); 

  // 1. Check for Magic Links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('cid') || params.get('tx')) {
      setCurrentPage('verify');
    }
  }, []);

  // 2. Check Connection & Listen for Account Changes (Auto-Logout support)
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();

    // LISTENER: If user disconnects/changes account inside MetaMask extension
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(''); // User disconnected via MetaMask UI -> Auto logout
          setCurrentPage('home'); // Optional: Redirect to home
        }
      });
    }
    
    // Cleanup listener on unmount
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {}); 
      }
    };
  }, []);

  // 3. Connect Function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Connection failed", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // 4. NEW: Disconnect Function (The "Soft Logout")
  const disconnectWallet = () => {
    setAccount(''); // Clears the state, resetting the UI
    setCurrentPage('home'); // Redirect user to home or login view
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'issue':
        return <IssueCertificatePage account={account} connectWallet={connectWallet} />;
      case 'revoke':
        return <RevokeCertificatePage account={account} connectWallet={connectWallet} />;
      case 'verify':
        return <VerifyCertificatePage />;
      case 'transactions':
        return <TransactionsPage account={account} />; 
      default:
        return <HomePage />;
    }
  };

  return (
    // 5. Pass 'disconnectWallet' to Layout so the Navbar can use it
    <Layout 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
      account={account}
      connectWallet={connectWallet}
      disconnectWallet={disconnectWallet} // <--- Pass this down!
    >
      {renderPage()}
    </Layout>
  );
};

export default App;