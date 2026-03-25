import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('swap_transactions')
export class SwapTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quoteId: string;

  @Index()
  @Column()
  userAddress: string;

  @Column()
  fromToken: string;

  @Column()
  toToken: string;

  @Column('decimal', { precision: 36, scale: 18 })
  amountIn: string;

  @Column('decimal', { precision: 36, scale: 18 })
  amountOut: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'failed';

  @Column({ nullable: true })
  txHash: string;

  @Column({ nullable: true })
  blockHeight: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
