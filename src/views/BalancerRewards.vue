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
                                    <div style="padding-left:0; padding-right:0">
                                        <span class="heading">{{dataset.projected | bal }}</span>
                                        <span class="description" >Weekly projection</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-center mt-5">
                            <h3>
                                Balancer mining rewards (Week 10)
                            </h3>

                            <div v-show="user">
                                <div v-show="loading" class="loading-box">
                                    <pacman-loader color="#412996" class="pacman"></pacman-loader>
                                    <div class="pacman-text">
                                        Fetching data...
                                    </div>

                                </div>

                                <div v-show="!loading">
                                    <div class="updated">Last updated <b> {{dataset.lastUpdated | moment("from")}}</b> </div>
                                    <price-chart :data="dataset.chartData" ></price-chart>
                                </div>

                            </div>

                            <div class="btn-wrapper" style="margin-top:30px;" v-show="!user">
                                <base-button @click="connectToMetamask()"
                                             class="mb-3 mb-sm-0"
                                             type="warning"
                                             icon="fa fa-smile">
                                    Connect with Metamask
                                </base-button>

                            </div>


                        </div>
                        <div class="mt-5 py-5 border-top text-center">
                            <div class="row justify-content-center">
                                <div class="col-lg-9">
                                    <a href="https://github.com/balancer-labs/bal-mining-scripts" target="_blank">Learn more about mining rewards</a>
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
  import { PacmanLoader } from '@saeris/vue-spinners'

  const WEEK_SNAPSHOT_COUNT = 177;
  const Web3 = require("web3");

  export default {
    name: "dataset",
    components: {
      PriceChart,
      PacmanLoader
    },
    data: function() {
      return {
        token: null,
        dataset: {
          earned: null,
          projected: null,
          chartData: null
        },
        user : null,
        loading: true,
      }
    },
    methods: {
      connectToMetamask: async function() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          let accounts = await web3.eth.getAccounts();
          console.log(accounts);
          this.user = accounts[0].toLowerCase();
          this.parseUserData();
        }
      },
      getToken: function(symbol) {
        return token(symbol);
      },
      parseUserData: async function() {
        console.log("Getting data for: " + this.user);
        let userRewards = this.data.rewards[this.user];
        console.log(userRewards);

        let total = 0;
        this.dataset.chartData = {};
        this.dataset.chartData.labels = [];
        this.dataset.chartData.values = [];
        let blocks = Object.keys(this.data.blocks);
        for(var b=0; b<blocks.length; b++) {
          let time = this.data.blocks[blocks[b]];
          this.dataset.chartData.labels.push(time);
          this.dataset.chartData.values.push(userRewards[b]);
          total = parseFloat(userRewards[b]);
        };
        //Get last 5
        //let last = Object.keys(userRewards).sort().slice(-11);
        var last = blocks.length-1;
        console.log("Last: " + last);
        let diff10 = userRewards[last] - userRewards[last-10];


        this.dataset.earned = total;
        //let weeklyRatio = (Object.keys(userRewards).length) / WEEK_SNAPSHOT_COUNT;
        //this.dataset.projected = total/weeklyRatio;
        this.dataset.projected = diff10*177/10;

        console.log(this.dataset.chartData);
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

      let dataTxs = await find({app: "Limestone", type: "balancer-rewards", version: "0.004"});
      console.log(dataTxs);


      console.log("Found txs: " + dataTxs.length);
      let latestTx = dataTxs.length > 0 ? dataTxs[0] : null;

      if (latestTx) {
        let latestDataset = null;
        try {
          latestDataset = await getTags(latestTx);
        } catch {
          console.log("Cannot fetch the latest dataset");
          latestTx = dataTxs[1];
          latestDataset = await getTags(latestTx);
        }

        latestDataset.tx = latestTx;
        console.log(latestDataset.time);
        latestDataset.lastUpdated = new Date(parseInt(latestDataset.time));
        Object.assign(this.dataset, latestDataset);
        console.log(latestDataset);
        this.data = await getData(this.dataset.tx);
        console.log(this.data);
        console.log("Data fetched: " + this.dataset.snapshot);
        this.loading = false;

        if (this.user) {
          this.parseUserData();
        }
      }
    }
  };
</script>

<style>
    .loading-box {
        text-align: center;
        padding-right:3%;
        margin-top:100px;
    }
    .pacman {
        margin: auto;
    }
    .pacman-text {
        margin: 30px 0 0 30px;
    }
</style>
