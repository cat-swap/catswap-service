import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';

const TOKENS = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 98542.36 },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 3456.78 },
  { id: 'sol', symbol: 'SOL', name: 'Solana', price: 187.45 },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1.0 },
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', price: 1.0 },
];

interface TokenInputProps {
  label: string;
  balance: string;
  token: (typeof TOKENS)[0];
  amount: string;
  onTokenChange: (token: (typeof TOKENS)[0]) => void;
  onAmountChange?: (value: string) => void;
  readOnly?: boolean;
  valueInUsd?: string;
}

const TokenInput: React.FC<TokenInputProps> = ({
  label,
  balance,
  token,
  amount,
  onTokenChange,
  onAmountChange,
  readOnly = false,
  valueInUsd,
}) => (
  <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-[var(--text-tertiary)]">{label}</span>
      <span className="text-xs text-[var(--text-tertiary)]">Balance: {balance}</span>
    </div>
    <div className="flex items-center gap-3">
      <select
        value={token.id}
        onChange={(e) =>
          onTokenChange(
            TOKENS.find((t) => t.id === e.target.value) || TOKENS[0]
          )
        }
        className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-semibold text-lg outline-none border-none cursor-pointer"
      >
        {TOKENS.map((t) => (
          <option key={t.id} value={t.id}>
            {t.symbol}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={amount}
        onChange={(e) => onAmountChange?.(e.target.value)}
        placeholder="0.00"
        readOnly={readOnly}
        className="flex-1 bg-transparent text-right text-2xl font-semibold text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
    {valueInUsd && (
      <div className="text-right mt-1">
        <span className="text-xs text-[var(--text-tertiary)]">${valueInUsd}</span>
      </div>
    )}
  </div>
);

export const SwapPage: React.FC = () => {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[3]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isSwapping, setIsSwapping] = useState(false);

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

  const handleSwapSubmit = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    
    setIsSwapping(true);
    // Simulate swap
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSwapping(false);
    setFromAmount('');
    setToAmount('');
  };

  const fromValueInUsd = fromAmount
    ? (parseFloat(fromAmount) * fromToken.price).toFixed(2)
    : '0.00';
  const toValueInUsd = toAmount
    ? (parseFloat(toAmount) * toToken.price).toFixed(2)
    : '0.00';

  return (
    <div className="min-h-[calc(100vh-64px)] p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Swap</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-tertiary)]">
                Slippage
              </span>
              <select
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-xs rounded px-2 py-1 border border-[var(--border-primary)] outline-none"
              >
                <option value="0.1">0.1%</option>
                <option value="0.5">0.5%</option>
                <option value="1.0">1.0%</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* From Token */}
            <TokenInput
              label="From"
              balance="0.5 BTC"
              token={fromToken}
              amount={fromAmount}
              onTokenChange={setFromToken}
              onAmountChange={handleFromAmountChange}
              valueInUsd={fromValueInUsd}
            />

            {/* Swap Button */}
            <div className="flex justify-center -my-3 relative z-10">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleSwap}
                className="rounded-full border border-[var(--border-primary)]"
              >
                <ArrowDown size={20} />
              </Button>
            </div>

            {/* To Token */}
            <TokenInput
              label="To"
              balance="10000 USDT"
              token={toToken}
              amount={toAmount}
              onTokenChange={setToToken}
              readOnly
              valueInUsd={toValueInUsd}
            />

            {/* Rate Info */}
            <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pt-4">
              <span>Rate</span>
              <span className="text-[var(--text-primary)]">
                1 {fromToken.symbol} ={' '}
                {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}
              </span>
            </div>

            {/* Swap Button */}
            <Button
              variant="buy"
              size="lg"
              className="w-full mt-4"
              isLoading={isSwapping}
              disabled={!fromAmount || parseFloat(fromAmount) <= 0}
              onClick={handleSwapSubmit}
            >
              {isSwapping ? 'Swapping...' : 'Swap'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
