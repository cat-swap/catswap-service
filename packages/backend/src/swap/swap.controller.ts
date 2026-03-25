import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SwapService } from './swap.service';
import { GetQuoteDto } from './dto/get-quote.dto';
import { ExecuteSwapDto } from './dto/execute-swap.dto';
import { SwapQuote } from './entities/swap-quote.entity';

@ApiTags('swap')
@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get('quote')
  @ApiOperation({ summary: 'Get swap quote' })
  async getQuote(@Query() getQuoteDto: GetQuoteDto): Promise<SwapQuote> {
    return this.swapService.getQuote(getQuoteDto);
  }

  @Post('execute')
  @ApiOperation({ summary: 'Execute swap transaction' })
  async executeSwap(@Body() executeSwapDto: ExecuteSwapDto): Promise<{ txId: string; status: string }> {
    return this.swapService.executeSwap(executeSwapDto);
  }

  @Get('routes')
  @ApiOperation({ summary: 'Get available swap routes' })
  @ApiQuery({ name: 'fromToken', required: true })
  @ApiQuery({ name: 'toToken', required: true })
  async getRoutes(
    @Query('fromToken') fromToken: string,
    @Query('toToken') toToken: string,
  ): Promise<{ routes: any[] }> {
    return this.swapService.findRoutes(fromToken, toToken);
  }
}
