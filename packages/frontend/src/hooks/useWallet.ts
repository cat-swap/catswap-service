import { useState, useCallback, useEffect } from 'react';
import { WalletInfo } from '../types';
import {
  isCatenaInstalled,
  isCatenaConnected,
  getCatenaAccounts,
  requestCatenaAccounts,
  disconnectCatena,
} from '../utils/catenaWallet';

// Flag to enable mock mode for development
const USE_MOCK_WALLET = import.meta.env.VITE_USE_MOCK_WALLET === 'true';

interface UseWalletOptions {
  initialMockBalance?: number;
}

/**
 * Hook for managing Catena wallet connection
 * Simplified to only support Catena wallet
 */
export const useWallet = (options: UseWalletOptions = {}) => {
  const { initialMockBalance = 0.5 } = options;
  
  const [wallet, setWallet] = useState<WalletInfo>({
    address: '',
    balance: 0,
    connected: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if Catena wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      // Add small delay to allow wallet extension to inject
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!isCatenaInstalled()) {
        console.log('Catena wallet not installed');
        return;
      }
      
      try {
        const connected = await isCatenaConnected();
        if (connected) {
          const accounts = await getCatenaAccounts();
          if (accounts.length > 0) {
            const address = accounts[0];
            setWallet({
              address: `${address.slice(0, 6)}...${address.slice(-4)}`,
              balance: USE_MOCK_WALLET ? initialMockBalance : 0,
              connected: true,
            });
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();
  }, [initialMockBalance]);

  // Listen for account changes
  useEffect(() => {
    if (!wallet.connected || !window.opcat) return;

    const handleAccountChange = (accounts: string[]) => {
      if (accounts[0]) {
        const address = accounts[0];
        setWallet(prev => ({
          ...prev,
          address: `${address.slice(0, 6)}...${address.slice(-4)}`,
          connected: true,
        }));
      } else {
        setWallet({
          address: '',
          balance: 0,
          connected: false,
        });
      }
    };

    window.opcat.on('accountsChanged', handleAccountChange);
    return () => {
      window.opcat?.removeListener('accountsChanged', handleAccountChange);
    };
  }, [wallet.connected]);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      
      if (!isCatenaInstalled()) {
        // Open Catena wallet installation page
        window.open(
          'https://chromewebstore.google.com/detail/catena-wallet/jjjjbhackagenhoidaapdaloghfkckda',
          '_blank'
        );
        throw new Error('Please install Catena wallet');
      }

      const accounts = await requestCatenaAccounts();
      if (accounts.length > 0) {
        const address = accounts[0];
        setWallet({
          address: `${address.slice(0, 6)}...${address.slice(-4)}`,
          balance: USE_MOCK_WALLET ? initialMockBalance : 0,
          connected: true,
        });
        return true;
      } else {
        throw new Error('No accounts found');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [initialMockBalance]);

  const disconnect = useCallback(async () => {
    try {
      if (isCatenaInstalled()) {
        await disconnectCatena();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    } finally {
      setWallet({
        address: '',
        balance: 0,
        connected: false,
      });
    }
  }, []);

  return {
    wallet,
    isConnecting,
    connect,
    disconnect,
  };
};

export default useWallet;
