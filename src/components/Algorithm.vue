<template>
    <!--
      TODO: form validation, submit buttons
      Timeline slider
      Update graph of potential performance
      Algorithm Settings (waiting period, data period, trend strength, rate of change, volatility)
    -->
    <div class="card">
      <div v-if="brokers.length > 0" class="card-content">
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

        <br/>
        <br/>
        <br/>
      </div>

      <div class="card-content valign center">
        <div class="card">
          <div class="card-content">
            <h4>Algorithm:</h4>
            <!--TODO: marketplace of algorithms, search for algorithm link TOS-->
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <!--TODO: error message and link to crontab guru if invalid cron-->
            <h4>Schedule</h4>

            <input type="text" id="cron_input" placeholder="* * * * * *"/>
            <label for="cron_input">Cron String</label>

            <h5>Starting On</h5>
            <input type="text" class="datepicker">
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <h3>Total Value: ${{accountValue}}</h3>
            <div class="input-field col s12">
              <select v-model="show">
                <option value="shares" selected>Shares</option>
                <option value="profit">Profit</option>
                <option value="value">Total Value</option>
              </select>
            </div>

            <div class="container">
              <d-chart
                v-bind:portfolio="portfolio"
                v-bind:accountValue="accountValue"
                v-bind:show="show"></d-chart>
            </div>

            <div class="container">
              <h5>Max Allocation Percentage:</h5>
              <p class="range-field" v-for="p in pool" v-bind:key="p.symbol">
                {{ p.symbol }}
                <input type="range" min="0" max="50" v-model="p.maxAllocation"/>
              </p>

              <a
                class="btn-floating black"
                v-on:click="() => showNewSecurityForm = true"
                v-if="showNewSecurityForm === false">
                <i class="material-icons">add</i>
              </a>

              <div class="row" v-else>
                <a
                  class="btn-floating black"
                  v-on:click="() => showNewSecurityForm = false">
                  <i class="material-icons">expand_less</i>
                </a>

                <input id="new-symbol" type="text" v-model="newSymbol"/>
                <label for="new-symbol">Security Symbol</label>

                <p class="range-field">
                  Max Allocation
                  <input type="range" min="0" max="50" v-model="newAllocation"/>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <h3>Algo Settings</h3>

            <h5>Data Period</h5>
            <p class="range-field">
              <input type="range" min="1" max="5" v-model="dataPeriod"/>
            </p>

            <h5>Waiting Period</h5>
            <p class="range-field">
              <input type="range" min="1" max="5" v-model="waitingPeriod"/>
            </p>

            <h5>Trend Strength</h5>
            <p class="range-field">
              <input type="range" min="1" max="5" v-model="trendStrength"/>
            </p>

            <h5>Rate of Change</h5>
            <p class="range-field">
              <input type="range" min="1" max="5" v-model="rateOfChange"/>
            </p>

            <h5>Volatility</h5>
            <p class="range-field">
              <input type="range" min="1" max="5" v-model="volatility"/>
            </p>
          </div>
        </div>

      </div>
    </div>
</template>

<script>
import { Doughnut } from 'vue-chartjs'
const ColorHash = require('color-hash')

export default {
  data: function () {
    return {
      brokers: [],
      broker: null,
      brokerAccounts: [],
      brokerAccount: null,
      cron: '',
      show: 'shares',
      accountValue: 98197,
      showNewSecurityForm: false,
      newSymbol: '',
      newAllocation: 20,
      dataPeriod: 3,
      waitingPeriod: 3,
      trendStrength: 2,
      rateOfChange: 4,
      volatility: 2,
      portfolio: [
        {
          symbol: 'GOOG',
          shares: 25,
          value: 25000,
          profit: 1527
        },
        {
          symbol: 'AMZN',
          shares: 45,
          value: 67500,
          profit: 8195
        },
        {
          symbol: 'MSFT',
          shares: 20,
          value: 2000,
          profit: 200
        }
      ],
      pool: [
        {
          symbol: 'GOOG',
          maxAllocation: 40
        },
        {
          symbol: 'AMZN',
          maxAllocation: 40
        },
        {
          symbol: 'MSFT',
          maxAllocation: 30
        },
        {
          symbol: 'FB',
          maxAllocation: 10
        }
      ]
    }
  },
  methods: {
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
          console.log(data)
          self.brokers = data.user.brokers
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  components: {
    'd-chart': {
      props: ['portfolio', 'show', 'accountValue'],
      extends: Doughnut,
      data: function () {
        return {
          options: {
            legend: {
              labels: {
                fontFamily: 'Source Code Pro'
              }
            }
          }
        }
      },
      methods: {
        generateLabels: function () {
          return this.portfolio.map(e => e.symbol).concat(['Cash'])
        },
        generateColor: function (symbol) {
          const ch = new ColorHash()
          const c = ch.rgb(symbol)
          return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0.7)'
        },
        generateColors: function () {
          return this.generateLabels().map(e => this.generateColor(e))
        },
        generateData: function () {
          switch (this.show) {
            case 'shares':
              return this.portfolio.map(e => e.shares)

            case 'profit':
              return this.portfolio.map(e => e.profit)

            case 'value':
              return this.portfolio.map(e => e.value).concat([
                this.accountValue - this.portfolio.reduce((acc, e) => acc + e.value, 0)])

            default:
              break
          }
        },
        generateChart: function () {
          return this.renderChart({
            labels: this.generateLabels(),
            datasets: [
              {
                backgroundColor: this.generateColors(),
                data: this.generateData()
              }
            ]
          }, this.options)
        }
      },
      mounted: function () {
        this.generateChart()
      },
      watch: {
        show: function () {
          this.generateChart()
        }
      }
    }
  },
  created: function () {
    console.log('created')
    this.getUser()
  },
  mounted: function () {
    let datepickers = document.querySelectorAll('.datepicker')
    let selects = document.querySelectorAll('select')
    window.M.Datepicker.init(datepickers)
    window.M.FormSelect.init(selects)
  },
  updated: function () {
    var elems = document.querySelectorAll('select')
    window.M.FormSelect.init(elems)
  }
}
</script>

<style>
  input {
    text-align: center;
  }
</style>
