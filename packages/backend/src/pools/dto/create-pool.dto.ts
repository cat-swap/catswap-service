import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePoolDto {
  @ApiProperty({ description: 'First token symbol', example: 'BTC' })
  @IsString()
  tokenA: string;

  @ApiProperty({ description: 'Second token symbol', example: 'USDT' })
  @IsString()
  tokenB: string;

  @ApiProperty({ description: 'Initial reserve of token A', example: '10.5' })
  @IsNumber()
  @Min(0)
  reserveA: number;

  @ApiProperty({ description: 'Initial reserve of token B', example: '1000000' })
  @IsNumber()
  @Min(0)
  reserveB: number;

  @ApiProperty({ description: 'Trading fee tier in percent', example: 0.3, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  feeTier?: number;
}
