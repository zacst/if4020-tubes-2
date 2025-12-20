import React, { useState, useEffect } from 'react'; // Import useEffect
import Layout from './components/Layout';
import HomePage from './pages/Home';
import IssueCertificatePage from './pages/IssueCertificate';
import RevokeCertificatePage from './pages/RevokeCertificate';
import VerifyCertificatePage from './pages/VerifyCertificate.jsx';
import TransactionsPage from './pages/Transactions';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  // Check URL for "Magic Link" parameters on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // If the URL has 'cid' or 'tx', automatically go to 'verify' page
    if (params.get('cid') || params.get('tx')) {
      setCurrentPage('verify');
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'issue':
        return <IssueCertificatePage />;
      case 'revoke':
        return <RevokeCertificatePage />;
      case 'verify':
        return <VerifyCertificatePage />;
      case 'transactions':
        return <TransactionsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;