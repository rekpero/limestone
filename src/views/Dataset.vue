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
                <card shadow class="card-profile" style="margin-top:-550px;" no-body>
                    <div class="px-4">
                        <div class="row justify-content-center">
                            <div class="col-lg-3 order-lg-2">
                                <div class="card-profile-image">
                                    <a href="#">
                                        <img :src="token && token.logo" class="rounded-circle">
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center">

                                    <a :href="'https://viewblock.io/arweave/tx/'+dataset.tx" target="_blank">
                                    <base-button type="info" size="sm" class="mr-4">Verify on Arweave</base-button>
                                    </a>

                                    <a @click="$router.push('/details/'+configId+'/'+token.symbol)">
                                        <base-button type="info" size="sm" class="mr-4">Browse</base-button>
                                    </a>

                            </div>
                            <div class="col-lg-4 order-lg-1">
                                <div class="card-profile-stats d-flex justify-content-center">
                                    <div>
                                        <span class="heading">{{dataset.min.toFixed(2)}}</span>
                                        <span class="description">Minimum</span>
                                    </div>
                                    <div>
                                        <span class="heading">{{dataset.avg.toFixed(2)}}</span>
                                        <span class="description">Average</span>
                                    </div>
                                    <div>
                                        <span class="heading">{{dataset.max.toFixed(2)}}</span>
                                        <span class="description">Maximum</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-center mt-5">
                            <h3>
                                {{token && token.name}}
                            </h3>
                            <div class="updated">Last updated <b> {{dataset.lastUpdated | moment("from")}}</b> </div>

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
  import { fetchDataset } from './services/Limestone';
  import { token } from './services/Tokens';
  import { getPrice } from '@limestonefi/api';

  export default {
    name: "dataset",
    components: {
      PriceChart
    },
    data: function() {
      return {
        token: null,
        configId: '',
        dataset: {
          min: 0,
          avg: 0,
          max: 0,
          chartData: null
        },

      }
    },
    methods: {
      getToken: function(symbol) {
        return token(symbol);
      }
    },
    async mounted() {
      this.configId = this.$route.params.dataset;
      this.token = token(this.$route.params.token);

      await fetchDataset(this.dataset, this.configId, 0);

        this.dataset.chartData = {};
        this.dataset.chartData.labels = [];
        this.dataset.chartData.values = [];
        this.dataset.min = Number.MAX_VALUE;
        let sum = 0;
        let count = 0;
        this.dataset.data.forEach(point => {
          this.dataset.chartData.labels.push(point[0]);
          this.dataset.chartData.values.push(point[1]);
          this.dataset.min = Math.min(this.dataset.min, point[1]);
          this.dataset.max = Math.max(this.dataset.max, point[1]);
          sum += point[1];
          count++;
        });
        this.dataset.avg = sum / count;
        console.log(this.dataset.chartData);



    }
  };
</script>

<style>
    div.updated {
        font-size: .875rem;
        color: #adb5bd;
        width: 100%;
        text-align: right;
    }
</style>
