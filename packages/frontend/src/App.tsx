import { useState, Suspense, lazy } from 'react';
import { Header, WalletModal } from './components';
import { SwapPage } from './components';
import { useWallet } from './hooks/useWallet';
import { useTheme } from './hooks/useTheme';
import './App.css';

// Lazy load heavy pages that use recharts
const TradePage = lazy(() => import('./components/TradePage'));
const PoolsPage = lazy(() => import('./components/PoolsPage'));

type Page = 'swap' | 'perps' | 'pools';

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-[calc(100vh-64px)]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-buy)]" />
  </div>
);

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
        return (
          <Suspense fallback={<PageLoader />}>
            <TradePage />
          </Suspense>
        );
      case 'pools':
        return (
          <Suspense fallback={<PageLoader />}>
            <PoolsPage />
          </Suspense>
        );
      default:
        return <SwapPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header
        wallet={wallet}
        onConnectWallet={() => setIsWalletModalOpen(true)}
        onDisconnect={disconnect}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page as Page)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 overflow-hidden">{renderPage()}</main>

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
