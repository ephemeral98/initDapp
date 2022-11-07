import { useAppStore } from '@/store/appStore';

/**
 * 监听地址栏的变化，该方法只能用一次（已在main.ts中调用）
 */
export default function watchUrl() {
  const appStore = useAppStore();

  const _wr = (type) => {
    const orig = history[type];
    return function () {
      const rv = orig.apply(this, arguments);
      const e: any = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };
  history.pushState = _wr('pushState');
  // history.replaceState = _wr('replaceState');
  /* window.addEventListener('replaceState', function (e) {
    console.log('THEY DID IT AGAIN! replaceState 111111');
  }); */

  function _handleTouchUrl() {
    appStore.setTouchUrl(appStore.touchUrl + 1);
  }

  window.addEventListener('pushState', _handleTouchUrl);
  window.addEventListener('popstate', _handleTouchUrl);
}
