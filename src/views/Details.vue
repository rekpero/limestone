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
                        </div>
                        <div class="text-center mt-5" style="min-height: 500px;">
                            <h3>
                                {{token && token.name}}
                            </h3>
                            <div class="updated">Last updated <b> </b> </div>

                            <div class="table-responsive">
                                <base-table class="table align-items-center table-flush"
                                            thead-classes="thead-light"
                                            tbody-classes="list"
                                            :data="data">
                                    <template slot="columns">
                                        <th>Value</th>
                                        <th>Date</th>
                                        <th>Arweave tx</th>
                                        <th>Actions</th>
                                        <th></th>
                                    </template>

                                    <template slot-scope="{row}">
                                        <td>{{row.value | usd}}</td>
                                        <td>{{row.time.toLocaleDateString()}} {{row.time.toLocaleTimeString()}}</td>
                                        <td>{{row.tx | tx}}</td>
                                        <td>
                                            <base-button type="info" size="sm" class="mr-4">Raise Dispute</base-button>
                                        </td>
                                        <!--<th scope="row">-->
                                            <!--<div class="media align-items-center">-->
                                                <!--<a href="#" class="avatar rounded-circle mr-3">-->
                                                    <!--<img alt="Image placeholder" :src="row.img">-->
                                                <!--</a>-->
                                                <!--<div class="media-body">-->
                                                    <!--<span class="name mb-0 text-sm">{{row.title}}</span>-->
                                                <!--</div>-->
                                            <!--</div>-->
                                        <!--</th>-->
                                        <!--<td class="budget">-->
                                            <!--{{row.budget}}-->
                                        <!--</td>-->
                                        <!--<td>-->
                                            <!--<badge class="badge-dot mr-4" :type="row.statusType">-->
                                                <!--<i :class="`bg-${row.statusType}`"></i>-->
                                                <!--<span class="status">{{row.status}}</span>-->
                                            <!--</badge>-->
                                        <!--</td>-->
                                        <!--<td>-->
                                            <!--<div class="avatar-group">-->
                                                <!--<a href="#" class="avatar avatar-sm rounded-circle" data-toggle="tooltip" data-original-title="Ryan Tompson">-->
                                                    <!--<img alt="Image placeholder" src="img/theme/team-1-800x800.jpg">-->
                                                <!--</a>-->
                                                <!--<a href="#" class="avatar avatar-sm rounded-circle" data-toggle="tooltip" data-original-title="Romina Hadid">-->
                                                    <!--<img alt="Image placeholder" src="img/theme/team-2-800x800.jpg">-->
                                                <!--</a>-->
                                                <!--<a href="#" class="avatar avatar-sm rounded-circle" data-toggle="tooltip" data-original-title="Alexander Smith">-->
                                                    <!--<img alt="Image placeholder" src="img/theme/team-3-800x800.jpg">-->
                                                <!--</a>-->
                                                <!--<a href="#" class="avatar avatar-sm rounded-circle" data-toggle="tooltip" data-original-title="Jessica Doe">-->
                                                    <!--<img alt="Image placeholder" src="img/theme/team-4-800x800.jpg">-->
                                                <!--</a>-->
                                            <!--</div>-->
                                        <!--</td>-->

                                        <!--<td>-->
                                            <!--<div class="d-flex align-items-center">-->
                                                <!--<span class="completion mr-2">{{row.completion}}%</span>-->
                                                <!--<div>-->
                                                    <!--<base-progress :type="row.statusType"-->
                                                                   <!--:show-percentage="false"-->
                                                                   <!--class="pt-0"-->
                                                                   <!--:value="row.completion"/>-->
                                                <!--</div>-->
                                            <!--</div>-->
                                        <!--</td>-->

                                        <!--<td class="text-right">-->
                                            <!--<base-dropdown class="dropdown"-->
                                                           <!--position="right">-->
                                                <!--<a slot="title" class="btn btn-sm btn-icon-only text-light" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->
                                                    <!--<i class="fas fa-ellipsis-v"></i>-->
                                                <!--</a>-->

                                                <!--<template>-->
                                                    <!--<a class="dropdown-item" href="#">Action</a>-->
                                                    <!--<a class="dropdown-item" href="#">Another action</a>-->
                                                    <!--<a class="dropdown-item" href="#">Something else here</a>-->
                                                <!--</template>-->
                                            <!--</base-dropdown>-->
                                        <!--</td>-->

                                    </template>

                                </base-table>
                            </div>

                        </div>

                    </div>
                </card>
            </div>
        </section>
    </div>
</template>
<script>
  import BaseTable from './components/BaseTable'
  import { fetchDataEntries } from './services/Limestone';
  import { token } from './services/Tokens';

  export default {
    name: "dataset",
    components: {
      BaseTable
    },
    data: function() {
      return {
        token: null,
        configId: '',
        data: []
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

      await fetchDataEntries(this.configId, this.data);

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
