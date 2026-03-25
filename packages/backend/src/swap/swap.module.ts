import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';
import { SwapQuote } from './entities/swap-quote.entity';
import { SwapTransaction } from './entities/swap-transaction.entity';
import { PoolsModule } from '../pools/pools.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SwapQuote, SwapTransaction]),
    PoolsModule,
  ],
  controllers: [SwapController],
  providers: [SwapService],
  exports: [SwapService],
})
export class SwapModule {}
