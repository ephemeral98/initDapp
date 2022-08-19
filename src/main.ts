import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import VueI18n from '@/locales/i18n';
import animate from 'animate.css';

// 初始化一些东西
import '@/utils/initRem';
import '@css/index.scss';
import 'virtual:windi.css';

// vant
import { Popup } from 'vant';
import 'vant/lib/popup/style';

// element plus
import 'element-plus/theme-chalk/index.css';

// 一些全局组件
import BpButton from '@cps/BpButton';
import BpForm from '@cps/BpForm';

import BpSwiper from '@cps/BpSwiper';
import { useAppStore } from './store/appStore';
import { handleThrottle } from './utils/tools';

const pinia = createPinia();

const vueApp = createApp(App);
vueApp
  .use(router)
  .use(VueI18n)
  .use(animate)
  .use(pinia)
  .use(Popup)
  .use(ElLoading)
  .use(ElDropdown)
  .use(BpSwiper)
  .use(BpForm)
  .use(BpButton)
  .mount('#app');

// 获取当前设备尺寸
const appStore = useAppStore();
appStore.getCurDevice();
// 添加监听屏幕变化
window.onresize = handleThrottle(() => {
  appStore.getCurDevice();
});
