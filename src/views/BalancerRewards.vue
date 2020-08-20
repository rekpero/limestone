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
                                Balancer mining rewards
                            </h3>

                            <div v-show="user">
                                <div v-show="loading" class="loading-box">
                                    <pacman-loader color="#412996" class="pacman"></pacman-loader>
                                    <div class="pacman-text">
                                        Fetching data...
                                    </div>

                                </div>

                                <div v-show="!loading">

                                    <div style="width:100%; height: 30px;">
                                        <div class="week-selector">
                                            <base-button @click="changeWeek(10)" :disabled="week == 10" type="info" size="sm" class="mr-4">Week 10</base-button>
                                            <base-button @click="changeWeek(11)" :disabled="week == 11" type="info" size="sm" class="mr-4">Week 11</base-button>
                                        </div>

                                        <!--<div class="updated">-->
                                            <!--Last updated <b> {{dataset.lastUpdated | moment("from")}}</b>-->
                                        <!--</div>-->

                                        <div class="mode-selector">
                                            <base-button @click="cumulative = true" :disabled="cumulative" type="info" size="sm" class="mr-4">Cumulative</base-button>
                                            <base-button @click="cumulative = false" :disabled="!cumulative" type="info" size="sm" class="mr-4">Per snapshot</base-button>
                                        </div>

                                    </div>



                                    <price-chart :data="cumulative ? dataset.chartData : dataset.chartData2" ></price-chart>
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

                            <div class="row justify-content-center py-1">
                                <div class="col-lg-9">
                                    <a href="https://github.com/balancer-labs/bal-mining-scripts" target="_blank">Learn more about mining rewards</a>
                                </div>
                            </div>
                        </div>
                        <div class="mt-2 border-top">
                            <h5 style="margin-top: 1rem">
                            Popular yield farming accounts:
                            </h5>

                            <div class="card-profile-actions mt-lg-0" style="margin: 1rem 0 1rem 0;">
                                <base-button type="info" size="sm" class="mr-4" @click="setUser('0xf7575d4d4db78f6ba43c734616c51e9fd4baa7fb')">mUSD / ETH</base-button>
                                <base-button type="info" size="sm" class="mr-4" @click="setUser('0x881c72d1e6317f10a1cdcbe05040e7564e790c80')">mUSD / USDC</base-button>
                                <base-button type="info" size="sm" class="mr-4" @click="setUser('0xf4a7d2d85f4ba11b5c73c35e27044c0c49f7f027')">MTA 5% </base-button>
                                <base-button type="info" size="sm" class="mr-4" @click="setUser('0x25970282aac735cd4c76f30bfb0bf2bc8dad4e70')">MTA 80% </base-button>
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


  const WEEK_TXS = {
    "10" : "aJrbQX8skpN4RS6LwEHFh_jc28nKc6B0tPblA-8p1ro",
    "11" : "x4W5M6URBkvy8Gv7Vu9fCI6ZuawS9hpJo_Khb-MVoTo"
  };

  export default {
    name: "dataset",
    components: {
      PriceChart,
      PacmanLoader
    },
    data: function() {
      return {
        cumulative: true,
        token: null,
        week: 11,
        cachedData: {},
        dataset: {
          earned: null,
          projected: null,
          chartData: null,
          chartDataDiff: null,
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

        //Cumulative chart
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

        //Diff chart
        this.dataset.chartData2 = {};
        this.dataset.chartData2.labels = [];
        this.dataset.chartData2.values = [];
        for(var b=0; b<blocks.length; b++) {
          let time = this.data.blocks[blocks[b]];
          this.dataset.chartData2.labels.push(time);
          let val = b == 0 ? userRewards[b] : userRewards[b] - userRewards[b-1];
          this.dataset.chartData2.values.push(val);
        };

        //Get last diff
        let last = Object.keys(userRewards).slice(-1);
        let remainingCount = WEEK_SNAPSHOT_COUNT - last[0];
        let remaining = remainingCount * (userRewards[last] - userRewards[last-1]);
        // console.log("Last: " + last);
        // console.log("RC: " + remainingCount);
        // console.log("Remaining: " + remaining);



        this.dataset.earned = total;
        this.dataset.projected = total + remaining;
      },
      fetchData: async function(){
        this.loading = true;
        //let latestTx = dataTxs.length > 0 ? dataTxs[0] : null;
        //Temporary show end of week 10, as Balancer decide the bounds for the next week
        let latestTx = WEEK_TXS[this.week];




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

          this.data = this.cachedData[this.week];
          if (!this.data) {
            console.log("No data in cache");
            this.data = await getData(this.dataset.tx);
            this.cachedData[this.week] = this.data;
          }
          console.log(this.data);
          console.log("Data fetched: " + this.dataset.snapshot);
          this.loading = false;

          if (this.user) {
            this.parseUserData();
          }
        }
      },
      setUser: function(account) {
        this.user = account;
        this.parseUserData();
      },
      changeWeek: function(week) {
        this.week = week;
        this.fetchData();
      }
    },
    async mounted() {
      //Try to get accounts
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
          let accounts = await web3.eth.getAccounts();
          if (accounts && accounts.length > 0) {
            this.user = accounts[0].toLowerCase();
            console.log("Main account: " + this.user);
          }
        } catch(err) {
          console.log("No accounts - agree to conect");
        }
      }


      let balPriceRes = await this.$http.get("https://api.coingecko.com/api/v3/simple/price?ids=balancer&vs_currencies=USD");
      window.balPrice = parseFloat(balPriceRes.body.balancer.usd);
      console.log("BAL price: " + this.balPrice);

      let dataTxs = await find({app: "Limestone", type: "balancer-rewards", version: "0.004"});
      console.log("Found txs: " + dataTxs.length);

      this.fetchData();
    },
    filters: {
      bal: function (value) {
        if (value) {
          let usd = value * window.balPrice;
          return value.toFixed(2) + ' BAL' + ' ($' + parseInt(usd).toLocaleString() + ')';
        } else {
          return "..."
        }
      }
    },
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
    .week-selector {
        float: left;
    }
    .mode-selector {
        float:right;
    }

</style>
