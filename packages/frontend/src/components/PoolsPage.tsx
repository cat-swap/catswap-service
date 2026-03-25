import React, { useState } from 'react';

interface Pool {
  id: string;
  tokenA: string;
  tokenB: string;
  tvl: number;
  apr: number;
  volume24h: number;
  fee: number;
}

const POOLS: Pool[] = [
  { id: '1', tokenA: 'BTC', tokenB: 'USDT', tvl: 245000000, apr: 12.5, volume24h: 89000000, fee: 0.3 },
  { id: '2', tokenA: 'ETH', tokenB: 'USDT', tvl: 156000000, apr: 8.2, volume24h: 45000000, fee: 0.3 },
  { id: '3', tokenA: 'BTC', tokenB: 'ETH', tvl: 89000000, apr: 15.3, volume24h: 23000000, fee: 0.3 },
  { id: '4', tokenA: 'SOL', tokenB: 'USDT', tvl: 45000000, apr: 18.7, volume24h: 12000000, fee: 0.3 },
  { id: '5', tokenA: 'ETH', tokenB: 'USDC', tvl: 67000000, apr: 6.8, volume24h: 18000000, fee: 0.05 },
  { id: '6', tokenA: 'BTC', tokenB: 'USDC', tvl: 34000000, apr: 10.2, volume24h: 8900000, fee: 0.05 },
];

const formatCurrency = (value: number): string => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

export const PoolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  return (
    <div className="min-h-[calc(100vh-64px)] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-primary-okx mb-1">Liquidity Pools</h1>
            <p className="text-sm text-tertiary-okx">Provide liquidity and earn fees</p>
          </div>
          <button className="btn btn-primary px-6 py-2.5">
            Create Position
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-okx-lg border border-primary-okx bg-secondary-okx p-4">
            <p className="text-xs text-tertiary-okx mb-1">Total TVL</p>
            <p className="text-xl font-semibold text-primary-okx">$606.00M</p>
          </div>
          <div className="rounded-okx-lg border border-primary-okx bg-secondary-okx p-4">
            <p className="text-xs text-tertiary-okx mb-1">24h Volume</p>
            <p className="text-xl font-semibold text-primary-okx">$195.90M</p>
          </div>
          <div className="rounded-okx-lg border border-primary-okx bg-secondary-okx p-4">
            <p className="text-xs text-tertiary-okx mb-1">24h Fees</p>
            <p className="text-xl font-semibold text-primary-okx">$587.70K</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'text-primary-okx border-okx-buy'
                : 'text-tertiary-okx border-transparent hover:text-primary-okx'
            }`}
          >
            All Pools
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'my'
                ? 'text-primary-okx border-okx-buy'
                : 'text-tertiary-okx border-transparent hover:text-primary-okx'
            }`}
          >
            My Positions
          </button>
        </div>

        {/* Pools Table */}
        <div className="rounded-okx-lg border border-primary-okx bg-secondary-okx overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 px-6 py-3 border-b border-primary-okx text-xs font-medium text-tertiary-okx uppercase">
            <span>Pool</span>
            <span className="text-right">TVL</span>
            <span className="text-right">APR</span>
            <span className="text-right">24h Volume</span>
            <span className="text-right">Fee</span>
          </div>

          {/* Table Body */}
          {activeTab === 'all' ? (
            POOLS.map((pool) => (
              <div
                key={pool.id}
                className="grid grid-cols-5 px-6 py-4 border-b border-primary-okx items-center hover:bg-tertiary-okx transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <div className="w-7 h-7 rounded-full bg-okx-buy flex items-center justify-center text-white text-xs font-bold">
                      {pool.tokenA[0]}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-okx-sell flex items-center justify-center text-white text-xs font-bold">
                      {pool.tokenB[0]}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-primary-okx ml-1">
                    {pool.tokenA}/{pool.tokenB}
                  </span>
                </div>
                <span className="text-sm text-primary-okx text-right">{formatCurrency(pool.tvl)}</span>
                <span className="text-sm text-okx-buy text-right">{pool.apr}%</span>
                <span className="text-sm text-primary-okx text-right">{formatCurrency(pool.volume24h)}</span>
                <span className="text-sm text-tertiary-okx text-right">{pool.fee}%</span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-tertiary-okx text-sm mb-4">No positions found</p>
              <button className="btn btn-primary px-6 py-2">
                Add Liquidity
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
