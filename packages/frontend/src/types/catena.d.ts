// Catena Wallet (OPCAT) Type Definitions
// Reference: https://docs.opcatlabs.io/api/opcat-wallet

declare global {
  interface Window {
    opcat?: OpcatWallet;
  }
}

export interface OpcatWallet {
  /** Get connected accounts */
  getAccounts(): Promise<string[]>;
  
  /** Request user to connect accounts */
  requestAccounts(): Promise<string[]>;
  
  /** Disconnect wallet */
  disconnect(): Promise<void>;
  
  /** Get current network */
  getNetwork(): Promise<{ network: string }>;
  
  /** Switch to different network */
  switchNetwork(network: string): Promise<void>;
  
  /** Sign a message */
  signMessage(message: string): Promise<string>;
  
  /** Sign a PSBT */
  signPsbt(psbtHex: string, options?: SignPsbtOptions): Promise<string>;
  
  /** Listen for events */
  on(event: string, handler: (...args: any[]) => void): void;
  
  /** Remove event listener */
  removeListener(event: string, handler: (...args: any[]) => void): void;
}

export interface SignPsbtOptions {
  /** Whether to broadcast after signing */
  autoBroadcast?: boolean;
  /**
   * Sighash types for inputs
   * Maps input index to sighash type
   */
  sighashTypes?: Record<number, number>;
}

export type SupportedNetwork = 'opcat-mainnet' | 'opcat-testnet';

export {};
