/**
 * 是否要打包到测试网(生成子路径)
 */
export function buildTestnet(mode) {
  // 是否要打包到测试网(生成子路径)
  const notTestnetArrs = ['development', 'production'];
  const notTestnet = notTestnetArrs.find((item) => item === mode);
  const baseUrl = notTestnet ? './' : `/${mode}/`;
  return baseUrl;
}
