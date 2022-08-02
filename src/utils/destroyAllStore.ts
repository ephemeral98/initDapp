/**
 * 销毁store目录，contractStore目录下 一些仓库,
 *  (只销毁默认导出的store) (只销毁以xxxStore命名的store)
 */
export default function destroyAllStore() {
  // store目录
  const storeFiles = require.context('../store', true, /\S*Store.(ts$|js$)/);

  /**
   * 帮助销毁
   * @param {*} modulesFiles 文件的默认导出
   */
  function _helpDestroy(modulesFiles) {
    const stores = modulesFiles.keys().reduce((modules, modulePath) => {
      const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
      const value = modulesFiles(modulePath);
      modules[moduleName] = value.default;
      return modules;
    }, {});

    for (const storeName in stores) {
      if (Object.hasOwnProperty.call(stores, storeName)) {
        const store = stores[storeName];
        store?.()?.$reset?.();
      }
    }
  }

  _helpDestroy(storeFiles);
}
