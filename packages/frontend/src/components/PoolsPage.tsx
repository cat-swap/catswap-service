import React, { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';
import { formatCurrency } from '../shared/lib/formatters';

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

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <Card>
    <CardContent className="p-4">
      <p className="text-xs text-foreground-tertiary mb-1">{label}</p>
      <p className="text-xl font-semibold text-foreground">{value}</p>
    </CardContent>
  </Card>
);

interface PoolRowProps {
  pool: Pool;
}

const PoolRow: React.FC<PoolRowProps> = ({ pool }) => (
  <div
    className="grid grid-cols-5 px-4 sm:px-6 py-4 border-b border-border items-center hover:bg-background-tertiary transition-colors cursor-pointer"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Handle pool selection
      }
    }}
  >
    <div className="flex items-center gap-2">
      <div className="flex -space-x-1">
        <div className="w-7 h-7 rounded-full bg-success flex items-center justify-center text-white text-xs font-bold">
          {pool.tokenA[0]}
        </div>
        <div className="w-7 h-7 rounded-full bg-danger flex items-center justify-center text-white text-xs font-bold">
          {pool.tokenB[0]}
        </div>
      </div>
      <span className="text-sm font-medium text-foreground ml-1 hidden sm:inline">
        {pool.tokenA}/{pool.tokenB}
      </span>
      <span className="text-sm font-medium text-foreground ml-1 sm:hidden">
        {pool.tokenA}/{pool.tokenB}
      </span>
    </div>
    <span className="text-sm text-foreground text-right">
      {formatCurrency(pool.tvl)}
    </span>
    <span className="text-sm text-success text-right">
      {pool.apr}%
    </span>
    <span className="text-sm text-foreground text-right">
      {formatCurrency(pool.volume24h)}
    </span>
    <span className="text-sm text-foreground-tertiary text-right">
      {pool.fee}%
    </span>
  </div>
);

export const PoolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  return (
    <div className="min-h-[calc(100vh-64px)] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Liquidity Pools
            </h1>
            <p className="text-sm text-foreground-tertiary">
              Provide liquidity and earn fees
            </p>
          </div>
          <Button>Create Position</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <StatCard label="Total TVL" value="$606.00M" />
          <StatCard label="24h Volume" value="$195.90M" />
          <StatCard label="24h Fees" value="$587.70K" />
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'all' | 'my')}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="all">All Pools</TabsTrigger>
            <TabsTrigger value="my">My Positions</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Pools Table */}
        <Card className="overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 px-4 sm:px-6 py-3 border-b border-border text-xs font-medium text-foreground-tertiary uppercase">
            <span>Pool</span>
            <span className="text-right">TVL</span>
            <span className="text-right">APR</span>
            <span className="text-right hidden sm:block">24h Volume</span>
            <span className="text-right sm:hidden">Vol</span>
            <span className="text-right">Fee</span>
          </div>

          {/* Table Body */}
          {activeTab === 'all' ? (
            POOLS.map((pool) => <PoolRow key={pool.id} pool={pool} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-foreground-tertiary text-sm mb-4">
                No positions found
              </p>
              <Button>Add Liquidity</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PoolsPage;
