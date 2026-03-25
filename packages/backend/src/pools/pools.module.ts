import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoolsController } from './pools.controller';
import { PoolsService } from './pools.service';
import { Pool } from './entities/pool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pool])],
  controllers: [PoolsController],
  providers: [PoolsService],
  exports: [PoolsService],
})
export class PoolsModule {}
