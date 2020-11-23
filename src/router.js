import Vue from "vue";
import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Components from "./views/Components.vue";
import Home from "./views/Home.vue";
import BrowseData from "./views/BrowseData.vue";
import OpenDispute from "./views/OpenDispute.vue";
import Dispute from "./views/Dispute.vue";
import Dataset from "./views/Dataset.vue";
import BalancerRewards from "./views/BalancerRewards.vue";
import Details from "./views/Details.vue";

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
      path: "/dataset/:dataset/:token",
      name: "dataset",
      components: {
        header: AppHeader,
        default: Dataset
      }
    },
    {
      path: "/details/:dataset/:token",
      name: "details",
      components: {
        header: AppHeader,
        default: Details
      }
    },
    {
      path: "/balancer-rewards",
      name: "balancer-rewards",
      components: {
        header: AppHeader,
        default: BalancerRewards
      }
    },
    {
      path: "/open-dispute/:tx/:value",
      name: "OpenDispute",
      components: {
        header: AppHeader,
        default: OpenDispute
      }
    },
    {
      path: "/dispute/:id",
      name: "dispute",
      components: {
        header: AppHeader,
        default: Dispute
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
