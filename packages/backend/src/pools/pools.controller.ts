import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PoolsService } from './pools.service';
import { Pool } from './entities/pool.entity';
import { CreatePoolDto } from './dto/create-pool.dto';

@ApiTags('pools')
@Controller('pools')
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all liquidity pools' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{ data: Pool[]; total: number }> {
    return this.poolsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pool by ID' })
  @ApiParam({ name: 'id', description: 'Pool ID' })
  async findOne(@Param('id') id: string): Promise<Pool> {
    return this.poolsService.findOne(id);
  }

  @Get(':tokenA/:tokenB')
  @ApiOperation({ summary: 'Get pool by token pair' })
  async findByPair(
    @Param('tokenA') tokenA: string,
    @Param('tokenB') tokenB: string,
  ): Promise<Pool | null> {
    return this.poolsService.findByPair(tokenA, tokenB);
  }

  @Post()
  @ApiOperation({ summary: 'Create new liquidity pool' })
  async create(@Body() createPoolDto: CreatePoolDto): Promise<Pool> {
    return this.poolsService.create(createPoolDto);
  }
}
