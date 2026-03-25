import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('swap_quotes')
export class SwapQuote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fromToken: string;

  @Column()
  toToken: string;

  @Column('decimal', { precision: 36, scale: 18 })
  amountIn: string;

  @Column('decimal', { precision: 36, scale: 18 })
  amountOut: string;

  @Column('decimal', { precision: 36, scale: 18 })
  minAmountOut: string;

  @Column('decimal', { precision: 36, scale: 18 })
  exchangeRate: string;

  @Column('decimal', { precision: 5, scale: 2 })
  slippage: number;

  @Column('decimal', { precision: 10, scale: 4 })
  priceImpact: string;

  @Column()
  poolId: string;

  @Column({ default: false })
  executed: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
