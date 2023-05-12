import { supportedChains } from '@/contracts/chains';

/**
 * 获取随机数
 * @param min 最小值
 * @param max 最大值
 */
export function getRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 地址略写
 * @param str 全地址
 * @param frontLen 前面多少颗星星
 * @param endLen 结尾多少个星星
 */
export function plusStar(str: string, frontLen: number, endLen: number) {
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

/**
 * 判断该错误是不是点击钱包的拒绝引起
 * @param error catch到的错误
 * @returns true:是点击了拒绝引起，false:其他引起的错误
 */
export function getWalletReject(error): boolean {
  let info =
    error?.['reason'] || error?.data?.message || error?.error?.message || error?.message || error;
  // 错误消息中包含这些字眼的都算点击了拒绝
  let errorKeyTag = ['User denied', 'rejected'];
  let res = !!errorKeyTag.filter((it) => info?.includes?.(it)).length;
  return error === 'cancel' || res;
}

/**
 * 获取图片资源
 * @param name
 * @returns
 */
export function getImage(name: string) {
  return new URL(`../assets/img/${name}`, import.meta.url).href;
}
