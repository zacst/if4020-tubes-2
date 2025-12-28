import React, { useState } from 'react';
// 1. Added LogOut icon
import { FileText, Upload, Search, Shield, XCircle, Home, Menu, X, LogOut } from 'lucide-react';

// 2. Accept account, connect, and disconnect as props from App.js
const Layout = ({ 
  children, 
  currentPage, 
  setCurrentPage, 
  account, 
  connectWallet, 
  disconnectWallet 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'issue', label: 'Issue Certificate', icon: Upload, role: 'admin' },
    { id: 'revoke', label: 'Revoke Certificate', icon: XCircle, role: 'admin' },
    { id: 'verify', label: 'Verify Certificate', icon: Search },
    { id: 'transactions', label: 'Transactions', icon: FileText },
  ];

  // REMOVED: Internal useEffect and connectWallet function. 
  // We now use the ones passed down from App.js to keep the whole app in sync.

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ITB Certificate System</h1>
                <p className="text-xs text-gray-500">Blockchain-Based Verification</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map(item => {
                const Icon = item.icon;
                // Optional: Hide admin items if not logged in (uncomment if desired)
                // if (item.role === 'admin' && !account) return null; 

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                      currentPage === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Wallet & Logout Section */}
            <div className="hidden md:block">
              {account ? (
                <div className="flex items-center space-x-3">
                  {/* Address Display */}
                  <div className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-mono text-sm border border-gray-200 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </div>
                  
                  {/* Logout Button */}
                  <button 
                    onClick={disconnectWallet}
                    className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Disconnect Wallet"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={connectWallet}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center space-x-3 ${
                      currentPage === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile Wallet Section */}
              <div className="px-4 pt-4 border-t border-gray-100 mt-2">
                {account ? (
                  <div className="space-y-3">
                    <div className="w-full px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-mono text-sm text-center border border-gray-200">
                      Connected: {account.slice(0, 6)}...{account.slice(-4)}
                    </div>
                    <button 
                      onClick={() => {
                        disconnectWallet();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg font-medium flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      connectWallet();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            © 2025 Institut Teknologi Bandung - Blockchain Certificate System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;