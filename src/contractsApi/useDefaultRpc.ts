import { getChainData } from '@/utils/tools';
import { useAppStore } from '@store/appStore';
import { toRaw } from 'vue';
import { useRouteItem } from '@/router/useRouterTools';

/**
 * 是否启用预设好的rpc生成signer
 * @returns signer
 */
export default function useDefaultRpc() {
  const appStore = useAppStore();
  const routeItem = useRouteItem();
  const { ethers, signerValue } = appStore.ethersObj;

  let signer = toRaw(signerValue);
  // 如果没有安装小狐狸，或者没有登录钱包，或者用了不对的链，则使用预设rpc构建合约对象
  if (!appStore.defaultAccount || !appStore.rightChain) {
    const chainData = getChainData(routeItem?.meta?.needChains?.[0]);
    signer = new ethers.providers.JsonRpcProvider(chainData?.rpcUrls?.[0]);
  }
  return signer;
}
