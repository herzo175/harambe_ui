<template>
  <div class="card">
    <div class="card-content">
      <div v-if="brokers.length > 0">
        <div class="input-field col s12 m6">
          <select v-model="broker">
            <option disabled>Select Broker</option>
            <option
              v-for="b in brokers" :key="b.Id" v-bind:value="b">
              {{ b.name }}
            </option>
          </select>
        </div>

        <div class="input-field col s12 m6">
          <select v-model="brokerAccount">
            <option disabled>Select Account</option>
            <option
              v-for="a in brokerAccounts" :key="a.accountNumber" v-bind:value="a">
              {{ a.name }}
            </option>
          </select>
        </div>
      </div>

      <h4 v-if="currentReport">
        Account Value: ${{addCommas(currentReport.value)}}
      </h4>

      <div class="container">
        <div v-if="currentReport">
          <line-chart
            v-bind:reports="reports"
            v-bind:currentReport="currentReport">
          </line-chart>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Balance</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in reports.concat([currentReport])" v-bind:key="r.date">
                <td>{{ formatDate(new Date(r.date)) }}</td>
                <td>${{addCommas(r.value)}}</td>
                <td>{{ r.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <h5 class="center-align">Select Account From Broker</h5>
        </div>
      </div>
      <br />
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'

export default {
  data: function () {
    return {
      brokers: [],
      broker: null,
      brokerAccounts: [],
      brokerAccount: null,
      reports: [],
      currentReport: null
    }
  },
  methods: {
    addCommas: function (n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    formatDate: function (d) {
      return `${d.getMonth() + 1} / ${d.getDate()} / ${d.getFullYear()}`
    },
    getUser: function () {
      const self = this
      const query = `
        {
          user(token: "${this.$store.state.userToken}") {
            brokers {
              Id
              name
              accounts {
                name
                accountNumber
              }
            }
          }
        }
      `

      this.$graphQLClient.request(query)
        .then(data => {
          self.brokers = data.user.brokers
        })
        .catch(err => {
          console.error(err)
        })
    },
    getReports: function (accountNumber) {
      const self = this
      const query = `
        {
          reports(token: "${this.$store.state.userToken}", accountNumber: "${accountNumber}") {
            Id
            description
            date
            cash
            value
            buyingPower
          }
        }
      `

      this.$graphQLClient.request(query)
        .then(data => {
          const sortedReports = data.reports.sort((a, b) => new Date(a.date) - new Date(b.date))
          self.reports = sortedReports
        })
        .catch(err => {
          console.error(err)
        })
    },
    getCurrent: function (accountNumber) {
      const self = this
      const query = `
        {
          report(token: "${this.$store.state.userToken}", brokerId: "${this.broker.Id}", accountNumber: "${accountNumber}") {
            Id
            description
            date
            cash
            value
            buyingPower
          }
        }
      `

      this.$graphQLClient.request(query)
        .then(data => {
          self.currentReport = data.report
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  watch: {
    broker: function (broker) {
      this.brokerAccounts = broker.accounts
    },
    brokerAccount: function (brokerAccount) {
      this.getReports(brokerAccount.accountNumber)
      this.getCurrent(brokerAccount.accountNumber)
    }
  },
  components: {
    'line-chart': {
      extends: Line,
      props: ['currentReport', 'reports'],
      mounted: function () {
        const allReports = this.reports.concat([this.currentReport])
        const months = allReports.map(r => {
          const d = new Date(r.date)
          return `${d.getMonth() + 1} / ${d.getDate()} / ${d.getFullYear()}`
        })

        this.renderChart({
          labels: months,
          datasets: [
            {
              label: 'Account Value',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              data: allReports.map(r => r.value)
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
  },
  created: function () {
    this.getUser()
  },
  updated: function () {
    var elems = document.querySelectorAll('select')
    window.M.FormSelect.init(elems)
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

  option {
    text-align: center;
  }
</style>
