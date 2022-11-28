import i18n from '@/locales/i18n';
import { supportedChains } from '@/contracts/chains';
const $t = i18n.global.t;

/**
 * 地址略写
 * @param {String} str 全地址
 * @param frontLen 前面多少颗星星
 * @param endLen 结尾多少个星星
 * @returns {String}
 */
export function plusXing(str: string, frontLen: number, endLen: number) {
  if (str?.length === undefined) return '';
  var len = str.length - frontLen - endLen;
  var xing = '';
  for (var i = 0; i < len; i++) {
    xing = '****';
  }
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
}

/**
 * 克隆
 * @param {*} obj 克隆的对象
 * @param {Boolean} deep 是否深度克隆
 * @returns
 */
export function clone(obj, deep: boolean) {
  if (Array.isArray(obj)) {
    //如果是数组
    if (deep) {
      let tempArr = [];
      obj.forEach((item) => {
        tempArr.push(clone(item, deep));
      });
      return tempArr;
    } else {
      return obj.slice(); //复制数组
    }
  } else if (typeof obj === 'object') {
    //如果是对象
    let newObj = {};
    for (const key in obj) {
      if (deep) {
        newObj[key] = clone(obj[key], deep);
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  } else {
    //如果是基本类型
    return obj;
  }
}

/**
 * 节流
 * @param callback 回调函数
 * @param duration 节流间隔时间
 */
export function bpThrottle(callback: (e) => void, duration: number = 70) {
  let throttleTimer;
  console.log('12222222');
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
 * 获取链的节点数据
 * @param chainId 链id
 * @returns
 */
export function getChainData(chainId) {
  if (!chainId) {
    return supportedChains[0];
  }
  return supportedChains.find((chain) => chain.chainId === chainId);
}

/**
 * 睡眠函数
 * @param gap 睡眠时常
 */
export function sleep(gap: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, gap);
  });
}
