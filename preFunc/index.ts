import i18n from '@/locales/i18n';

/**
 * full：整体替换
 * @param param
 * @returns
 */
export function $f(param: string): string {
  return param;
}

/**
 * 局部模板替换
 * @param param
 * @returns
 */
export function $p(param: string): string {
  return param;
}

/**
 * 局部模板替换
 * @param param
 * @returns
 */
export function $t(param: string): string {
  return i18n.global.t(param);
}
