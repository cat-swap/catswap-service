// Catena (OPCAT) Wallet utilities
// Reference: https://docs.opcatlabs.io/api/opcat-wallet

import type { SupportedNetwork } from '../types/catena';

const CATENA_DOWNLOAD_URL = 'https://chromewebstore.google.com/detail/catena-wallet/jjjjbhackagenhoidaapdaloghfkckda';

/**
 * Check if Catena Wallet extension is installed
 */
export function isCatenaInstalled(): boolean {
  return typeof window.opcat !== 'undefined';
}

/**
 * Check if user has already connected their wallet
 */
export async function isCatenaConnected(): Promise<boolean> {
  if (!isCatenaInstalled()) {
    return false;
  }

  try {
    const accounts = await window.opcat!.getAccounts();
    return accounts.length > 0;
  } catch (error) {
    console.error('Error checking Catena connection:', error);
    return false;
  }
}

/**
 * Get connected accounts
 */
export async function getCatenaAccounts(): Promise<string[]> {
  if (!isCatenaInstalled()) {
    throw new Error('Catena Wallet is not installed');
  }

  return await window.opcat!.getAccounts();
}

/**
 * Request user to connect their wallet
 */
export async function requestCatenaAccounts(): Promise<string[]> {
  if (!isCatenaInstalled()) {
    throw new Error('Catena Wallet is not installed');
  }

  return await window.opcat!.requestAccounts();
}

/**
 * Disconnect wallet
 */
export async function disconnectCatena(): Promise<void> {
  if (!isCatenaInstalled()) {
    throw new Error('Catena Wallet is not installed');
  }

  return await window.opcat!.disconnect();
}

/**
 * Get current network
 */
export async function getCatenaNetwork(): Promise<string> {
  if (!isCatenaInstalled()) {
    throw new Error('Catena Wallet is not installed');
  }

  const networkObj = await window.opcat!.getNetwork();
  return networkObj.network;
}

/**
 * Switch network
 */
export async function switchCatenaNetwork(network: string): Promise<void> {
  if (!isCatenaInstalled()) {
    throw new Error('Catena Wallet is not installed');
  }

  return await window.opcat!.switchNetwork(network);
}

/**
 * Get Catena wallet object
 */
export function getCatenaObject(): Window['opcat'] {
  if (!isCatenaInstalled()) {
    throw new Error('Catena Wallet is not installed');
  }
  return window.opcat!;
}

/**
 * Open Catena Wallet download page
 */
export function openCatenaDownloadPage(): void {
  window.open(CATENA_DOWNLOAD_URL, '_blank');
}

/**
 * Convert SDK network to wallet network format
 */
export function sdkNetworkToWalletNetwork(network: SupportedNetwork): string {
  switch (network) {
    case 'opcat-mainnet':
      return 'mainnet';
    case 'opcat-testnet':
      return 'testnet';
    default:
      throw new Error('Wallet does not support network: ' + network);
  }
}

/**
 * Convert wallet network format to SDK network
 */
export function walletNetworkToSdkNetwork(network: string): SupportedNetwork {
  switch (network) {
    case 'mainnet':
    case 'livenet':
      return 'opcat-mainnet';
    case 'testnet':
      return 'opcat-testnet';
    default:
      throw new Error('SDK does not support network: ' + network);
  }
}

/**
 * Sign a message using Catena wallet
 */
export async function signMessageWithCatena(message: string): Promise<string> {
  if (!isCatenaInstalled()) {
    throw new Error('Catena Wallet is not installed');
  }

  return await window.opcat!.signMessage(message);
}

/**
 * Sign a PSBT using Catena wallet
 */
export async function signPsbtWithCatena(
  psbtHex: string,
  options?: { autoBroadcast?: boolean }
): Promise<string> {
  if (!isCatenaInstalled()) {
    throw new Error('Catena Wallet is not installed');
  }

  return await window.opcat!.signPsbt(psbtHex, options);
}
