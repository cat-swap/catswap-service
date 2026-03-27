import React, { useState } from 'react';
import { Plus, Search, TrendingUp, DollarSign, BarChart3, ChevronDown } from 'lucide-react';

interface Pool {
  id: string;
  tokenA: string;
  tokenB: string;
  tvl: number;
  providers: number;
  volume24h: number;
  fee24h: number;
  apr7d: number;
  hasPosition: boolean;
  hasFees: boolean;
}

const TOKEN_COLORS: Record<string, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#14F195',
  BNB: '#F3BA2F',
  USDT: '#26A17B',
  USDC: '#2775CA',
};

const POOLS: Pool[] = [
  { id: '1', tokenA: 'BTC', tokenB: 'USDT', tvl: 50780000, providers: 100, volume24h: 50780000, fee24h: 90.49, apr7d: 90.49, hasPosition: true, hasFees: true },
  { id: '2', tokenA: 'BTC', tokenB: 'USDT', tvl: 50780000, providers: 100, volume24h: 50780000, fee24h: 50.88, apr7d: 50.88, hasPosition: true, hasFees: true },
  { id: '3', tokenA: 'BTC', tokenB: 'USDT', tvl: 50780000, providers: 100, volume24h: 50780000, fee24h: 8.56, apr7d: 8.56, hasPosition: true, hasFees: true },
  { id: '4', tokenA: 'BTC', tokenB: 'USDT', tvl: 50780000, providers: 100, volume24h: 50780000, fee24h: 20.88, apr7d: 20.88, hasPosition: true, hasFees: false },
  { id: '5', tokenA: 'BTC', tokenB: 'USDT', tvl: 50780000, providers: 100, volume24h: 50780000, fee24h: 10.88, apr7d: 10.88, hasPosition: false, hasFees: false },
  { id: '6', tokenA: 'ETH', tokenB: 'USDT', tvl: 32400000, providers: 85, volume24h: 32400000, fee24h: 15.23, apr7d: 15.23, hasPosition: true, hasFees: true },
];

const formatCurrency = (value: number) => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, change }) => (
  <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] p-4">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
        {icon}
      </div>
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-semibold text-[var(--text-primary)]">{value}</span>
      {change && (
        <span className="text-xs text-[var(--color-buy)]">{change}</span>
      )}
    </div>
  </div>
);

const TokenIcon: React.FC<{ symbol: string; className?: string }> = ({ symbol, className = '' }) => (
  <div
    className={`rounded-full flex items-center justify-center text-white text-xs font-bold ${className}`}
    style={{ backgroundColor: TOKEN_COLORS[symbol] || '#888' }}
  >
    {symbol[0]}
  </div>
);

const FeeTag: React.FC<{ low: string; high: string }> = ({ low, high }) => (
  <div className="flex items-center gap-1">
    <span className="text-xs text-[var(--text-secondary)]">{low}</span>
    <span className="text-xs text-[var(--text-secondary)]">{high}</span>
  </div>
);

const ActionButton: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'primary' | 'outline' | 'ghost';
  onClick?: () => void;
}> = ({ children, variant = 'outline', onClick }) => {
  const baseClasses = "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200";
  const variantClasses = {
    primary: "bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90",
    outline: "border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] hover:border-[var(--text-primary)]",
    ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
  };
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};

interface PoolRowProps {
  pool: Pool;
}

