<template>
    <div class="profile-page">
        <section class="section-profile-cover section-shaped my-0">
            <div class="shape shape-style-1 shape-primary shape-skew alpha-4">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </section>
        <section class="section section-skew">
            <div class="container">
                <card shadow class="card-profile" style="margin-top:-500px;" no-body>
                    <div class="px-4">
                        <div class="row justify-content-center">
                            <div class="col-lg-3 order-lg-2">
                                <div class="card-profile-image">
                                    <a href="#">
                                        <img :src="dataset.logo" class="rounded-circle">
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center">
                                <div class="card-profile-actions py-4 mt-lg-0">
                                    <base-button type="info" size="sm" class="mr-4">Connect</base-button>
                                    <base-button type="default" size="sm" class="float-right">Message</base-button>
                                </div>
                            </div>
                            <div class="col-lg-4 order-lg-1">
                                <div class="card-profile-stats d-flex justify-content-center">
                                    <div>
                                        <span class="heading">22</span>
                                        <span class="description">Minimum</span>
                                    </div>
                                    <div>
                                        <span class="heading">10</span>
                                        <span class="description">Average</span>
                                    </div>
                                    <div>
                                        <span class="heading">89</span>
                                        <span class="description">Maximum</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-center mt-5">
                            <h3>{{dataset.name}}
                            </h3>

                            <price-chart :data="dataset.chartData"></price-chart>

                        </div>
                        <div class="mt-5 py-5 border-top text-center">
                            <div class="row justify-content-center">
                                <div class="col-lg-9">
                                    <p>{{dataset.description}}</p>
                                    <a :href="dataset.url" target="_blank">Visit project website</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </card>
            </div>
        </section>
    </div>
</template>
<script>
  import PriceChart from './components/PriceChart'
  import { find, download } from './services/Arweave';

  export default {
    name: "dataset",
    components: {
      PriceChart
    },
    data: function() {
      return {
        dataset: {
          logo: "https://assets.coingecko.com/coins/images/11683/large/Balancer.png?1592792958",
          name: "Balancer",
          url: "https://balancer.finance",
          chartData: null
        }
      }
    },
    async mounted() {
      let data = await download(this.$route.params.dataset);

      this.dataset.chartData = {};
      this.dataset.chartData.labels = [];
      this.dataset.chartData.values = [];
      data.forEach(point => {
        this.dataset.chartData.labels.push(point[0]);
        this.dataset.chartData.values.push(point[1]);
      });

      console.log(this.dataset.chartData);
    }
  };
</script>

<style>
</style>
