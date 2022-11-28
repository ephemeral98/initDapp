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
export function bpFormat(num, digits: number = 0, dec: number = 18): string {
  let digi = Math.abs(digits);

  // 没有值
  if (!num) {
    const res = 0;
    return digits ? res.toFixed(digi) : '0';
  }

  let res: any = ethers.utils.formatUnits(num, dec);
  if (digits < 0) {
    // 小数向下约
    res = bpFloor(res, digi, true);
  }
  return bpFixed(res, digi, true);
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
 * 将整数和小数分隔开
 */
interface IDiviDotRes {
  iNum: string; // 整数部分
  dNum: string; // 小数部分
}
function _diviDot(num: string): IDiviDotRes {
  const regDot = /\./g;
  const dotInx = regDot.exec(num)?.index;
  const iNum = num.slice(0, dotInx);
  let dNum = num.slice(dotInx);

  // 如果没有小数： .0000、

  return {
    iNum,
    dNum: dotInx ? dNum : '',
  };
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
  return baseFixed(num, dec, isFill, 'fixed');
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
  return baseFixed(num, dec, isFill, 'floor');
}

/**
 * 向上约n位
 * @param num 要约的数
 * @param dec 约几位
 * @param isFill 不足时是否填充0
 * @returns
 */
export function bpCeil(
  num: string | number | ethBigNumber,
  dec: number = 0,
  isFill: boolean = false
): string {
  return baseFixed(num, dec, isFill, 'ceil');
}

/**
 * 向上约、向下约、四舍五入、基础方法
 */
type IType = 'ceil' | 'floor' | 'fixed';
function baseFixed(
  num: string | number | ethBigNumber,
  dec: number = 0,
  isFill: boolean = false,
  type: IType
): string {
  // 克隆要约的数，变成字符串
  const cloneNum: string = _isValid(num) ? String(num) : '0';

  let result: string = '0';
  if (type === 'ceil') {
    result = math.bignumber(cloneNum).toFixed(dec, 2);
  } else if (type === 'floor') {
    result = math.bignumber(cloneNum).toFixed(dec, 3);
  } else if (type === 'fixed') {
    result = math.bignumber(cloneNum).toFixed(dec);
  }

  if (isFill) {
    // 填充0
    return result;
  }

  // 不填充0
  const { iNum, dNum } = _diviDot(result);

  if (!dNum || /^.0+$/.test(dNum)) {
    // 没有小数, 或者小数部分都为0
    return iNum;
  }

  // 将小数后面的0去掉
  const resDNum = dNum.replace(/0+/, '');
  // 整数和小数拼接
  return iNum + resDNum;
}

/**
 * 将数字转换为千分位表示
 * @param num 数字
 * @returns 123,456,78
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
