import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { Header } from './components/Header';
import { SpotTradingPage } from './components/SpotTradingPage';
import { PerpsTradingPage } from './components/PerpsTradingPage';
import { PoolsPage } from './components/PoolsPage';
import { usePageMeta } from './hooks/usePageMeta';
import { useWallet } from './hooks/useWallet';
import { useTheme } from './hooks/useTheme';
import { AppPage, getPageKeyFromPath, getPagePath } from './seo/routeMeta';

interface AppLayoutContext {
  connectWallet: () => Promise<void>;
  navigateToTrade: (pair: string, type: 'spot' | 'perp') => void;
  connected: boolean;
  selectedPair?: string;
  wallet: ReturnType<typeof useWallet>['wallet'];
}

const createTradeSearch = (pair?: string) => {
  if (!pair) return '';

  return `?pair=${encodeURIComponent(pair)}`;
};

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = getPageKeyFromPath(location.pathname);
  const selectedPair = searchParams.get('pair') ?? undefined;
  const { theme, toggleTheme } = useTheme();
  const { wallet, isConnecting, connect, disconnect } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleNavigateToTrade = (pair: string, type: 'spot' | 'perp') => {
    const pathname = type === 'spot' ? getPagePath('spot') : getPagePath('perps');
    navigate(`${pathname}${createTradeSearch(pair)}`);
  };

  const handlePageChange = (page: AppPage) => {
    const nextPath = getPagePath(page);
    const nextSearch = page === 'pools' ? '' : createTradeSearch(selectedPair);
    navigate(`${nextPath}${nextSearch}`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header
        wallet={wallet}
        onConnectWallet={handleConnect}
        onDisconnect={disconnect}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="pt-[45px] sm:pt-[52px] pb-20 md:pb-0 min-h-screen">
        <Outlet
          context={{
            connectWallet: handleConnect,
            connected: wallet.connected,
            navigateToTrade: handleNavigateToTrade,
            selectedPair,
            wallet,
          }}
        />
      </main>

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
};

const useAppLayoutContext = () => useOutletContext<AppLayoutContext>();

const SpotRoute = () => {
  const { connectWallet, selectedPair, wallet } = useAppLayoutContext();
  usePageMeta('spot');

  return (
    <SpotTradingPage
      wallet={wallet}
      onConnectWallet={connectWallet}
      selectedPair={selectedPair}
    />
  );
};

const PerpsRoute = () => {
  const { connectWallet, selectedPair, wallet } = useAppLayoutContext();
  usePageMeta('perps');

  return (
    <PerpsTradingPage
      wallet={wallet}
      onConnectWallet={connectWallet}
      selectedPair={selectedPair}
    />
  );
};

const PoolsRoute = () => {
  const { connected, navigateToTrade } = useAppLayoutContext();
  usePageMeta('pools');

  return (
    <PoolsPage
      connected={connected}
      onNavigateToTrade={navigateToTrade}
    />
  );
};

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<SpotRoute />} />
        <Route path="perps" element={<PerpsRoute />} />
        <Route path="pools" element={<PoolsRoute />} />
        <Route path="spot" element={<Navigate replace to="/" />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;
