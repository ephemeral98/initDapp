import BpSwiperVue from './BpSwiperComp.vue';
import { SwiperSlide } from 'swiper/vue';
import { App } from 'vue';

const BpSwiper = {
  install(app: App) {
    app.component('BpSwiper', BpSwiperVue);
    app.component('SwiperSlide', SwiperSlide);
  },
};

export default BpSwiper;
