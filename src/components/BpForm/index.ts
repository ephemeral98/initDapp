import BpAddComp from './BpAddComp.vue';
import BpSubComp from './BpSubComp.vue';
import BpInputComp from './BpInputComp.vue';
import { App } from 'vue';

const BpSwiper = {
  install(app: App) {
    app.component('BpInput', BpInputComp);
    app.component('BpAdd', BpAddComp);
    app.component('BpSub', BpSubComp);
  },
};

export default BpSwiper;
