import { useState, useMemo } from 'react';
import { TradingPair } from '../types';
import { tradingPairs, generateCandleData } from '../data/mockData';
import {
  PairListPanel,
  ChartPanel,
  TradingFormPanel,
} from './trade';

interface TradePageProps {
  selectedPairId?: string;
}

type ActivePanel = 'pairs' | 'chart' | 'form';
type TimeFrame = '1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export const TradePage: React.FC<TradePageProps> = ({ selectedPairId }) => {
  const [selectedPair, setSelectedPair] = useState<TradingPair>(
    tradingPairs.find((p) => p.id === selectedPairId) || tradingPairs[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1H');
  const [activeMobilePanel, setActiveMobilePanel] =
    useState<ActivePanel>('chart');

  const candleData = useMemo(
    () => generateCandleData(selectedPair.price),
    [selectedPair]
  );

  // Generate order book data
  const orderBook = useMemo(() => {
    const asks: OrderBookEntry[] = [];
    const bids: OrderBookEntry[] = [];
    const basePrice = selectedPair.price;

    for (let i = 0; i < 12; i++) {
      const askPrice = basePrice + (i + 1) * (basePrice * 0.0005);
      const bidPrice = basePrice - (i + 1) * (basePrice * 0.0005);
      const askAmount = 0.5 + (i % 3) * 0.3;
      const bidAmount = 0.5 + (i % 3) * 0.3;

      asks.push({
        price: askPrice,
        amount: askAmount,
        total: askPrice * askAmount,
      });
      bids.push({
        price: bidPrice,
        amount: bidAmount,
        total: bidPrice * bidAmount,
      });
    }

    return { asks: asks.reverse(), bids };
  }, [selectedPair]);

  const filteredPairs = useMemo(() => {
    return tradingPairs.filter(
      (pair) =>
        pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectPair = (pair: TradingPair) => {
    setSelectedPair(pair);
    setActiveMobilePanel('chart');
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr_360px] h-[calc(100vh-64px)] bg-[var(--bg-primary)]">
        <PairListPanel
          pairs={filteredPairs}
          selectedPair={selectedPair}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectPair={handleSelectPair}
        />
        <ChartPanel
          selectedPair={selectedPair}
          candleData={candleData}
          orderBook={orderBook}
          timeFrame={timeFrame}
          onTimeFrameChange={setTimeFrame}
        />
        <TradingFormPanel selectedPair={selectedPair} />
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:grid md:grid-cols-[240px_1fr] lg:hidden h-[calc(100vh-64px)] bg-[var(--bg-primary)]">
        <PairListPanel
          pairs={filteredPairs}
          selectedPair={selectedPair}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectPair={handleSelectPair}
        />
        <div className="grid grid-rows-[1fr_280px]">
          <ChartPanel
            selectedPair={selectedPair}
            candleData={candleData}
            orderBook={orderBook}
            timeFrame={timeFrame}
            onTimeFrameChange={setTimeFrame}
          />
          <TradingFormPanel selectedPair={selectedPair} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-[calc(100vh-64px)] bg-[var(--bg-primary)]">
        {/* Mobile Tab Navigation */}
        <div className="flex border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          {[
            { id: 'pairs', label: 'Pairs' },
            { id: 'chart', label: 'Chart' },
            { id: 'form', label: 'Trade' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMobilePanel(tab.id as ActivePanel)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeMobilePanel === tab.id
                  ? 'text-[var(--text-primary)] border-b-2 border-[var(--color-buy)]'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Panel Content */}
        <div className="flex-1 overflow-hidden">
          {activeMobilePanel === 'pairs' && (
            <PairListPanel
              pairs={filteredPairs}
              selectedPair={selectedPair}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectPair={handleSelectPair}
            />
          )}
          {activeMobilePanel === 'chart' && (
            <ChartPanel
              selectedPair={selectedPair}
              candleData={candleData}
              orderBook={orderBook}
              timeFrame={timeFrame}
              onTimeFrameChange={setTimeFrame}
            />
          )}
          {activeMobilePanel === 'form' && (
            <TradingFormPanel selectedPair={selectedPair} />
          )}
        </div>
      </div>
    </>
  );
};

export default TradePage;
