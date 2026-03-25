import React from 'react';
import { TradingPair } from '../types';

interface MarketOverviewProps {
  pairs: TradingPair[];
  selectedPair: TradingPair | null;
  onSelectPair: (pair: TradingPair) => void;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  pairs,
  selectedPair,
  onSelectPair,
}) => {
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(4);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    }
    if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    }
    return `$${(volume / 1e3).toFixed(2)}K`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-primary-okx">Markets</h2>
        <div className="flex gap-1">
          {['Hot', 'Gainers', 'Losers', 'New'].map((tab, index) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-okx transition-colors ${
                index === 0
                  ? 'text-primary-okx bg-tertiary-okx'
                  : 'text-secondary-okx hover:text-primary-okx hover:bg-tertiary-okx'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-okx-lg border border-primary-okx bg-secondary-okx overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_0.8fr] px-4 py-3 border-b border-primary-okx text-xs font-medium text-tertiary-okx uppercase">
          <span>Name</span>
          <span className="text-right">Last Price</span>
          <span className="text-right">24h Change</span>
          <span className="text-right">24h Volume</span>
          <span className="text-right">24h High</span>
          <span className="text-right">24h Low</span>
          <span></span>
        </div>

        {/* Table Body */}
        <div className="max-h-[500px] overflow-y-auto">
          {pairs.map((pair) => (
            <div
              key={pair.id}
              onClick={() => onSelectPair(pair)}
              className={`grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_0.8fr] px-4 py-4 border-b border-primary-okx cursor-pointer transition-colors items-center ${
                selectedPair?.id === pair.id 
                  ? 'bg-tertiary-okx border-l-2 border-l-okx-buy' 
                  : 'hover:bg-tertiary-okx'
              }`}
            >
              {/* Name */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ background: getPairColor(pair.symbol) }}
                >
                  {pair.symbol.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-primary-okx">{pair.symbol}</div>
                  <div className="text-xs text-tertiary-okx">{pair.name}</div>
                </div>
              </div>

              {/* Price */}
              <span className="text-sm font-medium text-primary-okx text-right">
                ${formatPrice(pair.price)}
              </span>

              {/* Change */}
              <span className={`text-sm font-medium text-right ${pair.change24h >= 0 ? 'text-okx-buy' : 'text-okx-sell'}`}>
                {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
              </span>

              {/* Volume */}
              <span className="text-sm text-tertiary-okx text-right">
                {formatVolume(pair.volume24h)}
              </span>

              {/* High */}
              <span className="text-sm text-tertiary-okx text-right">
                ${formatPrice(pair.high24h)}
              </span>

              {/* Low */}
              <span className="text-sm text-tertiary-okx text-right">
                ${formatPrice(pair.low24h)}
              </span>

              {/* Action */}
              <div className="text-right">
                <button className="px-4 py-1.5 text-xs font-medium rounded border border-okx-buy text-okx-buy hover:bg-okx-buy hover:text-white transition-colors">
                  Trade
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getPairColor = (symbol: string): string => {
  const colors: Record<string, string> = {
    'BTC': '#f7931a',
    'ETH': '#627eea',
    'SOL': '#14f195',
    'BNB': '#f3ba2f',
    'XRP': '#23292f',
    'DOGE': '#c3a634',
    'ADA': '#0033ad',
    'AVAX': '#e84142',
  };
  const key = symbol.split('/')[0];
  return colors[key] || '#6b7280';
};
