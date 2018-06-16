<template>
    <!--
      TODO: form validation, submit buttons
      Timeline slider
      Update graph of potential performance
      Algorithm Settings (waiting period, data period, trend strength, rate of change, volatility)
    -->
    <div class="card">
      <div class="card-content valign center">

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
  mounted: function () {
    var elems = document.querySelectorAll('select')
    window.M.FormSelect.init(elems)
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
  }
}
</script>

<style>
  input {
    text-align: center;
  }
</style>
