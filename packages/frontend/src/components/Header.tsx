import React, { useState } from 'react';
import { WalletInfo } from '../types';

interface HeaderProps {
  wallet: WalletInfo;
  onConnectWallet: () => void;
  onDisconnect: () => void;
  currentPage?: string;
  onPageChange?: (page: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  onConnectWallet,
  onDisconnect,
  currentPage = 'swap',
  onPageChange,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = [
    { id: 'swap', label: 'Swap' },
    { id: 'perps', label: 'Perps' },
    { id: 'pools', label: 'Pools' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-primary-okx bg-primary-okx transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl text-okx-buy">◉</span>
          <span className="text-xl font-bold text-primary-okx tracking-tight">CatSwap</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                onPageChange?.(item.id);
              }}
              className={`text-sm font-medium transition-colors duration-200 ${
                currentPage === item.id
                  ? 'text-primary-okx'
                  : 'text-secondary-okx hover:text-primary-okx'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="btn-ghost w-9 h-9 rounded-okx p-0"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Wallet Section */}
          {wallet.connected ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-primary-okx px-3 py-1.5 rounded-okx bg-tertiary-okx">
                {wallet.balance.toFixed(4)} BTC
              </span>
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-okx bg-tertiary-okx cursor-pointer hover:bg-secondary-okx transition-colors">
                  <span className="text-sm text-secondary-okx">{wallet.address}</span>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-xs text-white font-bold">
                    ₿
                  </div>
                </div>
                {showDropdown && (
                  <div className="absolute top-full right-0 mt-2 py-2 px-1 min-w-[150px] rounded-okx bg-secondary-okx border border-primary-okx shadow-lg">
                    <button
                      onClick={onDisconnect}
                      className="w-full text-left px-3 py-2 text-sm text-okx-sell hover:bg-tertiary-okx rounded transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button onClick={onConnectWallet} className="btn btn-primary">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
