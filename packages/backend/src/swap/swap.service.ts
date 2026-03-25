import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SwapQuote } from './entities/swap-quote.entity';
import { SwapTransaction } from './entities/swap-transaction.entity';
import { GetQuoteDto } from './dto/get-quote.dto';
import { ExecuteSwapDto } from './dto/execute-swap.dto';
import { PoolsService } from '../pools/pools.service';

@Injectable()
export class SwapService {
  constructor(
    @InjectRepository(SwapQuote)
    private readonly quoteRepository: Repository<SwapQuote>,
    @InjectRepository(SwapTransaction)
    private readonly transactionRepository: Repository<SwapTransaction>,
    private readonly poolsService: PoolsService,
  ) {}

  async getQuote(getQuoteDto: GetQuoteDto): Promise<SwapQuote> {
    const { fromToken, toToken, amount, slippage = 0.5 } = getQuoteDto;

    // Find pool for the token pair
    const pool = await this.poolsService.findByPair(fromToken, toToken);
    if (!pool) {
      throw new NotFoundException(`No pool found for ${fromToken}/${toToken}`);
    }

    // Calculate output amount using constant product formula
    const reserveIn = parseFloat(fromToken === pool.tokenA ? pool.reserveA : pool.reserveB);
    const reserveOut = parseFloat(fromToken === pool.tokenA ? pool.reserveB : pool.reserveA);
    const amountIn = parseFloat(amount);

    // Apply fee (default 0.3%)
    const fee = parseFloat(pool.feeTier.toString()) / 100;
    const amountInWithFee = amountIn * (1 - fee);

    // Constant product formula: x * y = k
    // (reserveIn + amountInWithFee) * (reserveOut - amountOut) = reserveIn * reserveOut
    const amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);

    // Calculate minimum output with slippage
    const minAmountOut = amountOut * (1 - slippage / 100);

    // Calculate price impact
    const priceImpact = (amountInWithFee / (reserveIn + amountInWithFee)) * 100;

    const quote = this.quoteRepository.create({
      fromToken,
      toToken,
      amountIn: amount,
      amountOut: amountOut.toFixed(8),
      minAmountOut: minAmountOut.toFixed(8),
      exchangeRate: (amountOut / amountIn).toFixed(8),
      slippage,
      priceImpact: priceImpact.toFixed(4),
      poolId: pool.id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
    });

    return this.quoteRepository.save(quote);
  }

  async executeSwap(executeSwapDto: ExecuteSwapDto): Promise<{ txId: string; status: string }> {
    const { quoteId, userAddress } = executeSwapDto;

    // Verify quote exists and is valid
    const quote = await this.quoteRepository.findOne({ where: { id: quoteId } });
    if (!quote) {
      throw new NotFoundException('Quote not found');
    }
    if (quote.expiresAt < new Date()) {
      throw new BadRequestException('Quote has expired');
    }
    if (quote.executed) {
      throw new BadRequestException('Quote already executed');
    }

    // Create transaction record
    const transaction = this.transactionRepository.create({
      quoteId,
      userAddress,
      fromToken: quote.fromToken,
      toToken: quote.toToken,
      amountIn: quote.amountIn,
      amountOut: quote.amountOut,
      status: 'pending',
    });

    await this.transactionRepository.save(transaction);

    // Mark quote as executed
    quote.executed = true;
    await this.quoteRepository.save(quote);

    // Return transaction ID (in real implementation, this would submit to blockchain)
    return {
      txId: transaction.id,
      status: 'pending',
    };
  }

  async findRoutes(fromToken: string, toToken: string): Promise<{ routes: any[] }> {
    // Simple implementation - find direct pool
    const pool = await this.poolsService.findByPair(fromToken, toToken);
    
    const routes = [];
    if (pool) {
      routes.push({
        type: 'direct',
        path: [fromToken, toToken],
        pools: [pool.id],
        fee: pool.feeTier,
      });
    }

    return { routes };
  }
}
