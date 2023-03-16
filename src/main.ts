// dev
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import VueI18n from '@/locales/i18n';
import 'animate.css';
import * as direct from './utils/bpDirective';
import watchUrl from './router/watchUrl';

// 初始化一些东西
import '@/utils/initRem';
import '@css/index.scss';
import 'virtual:windi.css';
import '../bpType';

// 一些全局组件
import BpButton from '@cps/BpButton';
import BpSwiper from '@cps/BpSwiper';
import { useAppStore } from './store/appStore';
import { bpThrottle } from './hooks/useDeb';

const pinia = createPinia();

const vueApp = createApp(App);
// 多语言翻译标记
vueApp.config.globalProperties.$tc = (param): string => param;

vueApp.use(router).use(VueI18n).use(pinia).use(BpSwiper).use(BpButton).mount('#app');

// 常用自定义指令
direct.maxDirective(vueApp);
direct.minDirective(vueApp);
direct.doubleDirective(vueApp);
direct.numberDirective(vueApp);
direct.intDirective(vueApp);
direct.integerDirective(vueApp);

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
