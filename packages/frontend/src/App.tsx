import React, { useState } from 'react';
import { Header, WalletModal, TradePage, SwapPage, PoolsPage } from './components';
import { useWallet } from './hooks/useWallet';
import { useTheme } from './hooks/useTheme';
import './App.css';

type Page = 'swap' | 'perps' | 'pools';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('swap');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  
  const { theme, toggleTheme } = useTheme();

  const {
    wallet,
    isConnecting,
    connectPhantom,
    connectMetaMask,
    connectCatena,
    disconnect,
  } = useWallet();

  const handleConnectPhantom = async () => {
    try {
      await connectPhantom();
      setIsWalletModalOpen(false);
    } catch (error) {
      console.error('Failed to connect Phantom:', error);
    }
  };

  const handleConnectMetaMask = async () => {
    try {
      await connectMetaMask();
      setIsWalletModalOpen(false);
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
    }
  };

  const handleConnectCatena = async () => {
    try {
      await connectCatena();
      setIsWalletModalOpen(false);
    } catch (error) {
      console.error('Failed to connect Catena:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'swap':
        return <SwapPage />;
      case 'perps':
        return <TradePage />;
      case 'pools':
        return <PoolsPage />;
      default:
        return <SwapPage />;
    }
  };

  return (
    <div className="min-h-screen bg-primary-okx transition-colors duration-200">
      <Header
        wallet={wallet}
        onConnectWallet={() => setIsWalletModalOpen(true)}
        onDisconnect={disconnect}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page as Page)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnectPhantom={handleConnectPhantom}
        onConnectMetaMask={handleConnectMetaMask}
        onConnectCatena={handleConnectCatena}
        isConnecting={isConnecting}
      />
    </div>
  );
}

export default App;
