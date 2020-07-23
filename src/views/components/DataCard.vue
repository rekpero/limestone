<template>
    <card class="border-0" hover shadow body-classes="py-5">
        <icon name="ni ni-check-bold" type="primary" rounded class="mb-4">
        </icon>
        <h6 class="text-primary text-uppercase">{{dataset.name}} token prices</h6>
        <p class="description mt-3" v-html="dataset.description"></p>
        <div>
            <badge type="primary" rounded>{{dataset.symbol}}</badge>
            <badge type="primary" rounded>{{dataset.source}}</badge>
        </div>
        <base-button @click="$router.push('dataset/'+dataset.tx)" type="primary" class="mt-4">
            View Data
        </base-button>
    </card>
</template>

<script>

  export default {
    name: "DataCard",
    props:["dataset"]
  };
</script>
