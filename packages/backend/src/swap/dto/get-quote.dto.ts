import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetQuoteDto {
  @ApiProperty({ description: 'Source token symbol', example: 'BTC' })
  @IsString()
  fromToken: string;

  @ApiProperty({ description: 'Destination token symbol', example: 'USDT' })
  @IsString()
  toToken: string;

  @ApiProperty({ description: 'Amount to swap', example: '1.5' })
  @IsNumber()
  @Min(0)
  amount: string;

  @ApiProperty({ description: 'Slippage tolerance in percent', example: 0.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  slippage?: number;
}
