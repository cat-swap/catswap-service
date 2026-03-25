import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TradingPair, CandleData } from '../../types';
import { OrderBookPanel } from './OrderBookPanel';
import { formatPrice, formatVolume } from '../../shared/lib/formatters';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

type TimeFrame = '1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W';

interface ChartPanelProps {
  selectedPair: TradingPair;
  candleData: CandleData[];
  orderBook: {
    asks: OrderBookEntry[];
    bids: OrderBookEntry[];
  };
  timeFrame: TimeFrame;
  onTimeFrameChange: (tf: TimeFrame) => void;
}

const TIME_FRAMES: TimeFrame[] = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

export const ChartPanel: React.FC<ChartPanelProps> = ({
  selectedPair,
  candleData,
  orderBook,
  timeFrame,
  onTimeFrameChange,
}) => {
  const priceChange = selectedPair.change24h >= 0;

  const tooltipStyles = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '8px',
    padding: '8px 12px',
  };

  const labelStyle = {
    color: 'var(--text-tertiary)',
    fontSize: 12,
  };

  return (
    <div className="flex flex-col h-full min-w-0">
      {/* Chart Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border-primary)] flex-wrap">
        <div className="flex items-baseline gap-2">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {selectedPair.symbol}
          </h2>
          <span className="text-xs text-[var(--text-tertiary)]">
            {selectedPair.name} Perpetual
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-2xl font-bold ${
              priceChange ? 'text-[var(--color-buy)]' : 'text-[var(--color-sell)]'
            }`}
          >
            ${formatPrice(selectedPair.price)}
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${
              priceChange
                ? 'text-[var(--color-buy)] bg-[var(--color-buy-light)]'
                : 'text-[var(--color-sell)] bg-[var(--color-sell-light)]'
            }`}
          >
            {priceChange ? '+' : ''}
            {selectedPair.change24h.toFixed(2)}%
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-4 ml-auto">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-[var(--text-tertiary)]">24h High</span>
            <span className="text-sm text-[var(--text-primary)]">
              ${formatPrice(selectedPair.high24h)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-[var(--text-tertiary)]">24h Low</span>
            <span className="text-sm text-[var(--text-primary)]">
              ${formatPrice(selectedPair.low24h)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-[var(--text-tertiary)]">24h Vol</span>
            <span className="text-sm text-[var(--text-primary)]">
              {formatVolume(selectedPair.volume24h)}
            </span>
          </div>
        </div>
      </div>

      {/* Time Frame Selector */}
      <div className="flex gap-1 px-4 py-2 border-b border-[var(--border-primary)]">
        {TIME_FRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => onTimeFrameChange(tf)}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              timeFrame === tf
                ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[280px] p-4 border-b border-[var(--border-primary)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={candleData.slice(-50)}>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
              tickFormatter={(value) =>
                new Date(value).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }
            />
            <YAxis
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
              tickFormatter={(value) => `$${formatPrice(value)}`}
              width={70}
            />
            <Tooltip
              contentStyle={tooltipStyles}
              labelStyle={labelStyle}
              formatter={(value) => [`$${formatPrice(Number(value))}`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke={
                priceChange ? 'var(--color-buy)' : 'var(--color-sell)'
              }
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Order Book */}
      <div className="flex-1 min-h-0">
        <OrderBookPanel selectedPair={selectedPair} orderBook={orderBook} />
      </div>
    </div>
  );
};
