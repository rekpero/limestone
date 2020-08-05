import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Argon from "./plugins/argon-kit";
import VueResource from 'vue-resource';
import './registerServiceWorker'

Vue.config.productionTip = false;
Vue.use(Argon);
Vue.use(VueResource);
Vue.use(require('vue-moment'));

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
