import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pool } from './entities/pool.entity';
import { CreatePoolDto } from './dto/create-pool.dto';

@Injectable()
export class PoolsService {
  constructor(
    @InjectRepository(Pool)
    private readonly poolRepository: Repository<Pool>,
  ) {}

  async findAll(page: number = 1, limit: number = 20): Promise<{ data: Pool[]; total: number }> {
    const [data, total] = await this.poolRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { tvl: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Pool> {
    const pool = await this.poolRepository.findOne({ where: { id } });
    if (!pool) {
      throw new NotFoundException(`Pool with ID ${id} not found`);
    }
    return pool;
  }

  async findByPair(tokenA: string, tokenB: string): Promise<Pool | null> {
    return this.poolRepository.findOne({
      where: [
        { tokenA, tokenB },
        { tokenA: tokenB, tokenB: tokenA },
      ],
    });
  }

  async create(createPoolDto: CreatePoolDto): Promise<Pool> {
    const pool = this.poolRepository.create(createPoolDto);
    return this.poolRepository.save(pool);
  }

  async updateTvl(id: string, tvl: number): Promise<void> {
    await this.poolRepository.update(id, { tvl, updatedAt: new Date() });
  }

  async updateVolume(id: string, volume24h: number): Promise<void> {
    await this.poolRepository.update(id, { volume24h, updatedAt: new Date() });
  }
}
