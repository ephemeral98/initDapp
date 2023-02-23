/**
 * 节流
 * @param callback 回调函数
 * @param duration 节流间隔时间
 * eg: bpThrottle(() => {})
 */
export function bpThrottle(callback: (e) => void, duration: number = 70) {
  let throttleTimer;
  return (e) => {
    if (throttleTimer) return;

    throttleTimer = setTimeout(() => {
      callback(e);
      throttleTimer = null;
    }, duration);
  };
}

/**
 * 防抖
 * @param callback 回调函数
 * @param duration 防抖间隔时间
 * eg: bpDebounce(() => {})
 *
 */
export function bpDebounce(callback: (e) => void, duration: number = 70) {
  let debounceTimer;
  return (e) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      callback(e);
      debounceTimer = null;
    }, duration);
  };
}

/**
 * 输入框防抖
 * @param value 值
 * @param delay 延迟时间(毫秒)
 *
 * eg: const text = debounceRef('');
 *      <input v-model="text">
 */
export const debounceRef = (value, delay: number = 700) => {
  return customRef((track, trigger) => {
    let timer = null;

    return {
      get() {
        // 依赖收集
        track();
        return value;
      },

      set(val) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          // 派发更新
          value = val;
          trigger();
        }, delay);
      },
    };
  });
};