const PoolRow: React.FC<PoolRowProps> = ({ pool }) => (
  <div
    className="grid grid-cols-[minmax(180px,2fr)_repeat(4,minmax(100px,1fr))_repeat(3,minmax(80px,1fr))_minmax(140px,1.5fr)] px-4 py-4 border-b border-[var(--border-primary)] items-center hover:bg-[var(--bg-tertiary)] transition-colors"
  >
    {/* Pools */}
    <div className="flex items-center gap-3">
      <div className="flex -space-x-1.5">
        <TokenIcon symbol={pool.tokenA} className="w-7 h-7 border-2 border-[var(--bg-secondary)]" />
        <TokenIcon symbol={pool.tokenB} className="w-7 h-7 border-2 border-[var(--bg-secondary)]" />
      </div>
      <div>
        <div className="text-sm font-medium text-[var(--text-primary)]">
          {pool.tokenA}/{pool.tokenB}
        </div>
        <FeeTag low="0.08%" high="10%" />
      </div>
    </div>
    
    {/* Liquidity */}
    <div className="text-right">
      <div className="text-sm font-medium text-[var(--text-primary)]">
        {formatCurrency(pool.tvl)}
      </div>
      <div className="text-xs text-[var(--text-tertiary)]">
        {pool.providers} providers
      </div>
    </div>
    
    {/* 24H Vol */}
    <div className="text-right">
      <span className="text-sm text-[var(--text-primary)]">
        {formatCurrency(pool.volume24h)}
      </span>
    </div>
    
    {/* 24H Fee/L */}
    <div className="text-right">
      <span className="text-sm text-[var(--text-primary)]">
        {pool.fee24h.toFixed(2)}%
      </span>
    </div>
    
    {/* 7D APR */}
    <div className="text-right">
      <span className="text-sm text-[var(--color-buy)]">
        {pool.apr7d.toFixed(2)}%
      </span>
    </div>
    
    {/* Deposit */}
    <div className="text-center">
      <ActionButton>deposit</ActionButton>
    </div>
    
    {/* Positions */}
    <div className="text-center">
      {pool.hasPosition ? (
        <ActionButton>remove</ActionButton>
      ) : (
        <span className="text-sm text-[var(--text-tertiary)]">-</span>
      )}
    </div>
    
    {/* Fees */}
    <div className="text-center">
      {pool.hasFees ? (
        <ActionButton>claim</ActionButton>
      ) : (
        <span className="text-sm text-[var(--text-tertiary)]">-</span>
      )}
    </div>
    
    {/* Trade */}
    <div className="flex items-center justify-end gap-2">
      <ActionButton variant="outline">spot</ActionButton>
      <ActionButton variant="outline">perp</ActionButton>
    </div>
  </div>
);

export const PoolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPools = POOLS.filter(pool => 
    searchQuery === '' || 
    pool.tokenA.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pool.tokenB.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Pools</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Provide liquidity and earn trading fees
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] font-medium text-sm hover:opacity-90 transition-colors">
            <Plus className="w-4 h-4" />
            New Position
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard 
            icon={<DollarSign className="w-4 h-4" />} 
            label="Total Value Locked" 
            value="$606.00M" 
            change="+5.2%"
          />
          <StatCard 
            icon={<BarChart3 className="w-4 h-4" />} 
            label="24h Volume" 
            value="$195.90M" 
          />
          <StatCard 
            icon={<TrendingUp className="w-4 h-4" />} 
            label="24h Fees" 
            value="$587.70K" 
          />
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex gap-1 p-1 rounded-md bg-[var(--bg-tertiary)]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                activeTab === 'all'
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All Pools
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                activeTab === 'my'
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              My Positions
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search pools"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm rounded-md pl-10 pr-4 py-2 border border-[var(--border-primary)] outline-none focus:border-[var(--text-primary)] transition-all placeholder:text-[var(--text-tertiary)]"
            />
          </div>
        </div>

        {/* Pools Table */}
        <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[minmax(180px,2fr)_repeat(4,minmax(100px,1fr))_repeat(3,minmax(80px,1fr))_minmax(140px,1.5fr)] px-4 py-3 border-b border-[var(--border-primary)] text-xs font-medium text-[var(--text-tertiary)] uppercase">
            <span className="flex items-center gap-1">
              Pools
            </span>
            <span className="flex items-center justify-end gap-1 cursor-pointer hover:text-[var(--text-primary)]">
              Liquidity
              <ChevronDown className="w-3 h-3" />
            </span>
            <span className="text-right">24H Vol</span>
            <span className="text-right">24H Fee/L</span>
            <span className="text-right">7D APR</span>
            <span className="text-center">Deposit</span>
            <span className="text-center">Positions</span>
            <span className="text-center">Fees</span>
            <span className="text-right">Trade</span>
          </div>

          {/* Table Body */}
          {activeTab === 'all' ? (
            filteredPools.length > 0 ? (
              filteredPools.map((pool) => <PoolRow key={pool.id} pool={pool} />)
            ) : (
              <div className="flex items-center justify-center py-16 text-[var(--text-tertiary)]">
                No pools found
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-[var(--text-secondary)] text-sm mb-4">
                You have no liquidity positions
              </p>
              <button className="px-4 py-2 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--bg-quaternary)] transition-colors">
                Add Liquidity
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoolsPage;
