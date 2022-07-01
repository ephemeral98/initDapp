import { useAppStore } from '../store/appStore';
import { ElMessage } from 'element-plus';
import i18n from '@/locales/i18n';
const $t = i18n.global.t;

/**
 * 检查是否账户或者链正确
 */
export function checkRightChain(to, from) {
  const appStore = useAppStore();
  // 匹配路由中 meta 的依赖项，如果当前链不在meta依赖项中，则链不对
  const { chainId } = appStore.ethersObj;
  const inclu = to.meta.needChains?.includes(chainId);
  debugger
  if (!inclu && to.meta?.needChains !== undefined) {
    appStore.setrightChain(false);
  } else {
    debugger
    appStore.setrightChain(true);
  }

  // 如果链不对，弹窗切链 or 提示
  if (!inclu && to.meta?.needChains !== undefined && to.meta?.needTips) {
    ElMessage.error($t('msg.6'));
  }
}
