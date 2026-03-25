# CatSwap Frontend

A modern DEX frontend built with React, Vite, and Tailwind CSS.

## Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/) with SWC for fast HMR
- **Framework**: React 18.3 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with `class-variance-authority`
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload when you make edits. HMR (Hot Module Replacement) provides instant updates.

### Type Checking

```bash
npm run typecheck
```

### Build

```bash
npm run build
```

Builds the app for production to the `dist` folder. The build is minified and optimized.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Tabs.tsx
│   ├── Header.tsx
│   ├── WalletModal.tsx
│   ├── SwapPage.tsx
│   ├── TradePage.tsx
│   └── PoolsPage.tsx
├── lib/
│   └── utils.ts         # Utility functions (cn, etc.)
├── shared/
│   └── lib/
│       └── formatters.ts # Formatting utilities
├── hooks/
│   ├── useWallet.ts
│   └── useTheme.ts
├── types/
│   └── index.ts
├── App.tsx
└── index.tsx
```

## UI Components

Components are built with accessibility in mind:

- **Button**: Multiple variants (primary, secondary, ghost, buy, sell) with loading state
- **Card**: Flexible card layout with header, content, footer sections
- **Input**: Form input with label, error, and helper text support
- **Modal**: Accessible dialog with focus trap, ESC to close, focus restoration
- **Tabs**: Keyboard navigable tabs with proper ARIA attributes

## Styling

Uses Tailwind CSS with custom CSS variables for theming:

```css
--bg-primary: #000000;      /* Main background */
--bg-secondary: #141414;    /* Card/panel background */
--text-primary: #ffffff;    /* Main text */
--color-buy: #25a750;       /* Buy/green */
--color-sell: #ca3f64;      /* Sell/red */
```

## Development Mode

Enable mock wallet data by creating `.env`:

```env
VITE_USE_MOCK_WALLET=true
```

## Learn More

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
