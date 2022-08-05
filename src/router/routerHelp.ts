import { useAppStore } from '../store/appStore';
import { ElMessage } from 'element-plus';
import i18n from '@/locales/i18n';
import { useRouteItem } from './useRouterTools';
const $t = i18n.global.t;
import { nextTick } from 'vue';

/**
 * 检查是否账户或者链正确
 */
export function checkRightChain(to, from) {
  const curRouteItem = useRouteItem();
  const targetRoute = to || curRouteItem;

  const appStore = useAppStore();
  // 匹配路由中 meta 的依赖项，如果当前链不在meta依赖项中，则链不对
  const { chainId } = appStore.ethersObj;
  const inclu = targetRoute.meta.needChains?.includes(chainId);
  if (!inclu && targetRoute.meta?.needChains !== undefined) {
    appStore.setRightChain(false);
  } else {
    appStore.setRightChain(true);
  }

  // 如果链不对，弹窗切链 or 提示
  if (!inclu && targetRoute.meta?.needChains !== undefined && targetRoute.meta?.needTips) {
    ElMessage.error($t('msg.6'));

    nextTick(() => {
      appStore.switchChain(targetRoute.meta?.needChains[0]);
    });
  }
}
