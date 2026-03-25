import * as React from 'react';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import { WalletInfo } from '../types';
import { Button } from './ui/Button';

interface HeaderProps {
  wallet: WalletInfo;
  onConnectWallet: () => void;
  onDisconnect: () => void;
  currentPage?: string;
  onPageChange?: (page: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

const navItems = [
  { id: 'swap', label: 'Swap' },
  { id: 'perps', label: 'Perps' },
  { id: 'pools', label: 'Pools' },
];

export const Header: React.FC<HeaderProps> = ({
  wallet,
  onConnectWallet,
  onDisconnect,
  currentPage = 'swap',
  onPageChange,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const disconnectButtonRef = React.useRef<HTMLButtonElement>(null);

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

  // Handle keyboard navigation for dropdown
  React.useEffect(() => {
    if (!showDropdown) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes dropdown
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowDropdown(false);
        buttonRef.current?.focus();
        return;
      }

      // Tab navigation - close on tab out
      if (e.key === 'Tab') {
        const focusableElements = dropdownRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) {
          setShowDropdown(false);
          return;
        }

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          // Shift+Tab from first element - close and return to trigger
          e.preventDefault();
          setShowDropdown(false);
          buttonRef.current?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          // Tab from last element - close dropdown
          setShowDropdown(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus first menu item when opened
    setTimeout(() => {
      disconnectButtonRef.current?.focus();
    }, 10);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDropdown]);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDisconnect = () => {
    onDisconnect();
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl text-success">◉</span>
          <span className="text-xl font-bold text-foreground tracking-tight">
            CatSwap
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1" role="tablist">
          {navItems.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={currentPage === item.id}
              onClick={() => onPageChange?.(item.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                currentPage === item.id
                  ? 'text-foreground bg-background-secondary'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-background-tertiary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Wallet Section */}
          {wallet.connected ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground px-3 py-1.5 rounded-lg bg-background-tertiary">
                {wallet.balance.toFixed(4)} BTC
              </span>
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={handleDropdownToggle}
                  aria-expanded={showDropdown}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background-tertiary hover:bg-background-secondary transition-colors border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <span className="text-sm text-foreground-secondary">
                    {wallet.address}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-xs text-white font-bold">
                    ₿
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-foreground-secondary transition-transform duration-200 ${
                      showDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    role="menu"
                    className="absolute top-full right-0 mt-2 py-2 px-1 min-w-[150px] rounded-lg bg-background-secondary border border-border shadow-lg z-50"
                  >
                    <button
                      ref={disconnectButtonRef}
                      role="menuitem"
                      onClick={handleDisconnect}
                      className="w-full text-left px-3 py-2 text-sm text-error hover:bg-background-tertiary rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Button onClick={onConnectWallet}>Connect Wallet</Button>
          )}
        </div>
      </div>
    </header>
  );
};
