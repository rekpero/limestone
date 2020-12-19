<template>
    <header class="header-global">
        <base-nav class="navbar-main" transparent type="" effect="light" expand>
            <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                <img src="img/logo-white.png" alt="logo" style="margin-top: -5px;">
                <span style="font-size: 20px; margin-left:5px; padding-top: 15px;">Limestone</span>
            </router-link>

            <div class="row" slot="content-header" slot-scope="{closeMenu}">
                <div class="col-6 collapse-brand">
                    <a href="https://demos.creative-tim.com/vue-argon-design-system/documentation/">
                        <img src="img/brand/blue.png">
                    </a>
                </div>
                <div class="col-6 collapse-close">
                    <close-button @click="closeMenu"></close-button>
                </div>
            </div>

            <ul class="navbar-nav navbar-nav-hover align-items-lg-center">
                <li >
                    <router-link to="/browse-data" class="nav-item" style="color:white; margin:0">Browse data</router-link>
                    |
                    <router-link to="/balancer-rewards" class="nav-item" style="color:white">Balancer rewards</router-link>
                </li>

            </ul>
            <ul class="navbar-nav align-items-lg-right ml-lg-auto">
                <li class="nav-item">
                    <a class="nav-link nav-link-icon" href="https://twitter.com/limestone_fi" target="_blank" rel="noopener"
                       data-toggle="tooltip" title="See us on Twitter">
                        <i class="fa fa-twitter-square"></i>
                        <span class="nav-link-inner--text d-lg-none">Twitter</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link nav-link-icon" href="https://github.com/jakub-wojciechowski/limestone"
                       target="_blank" rel="noopener" data-toggle="tooltip" title="Check code on Github">
                        <i class="fa fa-github"></i>
                        <span class="nav-link-inner--text d-lg-none">Github</span>
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link nav-link-icon" href="https://discord.gg/PVxBZKFr46"
                       target="_blank" rel="noopener" data-toggle="tooltip" title="Chat on Discord">
                        <i class="fa fa-discord"></i>
                        <span class="nav-link-inner--text d-lg-none">Discord</span>
                    </a>
                </li>




            </ul>
        </base-nav>
    </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";

export default {
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown
  }
};
</script>
<style>
</style>
