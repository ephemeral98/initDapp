import { create, all, BigNumber, MathJsChain } from 'mathjs';
import { ethers, BigNumber as ethBigNumber } from 'ethers';
const parseUnits = ethers.utils.parseUnits;
type NumStr = number | string;
type BigNumStr = NumStr | ethBigNumber;

export interface IResType {
  hex?: boolean;
  digits?: number;
}

const config = {
  epsilon: 1e-12,
  matrix: 'Matrix' as any, // 函数的默认矩阵输出类型。
  number: 'BigNumber' as any, // BigNumbers比 JavaScript 的默认数字具有更高的精度
  precision: 64, // BigNumbers 的最大有效数字位数。此设置仅适用于 BigNumber，不适用于数字。
  predictable: false, // 可预测的输出类型函数。当为真时，输出类型仅取决于输入类型。当为 false（默认）时，输出类型可能因输入值而异。
  randomSeed: null, // 设置为null使用随机种子为伪随机数生成器提供种子。
};
const math = create(all, config);

interface IParams {
  hex?: boolean; // 是否转为ethers的 16进制的bigNumber
  deci?: number; // 保留n位小数
}

/**
 * 乘法使用栗子：
 *
 * 一般展示用：
 * bpMul(3, 2) --> 6
 *
 * 如果想带保持3位小数
 * bpMul(3, 2, { deci: 3 }) --> 6.000
 *
 * 带精度入参用：
 * bpMul(3, 10 ** 18, { hex: true }) --> 0x53444835ec580000
 * 出来是默认带有18精度的bigNumber
 */

/**
 * 基本算法
 * @param funcName 算法名字（加减乘除）
 * @param params
 * @returns
 */
function bpBaseCalc(
  funcName: string,
  ...params: [...BigNumStr[], IParams | BigNumStr]
): string | ethBigNumber {
  const resTypeConfig: IParams = params[params.length - 1] as any;

  let deci = 0;
  let hex = false;
  let resArr = params as number[];

  if (
    typeof resTypeConfig === 'object' &&
    (Object.keys(resTypeConfig).includes('hex') || Object.keys(resTypeConfig).includes('deci'))
  ) {
    // 写了配置项
    hex = resTypeConfig.hex ?? hex;
    deci = resTypeConfig.deci ?? deci;
    resArr = params.filter((item, inx) => inx !== params.length - 1) as number[];
  }
  const preci = Math.abs(deci);
  // 映射为bigNumber数组
  const cloneParams = resArr.map((item) => (item ? math.bignumber(String(item)) : 0));

  let bigNum = math.chain(math[funcName](cloneParams[0], cloneParams[1]));

  // bigNumber累加
  if (cloneParams.length > 2) {
    for (let i = 2, len = resArr.length; i < len; i++) {
      bigNum = bigNum[funcName](String(resArr[i])) as MathJsChain<0 | BigNumber>;
    }
  }

  let result: string | ethBigNumber = math.format(bigNum.done(), {
    notation: 'fixed',
    precision: deci > 0 ? preci : 0,
  });

  // 除数为0则返回0
  if (+result === Infinity || math.isNaN(+result)) result = '0';

  if (deci < 0) {
    // 小数向下约
    result = String(bpFloor(result, preci, true));
  }

  if (hex) {
    result = ethers.utils.parseUnits(result, preci ?? 18);
  }

  return result;
}

/**
 * 加法
 * @param params n 个数
 * @param hex 是否转为16进制的bigNumber(一般是带精度入参数用)
 * @param deci 精度(如果是16进制，则为ethers的精度，如果是10进制则约为几位小数)
 * 如果 deci 为负数，则表示 小数往下约，否则默认四舍五入
 * @returns
 */
export function bpAdd(...params: [...BigNumStr[], IParams | BigNumStr]): string | ethBigNumber {
  return bpBaseCalc('add', ...params);
}

