<template>
    <!--TODO: set up transaction and balance formatting server side, data passing to chart-->
    <div class="card">
      <div class="card-content">
        <h4>Account Value: ${{addCommas(accountValue)}}</h4>

        <div class="container">
          <line-chart></line-chart>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Balance</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in transactions" v-bind:key="t.date">
              <td>{{ t.date }}</td>
              <td>${{addCommas(t.accountValue)}}</td>
              <td>{{ t.notes }}</td>
            </tr>
          </tbody>
        </table>

        <br />
      </div>
    </div>
</template>

<script>
import { Line } from 'vue-chartjs'

export default {
  data: function () {
    return {
      accountValue: 98197,
      transactions: [
        {
          date: '5/25/2018',
          accountValue: 98197,
          notes: ''
        },
        {
          date: '5/20/2018',
          accountValue: 98105,
          notes: 'deposit (+$1000)'
        }
      ]
    }
  },
  methods: {
    addCommas: function (n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  components: {
    'line-chart': {
      extends: Line,
      mounted: function () {
        // Overwriting base render method with actual data.
        this.renderChart({
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: 'Account Value',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
            }
          ]
        }, {
          legend: {
            labels: {
              fontFamily: 'Source Code Pro'
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontFamily: 'Source Code Pro'
              }
            }],
            xAxes: [{
              ticks: {
                fontFamily: 'Source Code Pro'
              }
            }]
          }
        })
      }
    }
  }
}
</script>

<style>
  h4, th, td {
    text-align: center;
  }

  .container {
    padding: 2%
  }
</style>
