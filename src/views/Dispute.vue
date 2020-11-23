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
                    <div class="mt-3">

                            <h3 style="text-align: center; padding-bottom: 10px;">
                                 {{dispute.title}}
                            </h3>

                        <div class="mt-1 py-1 border-top">
                        <div class="row justify-content-center">

                            <div class="col-lg-8 align-self-lg-left" style="padding-left: 50px; padding-top:20px;">
                                <i>{{dispute.description}}</i>

                                <div style="padding-top:30px;">

                                <base-button type="info" size="sm" class="mr-4" style="float:left;" @click="showVote('yes')">Vote Approve</base-button>

                                <base-button type="info" size="sm" class="mr-4" style="float:right;" @click="showVote('no')">Vote Reject</base-button>


                                </div>

                                <div style="padding:120px; margin-top:-100px;">
                                    <wj-radial-gauge
                                            class="text-gauge"
                                            :value.sync="votes.ratio"
                                            :is-read-only="false"
                                            :show-ranges="false"
                                            :is-animated="true"
                                            :get-text="getText">
                                        <wj-range :min="0" :max="100" color="#5038A3"></wj-range>
                                    </wj-radial-gauge>
                                </div>

                            </div>

                            <div class="col-lg-4 align-self-lg-left">
                                <div class="card-profile-stats justify-content-center">
                                    <div>
                                        <span class="heading">${{dispute.value}}</span>
                                        <span class="description">Disputed value</span>
                                    </div>

                                    <div>
                                        <span class="heading">${{dispute.deposit}}</span>
                                        <span class="description">Challenger deposit</span>
                                    </div>

                                    <div>
                                        <span class="heading">{{votes.total}}</span>
                                        <span class="description">Number of votes</span>
                                    </div>

                                    <div>
                                        <span class="heading">
                                            {{dispute.deadline && dispute.deadline.toLocaleDateString()}} <br/>
                                            {{dispute.deadline && dispute.deadline.toLocaleTimeString()}}
                                        </span>
                                        <span class="description">Deadline</span>
                                    </div>

                                </div>
                            </div>
                        </div>











                            <!--<div class="col-lg-4 order-lg-1">-->
                                <!--<div class="card-profile-stats d-flex justify-content-center">-->
                                    <!--<div>-->
                                        <!--<span class="heading"></span>-->
                                        <!--<span class="description">Minimum</span>-->
                                    <!--</div>-->
                                    <!--<div>-->
                                        <!--<span class="heading"></span>-->
                                        <!--<span class="description">Average</span>-->
                                    <!--</div>-->
                                    <!--<div>-->
                                        <!--<span class="heading"></span>-->
                                        <!--<span class="description">Maximum</span>-->
                                    <!--</div>-->
                                <!--</div>-->
                            <!--</div>-->
                        </div>



                    </div>
                </card>
            </div>
        </section>

        <modal :show.sync="showVotingModal">
            <template slot="header">
                <h5 class="modal-title" id="exampleModalLabel">Vote to {{voteData.choice == 'yes' ? 'approve' : 'reject'}} the dispute</h5>
            </template>
            <div>
                <form role="form">
                    <base-input class="mb-3"
                                placeholder="Amount of tokens"
                                v-model="voteData.value"
                    >
                    </base-input>
                </form>
            </div>
            <template slot="footer">
                <base-button type="secondary" @click="showVotingModal = false">Cancel</base-button>
                <base-button type="primary" @click="vote()">Vote</base-button>
            </template>
        </modal>

    </div>
</template>
<script>
  import PriceChart from './components/PriceChart'
  import { getDispute, getVotes, vote } from './services/MockDisputes';
  import { token } from './services/Tokens';
  import Modal from "@/components/Modal.vue";

  export default {
    name: "dataset",
    components: {
      Modal
    },
    data: function() {
      return {
        showVotingModal: false,
        dispute: {},
        votes: {},
        voteData: {
          choice: '',
          value: null
        }
      }
    },
    methods: {
      showVote: async function(choice) {
        this.voteData.choice = choice;
        this.showVotingModal = true;
      },
      vote: async function() {
        this.votes = await vote(this.$route.params.id, this.voteData.choice, parseInt(this.voteData.value));
        this.voteData = {
          choice: '',
          value: null
        };
        this.showVotingModal = false;
      },
      getText: function (gauge, part, value, text) {
        switch (part) {
          case 'min':
            return 'Approve';
          case 'max':
            return 'Reject';
          default:
            return parseInt(value)+ "%";
        }
        return text;
      }
    },
    async mounted() {
      this.dispute = await getDispute(this.$route.params.id);
      this.votes = await getVotes(this.$route.params.id);
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

    pre.code-block {
        background-color: #f8f8f8;
        color: #525252;
        padding: 0 10px 0 10px;
    }
</style>
