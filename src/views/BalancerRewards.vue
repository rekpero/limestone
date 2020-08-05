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
                                        <img src="https://assets.coingecko.com/coins/images/11683/large/Balancer.png?1592792958" class="rounded-circle">
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center">
                                <div class="card-profile-actions py-4 mt-lg-0">
                                    <a :href="'https://viewblock.io/arweave/tx/'+dataset.tx" target="_blank">
                                        <base-button type="info" size="sm" class="mr-4">Verify on Arweave</base-button>
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-4 order-lg-1">
                                <div class="card-profile-stats d-flex justify-content-center">
                                    <div>
                                        <span class="heading">{{dataset.earned | bal}}</span>
                                        <span class="description">Earned so far</span>
                                    </div>
                                    <div>
                                        <span class="heading">{{dataset.projected | bal }}</span>
                                        <span class="description">Weekly projection</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-center mt-5">
                            <h3>
                                {{token && token.name}}
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
  import { find, getTags, getData } from './services/Arweave';
  import { getBlockTime } from './services/Blocks';
  import { token } from './services/Tokens';

  export default {
    name: "dataset",
    components: {
      PriceChart
    },
    data: function() {
      return {
        token: null,
        dataset: {
          earned: null,
          projected: null,
          chartData: null
        },
        user : "0x7d5024bfb6512211acb7521a76a8d60f8980fd7c"
      }
    },
    methods: {
      getToken: function(symbol) {
        return token(symbol);
      }
    },
    filters: {
      bal: function (value) {
        if (value) {
          let usd = value * window.balPrice;
          return value.toFixed(2) + ' BAL' + ' ($' + usd.toFixed(2) + ')';
        } else {
          return "..."
        }
      }
    },
    async mounted() {
      let balPriceRes = await this.$http.get("https://api.coingecko.com/api/v3/simple/price?ids=balancer&vs_currencies=USD");
      window.balPrice = parseFloat(balPriceRes.body.balancer.usd);
      console.log("BAL price: " + this.balPrice);

      const WEEK_SNAPSHOT_COUNT = 177;

      // let configId = this.$route.params.dataset;
      // this.token = token(this.$route.params.token);
      let dataTxs = await find({app: "Limestone", type: "balancer-rewards", version: "0.003"});
      console.log(dataTxs);


      let max = Number.MIN_VALUE;
      let latestDataset = null;
      for(var i=0; i<dataTxs.length; i++) {
        try {
          let tags = await getTags(dataTxs[i]);
          console.log(tags);
          if (tags.time > max) {
            max = tags.time;
            latestDataset = tags;
            latestDataset.tx = dataTxs[i];
          }
        } catch {
          console.log("Error fetching tx details - probably not mined yet");
        }
      };

      if (latestDataset) {
        console.log("Latest: " + latestDataset.tx);

        Object.assign(this.dataset, latestDataset);

        let allData = await getData(this.dataset.tx);
        let userRewards = allData.rewards[this.user];
        console.log(userRewards);

        let total = 0;
        this.dataset.chartData = {};
        this.dataset.chartData.labels = [];
        this.dataset.chartData.values = [];
        Object.keys(userRewards).forEach(async key => {
          let time = allData.blocks[key];
          this.dataset.chartData.labels.push(time);
          this.dataset.chartData.values.push(userRewards[key]);
          total = parseFloat(userRewards[key]);
        });
        this.dataset.earned = total;
        let weeklyRatio = (Object.keys(userRewards).length) / WEEK_SNAPSHOT_COUNT;
        this.dataset.projected = total/weeklyRatio;

        console.log(this.dataset.chartData);
      }
    }
  };
</script>

<style>
</style>
