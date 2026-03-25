import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';

const TOKENS = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 98542.36 },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 3456.78 },
  { id: 'sol', symbol: 'SOL', name: 'Solana', price: 187.45 },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1.00 },
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', price: 1.00 },
];

export const SwapPage: React.FC = () => {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[3]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value && fromToken && toToken) {
      const fromValue = parseFloat(value) * fromToken.price;
      const toValue = fromValue / toToken.price;
      setToAmount(toValue.toFixed(6));
    } else {
      setToAmount('');
    }
  };

  const handleSwap = () => {
    // Swap tokens
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] p-6">
      <div className="max-w-md mx-auto">
        <div className="rounded-okx-xl border border-primary-okx bg-secondary-okx p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary-okx">Swap</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-tertiary-okx">Slippage</span>
              <select
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="bg-tertiary-okx text-primary-okx text-xs rounded px-2 py-1 border border-primary-okx outline-none"
              >
                <option value="0.1">0.1%</option>
                <option value="0.5">0.5%</option>
                <option value="1.0">1.0%</option>
              </select>
            </div>
          </div>

          {/* From Token */}
          <div className="bg-tertiary-okx rounded-okx p-4 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-tertiary-okx">From</span>
              <span className="text-xs text-tertiary-okx">Balance: 0.5 BTC</span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={fromToken.id}
                onChange={(e) => setFromToken(TOKENS.find(t => t.id === e.target.value) || TOKENS[0])}
                className="bg-tertiary-okx text-primary-okx font-semibold text-lg outline-none border-none cursor-pointer"
              >
                {TOKENS.map((token) => (
                  <option key={token.id} value={token.id}>{token.symbol}</option>
                ))}
              </select>
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-right text-2xl font-semibold text-primary-okx outline-none placeholder:text-tertiary-okx"
              />
            </div>
            <div className="text-right mt-1">
              <span className="text-xs text-tertiary-okx">
                ${fromAmount ? (parseFloat(fromAmount) * fromToken.price).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-3 relative z-10">
            <button
              onClick={handleSwap}
              className="w-10 h-10 rounded-full bg-tertiary-okx border border-primary-okx flex items-center justify-center text-secondary-okx hover:text-primary-okx hover:bg-tertiary-okx transition-colors"
            >
              <ArrowDown size={20} />
            </button>
          </div>

          {/* To Token */}
          <div className="bg-tertiary-okx rounded-okx p-4 mt-2 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-tertiary-okx">To</span>
              <span className="text-xs text-tertiary-okx">Balance: 10000 USDT</span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={toToken.id}
                onChange={(e) => setToToken(TOKENS.find(t => t.id === e.target.value) || TOKENS[0])}
                className="bg-tertiary-okx text-primary-okx font-semibold text-lg outline-none border-none cursor-pointer"
              >
                {TOKENS.map((token) => (
                  <option key={token.id} value={token.id}>{token.symbol}</option>
                ))}
              </select>
              <input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.00"
                className="flex-1 bg-transparent text-right text-2xl font-semibold text-primary-okx outline-none placeholder:text-tertiary-okx"
              />
            </div>
            <div className="text-right mt-1">
              <span className="text-xs text-tertiary-okx">
                ${toAmount ? (parseFloat(toAmount) * toToken.price).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          {/* Rate Info */}
          <div className="flex items-center justify-between text-xs text-tertiary-okx mb-6">
            <span>Rate</span>
            <span className="text-primary-okx">
              1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}
            </span>
          </div>

          {/* Swap Button */}
          <button className="w-full py-4 rounded-okx bg-okx-buy text-white font-semibold text-base hover:opacity-90 transition-opacity">
            Swap
          </button>
        </div>
      </div>
    </div>
  );
};
