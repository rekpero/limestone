import Vue from "vue";
import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Components from "./views/Components.vue";
import Home from "./views/Home.vue";
import BrowseData from "./views/BrowseData.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Dataset from "./views/Dataset.vue";
import BalancerRewards from "./views/BalancerRewards.vue";

Vue.use(Router);

export default new Router({
  linkExactActiveClass: "active",
  routes: [
    {
      path: "/",
      name: "home",
      components: {
        header: AppHeader,
        default: Home
      }
    },
    {
      path: "/components",
      name: "components",
      components: {
        header: AppHeader,
        default: Components
      }
    },
    {
      path: "/browse-data",
      name: "browse-data",
      components: {
        header: AppHeader,
        default: BrowseData
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: AppHeader,
        default: Login,
        footer: AppFooter
      }
    },
    {
      path: "/register",
      name: "register",
      components: {
        header: AppHeader,
        default: Register,
        footer: AppFooter
      }
    },
    {
      path: "/dataset/:dataset/:token",
      name: "dataset",
      components: {
        header: AppHeader,
        default: Dataset
      }
    },
    {
      path: "/balancer-rewards",
      name: "balancer-rewards",
      components: {
        header: AppHeader,
        default: BalancerRewards
      }
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});
