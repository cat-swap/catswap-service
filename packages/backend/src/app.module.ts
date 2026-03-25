import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import configuration from './config/configuration';
import { pinoLoggerConfig } from './common/logger.config';

// Feature modules
import { PoolsModule } from './pools/pools.module';
import { SwapModule } from './swap/swap.module';
import { HealthModule } from './health/health.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { QueuesModule } from './queues/queues.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    LoggerModule.forRoot(pinoLoggerConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      expandVariables: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const database = configService.get<{
          host: string;
          port: number;
          username: string;
          password: string;
          name: string;
        }>('database');

        if (!database) {
          throw new Error('Database configuration is missing');
        }

        const nodeEnv = process.env.NODE_ENV || 'development';
        const isProduction = nodeEnv === 'production';

        return {
          type: 'postgres',
          host: database.host,
          port: database.port,
          username: database.username,
          password: database.password,
          database: database.name,
          synchronize: !isProduction,
          autoLoadEntities: true,
          ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
          extra: {
            max: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
            min: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
            idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30000', 10),
            connectionTimeoutMillis: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '2000', 10),
          },
          retryAttempts: 3,
          retryDelay: 3000,
          logging: process.env.DATABASE_LOGGING === 'true',
        };
      },
    }),
    ScheduleModule.forRoot(),
    // Feature modules
    PoolsModule,
    SwapModule,
    HealthModule,
    BlockchainModule,
    QueuesModule,
    MetricsModule,
  ],
})
export class AppModule {}
