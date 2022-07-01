import { create, all, number } from 'mathjs';
import { ethers } from 'ethers';
const parseUnits = ethers.utils.parseUnits;
type NumStr = number | string;

const config = {
  epsilon: 1e-12,
  matrix: 'Matrix' as any, // 函数的默认矩阵输出类型。
  number: 'BigNumber' as any, // BigNumbers比 JavaScript 的默认数字具有更高的精度
  precision: 64, // BigNumbers 的最大有效数字位数。此设置仅适用于 BigNumber，不适用于数字。
  predictable: false, // 可预测的输出类型函数。当为真时，输出类型仅取决于输入类型。当为 false（默认）时，输出类型可能因输入值而异。
  randomSeed: null, // 设置为null使用随机种子为伪随机数生成器提供种子。
};
const math = create(all, config);

/**
 * 乘法使用栗子：
 *
 * 一般展示用：
 * bpMul(3, 2) --> 6
 * 可防止精度丢失
 *
 * 如果想带保持3位小数
 * bpMul(3, 2, false, 3) --> 6.000
 *
 * 一般入参用：
 * bpMul(3, 10 ** 18, true) --> 0x53444835ec580000
 * 出来是默认带有18精度的bigNumber
 */

/**
 * 加法
 * @param a 数1
 * @param b 数2
 * @param hex 是否转为16进制的bigNumber(一般是带精度入参数用)
 * @param digits 精度(如果是16进制，则为ethers的精度，如果是10进制则约为几位小数)
 * 如果 digits 为负数，则表示 小数往下约，否则默认四舍五入
 * @returns
 */
export function bpAdd(a: NumStr, b: NumStr, hex: boolean = false, digits = 0) {
  let deci = Math.abs(digits);
  let num1 = a ? math.bignumber(String(a)) : 0;
  let num2 = b ? math.bignumber(String(b)) : 0; // bignumber 保证计算精度 format 返回计算的数字表示法
  let res: any = math.format(math.chain(math.add(num1, num2)).done(), {
    notation: 'fixed',
    precision: digits < 0 ? deci + 1 : deci,
  });

  if (digits < 0) {
    // 小数向下约
    res = fixFloor(res, deci);
  }

  if (hex) {
    res = ethers.utils.parseUnits(res, deci || 18);
  }
  return res;
}

/**
 * 减法
 * @param a 被减数
 * @param b 减数
 * @param hex 是否转为16进制的bigNumber(一般是带精度入参数用)
 * @param digits 精度(如果是16进制，则为ethers的精度，如果是10进制则约为几位小数)
 * 如果 digits 为负数，则表示 小数往下约，否则默认四舍五入
 * @returns
 */
export function bpSub(a: NumStr, b: NumStr, hex: boolean = false, digits = 0) {
  let deci = Math.abs(digits);
  let num1 = a ? math.bignumber(String(a)) : 0;
  let num2 = b ? math.bignumber(String(b)) : 0; // bignumber 保证计算精度 format 返回计算的数字表示法
  let res: any = math.format(math.chain(math.subtract(num1, num2)).done(), {
    notation: 'fixed',
    precision: digits < 0 ? deci + 1 : deci,
  });

  if (digits < 0) {
    // 小数向下约
    res = fixFloor(res, deci);
  }

  if (hex) {
    res = ethers.utils.parseUnits(res, deci || 18);
  }
  return res;
}

/**
 * 乘法
 * @param a 数1
 * @param b 数2
 * @param hex 是否转为16进制的bigNumber(一般是带精度入参数用)
 * @param digits 精度(如果是16进制，则为ethers的精度，如果是10进制则约为几位小数)
 * 如果 digits 为负数，则表示 小数往下约，否则默认四舍五入
 * bpMul(3, 10 ** 18)
 * @returns
 */
export function bpMul(a: NumStr, b: NumStr, hex: boolean = false, digits = 0) {
  let deci = Math.abs(digits);
  let num1 = a ? math.bignumber(String(a)) : 0;
  let num2 = b ? math.bignumber(String(b)) : 0; // bignumber 保证计算精度 format 返回计算的数字表示法
  let res: any = math.format(math.chain(math.multiply(num1, num2)).done(), {
    notation: 'fixed',
    precision: digits < 0 ? deci + 1 : deci,
  });

  if (digits < 0) {
    // 小数向下约
    res = fixFloor(res, deci);
  }

  if (hex) {
    res = ethers.utils.parseUnits(res, 0);
  }
  return res;
}

