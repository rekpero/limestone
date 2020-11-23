<template>
    <section class="section section-shaped section-lg my-0">
        <div class="shape shape-style-1 bg-gradient-default">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="container pt-lg-md">
            <div class="row justify-content-center">
                <div class="col-lg-5">
                    <card type="secondary" shadow
                          header-classes="bg-white pb-5"
                          body-classes="px-lg-7 py-lg-5"
                          class="border-0">

                        <template>
                            <div class="text-center text-muted mb-4">
                                <h4>Open dispute for transaction:</h4>
                                <small>{{$route.params.tx}}</small></br>
                                <small>Value: <b>{{$route.params.value}}</b></small>
                            </div>
                            <form role="form">
                                <base-input class="mb-3"
                                            placeholder="Title"
                                            v-model="dispute.title"
                                            >
                                </base-input>
                                <base-input class="mb-3"
                                            v-model="dispute.deposit"
                                            placeholder="Deposit (in Lime Tokens)">
                                </base-input>

                                <textarea class="form-control" id="description" rows="3"
                                          v-model="dispute.description"
                                          placeholder="Description ...">

                                </textarea>

                                 <!--<base-checkbox>-->
                                    <!--<span>I agree with the-->
                                        <!--<a href="#">Privacy Policy</a>-->
                                    <!--</span>-->
                                <!--</base-checkbox>-->
                                <div class="text-center">
                                    <base-button type="primary" class="my-4" @click="openDispute()">Open dispute</base-button>
                                </div>
                            </form>
                        </template>
                    </card>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
  import { openDispute } from './services/MockDisputes';

  export default {
    data: function() {
      return {
        dispute: {
          value: this.$route.params.value,
          deadline: new Date().getTime() + 60*60*24*7
        }
      }
    },
    methods: {
      openDispute: async function() {
        let opened = await openDispute(this.dispute);
        this.$router.push({path: '/dispute/' + opened.id})
      }
    }
  };
</script>
<style>
</style>
