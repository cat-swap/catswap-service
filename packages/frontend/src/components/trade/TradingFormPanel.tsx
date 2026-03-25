import { useState } from 'react';
import { TradingPair } from '../../types';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';
import { formatPrice } from '../../shared/lib/formatters';

type OrderSide = 'buy' | 'sell';
type OrderType = 'limit' | 'market';

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

interface TradingFormPanelProps {
  selectedPair: TradingPair;
}

// Mock open orders
const OPEN_ORDERS: Order[] = [
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

export const TradingFormPanel: React.FC<TradingFormPanelProps> = ({
  selectedPair,
}) => {
  const [orderSide, setOrderSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open');

  const total = parseFloat(price || '0') * parseFloat(amount || '0');
  const maxAmount = orderSide === 'buy' ? 10000 / selectedPair.price : 1.5;
  const percentage = (parseFloat(amount || '0') / maxAmount) * 100;

  return (
    <div className="flex flex-col h-full border-l border-border bg-background-secondary">
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
                  ? 'bg-background-tertiary text-foreground'
                  : 'text-foreground-tertiary hover:text-foreground'
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
              <label className="block text-xs text-foreground-tertiary mb-1">
                Price
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={price || formatPrice(selectedPair.price)}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-background-tertiary text-foreground border border-transparent focus:outline-none focus:border-border-hover transition-all pr-14"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-tertiary">
                  USDT
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-foreground-tertiary mb-1">
              Amount
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-lg text-sm bg-background-tertiary text-foreground border border-transparent placeholder:text-foreground-tertiary focus:outline-none focus:border-border-hover transition-all pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-tertiary">
                {selectedPair.symbol.split('/')[0]}
              </span>
            </div>
            <div className="flex gap-1 mt-2">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setAmount(((maxAmount * pct) / 100).toFixed(4))}
                  className="flex-1 py-1 text-xs rounded bg-background-tertiary text-foreground-tertiary hover:text-foreground hover:bg-background-secondary transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-foreground-tertiary mb-1">
              Total
            </label>
            <div className="relative">
              <input
                type="text"
                value={total.toFixed(2)}
                readOnly
                className="w-full px-3 py-2 rounded-lg text-sm bg-background-tertiary text-foreground border border-transparent opacity-60 pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground-tertiary">
                USDT
              </span>
            </div>
          </div>

          <div className="flex justify-between text-xs text-foreground-tertiary">
            <span>Available</span>
            <span className="text-foreground">
              {orderSide === 'buy'
                ? '10,000.00 USDT'
                : `1.50 ${selectedPair.symbol.split('/')[0]}`}
            </span>
          </div>

          {/* Slider */}
          <div className="h-1 bg-background-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all"
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
      <div className="flex-1 flex flex-col min-h-0 border-t border-border">
        <div className="flex px-3 border-b border-border">
          <button
            onClick={() => setActiveTab('open')}
            className={`px-2 py-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'open'
                ? 'text-foreground border-success'
                : 'text-foreground-tertiary border-transparent hover:text-foreground'
            }`}
          >
            Open Orders ({OPEN_ORDERS.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2 py-3 text-xs font-medium border-b-2 transition-colors ml-4 ${
              activeTab === 'history'
                ? 'text-foreground border-success'
                : 'text-foreground-tertiary border-transparent hover:text-foreground'
            }`}
          >
            Order History
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {activeTab === 'open' && OPEN_ORDERS.length === 0 && (
            <div className="flex items-center justify-center h-24 text-sm text-foreground-tertiary">
              No open orders
            </div>
          )}

          {activeTab === 'open' &&
            OPEN_ORDERS.map((order) => (
              <div
                key={order.id}
                className="p-3 mb-2 rounded-lg bg-background-tertiary"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                      order.side === 'buy'
                        ? 'text-success bg-success-light'
                        : 'text-danger bg-danger-light'
                    }`}
                  >
                    {order.side.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {order.pair}
                  </span>
                  <span className="text-xs text-foreground-tertiary ml-auto">
                    {order.type}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <span className="block text-xs text-foreground-tertiary">
                      Price
                    </span>
                    <span className="text-sm text-foreground">
                      {formatPrice(order.price)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-foreground-tertiary">
                      Amount
                    </span>
                    <span className="text-sm text-foreground">
                      {order.amount}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-foreground-tertiary">
                      Filled
                    </span>
                    <span className="text-sm text-foreground">
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
            <div className="flex items-center justify-center h-24 text-sm text-foreground-tertiary">
              No order history
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
