import { useState } from 'react';
import { Header } from './components/Header';
import { SpotTradingPage } from './components/SpotTradingPage';
import { PerpsTradingPage } from './components/PerpsTradingPage';
import { PoolsPage } from './components/PoolsPage';
import { useWallet } from './hooks/useWallet';
import { useTheme } from './hooks/useTheme';
import './App.css';

type Page = 'spot' | 'perps' | 'pools';



function App() {
  const [currentPage, setCurrentPage] = useState<Page>('spot');
  const { theme, toggleTheme } = useTheme();
  const { wallet, isConnecting, connect, disconnect } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'spot':
        return <SpotTradingPage wallet={wallet} onConnectWallet={handleConnect} />;
      case 'perps':
        return <PerpsTradingPage wallet={wallet} onConnectWallet={handleConnect} />;
      case 'pools':
        return <PoolsPage />;
      default:
        return <SpotTradingPage wallet={wallet} onConnectWallet={handleConnect} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header
        wallet={wallet}
        onConnectWallet={handleConnect}
        onDisconnect={disconnect}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="pt-14 sm:pt-16 md:pt-16 min-h-screen">
        {renderPage()}
      </main>

      {/* Simple Loading Overlay */}
      {isConnecting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--okx-primary)]" />
            <span className="text-sm text-[var(--text-secondary)]">Connecting to Catena...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
