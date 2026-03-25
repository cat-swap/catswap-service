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

interface TradePageProps {
  selectedPairId?: string;
}

type OrderSide = 'buy' | 'sell';
type OrderType = 'limit' | 'market';
type TimeFrame = '1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W';

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

  const candleData = useMemo(() => generateCandleData(selectedPair.price), [selectedPair]);

  // Generate order book data
  const orderBook = useMemo(() => {
    const asks: OrderBookEntry[] = [];
    const bids: OrderBookEntry[] = [];
    const basePrice = selectedPair.price;

    for (let i = 0; i < 12; i++) {
      const askPrice = basePrice + (i + 1) * (basePrice * 0.0005);
      const bidPrice = basePrice - (i + 1) * (basePrice * 0.0005);
      const askAmount = Math.random() * 2 + 0.1;
      const bidAmount = Math.random() * 2 + 0.1;

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

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(4);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toFixed(2);
  };

  const total = parseFloat(price || '0') * parseFloat(amount || '0');
  const maxAmount = orderSide === 'buy' ? 10000 / selectedPair.price : 1.5;
  const percentage = (parseFloat(amount || '0') / maxAmount) * 100;

  const timeFrames: TimeFrame[] = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

  const priceChange = selectedPair.change24h >= 0;

  // Custom tooltip styles based on theme
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
    <div className="grid grid-cols-[260px_1fr_340px] h-[calc(100vh-64px)] bg-primary-okx transition-colors duration-200">
      {/* Left Panel - Pair List */}
      <div className="flex flex-col border-r border-primary-okx bg-secondary-okx">
        {/* Search & Tabs */}
        <div className="p-3 border-b border-primary-okx">
          <div className="flex gap-1 mb-2">
            {['USDT', 'USD', 'BTC'].map((tab) => (
              <button
                key={tab}
                className="flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors text-secondary-okx hover:text-primary-okx hover:bg-tertiary-okx"
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
        <div className="grid grid-cols-3 px-3 py-2 text-xs text-tertiary-okx border-b border-primary-okx">
          <span>Pair</span>
          <span className="text-right">Last Price</span>
          <span className="text-right">24h Change</span>
        </div>

        {/* Pair List */}
        <div className="flex-1 overflow-y-auto">
          {filteredPairs.map((pair) => (
            <div
              key={pair.id}
              onClick={() => setSelectedPair(pair)}
              className={`grid grid-cols-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-tertiary-okx ${
                selectedPair.id === pair.id ? 'bg-tertiary-okx border-l-2 border-okx-buy' : ''
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-primary-okx">{pair.symbol.replace('/USDT', '')}</span>
                <span className="text-xs text-tertiary-okx">Vol {formatVolume(pair.volume24h)}</span>
              </div>
              <div className="text-right">
                <span className="text-sm text-primary-okx">{formatPrice(pair.price)}</span>
              </div>
              <div className="text-right">
                <span className={`text-sm ${pair.change24h >= 0 ? 'text-okx-buy' : 'text-okx-sell'}`}>
                  {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel - Chart & Order Book */}
      <div className="flex flex-col min-w-0">
        {/* Chart Header */}
        <div className="flex items-center gap-6 px-4 py-3 border-b border-primary-okx flex-wrap">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-semibold text-primary-okx">{selectedPair.symbol}</h2>
            <span className="text-xs text-tertiary-okx">{selectedPair.name} Perpetual</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${priceChange ? 'text-okx-buy' : 'text-okx-sell'}`}>
              ${formatPrice(selectedPair.price)}
            </span>
            <span className={`text-sm px-1.5 py-0.5 rounded ${priceChange ? 'text-okx-buy bg-okx-buy-light' : 'text-okx-sell bg-okx-sell-light'}`}>
              {priceChange ? '+' : ''}{selectedPair.change24h.toFixed(2)}%
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-6 ml-auto">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-tertiary-okx">24h High</span>
              <span className="text-sm text-primary-okx">${formatPrice(selectedPair.high24h)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-tertiary-okx">24h Low</span>
              <span className="text-sm text-primary-okx">${formatPrice(selectedPair.low24h)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-tertiary-okx">24h Vol</span>
              <span className="text-sm text-primary-okx">{formatVolume(selectedPair.volume24h)}</span>
            </div>
          </div>
        </div>

        {/* Time Frame Selector */}
        <div className="flex gap-1 px-4 py-2 border-b border-primary-okx">
          {timeFrames.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                timeFrame === tf
                  ? 'bg-tertiary-okx text-primary-okx'
                  : 'text-tertiary-okx hover:text-primary-okx hover:bg-tertiary-okx'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-[320px] p-4 border-b border-primary-okx">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={candleData.slice(-50)}>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
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
                stroke={priceChange ? 'var(--color-buy)' : 'var(--color-sell)'}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Book */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-2 border-b border-primary-okx">
            <span className="text-sm font-medium text-primary-okx">Order Book</span>
            <div className="flex gap-1">
              {['Both', 'Buy', 'Sell'].map((tab) => (
                <button
                  key={tab}
                  className="px-2 py-1 text-xs rounded transition-colors text-tertiary-okx hover:text-primary-okx hover:bg-tertiary-okx"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            {/* Header */}
            <div className="grid grid-cols-3 px-2 py-1.5 text-xs text-tertiary-okx">
              <span>Price(USDT)</span>
              <span className="text-right">Amount({selectedPair.symbol.split('/')[0]})</span>
              <span className="text-right">Total</span>
            </div>

            {/* Asks */}
            <div className="space-y-0.5">
              {orderBook.asks.map((ask, index) => (
                <div key={index} className="relative grid grid-cols-3 px-2 py-0.5 text-xs">
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-okx-sell/10"
                    style={{ width: `${(ask.amount / 2) * 100}%` }}
                  />
                  <span className="relative text-okx-sell">{formatPrice(ask.price)}</span>
                  <span className="relative text-right text-primary-okx">{ask.amount.toFixed(4)}</span>
                  <span className="relative text-right text-primary-okx">{formatPrice(ask.total)}</span>
                </div>
              ))}
            </div>

            {/* Spread */}
            <div className="flex items-center justify-center gap-2 py-2 my-1 bg-tertiary-okx rounded">
              <span className="text-base font-semibold text-primary-okx">{formatPrice(selectedPair.price)}</span>
              <span className={`text-xs ${priceChange ? 'text-okx-buy' : 'text-okx-sell'}`}>
                {priceChange ? '+' : ''}{selectedPair.change24h.toFixed(2)}%
              </span>
            </div>

            {/* Bids */}
            <div className="space-y-0.5">
              {orderBook.bids.map((bid, index) => (
                <div key={index} className="relative grid grid-cols-3 px-2 py-0.5 text-xs">
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-okx-buy/10"
                    style={{ width: `${(bid.amount / 2) * 100}%` }}
                  />
                  <span className="relative text-okx-buy">{formatPrice(bid.price)}</span>
                  <span className="relative text-right text-primary-okx">{bid.amount.toFixed(4)}</span>
                  <span className="relative text-right text-primary-okx">{formatPrice(bid.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Trading Form */}
      <div className="flex flex-col border-l border-primary-okx bg-secondary-okx">
        {/* Buy/Sell Tabs */}
        <div className="flex p-1 mx-3 mt-3 bg-tertiary-okx rounded-lg">
          <button
            onClick={() => setOrderSide('buy')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              orderSide === 'buy'
                ? 'bg-okx-buy-light text-okx-buy'
                : 'text-secondary-okx hover:text-primary-okx'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setOrderSide('sell')}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              orderSide === 'sell'
                ? 'bg-okx-sell-light text-okx-sell'
                : 'text-secondary-okx hover:text-primary-okx'
            }`}
          >
            Sell
          </button>
        </div>

        <div className="p-3">
          {/* Order Type Tabs */}
          <div className="flex gap-2 mb-3">
            {(['limit', 'market'] as OrderType[]).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors capitalize ${
                  orderType === type
                    ? 'bg-tertiary-okx text-primary-okx'
                    : 'text-tertiary-okx hover:text-primary-okx'
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
                <label className="block text-xs text-tertiary-okx mb-1">Price</label>
                <div className="relative">
                  <input
                    type="text"
                    value={price || formatPrice(selectedPair.price)}
                    onChange={(e) => setPrice(e.target.value)}
                    className="input-okx pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-tertiary-okx">USDT</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs text-tertiary-okx mb-1">Amount</label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="input-okx pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-tertiary-okx">
                  {selectedPair.symbol.split('/')[0]}
                </span>
              </div>
              <div className="flex gap-1 mt-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setAmount((maxAmount * pct / 100).toFixed(4))}
                    className="flex-1 py-1 text-xs rounded bg-tertiary-okx text-tertiary-okx hover:text-primary-okx hover:bg-tertiary-okx transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-tertiary-okx mb-1">Total</label>
              <div className="relative">
                <input
                  type="text"
                  value={total.toFixed(2)}
                  readOnly
                  className="input-okx pr-14 opacity-60"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-tertiary-okx">USDT</span>
              </div>
            </div>

            <div className="flex justify-between text-xs text-tertiary-okx">
              <span>Available</span>
              <span className="text-primary-okx">
                {orderSide === 'buy' ? '10,000.00 USDT' : `1.50 ${selectedPair.symbol.split('/')[0]}`}
              </span>
            </div>

            {/* Slider */}
            <div className="h-1 bg-tertiary-okx rounded-full overflow-hidden">
              <div
                className="h-full bg-okx-buy rounded-full transition-all"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>

            {/* Submit Button */}
            <button
              className={`w-full py-3 rounded-okx text-base font-semibold transition-all ${
                orderSide === 'buy'
                  ? 'btn-buy hover:opacity-90'
                  : 'btn-sell hover:opacity-90'
              }`}
            >
              {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedPair.symbol.split('/')[0]}
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div className="flex-1 flex flex-col min-h-0 border-t border-primary-okx">
          <div className="flex px-3 border-b border-primary-okx">
            <button
              onClick={() => setActiveTab('open')}
              className={`px-2 py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'open'
                  ? 'text-primary-okx border-okx-buy'
                  : 'text-tertiary-okx border-transparent hover:text-primary-okx'
              }`}
            >
              Open Orders ({openOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-2 py-3 text-xs font-medium border-b-2 transition-colors ml-4 ${
                activeTab === 'history'
                  ? 'text-primary-okx border-okx-buy'
                  : 'text-tertiary-okx border-transparent hover:text-primary-okx'
              }`}
            >
              Order History
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'open' && openOrders.length === 0 && (
              <div className="flex items-center justify-center h-24 text-sm text-tertiary-okx">
                No open orders
              </div>
            )}

            {activeTab === 'open' && openOrders.map((order) => (
              <div key={order.id} className="p-3 mb-2 rounded-okx bg-tertiary-okx">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                    order.side === 'buy' ? 'text-okx-buy bg-okx-buy-light' : 'text-okx-sell bg-okx-sell-light'
                  }`}>
                    {order.side.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-primary-okx">{order.pair}</span>
                  <span className="text-xs text-tertiary-okx ml-auto">{order.type}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <span className="block text-xs text-tertiary-okx">Price</span>
                    <span className="text-sm text-primary-okx">{formatPrice(order.price)}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-tertiary-okx">Amount</span>
                    <span className="text-sm text-primary-okx">{order.amount}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-tertiary-okx">Filled</span>
                    <span className="text-sm text-primary-okx">{(order.filled / order.amount * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <button className="w-full py-2 text-xs font-medium rounded border border-primary-okx text-tertiary-okx hover:border-okx-sell hover:text-okx-sell transition-colors">
                  Cancel
                </button>
              </div>
            ))}

            {activeTab === 'history' && (
              <div className="flex items-center justify-center h-24 text-sm text-tertiary-okx">
                No order history
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
