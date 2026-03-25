import { useState, useCallback, useEffect } from 'react';
import { WalletInfo } from '../types';
import {
  isCatenaInstalled,
  isCatenaConnected,
  getCatenaAccounts,
  requestCatenaAccounts,
  disconnectCatena,
} from '../utils/catenaWallet';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString: () => string };
    };
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: () => void) => void;
      removeListener: (event: string, callback: () => void) => void;
    };
  }
}

export type WalletType = 'phantom' | 'metamask' | 'catena';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletInfo>({
    address: '',
    balance: 0,
    connected: false,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletType, setWalletType] = useState<WalletType | null>(null);

  // Check if Catena wallet is already connected on mount
  useEffect(() => {
    const checkCatenaConnection = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (!isCatenaInstalled()) {
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
              balance: Math.random() * 0.5, // Mock BTC balance
              connected: true,
            });
            setWalletType('catena');
          }
        }
      } catch (error) {
        console.error('Error checking Catena connection:', error);
      }
    };

    checkCatenaConnection();
  }, []);

  // Listen for Catena account changes
  useEffect(() => {
    if (walletType === 'catena' && window.opcat) {
      const handleAccountChange = (accounts: string[]) => {
        if (accounts[0]) {
          const address = accounts[0];
          setWallet({
            address: `${address.slice(0, 6)}...${address.slice(-4)}`,
            balance: Math.random() * 0.5,
            connected: true,
          });
        } else {
          setWallet({
            address: '',
            balance: 0,
            connected: false,
          });
          setWalletType(null);
        }
      };

      window.opcat.on('accountsChanged', handleAccountChange);
      return () => {
        window.opcat?.removeListener('accountsChanged', handleAccountChange);
      };
    }
  }, [walletType]);

  const connectPhantom = useCallback(async () => {
    try {
      setIsConnecting(true);
      if (window.solana?.isPhantom) {
        const response = await window.solana.connect();
        const address = response.publicKey.toString();
        setWallet({
          address: `${address.slice(0, 4)}...${address.slice(-4)}`,
          balance: Math.random() * 10,
          connected: true,
        });
        setWalletType('phantom');
      } else {
        window.open('https://phantom.app/', '_blank');
        throw new Error('Please install Phantom wallet');
      }
    } catch (error) {
      console.error('Failed to connect Phantom:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectMetaMask = useCallback(async () => {
    try {
      setIsConnecting(true);
      if (window.ethereum?.isMetaMask) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        }) as string[];
        const address = accounts[0];
        setWallet({
          address: `${address.slice(0, 4)}...${address.slice(-4)}`,
          balance: Math.random() * 5,
          connected: true,
        });
        setWalletType('metamask');
      } else {
        window.open('https://metamask.io/', '_blank');
        throw new Error('Please install MetaMask');
      }
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectCatena = useCallback(async () => {
    try {
      setIsConnecting(true);
      if (!isCatenaInstalled()) {
        window.open('https://chromewebstore.google.com/detail/catena-wallet/jjjjbhackagenhoidaapdaloghfkckda', '_blank');
        throw new Error('Please install Catena wallet');
      }

      const accounts = await requestCatenaAccounts();
      if (accounts.length > 0) {
        const address = accounts[0];
        setWallet({
          address: `${address.slice(0, 6)}...${address.slice(-4)}`,
          balance: Math.random() * 0.5,
          connected: true,
        });
        setWalletType('catena');
      } else {
        throw new Error('No accounts found');
      }
    } catch (error) {
      console.error('Failed to connect Catena:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (walletType === 'catena') {
      try {
        await disconnectCatena();
      } catch (error) {
        console.error('Error disconnecting Catena:', error);
      }
    } else if (walletType === 'phantom' && window.solana) {
      await window.solana.disconnect();
    }
    
    setWallet({
      address: '',
      balance: 0,
      connected: false,
    });
    setWalletType(null);
  }, [walletType]);

  return {
    wallet,
    isConnecting,
    walletType,
    connectPhantom,
    connectMetaMask,
    connectCatena,
    disconnect,
  };
};
