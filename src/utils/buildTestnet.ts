export type IMode = 'devTest' | 'devMain' | 'buildTest' | 'buildMain' | 'childTest' | 'childMain';

/**
 * 设置网络(测试网/主网)
 * @param mode 模式
 * @param env 环境：true本地开发、false打包
 */
export function getEnv(mode) {
  const config = {
    contractEnv: true, // 合约环境：true测试网、false主网
    routerBase: './', // 路由基本路径
    viteBase: './', // 打包的基本路径
  };

  // 打包环境
  const BuildEnv = ['buildTest', 'buildMain', 'childTest', 'childMain'];

  if (BuildEnv.includes(mode)) {
    // 打包环境
    if (['childTest', 'childMain'].includes(mode)) {
      // 打包到子路径(根据模式名字 作为 子路径名字)
      config.routerBase = `/${mode}/`;
      config.viteBase = `/${mode}/`;
    } else {
      // 打包到根路径
    }
  } else {
    // 本地开发环境
  }

  if (['devTest', 'buildTest', 'childTest'].includes(mode)) {
    // 合约环境为测试网
  } else {
    config.contractEnv = false;
    // 合约环境为主网
  }
  return config;
}
