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
import { getEnv } from '@/utils/buildTestnet';
import useSign from '@/hooks/useSign';
import { $GET } from '@/hooks/useAjax';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/TestPage',
    name: 'testPage',
    component: () => import(/* webpackChunkName: "testPage" */ '@/views/TestPage/index.vue'),
    meta: {
      requireAccount: true, // 依赖钱包
      needChains: curNeedChain(['bsc']), // 依赖的链
      needTips: true, // 链不对的时候，需不需要提示
      auth: true,
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

const env = getEnv(import.meta.env.MODE);
const router = createRouter({
  history: createWebHashHistory(env.routerBase),
  routes,
});

router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // 每次进来，先拿一下钱包
    const appStore = useAppStore();
    // const { doSign } = useSign();

    if (to.meta.auth) {
      // 需要签名认证
      await appStore.linkWallet();
      handleSwitchChain();
      appStore.setNetWorkReady(true);

      console.log('defalult...', appStore.defaultAccount);

      const isLogin = await $GET('/api/test/whoami', {
        auth: true,
        other: 'hello',
      });

      console.log('isLogin..', isLogin);
      // await doSign();
    } else {
      appStore.linkWallet().then(() => {
        handleSwitchChain();
        appStore.setNetWorkReady(true);
      });
    }

    if (to.matched.length === 0) {
      //如果未匹配到路由
      from.path ? next({ path: from.path }) : next('/'); //如果上级也未匹配到路由则跳转主页面，如果上级能匹配到则转上级路由
    } else {
      next(); //如果匹配到正确跳转
    }
  }
);

export default router;
