import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain, http } from 'viem';
import { baseSepolia, sepolia, arbitrumSepolia } from 'viem/chains';

export const customChain = defineChain({
  id: 688689,
  name: 'Custom Trading Chain',
  nativeCurrency: { name: 'Custom Token', symbol: 'PHRS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://atlantic.dplabs-internal.com'] },
    public:  { http: ['https://atlantic.dplabs-internal.com'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://atlantic.pharosscan.xyz' },
  },
});

export const citreaTestnet = defineChain({
  id: 5115,
  name: 'Citrea Testnet',
  nativeCurrency: { name: 'Citrea Bitcoin', symbol: 'cBTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.citrea.xyz'] },
    public: { http: ['https://rpc.testnet.citrea.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Citrea Explorer', url: 'https://explorer.testnet.citrea.xyz' },
  },
  testnet: true,
});

const baseSepoliaWithRpc = defineChain({
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: { http: ['https://sepolia.base.org'] },
  },
});

const arbitrumSepoliaWithRpc = defineChain({
  ...arbitrumSepolia,
  rpcUrls: {
    ...arbitrumSepolia.rpcUrls,
    default: { http: ['https://sepolia-rollup.arbitrum.io/rpc'] },
  },
});

const sepoliaWithRpc = defineChain({
  ...sepolia,
  rpcUrls: {
    ...sepolia.rpcUrls,
    default: { http: ['https://rpc.sepolia.org'] },
  },
});

export const config = getDefaultConfig({
  appName: 'Trading Dashboard',
  projectId: 'd599add7e84b45278fada8bf28c54ac7',
  chains: [customChain, baseSepoliaWithRpc, citreaTestnet, arbitrumSepoliaWithRpc, sepoliaWithRpc],
  transports: {
    [customChain.id]: http('https://atlantic.dplabs-internal.com'),
    [baseSepoliaWithRpc.id]: http('https://sepolia.base.org'),
    [citreaTestnet.id]: http('https://rpc.testnet.citrea.xyz'),
    [arbitrumSepoliaWithRpc.id]: http('https://sepolia-rollup.arbitrum.io/rpc'),
    [sepoliaWithRpc.id]: http('https://rpc.sepolia.org'),
  },
  ssr: false,
});
