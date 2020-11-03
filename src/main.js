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

function setupFilters() {
  Vue.filter('usd', function (value) {
    if (!value) return '$0'
    return "$" + parseFloat(value).toFixed(2);
  });

  Vue.filter('usd-precise', function (value) {
    if (!value) return '$0'
    return "$" + value.toFixed(12);
  });

  Vue.filter('units', function (value) {
    if (!value) return '0';
    return value.toFixed(3);
  });

  Vue.filter('percent', function (value) {
    if (!value) return '0%';
    return (value * 100).toFixed(1) + "%";
  });

  Vue.filter('tx', function (value) {
    if (!value) return '';
    return value.substr(0, 6) + "..." + value.substr(value.length - 6);
  });
}

setupFilters();