/**
 * 减法
 * @param params n 个数
 * @param hex 是否转为16进制的bigNumber(一般是带精度入参数用)
 * @param deci 精度(如果是16进制，则为ethers的精度，如果是10进制则约为几位小数)
 * 如果 deci 为负数，则表示 小数往下约，否则默认四舍五入
 * @returns
 */
export function bpSub(...params: [...BigNumStr[], IParams | BigNumStr]): string | ethBigNumber {
  return bpBaseCalc('subtract', ...params);
}

/**
 * 乘法
 * @param params n 个数
 * @param hex 是否转为16进制的bigNumber(一般是带精度入参数用)
 * @param deci 精度(如果是16进制，则为ethers的精度，如果是10进制则约为几位小数)
 * 如果 deci 为负数，则表示 小数往下约，否则默认四舍五入
 * @returns
 */
export function bpMul(...params: [...BigNumStr[], IParams | BigNumStr]): string | ethBigNumber {
  return bpBaseCalc('multiply', ...params);
}

/**
 * 除法
 * @param params n 个数
 * @param hex 是否转为16进制的bigNumber(一般是带精度入参数用)
 * @param deci 精度(如果是16进制，则为ethers的精度，如果是10进制则约为几位小数)
 * 如果 deci 为负数，则表示 小数往下约，否则默认四舍五入
 * @returns
 */
export function bpDiv(...params: [...BigNumStr[], IParams | BigNumStr]): string | ethBigNumber {
  return bpBaseCalc('divide', ...params);
}

/**
 * 比较两个数的大小, a 是否小于 b
 */
export function bpLt(a: BigNumStr, b: BigNumStr): boolean {
  let num1 = a ? parseUnits(String(a)) : parseUnits('0');
  let num2 = b ? parseUnits(String(b)) : parseUnits('0');
  return num1.lt(num2);
}

/**
 * 比较两个数的大小, a 是否小于等于 b
 */
export function bpLte(a: BigNumStr, b: BigNumStr): boolean {
  let num1 = a ? parseUnits(String(a)) : parseUnits('0');
  let num2 = b ? parseUnits(String(b)) : parseUnits('0');
  return num1.lte(num2);
}

/**
 * 比较两个数的大小, a 是否大于 b
 */
export function bpGt(a: BigNumStr, b: BigNumStr): boolean {
  let num1 = a ? parseUnits(String(a)) : parseUnits('0');
  let num2 = b ? parseUnits(String(b)) : parseUnits('0');
  return num1.gt(num2);
}

/**
 * 比较两个数的大小, a 是否大于等于 b
 */
export function bpGte(a: BigNumStr, b: BigNumStr): boolean {
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
    res = bpFloor(res, digi, true);
  }
  return digits ? (+res).toFixed(digi) : (+res).toFixed();
}

/**
 * 判断是否位非法数
 */
function _isValid(num: string | number | ethBigNumber): boolean {
  let status = true;
  // 非数
  if (math.isNaN(+num) || num === null) {
    status = false;
  }
  // 16进制不支持
  if (String(num).startsWith('0x')) {
    status = false;
  }
  if (!status) {
    console.log('数字不合法:', num);
  }
  return status;
}

/**
 * 填充0
 * @param len 填充长度
 */
function _fillZero(len: number) {
  let c = '';
  for (let i = 0; i < len; i++) {
    c += '0';
  }
  return c;
}

/**
 * 向下约n位
 * @param num 要约的数
 * @param dec 约几位
 * @param isFill 不足时是否填充0
 * @returns
 */
