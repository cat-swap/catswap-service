import { TradingPair } from '../../types';
import { formatPrice } from '../../shared/lib/formatters';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface OrderBookPanelProps {
  selectedPair: TradingPair;
  orderBook: {
    asks: OrderBookEntry[];
    bids: OrderBookEntry[];
  };
}

export const OrderBookPanel: React.FC<OrderBookPanelProps> = ({
  selectedPair,
  orderBook,
}) => {
  const priceChange = selectedPair.change24h >= 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-primary)]">
        <span className="text-sm font-medium text-[var(--text-primary)]">
          Order Book
        </span>
        <div className="flex gap-1">
          {['Both', 'Buy', 'Sell'].map((tab) => (
            <button
              key={tab}
              className="px-2 py-1 text-xs rounded transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {/* Header */}
        <div className="grid grid-cols-3 px-2 py-1.5 text-xs text-[var(--text-tertiary)]">
          <span>Price(USDT)</span>
          <span className="text-right">
            Amount({selectedPair.symbol.split('/')[0]})
          </span>
          <span className="text-right">Total</span>
        </div>

        {/* Asks */}
        <div className="space-y-0.5">
          {orderBook.asks.map((ask, index) => (
            <div
              key={index}
              className="relative grid grid-cols-3 px-2 py-0.5 text-xs"
            >
              <div
                className="absolute right-0 top-0 bottom-0 bg-[var(--color-sell)]/10"
                style={{ width: `${(ask.amount / 2) * 100}%` }}
              />
              <span className="relative text-[var(--color-sell)]">
                {formatPrice(ask.price)}
              </span>
              <span className="relative text-right text-[var(--text-primary)]">
                {ask.amount.toFixed(4)}
              </span>
              <span className="relative text-right text-[var(--text-primary)]">
                {formatPrice(ask.total)}
              </span>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="flex items-center justify-center gap-2 py-2 my-1 bg-[var(--bg-tertiary)] rounded">
          <span className="text-base font-semibold text-[var(--text-primary)]">
            {formatPrice(selectedPair.price)}
          </span>
          <span
            className={`text-xs ${
              priceChange ? 'text-[var(--color-buy)]' : 'text-[var(--color-sell)]'
            }`}
          >
            {priceChange ? '+' : ''}
            {selectedPair.change24h.toFixed(2)}%
          </span>
        </div>

        {/* Bids */}
        <div className="space-y-0.5">
          {orderBook.bids.map((bid, index) => (
            <div
              key={index}
              className="relative grid grid-cols-3 px-2 py-0.5 text-xs"
            >
              <div
                className="absolute right-0 top-0 bottom-0 bg-[var(--color-buy)]/10"
                style={{ width: `${(bid.amount / 2) * 100}%` }}
              />
              <span className="relative text-[var(--color-buy)]">
                {formatPrice(bid.price)}
              </span>
              <span className="relative text-right text-[var(--text-primary)]">
                {bid.amount.toFixed(4)}
              </span>
              <span className="relative text-right text-[var(--text-primary)]">
                {formatPrice(bid.total)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
