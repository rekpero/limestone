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
                            <div v-for="dataset in datasets" class="col-lg-4">
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
import { find, download } from './services/Arweave';

export default {
  name: "home",
  components: {DataCard},
  data: function() {
    return {
      datasets: [
        {
        logo: "https://assets.coingecko.com/coins/images/11683/large/Balancer.png?1592792958",
        name: "Balancer",
        url: "https://balancer.finance",
        symbol: "BAL",
        source: "Coingecko",
        description: "This data set contains the price of BAL token from the last <b>7 days</b>" +
                     " with <b>1 hour</b> granularity. Data comes from the Coingecko aggregator.",
        chartData: null
      },
        {
          logo: "https://assets.coingecko.com/coins/images/10775/small/COMP.png?1592625425",
          name: "Compound",
          url: "https://compound.finance",
          symbol: "COMP",
          source: "Coingecko",
          description: "This data set contains the price of COMP token from the last <b>7 days</b>" +
          " with <b>1 hour</b> granularity. Data comes from the Coingecko aggregator.",
          chartData: null
        }
        ]
    }
  },
  async mounted() {
    let dataTxs = await find("BAL", "Coingecko");
    this.datasets[0].tx =  dataTxs[0];
    this.datasets[1].tx =  dataTxs[0];
  }
};
</script>
