// 这里是为了解决 在router-view外部，获取不了路由hook。
import router from '@/router';
import { useAppStore } from '@/store/appStore';
import { Ref } from 'vue-demi';
import { RouteRecordRaw } from 'vue-router';

/**
 * 路由额外参数
 */
type IExtraParam = {
  query: Object;
};

type ICurRoute = IExtraParam & RouteRecordRaw;

/**
 * 获取当前路由项
 * @returns
 */
export function useRouteItem(): ICurRoute {
  // const routerInfo = router.getRoutes();
  // 获取当前地址栏路由
  let curRouterPath = String(router.options?.history?.state?.current);
  curRouterPath = curRouterPath?.replace?.(/\?\S*/, '');

  const pathArrs = curRouterPath.split('/').filter((item) => item);

  // 获取所有路由信息
  const allRouter = router?.options?.routes;

  // 优先寻找首页，匹配首页的子路由
  const homePage = allRouter.find((item) => item.path === '/');

  // 当前路径
  const curPath = pathArrs[pathArrs.length - 1];

  // 寻找叶子节点
  function _findLeaves(name: string, aLeave) {
    const p = aLeave?.path?.split('/');
    if (name === p?.[p?.length - 1]) {
      return aLeave;
    }

    for (let i = 0, len = aLeave?.children?.length; i < len; i++) {
      const itemLeave = aLeave.children[i];
      const resp = _findLeaves(name, itemLeave);
      if (resp) {
        return resp;
      }
    }
  }

  let atHomePage, atOtherPage;
  for (let i = 0, len = homePage?.children?.length; i < len; i++) {
    const child = homePage.children[i];
    // 该路由在首页
    atHomePage = _findLeaves(curPath, child);
  }

  if (!atHomePage) {
    // 不在首页，则在其他路由上
    const otherPath = allRouter.find((item) => {
      const itemPath = item?.path?.split('/').filter((item) => item);
      return pathArrs?.[0] === itemPath[0];
    });
    atOtherPage = _findLeaves(curPath, otherPath);
  }

  // 当前路由项
  const curRouteItem = atHomePage || atOtherPage;

  // 获取路由query
  const curRouteQuery = _queryURLparams(window.location.href);

  return {
    ...curRouteItem,
    query: curRouteQuery,
  };
}

/**
 * 获取当前路由项的 meta信息
 * @returns
 */
export function useRouteMeta() {
  const routeItem = useRouteItem();
  return routeItem?.meta;
}

/**
 * 获取当前路由的 query 项
 * @returns
 */
export function useRouteQuery() {
  const routeItem = useRouteItem();
  return routeItem?.query;
}

/**
 * 获取响应式路由项，需要去main.ts下开启 watchUrl 才生效
 * 注意使用的时候不要解构出去
 * eg: const route = useRouteItemRef();
 */
export function useRouteItemRef(): Ref<ICurRoute> {
  const routeItem = ref({}) as Ref<ICurRoute>;
  watch(
    () => useAppStore().touchUrl,
    () => {
      routeItem.value = useRouteItem();
    },
    { immediate: true }
  );

  return routeItem;
}

/**
 * 解析地址栏信息
 * @param url 地址栏
 * @returns
 */
function _queryURLparams(url) {
  let obj = {};
  if (url.indexOf('?') < 0) return obj;
  let arr = url.split('?');
  url = arr[1];
  let array = url.split('&');
  for (let i = 0; i < array.length; i++) {
    let arr2 = array[i];
    let arr3 = arr2.split('=');
    obj[arr3[0]] = arr3[1];
  }
  return obj;
}
