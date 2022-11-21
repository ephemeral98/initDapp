/**
 * 节流滚动
 * @param callback
 * @param duration 节流延迟
 * @param el 注册的元素，默认window
 */
export const useScrollThrottle = (
  callback: () => void,
  duration: number = 100,
  el?: HTMLElement
) => {
  const target = el || window;
  let throttleTimer;

  const help = () => {
    if (throttleTimer) return;

    throttleTimer = setTimeout(() => {
      callback();
      throttleTimer = null;
    }, duration);
  };

  onMounted(() => {
    target.addEventListener('scroll', help);
  });

  onBeforeUnmount(() => {
    target.removeEventListener('scroll', help);
  });
};

/**
 * 是否滚动到底部
 * @param callback
 * @param duration 节流延迟
 */
export const useScrollBottom = (
  callback: () => void,
  offset: number = 100,
  duration: number = 100
) => {
  const lock = ref(false);

  useScrollThrottle(() => {
    const cHeight = document.documentElement.clientHeight;
    const top = document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight;

    const bottomCondition = top + cHeight > h - offset; // 到底的范围条件
    if (bottomCondition && !lock.value) {
      // 到底了
      callback();
      lock.value = true;
    }

    if (!bottomCondition) {
      lock.value = false; // 出去就解锁
    }
  }, duration);
};
