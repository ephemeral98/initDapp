// 这里是为了解决 在router-view外部，获取不了路由hook。
import router from '@/router';
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
  const curRouterPath = router.options?.history?.state?.current;

  // 获取所有路由信息
  const allRouter = router?.options?.routes;

  // 当前路由项
  const curRouteItem = allRouter.find((item) => item.path === curRouterPath);

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