/**
 * 除法
 * @param a 被除数
 * @param b 除数
 * @param hex 是否转为16进制的bigNumber(一般是带精度入参数用)
 * @param digits 精度(如果是16进制，则为ethers的精度，如果是10进制则约为几位小数)
 * 如果 digits 为负数，则表示 小数往下约，否则默认四舍五入
 * @returns
 */
export function bpDiv(a: NumStr, b: NumStr, hex: boolean = false, digits = 0) {
  let deci = Math.abs(digits);
  let num1 = a ? math.bignumber(String(a)) : 0;
  let num2 = b ? math.bignumber(String(b)) : 0; // bignumber 保证计算精度 format 返回计算的数字表示法
  let res: any = math.format(math.chain(math.divide(num1, num2)).done(), {
    notation: 'fixed',
    precision: digits < 0 ? deci + 1 : deci,
  });

  if (digits < 0) {
    // 小数向下约
    res = fixFloor(res, deci);
  }

  if (hex) {
    res = ethers.utils.parseUnits(res, deci || 18);
  }
  return res;
}

/**
 * 比较两个数的大小, a 是否小于 b
 */
export function bpLt(a: NumStr, b: NumStr): boolean {
  let num1 = a ? parseUnits(String(a)) : parseUnits('0');
  let num2 = b ? parseUnits(String(b)) : parseUnits('0');
  return num1.lt(num2);
}

/**
 * 比较两个数的大小, a 是否小于等于 b
 */
export function bpLte(a: NumStr, b: NumStr): boolean {
  let num1 = a ? parseUnits(String(a)) : parseUnits('0');
  let num2 = b ? parseUnits(String(b)) : parseUnits('0');
  return num1.lte(num2);
}

/**
 * 比较两个数的大小, a 是否大于 b
 */
export function bpGt(a: NumStr, b: NumStr): boolean {
  let num1 = a ? parseUnits(String(a)) : parseUnits('0');
  let num2 = b ? parseUnits(String(b)) : parseUnits('0');
  return num1.gt(num2);
}

/**
 * 比较两个数的大小, a 是否大于等于 b
 */
export function bpGte(a: NumStr, b: NumStr): boolean {
  let num1 = a ? parseUnits(String(a)) : parseUnits('0');
  let num2 = b ? parseUnits(String(b)) : parseUnits('0');
  return num1.gte(num2);
}

/**
 * 将普通字符串转为16进制的bigNumber
 * @param num 要转的数
 * @param dec 精度
 */
export function bpEthHex(num, dec = 18) {
  const resp = ethers.utils.parseUnits(String(num), dec);
  return resp;
}

/**
 * 将ethers的16进制bigNumber转为String
 * @param num 要转的数
 * @param digits 保留n位小数
 * 如果 digits 为负数，则表示 小数往下约，否则默认四舍五入
 * @param dec 精度
 */
export function bpFormat(num, digits = 0, dec = 18): string {
  // 没有值
  if (!num) {
    const res = 0;
    return digits ? res.toFixed(digits) : '0';
  }

  let digi = Math.abs(digits);
  let res: any = ethers.utils.formatUnits(num, dec);
  if (digits < 0) {
    // 小数向下约
    res = fixFloor(res, digi);
  }
  return digits ? (+res).toFixed(digi) : res;
}

/**
 * 向下保留几位小数
 * @param num 要保留的数
 * @param dec 保留的位数
 * eg: 保留4位小数 fixFloor(3.141599, 4)  -->  3.1415
 */
export function fixFloor(num: string | number, dec: number = 0): number {
  let count = '1';
  for (let i = 0, len = dec; i < len; i++) {
    count += '0';
  }
  return Math.floor(+num * +count) / +count;
}

/**
 * 将数字转换为千分位表示
 * @param {Number} num 数字
 * @returns {String} 123,456,78
 */
export function toThousands(num) {
  //处理非数字
  if (isNaN(num)) {
    return 0;
  }

  var res = num.toString().replace(/\d+/, function (n) {
    // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ',';
    });
  });
  return res;
}