export function bpFloor(
  num: string | number | ethBigNumber,
  dec: number = 0,
  isFill: boolean = false
): string {
  // 克隆要约的数，变成字符串
  const cloneNum: string = _isValid(num) ? String(num) : '0';

  const regDot = /\./g;
  let appearTimes;
  let count = 0; // 匹配小数点出现次数
  while ((appearTimes = regDot.exec(cloneNum))) {
    count++;
  }

  // 值是整数
  if (count === 0) {
    // 填充0
    if (isFill) {
      const zeros = _fillZero(dec);
      return cloneNum + '.' + zeros;
    }

    return cloneNum;
  }

  const inx = regDot.exec(cloneNum).index;
  const resNum = cloneNum.slice(0, inx + dec + 1);

  const decLen = cloneNum.slice(inx + 1);
  if (decLen.length < dec) {
    if (isFill) {
      // 不足补0
      const zeros = _fillZero(dec - decLen.length);
      return cloneNum + zeros;
    }

    return cloneNum;
  }

  return resNum;
}

/**
 * 将数字进行四舍五入
 * @param num 要约的数 (只能是10进制的字符串或者数字)
 * @param dec 要约的精度（小数点后几位）
 * @param isFill 不足是否填充0
 * @returns
 */
export function bpFixed(
  num: string | number | ethBigNumber,
  dec: number = 0,
  isFill: boolean = false
): string {
  // 克隆要约的数，变成字符串
  const cloneNum: string = _isValid(num) ? String(num) : '0';

  const regDot = /\./g;
  let appearTimes;
  let count = 0; // 匹配小数点出现次数
  while ((appearTimes = regDot.exec(cloneNum))) {
    count++;
  }

  let isFirst = true; // 判断首次进来的 锁

  /**
   * 字符串挨个判断
   * @param str 字符串被打散成的数组 (会修改原数组)
   * @param i 索引
   * @returns
   */
  function _upGrade(str: string[], i: number): string[] {
    if (str[i + 1] === undefined && isFirst) {
      if (+str[i] >= 5) {
        // 用a标记，已约的数
        str[i] = 'a';
        // 继续往前挪，继续判断
        _upGrade(str, i - 1);
      }
    } else if (str[i + 1] === 'a') {
      // 如果后一项是已经约掉的数，如果当前项还是9的话，则往前进一
      if (+str[i] === 9) {
        str[i] = 'a';
        // 继续往前挪，继续判断
        _upGrade(str, i - 1);
      } else {
        str[i] = String(+str[i] + 1);
        // str[i] = bpAdd(str[i], 1); // 这里是一个一个的转，不会精度溢出，没必要bpAdd
      }
    }

    // 记住首次进来的时候
    isFirst = false;

    return str;
  }

  // 匹配小数点的索引位
  const dotInx = regDot.exec(cloneNum)?.index;
  // 获取 要匹配的小数点的 索引位置 的多一位 (最后一位为标记位)
  const patchMoreOne = cloneNum.slice(dotInx + 1).slice(0, dec + 1);

  // 整数 (没有小数点)
  if (count === 0) {
    if (isFill) {
      const zeros = _fillZero(dec);
      return cloneNum + '.' + zeros;
    } else {
      return cloneNum;
    }
  }

  // 不够约
  if (patchMoreOne.length <= dec) {
    if (isFill) {
      // 填充0
      const len = dec - patchMoreOne.length;
      const zeros = _fillZero(len);
      return cloneNum + zeros;
    } else {
      return cloneNum;
    }
  }

  // 匹配整数部分
  const positiveInt = cloneNum.slice(0, dotInx);

  // 匹配正数部分打散成数组
  const patchMoreOneArr = patchMoreOne.split('');

  _upGrade(patchMoreOneArr, patchMoreOne.length - 1);

  // 去掉最后一位标记位
  patchMoreOneArr.pop();

  // 判断是否所有都是已经约掉的数
  const allZero = patchMoreOneArr.every((item) => item === 'a');

  // 将所有标记转成0
  const replaceA = /a/g;
  const temp = patchMoreOneArr.join('');
  const res = temp.replace(replaceA, '0');

  const resPositiveInt = allZero ? bpAdd(positiveInt, 1) : positiveInt;

  return resPositiveInt + '.' + res;
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
