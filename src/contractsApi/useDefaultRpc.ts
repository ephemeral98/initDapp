import { getChainInfoData } from '@/utils/tools';
import { useAppStore } from '@store/appStore';
import { toRaw } from 'vue';
import { useRouteItem } from '@/router/useRouterTools';

export default function useDefaultRpc() {
  const appStore = useAppStore();
  const { ethers, signerValue } = appStore.ethersObj;

  const routeItem = useRouteItem();

  let signer = toRaw(signerValue);
  // 如果没有安装小狐狸，或者没有登录钱包，或者用了不对的链，则使用预设rpc构建合约对象
  if (!appStore.defaultAccount || !appStore.rightChain) {
    const chainData = getChainInfoData(routeItem.meta?.needChains?.[0]);
    signer = new ethers.providers.JsonRpcProvider(chainData);
  }
  return signer;
}
