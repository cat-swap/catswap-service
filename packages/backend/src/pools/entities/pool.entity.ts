import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('pools')
@Index(['tokenA', 'tokenB'], { unique: true })
export class Pool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tokenA: string;

  @Column()
  tokenB: string;

  @Column('decimal', { precision: 36, scale: 18, default: 0 })
  reserveA: string;

  @Column('decimal', { precision: 36, scale: 18, default: 0 })
  reserveB: string;

  @Column('decimal', { precision: 36, scale: 2, default: 0 })
  tvl: number;

  @Column('decimal', { precision: 36, scale: 2, default: 0 })
  volume24h: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  apr: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0.3 })
  feeTier: number;

  @Column({ default: 0 })
  totalLpTokens: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
