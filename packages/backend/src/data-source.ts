import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'catswap',
  password: process.env.DATABASE_PASSWORD || 'catswap',
  database: process.env.DATABASE_NAME || 'catswap',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
