import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import VueI18n from '@/locales/i18n';
import animate from 'animate.css';

// 初始化一些东西
import '@/utils/initRem';
import '@css/index.scss';

// element plus
import { ElLoading, ElDropdown } from 'element-plus';
import 'element-plus/theme-chalk/index.css';

// vant
import { Popup } from 'vant';
import 'vant/lib/popup/style';

// 一些全局组件
import BpButton from '@cps/BpButton';

// swiper ui
import SwiperCore, { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper';
import 'swiper/swiper.scss';
import BpSwiper from '@cps/BpSwiper';

import { useAppStore } from './store/appStore';
import { handleThrottle } from './utils/tools';

SwiperCore.use([Navigation, Pagination, Autoplay, EffectCoverflow]);
const pinia = createPinia();

createApp(App)
  .use(router)
  .use(VueI18n)
  .use(animate)
  .use(pinia)
  .use(Popup)
  .use(ElLoading)
  .use(ElDropdown)
  .use(BpSwiper)
  .use(BpButton)
  .mount('#app');

// 获取当前设备尺寸
const appStore = useAppStore();
appStore.getCurDevice();
// 添加监听屏幕变化
window.onresize = handleThrottle(() => {
  appStore.getCurDevice();
});
