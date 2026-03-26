import React, { useState } from 'react';
import { Plus, Search, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

interface Pool {
  id: string;
  tokenA: string;
  tokenB: string;
  tvl: number;
  apr: number;
  volume24h: number;
  fee: number;
  feeTier: string;
}

const POOLS: Pool[] = [
  { id: '1', tokenA: 'BTC', tokenB: 'USDT', tvl: 245000000, apr: 12.5, volume24h: 89000000, fee: 0.3, feeTier: '0.3%' },
  { id: '2', tokenA: 'ETH', tokenB: 'USDT', tvl: 156000000, apr: 8.2, volume24h: 45000000, fee: 0.3, feeTier: '0.3%' },
  { id: '3', tokenA: 'BTC', tokenB: 'ETH', tvl: 89000000, apr: 15.3, volume24h: 23000000, fee: 0.3, feeTier: '0.3%' },
  { id: '4', tokenA: 'SOL', tokenB: 'USDT', tvl: 45000000, apr: 18.7, volume24h: 12000000, fee: 0.3, feeTier: '0.3%' },
  { id: '5', tokenA: 'ETH', tokenB: 'USDC', tvl: 67000000, apr: 6.8, volume24h: 18000000, fee: 0.05, feeTier: '0.05%' },
  { id: '6', tokenA: 'BTC', tokenB: 'USDC', tvl: 34000000, apr: 10.2, volume24h: 8900000, fee: 0.05, feeTier: '0.05%' },
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

interface PoolRowProps {
  pool: Pool;
}

const PoolRow: React.FC<PoolRowProps> = ({ pool }) => (
  <div
    className="grid grid-cols-12 px-4 sm:px-6 py-4 border-b border-[var(--border-primary)] items-center hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
      }
    }}
  >
    {/* Pool */}
    <div className="col-span-4 sm:col-span-3 flex items-center gap-3">
      <div className="flex -space-x-2">
        <div className="w-8 h-8 rounded-full bg-[var(--bg-quaternary)] flex items-center justify-center text-[var(--text-primary)] text-xs font-bold border-2 border-[var(--bg-secondary)]">
          {pool.tokenA[0]}
        </div>
        <div className="w-8 h-8 rounded-full bg-[var(--bg-quaternary)] flex items-center justify-center text-[var(--text-secondary)] text-xs font-bold border-2 border-[var(--bg-secondary)]">
          {pool.tokenB[0]}
        </div>
      </div>
      <div>
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {pool.tokenA}/{pool.tokenB}
        </span>
        <span className="hidden sm:block text-xs text-[var(--text-tertiary)]">
          Fee {pool.feeTier}
        </span>
      </div>
    </div>
    
    {/* TVL */}
    <div className="col-span-3 sm:col-span-2 text-right">
      <span className="text-sm text-[var(--text-primary)]">
        {formatCurrency(pool.tvl)}
      </span>
    </div>
    
    {/* APR */}
    <div className="col-span-2 text-right">
      <span className="text-sm text-[var(--color-buy)]">
        {pool.apr}%
      </span>
    </div>
    
    {/* Volume - Hidden on mobile */}
    <div className="hidden sm:block col-span-2 text-right">
      <span className="text-sm text-[var(--text-primary)]">
        {formatCurrency(pool.volume24h)}
      </span>
    </div>
    
    {/* Fee */}
    <div className="col-span-3 sm:col-span-2 text-right">
      <span className="text-sm text-[var(--text-secondary)]">
        {pool.fee}%
      </span>
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
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
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
          <div className="grid grid-cols-12 px-4 sm:px-6 py-3 border-b border-[var(--border-primary)] text-xs font-medium text-[var(--text-tertiary)] uppercase">
            <span className="col-span-4 sm:col-span-3">Pool</span>
            <span className="col-span-3 sm:col-span-2 text-right">TVL</span>
            <span className="col-span-2 text-right">APR</span>
            <span className="hidden sm:block col-span-2 text-right">24h Volume</span>
            <span className="col-span-3 sm:col-span-2 text-right">Fee</span>
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
