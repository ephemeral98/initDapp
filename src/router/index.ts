import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router';
import { useAppStore } from '@/store/appStore';
import { handleSwitchChain } from './routerHelp';
import { curNeedChain } from '@/contracts/chains';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/TestPage',
    name: 'testPage',
    component: () => import(/* webpackChunkName: "testPage" */ '@/views/TestPage/TestStore.vue'),
    meta: {
      requireAccount: true, // 依赖钱包
      needChains: curNeedChain(['bsc']), // 依赖的链
      needTips: true, // 链不对的时候，需不需要提示
    },
  },

  {
    path: '/TestSwiper',
    name: 'testSwiper',
    component: () => import(/* webpackChunkName: "testSwiper" */ '@/views/TestPage/TestSwiper.vue'),
    meta: {
      requireAccount: true, // 依赖钱包
      needChains: curNeedChain(['bsc']), // 依赖的链
      needTips: true, // 链不对的时候，需不需要提示
    },
  },

  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home/index.vue'),
    meta: {
      requireAccount: true,
      needChains: curNeedChain(['bsc']), // 依赖的链
      needTips: true, // 链不对的时候，需不需要提示
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // 每次进来，先拿一下钱包
    const appStore = useAppStore();
    appStore.linkWallet().then(() => {
      handleSwitchChain();
      appStore.setNetWorkReady(true);
    });

    if (to.matched.length === 0) {
      //如果未匹配到路由
      from.path ? next({ path: from.path }) : next('/'); //如果上级也未匹配到路由则跳转主页面，如果上级能匹配到则转上级路由
    } else {
      next(); //如果匹配到正确跳转
    }
  }
);

export default router;
