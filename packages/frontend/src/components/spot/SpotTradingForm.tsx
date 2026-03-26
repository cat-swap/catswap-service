import React, { useState, useMemo } from 'react';
import { TradingPair, WalletInfo } from '../../types';

type OrderSide = 'buy' | 'sell';
type OrderType = 'limit' | 'market';

interface SpotTradingFormProps {
  selectedPair: TradingPair;
  wallet: WalletInfo;
  onConnectWallet: () => void;
}

const MARGIN_LEVERAGE_OPTIONS = [2, 3, 5, 10];

export const SpotTradingForm: React.FC<SpotTradingFormProps> = ({
  selectedPair,
  wallet,
  onConnectWallet,
}) => {
  const [orderSide, setOrderSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const [marginEnabled, setMarginEnabled] = useState(false);
  const [marginLeverage, setMarginLeverage] = useState(3);
  const [showLeverageDropdown, setShowLeverageDropdown] = useState(false);

  const baseToken = selectedPair.symbol.split('/')[0];
  const quoteToken = selectedPair.symbol.split('/')[1] || 'USDT';

  // Set default price when pair changes
  useMemo(() => {
    setPrice(selectedPair.price.toFixed(2));
    setAmount('');
    setSliderValue(0);
  }, [selectedPair]);

  const total = useMemo(() => {
    const p = orderType === 'market' ? selectedPair.price : parseFloat(price || '0');
    const a = parseFloat(amount || '0');
    return p * a;
  }, [price, amount, orderType, selectedPair.price]);

  // Mock balances
  const baseBalance = 0.5; // BTC
  const quoteBalance = 10000; // USDT

  const maxAmount = useMemo(() => {
    const leverage = marginEnabled ? marginLeverage : 1;
    if (orderSide === 'buy') {
      const availableQuote = quoteBalance * leverage;
      const p = orderType === 'market' ? selectedPair.price : parseFloat(price || selectedPair.price.toString());
      return p > 0 ? availableQuote / p : 0;
    } else {
      return baseBalance * leverage;
    }
  }, [orderSide, orderType, price, selectedPair.price, baseBalance, quoteBalance, marginEnabled, marginLeverage]);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    if (maxAmount > 0) {
      const newAmount = (maxAmount * value) / 100;
      setAmount(newAmount.toFixed(6));
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const numValue = parseFloat(value);
    if (maxAmount > 0 && !isNaN(numValue)) {
      setSliderValue(Math.min((numValue / maxAmount) * 100, 100));
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const isBuy = orderSide === 'buy';
  const buttonColor = isBuy ? 'bg-[#0ECB81] hover:bg-[#0BC47A]' : 'bg-[#F6465D] hover:bg-[#E03A4F]';
  const buttonTextColor = isBuy ? 'text-black' : 'text-white';

  // Margin required when margin is enabled
  const marginRequired = marginEnabled ? total / marginLeverage : total;

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)]">
      {/* Header with Trade and Margin */}
      <div className="flex items-center gap-4 px-3 py-3 border-b border-[var(--border-primary)]">
        <span className="text-sm font-medium text-[var(--text-primary)]">Trade</span>
        
        {/* Margin Toggle */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-[var(--text-primary)]">Margin</span>
          <button
            onClick={() => setMarginEnabled(!marginEnabled)}
            className={`relative w-9 h-5 rounded-full transition-colors ${
              marginEnabled ? 'bg-black border border-[#2E2E2E]' : 'bg-[#999999]'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                marginEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
          
          {/* Leverage Selector (only when margin enabled) */}
          {marginEnabled && (
            <div className="relative ml-1">
              <button
                onClick={() => setShowLeverageDropdown(!showLeverageDropdown)}
                className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-quaternary)] transition-colors"
              >
                {marginLeverage}x
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showLeverageDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLeverageDropdown(false)}
                  />
                  <div className="absolute left-0 top-full mt-1 py-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-md shadow-lg z-50 min-w-[60px]">
                    {MARGIN_LEVERAGE_OPTIONS.map((lev) => (
                      <button
                        key={lev}
                        onClick={() => {
                          setMarginLeverage(lev);
                          setShowLeverageDropdown(false);
                        }}
                        className={`w-full px-3 py-1.5 text-xs text-left transition-colors ${
                          marginLeverage === lev
                            ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {lev}x
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Buy/Sell Tabs */}
      <div className="grid grid-cols-2 gap-1 p-3 border-b border-[var(--border-primary)]">
        <button
          onClick={() => setOrderSide('buy')}
          className={`py-2.5 text-sm font-semibold rounded transition-colors ${
            isBuy
              ? 'bg-[#0ECB81] text-black'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Buy {baseToken}
        </button>
        <button
          onClick={() => setOrderSide('sell')}
          className={`py-2.5 text-sm font-semibold rounded transition-colors ${
            !isBuy
              ? 'bg-[#F6465D] text-white'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Sell {baseToken}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Order Type Tabs */}
        <div className="flex items-center gap-1 px-3 py-3 border-b border-[var(--border-primary)]">
          {(['limit', 'market'] as OrderType[]).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors capitalize ${
                orderType === type
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="p-3 space-y-3">
          {/* Price Input */}
          {orderType === 'limit' && (
            <div>
              <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                Price ({quoteToken})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-md text-sm bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-all pr-16"
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)]">
                  {quoteToken}
                </span>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              Amount ({baseToken})
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder={`Min 0.00001 ${baseToken}`}
                className="w-full px-3 py-2.5 rounded-md text-sm bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-all pr-16 placeholder:text-[var(--text-tertiary)]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)]">
                {baseToken}
              </span>
            </div>
          </div>

          {/* Slider */}
          <div className="py-2">
            <div className="relative h-1 bg-[var(--bg-tertiary)] rounded-full">
              <div
                className={`absolute h-full rounded-full transition-all ${isBuy ? 'bg-[#0ECB81]' : 'bg-[#F6465D]'}`}
                style={{ width: `${sliderValue}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {/* Slider marks */}
              <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
                {[0, 25, 50, 75, 100].map((pct) => (
                  <div
                    key={pct}
                    className={`w-2 h-2 rounded-full ${sliderValue >= pct ? (isBuy ? 'bg-[#0ECB81]' : 'bg-[#F6465D]') : 'bg-[var(--bg-quaternary)]'}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-1">
              {['0%', '25%', '50%', '75%', '100%'].map((label, idx) => (
                <button
                  key={label}
                  onClick={() => handleSliderChange(idx * 25)}
                  className={`text-[10px] transition-colors ${
                    sliderValue >= idx * 25 ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Total */}
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
              Total ({quoteToken})
            </label>
            <div className="relative">
              <input
                type="text"
                value={total > 0 ? total.toFixed(2) : ''}
                readOnly
                placeholder="0.00"
                className="w-full px-3 py-2.5 rounded-md text-sm bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)] opacity-60 pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)]">
                {quoteToken}
              </span>
            </div>
          </div>

          {/* Margin Required (only when margin enabled) */}
          {marginEnabled && (
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Margin Required</span>
              <span className="text-[var(--text-primary)]">
                {marginRequired > 0 ? formatPrice(marginRequired) : '--'} {quoteToken}
              </span>
            </div>
          )}

          {/* Balance Info */}
          <div className="space-y-1.5 pt-1 border-t border-[var(--border-primary)]">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Available</span>
              <span className="text-[var(--text-primary)]">
                {wallet.connected 
                  ? `${isBuy ? formatPrice(quoteBalance) : baseBalance.toFixed(6)} ${isBuy ? quoteToken : baseToken}`
                  : `-- ${isBuy ? quoteToken : baseToken}`
                }
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">
                Max {marginEnabled ? (isBuy ? 'Long' : 'Short') : (isBuy ? 'buy' : 'sell')}
              </span>
              <span className="text-[var(--text-primary)]">
                {wallet.connected 
                  ? `${maxAmount.toFixed(6)} ${baseToken}`
                  : `-- ${baseToken}`
                }
              </span>
            </div>
          </div>

          {/* Action Button */}
          {wallet.connected ? (
            <button
              className={`w-full py-3 rounded-md text-sm font-semibold transition-all ${buttonColor} ${buttonTextColor}`}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {marginEnabled 
                ? (isBuy ? 'Long' : 'Short')
                : (isBuy ? 'Buy' : 'Sell')
              } {baseToken}
            </button>
          ) : (
            <button
              onClick={onConnectWallet}
              className={`w-full py-3 rounded-md text-sm font-semibold transition-all ${buttonColor} ${buttonTextColor}`}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotTradingForm;
