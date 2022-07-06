import { getChainInfoData } from '@/utils/tools';
import { useAppStore } from '@store/appStore';
import { toRaw } from 'vue';
import { useRoute } from 'vue-router';

export default function useDefaultRpc() {
  const appStore = useAppStore();
  const { ethers, signerValue } = appStore.ethersObj;

  let signer = toRaw(signerValue);

  // 如果没有安装小狐狸，或者用了不对的链，则使用预设rpc构建合约对象
  if (!window.ethereum || !appStore.rightChain) {
    const route = useRoute();
    const chainData = getChainInfoData(route.meta?.needChains?.[0]);
    signer = new ethers.providers.JsonRpcProvider(chainData);
  }
  return signer;
}
