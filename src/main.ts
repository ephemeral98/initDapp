// dev
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import VueI18n from '@/locales/i18n';
import 'animate.css';
import bpDirective from './utils/bpDirective';
import watchUrl from './router/watchUrl';

// 初始化一些东西
import '@/utils/initRem';
import '@css/index.scss';
import 'virtual:uno.css';

// 一些全局组件
import BpButton from '@cps/BpButton';
import { useAppStore } from './store/appStore';
import { bpThrottle } from './hooks/useDeb';

const pinia = createPinia();

const vueApp = createApp(App);
// 多语言翻译标记
vueApp.config.globalProperties.$p = (param): string => param;

vueApp.use(router).use(VueI18n).use(pinia).use(BpButton).use(bpDirective).mount('#app');

// 获取当前设备尺寸
const appStore = useAppStore();
appStore.getCurDevice();
// 添加监听屏幕变化
window.onresize = bpThrottle(() => {
  appStore.getCurDevice();
});

/**
 * 开启监听地址栏的变化，
 * 如果需要用到 useRouterTools.ts/useRouteItemRef 就开启
 */
watchUrl();
