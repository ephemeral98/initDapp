import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router';
import { useAppStore } from '@/store/appStore';
import $load from '@cps/GlobalLoading';
import { handleSwitchChain } from './routerHelp';
import { getCurNeedChain } from '@/contracts/chains';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/TestPage',
    name: 'testPage',
    component: () =>
      import(/* webpackChunkName: "testPage" */ '@/views/TestPage/index.vue'),
    meta: {
      requireAccount: true, // 依赖钱包
      needChains: getCurNeedChain(['bsc']), // 依赖的链
      needTips: true, // 链不对的时候，需不需要提示
    },
  },

  {
    path: '/',
    name: 'home',
    component: () =>
      import(/* webpackChunkName: "home" */ '@/views/Home/index.vue'),
    meta: {
      requireAccount: false,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    // 每次进来，先确定是否拿到钱包
    const appStore = useAppStore();
    if (appStore.defaultAccount || !to.meta.requireAccount) {
      // 进入的时候不依赖钱包拿链上数据的，先放用户进去，再不阻塞地获取钱包
      appStore.linkWallet();
    } else {
      $load({ isShow: true });
      await appStore.linkWallet();
      $load({ isShow: false });
    }
    next(true);
    try {
      handleSwitchChain();
    } catch (error) {
      console.log('error..', error);
    }
  }
);

export default router;
