import React, { useState } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import IssueCertificatePage from './pages/IssueCertificate';
import RevokeCertificatePage from './pages/RevokeCertificate';
import VerifyCertificatePage from './pages/VerifyCertificate.jsx';
import TransactionsPage from './pages/Transactions';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

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