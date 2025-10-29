import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Custom chain definition for chain ID 688689
export const customChain = defineChain({
  id: 688689,
  name: 'Custom Trading Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'Custom Token',
    symbol: 'CTK',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.customchain.network'], // Replace with actual RPC URL
    },
    public: {
      http: ['https://rpc.customchain.network'], // Replace with actual RPC URL
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.customchain.network' },
  },
});

export const config = getDefaultConfig({
  appName: 'Trading Dashboard',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [customChain],
  ssr: false,
});
