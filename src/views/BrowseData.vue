<template>
    <div>

        <div class="position-relative">
            <!-- shape Hero -->
            <section class="section-shaped my-0">
                <div class="shape shape-style-1 shape-default shape-skew">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div class="container shape-container d-flex">
                    <div class="col px-0" style="margin-top:-200px;">
                        <div class="row">
                            <div class="col-lg-6">
                                <h1 class="display-3  text-white">
                                    <span>Available data sets</span>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <!-- 1st Hero Variation -->
        </div>

        <section class="section section-lg pt-lg-0" style="margin-top:-400px;">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-12">
                        <div class="row row-grid">
                            <div v-for="dataset in datasets" class="col-lg-4" style="margin-top:25px;">
                                <data-card :dataset="dataset"></data-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script>

import DataCard from "./components/DataCard";
import { fetchDatasetConfigs } from './services/Limestone';

export default {
  name: "home",
  components: {DataCard},
  data: function() {
    return {
      datasets: []
    }
  },
  async mounted() {
    fetchDatasetConfigs(this.datasets);
  }
};
</script>

<style>
    img.rounded-circle.small-icon {
        width: 50px;
    }
</style>
