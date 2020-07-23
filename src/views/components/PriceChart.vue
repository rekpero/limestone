<script>
  import { Line } from "vue-chartjs";

  export default {
    extends: Line,
    props: ['data'],
    watch: {
      data: function(chartData, oldVal) { // watch it
        console.log('Data changed: ', chartData, ' | was: ', oldVal)

        this.renderChart(
          {
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.values,
                backgroundColor: "transparent",
                borderColor: "rgba(1, 116, 188, 0.50)",
                pointBackgroundColor: "rgba(171, 71, 188, 1)"
              }
            ]
          },
          {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  unit: 'month'
                }
              }]
            },
            legend: {
              display: false
            }
          }
        );


      }
    }
  };
</script>
