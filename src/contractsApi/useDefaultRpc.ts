import { getChainData } from '@/utils/tools';
import { useAppStore } from '@store/appStore';
import { useRoute } from 'vue-router';

export default function useDefaultRpc() {
  const appStore = useAppStore();
  const { ethers, signerValue } = appStore.ethersObj;

  let signer = signerValue;
  // 如果没有安装小狐狸，则使用预设rpc构建合约对象
  if (!window.ethereum) {
    const route = useRoute();
    const chainData = getChainData(route.meta?.needChains?.[0]);
    signer = new ethers.providers.JsonRpcProvider(chainData);
  }
  return signer;
}
