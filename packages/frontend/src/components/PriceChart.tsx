import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TradingPair, CandleData } from '../types';

interface PriceChartProps {
  pair: TradingPair | null;
  candleData: CandleData[];
}

type TimeFrame = '1H' | '4H' | '1D' | '1W' | '1M';

export const PriceChart: React.FC<PriceChartProps> = ({ pair, candleData }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1D');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  const chartData = useMemo(() => {
    return candleData.map((candle) => ({
      time: new Date(candle.time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      price: candle.close,
      volume: candle.volume,
    }));
  }, [candleData]);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2 });
    }
    return price.toFixed(2);
  };

  const timeFrames: TimeFrame[] = ['1H', '4H', '1D', '1W', '1M'];

  if (!pair) {
    return (
      <div className="rounded-okx-lg border border-primary-okx bg-secondary-okx p-6">
        <div className="h-[350px] flex items-center justify-center text-tertiary-okx">
          Select a trading pair to view the chart
        </div>
      </div>
    );
  }

  const priceChange = pair.change24h >= 0;
  const chartColor = priceChange ? 'var(--color-buy)' : 'var(--color-sell)';

  // Tooltip styles based on theme
  const tooltipStyles = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '8px',
    padding: '12px',
  };

  const labelStyle = {
    color: 'var(--text-tertiary)',
    marginBottom: '4px',
  };

  const itemStyle = {
    color: 'var(--text-primary)',
  };

  return (
    <div className="rounded-okx-lg border border-primary-okx bg-secondary-okx p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-semibold text-primary-okx">{pair.symbol}</span>
            <span className="text-sm text-tertiary-okx">{pair.name}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary-okx">${formatPrice(pair.price)}</span>
            <span className={`text-sm font-medium px-2 py-0.5 rounded ${
              priceChange ? 'text-okx-buy bg-okx-buy-light' : 'text-okx-sell bg-okx-sell-light'
            }`}>
              {priceChange ? '+' : ''}{pair.change24h.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Time Frames */}
          <div className="flex rounded-okx bg-tertiary-okx p-1">
            {timeFrames.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFrame(tf)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  timeFrame === tf
                    ? 'bg-tertiary-okx text-primary-okx'
                    : 'text-tertiary-okx hover:text-primary-okx'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Types */}
          <div className="flex rounded-okx bg-tertiary-okx p-1">
            {(['area', 'line'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition-colors ${
                  chartType === type
                    ? 'bg-tertiary-okx text-primary-okx'
                    : 'text-tertiary-okx hover:text-primary-okx'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[350px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                tickFormatter={(value) => `$${formatPrice(value)}`}
                width={80}
              />
              <Tooltip
                contentStyle={tooltipStyles}
                labelStyle={labelStyle}
                itemStyle={itemStyle}
                formatter={(value) => [`$${formatPrice(Number(value))}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                tickFormatter={(value) => `$${formatPrice(value)}`}
                width={80}
              />
              <Tooltip
                contentStyle={tooltipStyles}
                labelStyle={labelStyle}
                itemStyle={itemStyle}
                formatter={(value) => [`$${formatPrice(Number(value))}`, 'Price']}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="flex gap-8 pt-4 border-t border-primary-okx">
        <div>
          <span className="block text-xs text-tertiary-okx mb-1">24h High</span>
          <span className="text-sm font-medium text-primary-okx">${formatPrice(pair.high24h)}</span>
        </div>
        <div>
          <span className="block text-xs text-tertiary-okx mb-1">24h Low</span>
          <span className="text-sm font-medium text-primary-okx">${formatPrice(pair.low24h)}</span>
        </div>
        <div>
          <span className="block text-xs text-tertiary-okx mb-1">24h Volume</span>
          <span className="text-sm font-medium text-primary-okx">${(pair.volume24h / 1e9).toFixed(2)}B</span>
        </div>
      </div>
    </div>
  );
};
