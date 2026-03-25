import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExecuteSwapDto {
  @ApiProperty({ description: 'Quote ID to execute', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  quoteId: string;

  @ApiProperty({ description: 'User wallet address', example: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' })
  @IsString()
  userAddress: string;
}
