export default () => ({
  // Server configuration
  PORT: parseInt(process.env.PORT || '3001', 10),
  HOST: process.env.HOST || '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database configuration
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'catswap',
    password: process.env.DATABASE_PASSWORD || 'catswap',
    name: process.env.DATABASE_NAME || 'catswap',
  },

  // Redis configuration (for BullMQ queues)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  // Blockchain configuration
  blockchain: {
    network: process.env.BLOCKCHAIN_NETWORK || 'testnet',
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || '',
    rpcUser: process.env.BLOCKCHAIN_RPC_USER || '',
    rpcPassword: process.env.BLOCKCHAIN_RPC_PASSWORD || '',
  },

  // Swap configuration
  swap: {
    minAmount: parseFloat(process.env.SWAP_MIN_AMOUNT || '0.0001'),
    maxAmount: parseFloat(process.env.SWAP_MAX_AMOUNT || '100'),
    defaultSlippage: parseFloat(process.env.SWAP_DEFAULT_SLIPPAGE || '0.5'),
  },

  // Fee configuration (in basis points, 1 = 0.01%)
  fees: {
    swapFee: parseInt(process.env.FEE_SWAP || '30', 10), // 0.3%
    protocolFee: parseInt(process.env.FEE_PROTOCOL || '5', 10), // 0.05%
  },

  // Admin configuration
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || '',
  },
});

export type ConfigType = ReturnType<typeof configuration>;
