import { clone } from '@/utils/tools';
import { ConnectionInfo } from 'ethers/lib/utils';

// 支持的链
export interface ISupportChains extends ConnectionInfo {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export const supportedChainsInfos: ISupportChains[] = [
  {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed1.ninicoin.io'],
    blockExplorerUrls: ['https://bscscan.com/'],
    url: 'https://bsc-dataseed1.ninicoin.io',
  },
  {
    chainId: '0x61',
    chainName: 'Binance Smart Chain TEST',
    nativeCurrency: {
      name: 'TBNB',
      symbol: 'TBNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s3.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
    url: 'https://data-seed-prebsc-1-s3.binance.org:8545',
  },
  {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'], // https://rpc-mainnet.matic.network
    blockExplorerUrls: ['https://polygonscan.com/'],
    url: '',
  },
];

// export const supportedUrls = supportedChainsInfos.map((item) => item.url);
export const supportedChains = supportedChainsInfos.reduce((acc, item) => {
  acc.push({
    chainId: item.chainId,
    chainName: item.chainName,
    nativeCurrency: {
      name: item.nativeCurrency.name,
      symbol: item.nativeCurrency.symbol,
      decimals: item.nativeCurrency.decimals,
    },
    rpcUrls: item.rpcUrls,
    blockExplorerUrls: item.blockExplorerUrls,
  });
  return acc;
}, []);

console.log('supportedChains..',supportedChains);
