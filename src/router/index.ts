import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router';
import { useAppStore } from '@/store/appStore';
import { checkRightChain } from './routerHelp';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/TestPage',
    name: 'testPage',
    component: () => import(/* webpackChunkName: "testPage" */ '@/views/TestPage/index.vue'),
    meta: {
      requireAccount: true, // 依赖钱包
      needChains: ['0x61'], // 依赖的链
      needTips: true, // 链不对的时候，需不需要提示
    },
  },

  {
    path: '/TestSwiper',
    name: 'testSwiper',
    component: () => import(/* webpackChunkName: "testSwiper" */ '@/views/TestPage/TestSwiper.vue'),
    meta: {
      requireAccount: true, // 依赖钱包
      needChains: ['0x61'], // 依赖的链
      needTips: true, // 链不对的时候，需不需要提示
    },
  },

  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home/index.vue'),
    meta: {
      requireAccount: true,
      needChains: ['0x61'], // 依赖的链
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
    appStore.linkWallet();
    checkRightChain();
    next(true);
  }
);

export default router;
