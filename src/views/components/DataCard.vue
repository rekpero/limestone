<template>
    <card class="border-0" hover shadow body-classes="py-5">



        <h6 class="text-primary text-uppercase">
            <img :src="getToken(dataset.token).logo" class="rounded-circle small-icon">
            {{getToken(dataset.token).name}} token prices
        </h6>
        <p class="description mt-3">
            This data set contains the price of {{dataset.token}} token from the last <b>7 days</b>
            with <b>1 hour</b> granularity. Data comes from the {{dataset.source}} aggregator.
        </p>
        <div>
            <badge type="primary" rounded>{{dataset.token}}</badge>
            <badge type="primary" rounded>{{dataset.source}}</badge>
        </div>
        <base-button @click="$router.push('dataset/'+dataset.id+'/'+dataset.token)" type="primary" class="mt-4">
            View Data
        </base-button>
    </card>
</template>

<script>
  import { token } from '../services/Tokens';

  export default {
    name: "DataCard",
    props:["dataset"],
    methods: {
      getToken: function(symbol) {
        return token(symbol);
      }
    }
  };
</script>

<style>
    .small-icon {
        width:42px;
        margin-right: 10px;
    }
</style>
