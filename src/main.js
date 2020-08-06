import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Argon from "./plugins/argon-kit";
import VueResource from 'vue-resource';
import './registerServiceWorker'
import { VueSpinners } from '@saeris/vue-spinners'



Vue.config.productionTip = false;
Vue.use(Argon);
Vue.use(VueResource);
Vue.use(require('vue-moment'));
Vue.use(VueSpinners)

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
