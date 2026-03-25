# CatSwap Service Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A decentralized exchange (DEX) built on Bitcoin L2, powered by Catena Wallet.

## Project Structure

```
CatSwapService/
├── packages/
│   └── frontend/          # React + TypeScript frontend application
│       ├── src/           # Source code
│       ├── public/        # Static assets
│       └── build/         # Production build
├── package.json           # Root package.json for monorepo management
└── README.md
```

## Features

- **Swap**: Token exchange with optimal routing
- **Perps**: Perpetual futures trading
- **Pools**: Liquidity provision and yield farming
- **Catena Wallet Integration**: Native Bitcoin L2 wallet support

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Wallet**: Catena (OPCAT), Phantom, MetaMask
- **Charts**: Recharts
- **Build**: Create React App

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Install all dependencies:

```bash
npm run install:all
```

### Development

Start the frontend development server:

```bash
npm run start:dev
```

This will start the React development server at `http://localhost:3000`.

### Build

Build the frontend for production:

```bash
npm run build:frontend
```

## Wallet Integration

CatSwap supports multiple wallets:

- **Catena** (Recommended): Bitcoin native wallet for Bitcoin L2
- **Phantom**: Solana wallet
- **MetaMask**: Ethereum wallet

### Catena Wallet

Catena Wallet is the recommended wallet for CatSwap. It provides native Bitcoin L2 support.

- Chrome Extension: [Install Catena](https://chromewebstore.google.com/detail/catena-wallet/jjjjbhackagenhoidaapdaloghfkckda)

## Theming

CatSwap supports both light and dark themes, following OKX design system:

- **Dark Theme**: Pure black (#000000) background
- **Light Theme**: Pure white (#FFFFFF) background

## License

MIT
