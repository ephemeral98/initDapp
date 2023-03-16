import { useAppStore } from '../store/appStore';
import i18n from '@/locales/i18n';
import { useRouteItem } from './useRouterTools';
const $t = i18n.global.t;
import { nextTick } from 'vue';

/**
 * 检查是否账户或者链正确
 */
export function checkRightChain(to?, from?) {
  const curRouteItem = useRouteItem();
  const targetRoute = to || curRouteItem;

  const appStore = useAppStore();
  // 匹配路由中 meta 的依赖项，如果当前链不在meta依赖项中，则链不对
  const { chainId } = appStore.ethersObj;
  const inclu = targetRoute.meta?.needChains?.includes(chainId);
  if (!inclu && targetRoute.meta?.needChains !== undefined) {
    appStore.setRightChain(false);
    return false;
  } else {
    appStore.setRightChain(true);
    return true;
  }
}

/**
 * 处理切换
 */
export function handleSwitchChain() {
  const rightChain = checkRightChain();
  const appStore = useAppStore();
  const curRouteItem = useRouteItem();

  // 首次加载的时候，这里 rightChain 肯定是 false的，因为此时的chainid还没有拿到
  // 当进入了switchChain这个方法里面的_handleChange方法之后，chainid就对了
  if (!rightChain) {
    nextTick(() => {
      // 这里就不弹出提示了，不然会跳出很多个message，因为有3处执行了，由于执行的时机不同。如果实在需要提示，可以在watchAccount那传入一个参数作为判断，
      // ElMessage.error($t('router.1'));
      appStore.switchChain(curRouteItem.meta?.needChains[0]);
    });
  }
}
