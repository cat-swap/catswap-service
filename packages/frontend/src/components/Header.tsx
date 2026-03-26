import * as React from 'react';
import { Sun, Moon, ChevronDown, Wallet, LogOut } from 'lucide-react';
import { WalletInfo } from '../types';

type Page = 'spot' | 'perps' | 'pools';

interface HeaderProps {
  wallet: WalletInfo;
  onConnectWallet: () => void;
  onDisconnect: () => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const navItems: { id: Page; label: string }[] = [
  { id: 'spot', label: 'Spot' },
  { id: 'perps', label: 'Perps' },
  { id: 'pools', label: 'Pools' },
];

export const Header: React.FC<HeaderProps> = ({
  wallet,
  onConnectWallet,
  onDisconnect,
  currentPage,
  onPageChange,
  theme,
  onToggleTheme,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!showDropdown) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowDropdown(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDropdown]);

  const handleDisconnect = () => {
    onDisconnect();
    setShowDropdown(false);
  };

  return (
    <>
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 sm:h-11 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => onPageChange('spot')}
            >
              {/* Logo - 根据主题切换 */}
              <img 
                src={theme === 'dark' ? '/logo_dark.svg' : '/logo_light.svg'}
                alt="CatSwap"
                className="h-[26px] w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    currentPage === item.id
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.label}
                  {currentPage === item.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[var(--text-primary)] rounded-full" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all duration-200"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Wallet Section */}
            {wallet.connected ? (
              <div className="flex items-center gap-2">
                {/* Balance Display */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {wallet.balance.toFixed(4)}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">BTC</span>
                </div>

                {/* Wallet Dropdown */}
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-tertiary)] hover:bg-[var(--bg-quaternary)] border border-[var(--border-primary)] transition-all duration-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-[var(--bg-quaternary)] flex items-center justify-center">
                      <Wallet className="w-3 h-3 text-[var(--text-secondary)]" />
                    </div>
                    <span className="text-sm text-[var(--text-primary)] hidden sm:inline">
                      {wallet.address}
                    </span>
                    <span className="text-sm text-[var(--text-primary)] sm:hidden">
                      {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform duration-200 ${
                        showDropdown ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-full right-0 mt-2 py-1 min-w-[180px] rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-lg z-50"
                    >
                      {/* Mobile Balance */}
                      <div className="sm:hidden px-4 py-2 border-b border-[var(--border-primary)]">
                        <span className="text-xs text-[var(--text-secondary)]">Balance</span>
                        <div className="text-sm font-medium text-[var(--text-primary)]">
                          {wallet.balance.toFixed(4)} BTC
                        </div>
                      </div>
                      
                      <button
                        onClick={handleDisconnect}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-sell)] hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={onConnectWallet}
                className="px-4 py-1.5 rounded-md bg-[var(--text-primary)] text-[var(--bg-secondary)] text-sm font-medium hover:opacity-90 transition-all duration-200"
              >
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </button>
            )}
          </div>
        </div>
      </div>

    </header>

    {/* Mobile Bottom Navigation */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] pb-safe">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onPageChange(item.id)}
          className={`flex-1 py-3 text-xs font-medium transition-all duration-200 ${
            currentPage === item.id
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)]'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
    </>
  );
};

export default Header;
