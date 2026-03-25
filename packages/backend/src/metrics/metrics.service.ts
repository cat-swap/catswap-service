import { Injectable } from '@nestjs/common';
import { Gauge, Counter, Histogram, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly swapVolume: Counter<string>;
  private readonly swapCount: Counter<string>;
  private readonly poolTvl: Gauge<string>;
  private readonly swapDuration: Histogram<string>;

  constructor() {
    this.swapVolume = new Counter({
      name: 'catswap_swap_volume_total',
      help: 'Total swap volume in USD',
      labelNames: ['token_in', 'token_out'],
    });

    this.swapCount = new Counter({
      name: 'catswap_swap_count_total',
      help: 'Total number of swaps',
      labelNames: ['token_in', 'token_out'],
    });

    this.poolTvl = new Gauge({
      name: 'catswap_pool_tvl',
      help: 'Pool TVL in USD',
      labelNames: ['pool_id', 'token_a', 'token_b'],
    });

    this.swapDuration = new Histogram({
      name: 'catswap_swap_duration_seconds',
      help: 'Swap execution duration',
      buckets: [0.1, 0.5, 1, 2, 5],
    });

    register.registerMetric(this.swapVolume);
    register.registerMetric(this.swapCount);
    register.registerMetric(this.poolTvl);
    register.registerMetric(this.swapDuration);
  }

  recordSwap(tokenIn: string, tokenOut: string, volumeUsd: number): void {
    this.swapVolume.inc({ token_in: tokenIn, token_out: tokenOut }, volumeUsd);
    this.swapCount.inc({ token_in: tokenIn, token_out: tokenOut });
  }

  updatePoolTvl(poolId: string, tokenA: string, tokenB: string, tvl: number): void {
    this.poolTvl.set({ pool_id: poolId, token_a: tokenA, token_b: tokenB }, tvl);
  }

  recordSwapDuration(durationSeconds: number): void {
    this.swapDuration.observe(durationSeconds);
  }
}
