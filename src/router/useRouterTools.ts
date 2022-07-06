// 这里是为了解决 在router-view外部，获取不了路由hook。
import router from '@/router';
import { RouteRecordRaw } from 'vue-router';

/**
 * 获取当前路由项
 * @returns 
 */
export function useRouteItem(): RouteRecordRaw {
  // const routerInfo = router.getRoutes();
  // 获取当前地址栏路由
  const curRouterPath = router.options?.history?.state?.current;

  // 获取所有路由信息
  const allRouter = router?.options?.routes;

  // 当前路由项
  const curRouteItem = allRouter.find((item) => item.path === curRouterPath);

  return curRouteItem;
}
