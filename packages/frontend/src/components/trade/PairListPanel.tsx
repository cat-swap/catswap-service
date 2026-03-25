import { TradingPair } from '../../types';
import { formatPrice, formatVolume } from '../../shared/lib/formatters';

interface PairListPanelProps {
  pairs: TradingPair[];
  selectedPair: TradingPair;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPair: (pair: TradingPair) => void;
}

export const PairListPanel: React.FC<PairListPanelProps> = ({
  pairs,
  selectedPair,
  searchQuery,
  onSearchChange,
  onSelectPair,
}) => {
  return (
    <div className="flex flex-col h-full border-r border-[var(--border-primary)] bg-[var(--bg-secondary)]">
      {/* Search & Tabs */}
      <div className="p-3 border-b border-[var(--border-primary)]">
        <div className="flex gap-1 mb-2">
          {['USDT', 'USD', 'BTC'].map((tab) => (
            <button
              key={tab}
              className="flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search"
          className="w-full px-3 py-2 rounded-lg text-sm bg-[var(--bg-input)] text-[var(--text-primary)] border border-transparent placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-hover)] transition-all"
        />
      </div>

      {/* Header Row */}
      <div className="grid grid-cols-3 px-3 py-2 text-xs text-[var(--text-tertiary)] border-b border-[var(--border-primary)]">
        <span>Pair</span>
        <span className="text-right">Last Price</span>
        <span className="text-right">24h Change</span>
      </div>

      {/* Pair List */}
      <div className="flex-1 overflow-y-auto">
        {pairs.map((pair) => (
          <div
            key={pair.id}
            onClick={() => onSelectPair(pair)}
            className={`grid grid-cols-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)] ${
              selectedPair.id === pair.id
                ? 'bg-[var(--bg-tertiary)] border-l-2 border-[var(--color-buy)]'
                : ''
            }`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {pair.symbol.replace('/USDT', '')}
              </span>
              <span className="text-xs text-[var(--text-tertiary)]">
                Vol {formatVolume(pair.volume24h)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm text-[var(--text-primary)]">
                {formatPrice(pair.price)}
              </span>
            </div>
            <div className="text-right">
              <span
                className={`text-sm ${
                  pair.change24h >= 0
                    ? 'text-[var(--color-buy)]'
                    : 'text-[var(--color-sell)]'
                }`}
              >
                {pair.change24h >= 0 ? '+' : ''}
                {pair.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
