import BpButtonVue from './BpButtonComp.vue';
import { App } from 'vue';

export default {
  install(app: App) {
    app.component('BpButton', BpButtonVue);
  },
};
