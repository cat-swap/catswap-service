import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TradingPair } from '../types';
import { tradingPairs, generateCandleData } from '../data/mockData';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';
import { Button } from './ui/Button';

interface TradePageProps {
  selectedPairId?: string;
}

type OrderSide = 'buy' | 'sell';
type OrderType = 'limit' | 'market';
type TimeFrame = '1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W';
type ActivePanel = 'pairs' | 'chart' | 'orderbook' | 'form';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface Order {
  id: string;
  pair: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  price: number;
  amount: number;
  filled: number;
  status: 'pending' | 'partial' | 'completed' | 'cancelled';
  time: Date;
}

// Format utilities
const formatPrice = (price: number) => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return price.toFixed(4);
};

const formatVolume = (volume: number) => {
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
  return volume.toFixed(2);
};

export const TradePage: React.FC<TradePageProps> = ({ selectedPairId }) => {
  const [selectedPair, setSelectedPair] = useState<TradingPair>(
    tradingPairs.find((p) => p.id === selectedPairId) || tradingPairs[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [orderSide, setOrderSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1H');
  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open');
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

  // Mock open orders
  const openOrders: Order[] = [
    {
      id: '1',
      pair: 'BTC/USDT',
      side: 'buy',
      type: 'limit',
      price: 95000,
      amount: 0.5,
      filled: 0,
      status: 'pending',
      time: new Date(),
    },
    {
      id: '2',
      pair: 'ETH/USDT',
      side: 'sell',
      type: 'limit',
      price: 3600,
      amount: 2,
      filled: 1,
      status: 'partial',
      time: new Date(Date.now() - 3600000),
    },
  ];

  const filteredPairs = tradingPairs.filter(
    (pair) =>
      pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const total = parseFloat(price || '0') * parseFloat(amount || '0');
  const maxAmount = orderSide === 'buy' ? 10000 / selectedPair.price : 1.5;
  const percentage = (parseFloat(amount || '0') / maxAmount) * 100;

  const timeFrames: TimeFrame[] = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

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

  // Pair List Panel
  const PairListPanel = () => (
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
          className="input-okx"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
        {filteredPairs.map((pair) => (
          <div
            key={pair.id}
            onClick={() => {
              setSelectedPair(pair);
              setActiveMobilePanel('chart');
            }}
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

  // Order Book Component
  const OrderBookPanel = () => (
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

  // Trading Form Panel
  const TradingFormPanel = () => (
    <div className="flex flex-col h-full border-l border-[var(--border-primary)] bg-[var(--bg-secondary)]">
      {/* Buy/Sell Tabs */}
      <Tabs
        value={orderSide}
        onValueChange={(v) => setOrderSide(v as OrderSide)}
        className="p-3"
      >
        <TabsList className="w-full">
          <TabsTrigger value="buy" className="flex-1">
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="flex-1">
            Sell
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="px-3 pb-3 flex-1 overflow-y-auto">
        {/* Order Type Tabs */}
        <div className="flex gap-2 mb-3">
          {(['limit', 'market'] as OrderType[]).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors capitalize ${
                orderType === type
                  ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <div className="space-y-3">
          {orderType === 'limit' && (
            <div>
              <label className="block text-xs text-[var(--text-tertiary)] mb-1">
                Price
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={price || formatPrice(selectedPair.price)}
                  onChange={(e) => setPrice(e.target.value)}
                  className="input-okx pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)]">
                  USDT
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-1">
              Amount
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="input-okx pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)]">
                {selectedPair.symbol.split('/')[0]}
              </span>
            </div>
            <div className="flex gap-1 mt-2">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() =>
                    setAmount(((maxAmount * pct) / 100).toFixed(4))
                  }
                  className="flex-1 py-1 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-1">
              Total
            </label>
            <div className="relative">
              <input
                type="text"
                value={total.toFixed(2)}
                readOnly
                className="input-okx pr-14 opacity-60"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)]">
                USDT
              </span>
            </div>
          </div>

          <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
            <span>Available</span>
            <span className="text-[var(--text-primary)]">
              {orderSide === 'buy'
                ? '10,000.00 USDT'
                : `1.50 ${selectedPair.symbol.split('/')[0]}`}
            </span>
          </div>

          {/* Slider */}
          <div className="h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-buy)] rounded-full transition-all"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {/* Submit Button */}
          <Button
            variant={orderSide === 'buy' ? 'buy' : 'sell'}
            size="lg"
            className="w-full"
          >
            {orderSide === 'buy' ? 'Buy' : 'Sell'}{' '}
            {selectedPair.symbol.split('/')[0]}
          </Button>
        </div>
      </div>

      {/* Orders Section */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-[var(--border-primary)]">
        <div className="flex px-3 border-b border-[var(--border-primary)]">
          <button
            onClick={() => setActiveTab('open')}
            className={`px-2 py-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'open'
                ? 'text-[var(--text-primary)] border-[var(--color-buy)]'
                : 'text-[var(--text-tertiary)] border-transparent hover:text-[var(--text-primary)]'
            }`}
          >
            Open Orders ({openOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2 py-3 text-xs font-medium border-b-2 transition-colors ml-4 ${
              activeTab === 'history'
                ? 'text-[var(--text-primary)] border-[var(--color-buy)]'
                : 'text-[var(--text-tertiary)] border-transparent hover:text-[var(--text-primary)]'
            }`}
          >
            Order History
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {activeTab === 'open' && openOrders.length === 0 && (
            <div className="flex items-center justify-center h-24 text-sm text-[var(--text-tertiary)]">
              No open orders
            </div>
          )}

          {activeTab === 'open' &&
            openOrders.map((order) => (
              <div
                key={order.id}
                className="p-3 mb-2 rounded-lg bg-[var(--bg-tertiary)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                      order.side === 'buy'
                        ? 'text-[var(--color-buy)] bg-[var(--color-buy-light)]'
                        : 'text-[var(--color-sell)] bg-[var(--color-sell-light)]'
                    }`}
                  >
                    {order.side.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {order.pair}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)] ml-auto">
                    {order.type}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <span className="block text-xs text-[var(--text-tertiary)]">
                      Price
                    </span>
                    <span className="text-sm text-[var(--text-primary)]">
                      {formatPrice(order.price)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-[var(--text-tertiary)]">
                      Amount
                    </span>
                    <span className="text-sm text-[var(--text-primary)]">
                      {order.amount}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-[var(--text-tertiary)]">
                      Filled
                    </span>
                    <span className="text-sm text-[var(--text-primary)]">
                      {((order.filled / order.amount) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="w-full">
                  Cancel
                </Button>
              </div>
            ))}

          {activeTab === 'history' && (
            <div className="flex items-center justify-center h-24 text-sm text-[var(--text-tertiary)]">
              No order history
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Chart Panel
  const ChartPanel = () => (
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
        {timeFrames.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeFrame(tf)}
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
        <OrderBookPanel />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr_360px] h-[calc(100vh-64px)] bg-[var(--bg-primary)]">
        <PairListPanel />
        <ChartPanel />
        <TradingFormPanel />
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:grid md:grid-cols-[240px_1fr] lg:hidden h-[calc(100vh-64px)] bg-[var(--bg-primary)]">
        <PairListPanel />
        <div className="grid grid-rows-[1fr_280px]">
          <ChartPanel />
          <TradingFormPanel />
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
          {activeMobilePanel === 'pairs' && <PairListPanel />}
          {activeMobilePanel === 'chart' && <ChartPanel />}
          {activeMobilePanel === 'form' && <TradingFormPanel />}
        </div>
      </div>
    </>
  );
};
