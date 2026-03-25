# CatSwap Service Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A decentralized exchange (DEX) built on Bitcoin L2, powered by Catena Wallet.

## Project Structure

```
CatSwapService/
├── packages/
│   ├── frontend/          # React + TypeScript frontend application
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json   # catswap-frontend
│   └── backend/           # NestJS backend API
│       ├── src/
│       │   ├── pools/     # Liquidity pool management
│       │   ├── swap/      # Token swap operations
│       │   ├── blockchain/# Blockchain interaction
│       │   ├── queues/    # BullMQ job queues
│       │   ├── metrics/   # Prometheus metrics
│       │   └── health/    # Health checks
│       └── package.json   # @catswap/backend
├── package.json           # Root package.json for monorepo management
└── README.md
```

## Features

### Frontend
- **Swap**: Token exchange with optimal routing
- **Perps**: Perpetual futures trading
- **Pools**: Liquidity provision and yield farming
- **Catena Wallet Integration**: Native Bitcoin L2 wallet support
- **OKX Design**: Dark/Light theme support

### Backend
- **RESTful API**: NestJS with TypeORM
- **Database**: PostgreSQL for data persistence
- **Queues**: BullMQ with Redis for background jobs
- **Metrics**: Prometheus monitoring
- **Health Checks**: Kubernetes-ready probes

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeORM, PostgreSQL, Redis
- **Wallet**: Catena (OPCAT), Phantom, MetaMask
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL 14+
- Redis 7+

### Installation

1. Install all dependencies:

```bash
npm run install:all
```

2. Set up environment variables:

```bash
# Backend
cp packages/backend/.env.example packages/backend/.env
# Edit packages/backend/.env with your configuration
```

3. Start database services (using Docker):

```bash
docker run -d --name catswap-postgres \
  -e POSTGRES_USER=catswap \
  -e POSTGRES_PASSWORD=catswap \
  -e POSTGRES_DB=catswap \
  -p 5432:5432 postgres:15

docker run -d --name catswap-redis \
  -p 6379:6379 redis:7-alpine
```

### Development

Start both frontend and backend:

```bash
npm run start:dev
```

Or start separately:

```bash
# Terminal 1: Backend API
npm run start:dev:api

# Terminal 2: Frontend
npm run start:frontend
```

### Build

Build all packages:

```bash
npm run build
```

Build individually:

```bash
npm run build:frontend
npm run build:backend
```

## API Documentation

When running in development mode, API documentation is available at:

```
http://localhost:3001/api-docs
```

## Wallet Integration

CatSwap supports multiple wallets:

- **Catena** (Recommended): Bitcoin native wallet for Bitcoin L2
  - Chrome Extension: [Install Catena](https://chromewebstore.google.com/detail/catena-wallet/jjjjbhackagenhoidaapdaloghfkckda)
- **Phantom**: Solana wallet
- **MetaMask**: Ethereum wallet

## License

MIT
