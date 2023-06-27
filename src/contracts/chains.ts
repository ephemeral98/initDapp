import { isTest } from './address';

// 支持的链
export interface ISupportChains {
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

export const supportedChains: ISupportChains[] = [
  // 以太坊主网
  {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ankr.com/eth'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  // BSC主网
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
  },
  // BSC测试网
  {
    chainId: '0x61',
    chainName: 'Binance Smart Chain TEST',
    nativeCurrency: {
      name: 'TBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-2-s2.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
  },
  // Polygon主网
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
  },
  // Arbitrum Test
  {
    chainId: '0x66eed',
    chainName: 'Arbitrum Goerli Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://goerli.arbiscan.io/'],
  },
  // Arbitrum
  {
    chainId: '0xa4b1',
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ankr.com/arbitrum'],
    blockExplorerUrls: ['https://arbiscan.io/'],
  },
];

/**
 * 根据简称获取当前路由依赖的链
 * @param chain 依赖的链简称
 * @returns
 */
type IChain = 'bsc' | 'matic' | 'eth';

export function curNeedChain(chain: IChain[] = ['bsc']): string[] {
  const arr = [];
  // bsc
  if (chain.includes('bsc')) {
    if (isTest) {
      arr.push('0x61');
    } else {
      arr.push('0x38');
    }
  }

  // polygon
  if (chain.includes('matic')) {
    arr.push('0x89');
  }

  // eth
  if (chain.includes('eth')) {
    arr.push('0x1');
  }
  return arr;
}
