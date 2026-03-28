import React, { useState, useMemo } from 'react';
import { TradingPair, WalletInfo } from '../../types';

type OrderSide = 'buy' | 'sell';
type OrderType = 'limit' | 'market';

interface PerpsTradingFormProps {
  selectedPair: TradingPair;
  wallet: WalletInfo;
  onConnectWallet: () => void;
}

const LEVERAGE_OPTIONS = [1, 2, 3, 5, 10, 20, 30, 50, 75, 100];

export const PerpsTradingForm: React.FC<PerpsTradingFormProps> = ({
  selectedPair,
  wallet,
  onConnectWallet,
}) => {
  const [orderSide, setOrderSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const [leverage, setLeverage] = useState(20);
  const [showLeverageModal, setShowLeverageModal] = useState(false);
  const [leverageInput, setLeverageInput] = useState('20');
  const [showSliderTooltip, setShowSliderTooltip] = useState(false);

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

  // Mock margin balance
  const marginBalance = 5000; // USDT

  const maxAmount = useMemo(() => {
    const availableMargin = marginBalance * leverage;
    const p = orderType === 'market' ? selectedPair.price : parseFloat(price || selectedPair.price.toString());
    return p > 0 ? availableMargin / p : 0;
  }, [orderType, price, selectedPair.price, marginBalance, leverage]);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    if (maxAmount > 0) {
      const newAmount = (maxAmount * value) / 100;
      setAmount(newAmount.toFixed(6));
    }
  };

  const handleAmountChange = (value: string) => {
    // 禁止输入负数
    if (value.startsWith('-')) return;
    setAmount(value);
    const numValue = parseFloat(value);
    if (maxAmount > 0 && !isNaN(numValue) && numValue >= 0) {
      setSliderValue(Math.min((numValue / maxAmount) * 100, 100));
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const isBuy = orderSide === 'buy';
  const buttonColor = isBuy ? 'bg-[#0ECB81] hover:bg-[#0BC47A]' : 'bg-[#F6465D] hover:bg-[#E03A4F]';
  const buttonTextColor = isBuy ? 'text-black' : 'text-white';

  const marginRequired = total / leverage;

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)]">
      {/* Open/Close Tabs */}
      <div className="grid grid-cols-2 gap-1 p-3 border-b border-[var(--border-primary)]">
        <button
          onClick={() => setOrderSide('buy')}
          className={`py-2.5 text-sm font-semibold rounded transition-colors ${
            isBuy
              ? 'bg-[#0ECB81] text-black'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setOrderSide('sell')}
          className={`py-2.5 text-sm font-semibold rounded transition-colors ${
            !isBuy
              ? 'bg-[#F6465D] text-white'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Order Type & Leverage Row */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-1">
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
          
          {/* Leverage Selector */}
          <button
            onClick={() => setShowLeverageModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-quaternary)] transition-colors"
          >
            {leverage}x
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
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
          <div className="py-1">
            <div className="relative h-1 bg-[var(--bg-tertiary)] rounded-full">
              <div
                className="absolute h-full rounded-full bg-[var(--text-primary)]"
                style={{ width: `${sliderValue}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                onMouseDown={() => setShowSliderTooltip(true)}
                onMouseUp={() => setShowSliderTooltip(false)}
                onTouchStart={() => setShowSliderTooltip(true)}
                onTouchEnd={() => setShowSliderTooltip(false)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {/* Percentage Tooltip */}
              {showSliderTooltip && (
                <div
                  className="absolute -top-8 px-2 py-1 bg-[var(--bg-tooltip)] text-white text-xs font-medium rounded pointer-events-none"
                  style={{ left: `calc(${sliderValue}% - 20px)` }}
                >
                  {Math.round(sliderValue)}%
                </div>
              )}
              {/* Active thumb indicator */}
              {showSliderTooltip && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--text-primary)] pointer-events-none"
                  style={{ left: `calc(${sliderValue}% - ${sliderValue * 0.12}px)` }}
                />
              )}
              {/* Slider marks */}
              <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
                {[0, 25, 50, 75, 100].map((pct) => (
                  <div
                    key={pct}
                    className={`w-2 h-2 rounded-full ${sliderValue >= pct ? 'bg-[var(--text-primary)]' : 'bg-[var(--bg-quaternary)]'}`}
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

          {/* Total & Margin Info */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Total</span>
              <span className="text-[var(--text-primary)]">
                {total > 0 ? formatPrice(total) : '--'} {quoteToken}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Margin Required</span>
              <span className="text-[var(--text-primary)]">
                {marginRequired > 0 ? formatPrice(marginRequired) : '--'} {quoteToken}
              </span>
            </div>
          </div>

          {/* Balance Info */}
          <div className="space-y-1.5 pt-1 border-t border-[var(--border-primary)]">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Available Margin</span>
              <span className="text-[var(--text-primary)]">
                {wallet.connected 
                  ? `${formatPrice(marginBalance)} ${quoteToken}`
                  : `-- ${quoteToken}`
                }
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Max {isBuy ? 'Long' : 'Short'}</span>
              <span className="text-[var(--text-primary)]">
                {wallet.connected 
                  ? `${maxAmount.toFixed(6)} ${baseToken}`
                  : `-- ${baseToken}`
                }
              </span>
            </div>
          </div>

          {/* Funding Rate Info */}
          <div className="flex justify-between text-xs py-2 border-t border-[var(--border-primary)]">
            <span className="text-[var(--text-secondary)]">Funding Rate / Countdown</span>
            <span className="text-[#0ECB81]">+0.01% / 02:34:12</span>
          </div>

          {/* Action Button */}
          {wallet.connected ? (
            <button
              className={`w-full py-3 rounded-md text-sm font-semibold transition-all ${buttonColor} ${buttonTextColor}`}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {isBuy ? 'Open' : 'Close'} {baseToken}
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

      {/* Leverage Modal */}
      {showLeverageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[360px] bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]" style={{ boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.5)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-primary)]">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Adjust leverage</span>
              <button
                onClick={() => setShowLeverageModal(false)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Leverage Input */}
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-2">Leverage</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={leverageInput}
                    onChange={(e) => {
                      // 允许自由输入数字
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setLeverageInput(val);
                    }}
                    onBlur={() => {
                      // 失去焦点时验证范围
                      let val = parseInt(leverageInput) || 1;
                      val = Math.min(Math.max(val, 1), 100);
                      setLeverage(val);
                      setLeverageInput(String(val));
                    }}
                    className="flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none"
                  />
                  <span className="text-sm text-[var(--text-secondary)]">x</span>
                </div>
              </div>

              {/* Leverage Options */}
              <div className="flex flex-wrap gap-2">
                {LEVERAGE_OPTIONS.map((lev) => (
                  <button
                    key={lev}
                    onClick={() => {
                      setLeverage(lev);
                      setLeverageInput(String(lev));
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      leverage === lev
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {lev}x
                  </button>
                ))}
              </div>

              {/* Info */}
              <div className="space-y-1 text-xs text-[var(--text-secondary)]">
                <div className="flex justify-between">
                  <span>Max position size at adjusted leverage</span>
                  <span className="text-[var(--text-primary)]">0.0000 {baseToken}</span>
                </div>
                <div className="flex justify-between">
                  <span>Margin required</span>
                  <span className="text-[var(--text-primary)]">0 {quoteToken}</span>
                </div>
              </div>

              {/* Warning */}
              {leverage >= 50 && (
                <div className="text-xs text-[#F6465D]">
                  High leverage. Please trade with caution.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[var(--border-primary)]">
              <button
                onClick={() => {
                  setLeverageInput(String(leverage));
                  setShowLeverageModal(false);
                }}
                className="px-4 py-2 text-xs font-medium rounded-md border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // 确认时验证范围
                  let val = parseInt(leverageInput) || 1;
                  val = Math.min(Math.max(val, 1), 100);
                  setLeverage(val);
                  setLeverageInput(String(val));
                  setShowLeverageModal(false);
                }}
                className="px-4 py-2 text-xs font-medium rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerpsTradingForm;
