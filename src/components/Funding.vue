<template>
  <!--TODO: flip animation, submit button, form validaton, choose funding source-->
  <div class="card">
    <div class="card-content">
      <div class="row">
        <div class="col s6">
          <h5>Account Value:</h5>
        </div>
        <div class="col s6">
          <h5>${{addCommas(accountValue)}}</h5>
        </div>
      </div>

      <div class="row">
        <div class="col s6">
          <transition name="flip" mode="out-in">
            <button
              class="btn-floating btn-large green"
              v-on:click="toggleAction"
              v-if="action === '+'">
              <i class="material-icons" v-bind:key="'+'">add</i>
            </button>
            <button
              class="btn-floating btn-large red"
              v-on:click="toggleAction"
              v-else>
              <i class="material-icons" v-bind:key="'-'">remove</i>
            </button>
          </transition>
        </div>
        <div class="input-field col s6">
          <input type="text" v-model="amount" id="amount-field"/>
          <label for="amount-field" class="active center-aligned">Amount</label>
        </div>
      </div>

      <div class="divider"></div>

      <div class="row">
        <div class="col s6">
          <h5>New Total</h5>
        </div>
        <div class="col s6">
          <h5>${{addCommas(calcTotal())}}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      accountValue: 98197,
      amount: 1000,
      action: '+'
    }
  },
  methods: {
    calcTotal: function () {
      const amt = parseFloat(this.amount)

      if (isNaN(amt)) {
        return this.accountValue.toFixed(2)
      } else if (this.action === '+') {
        return (this.accountValue + amt).toFixed(2)
      } else {
        return (this.accountValue - amt).toFixed(2)
      }
    },
    addCommas: function (n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    toggleAction: function () {
      this.action = this.action === '+' ? '-' : '+'
    }
  }
}
</script>

<style>
  #amount-field {
    text-align: center;
    font-size: 1.67em;
  }

  label[for="amount-field"] {
    display: block;
    text-align: center;
    width: 90%;
  }

  label[for="amount-field"].active {
    text-align: left;
  }

  .col .s6 {
    text-align: center;
  }

  .flip-enter-active, .flip-leave-active {
    transition: translateY(70px) .7s ease;
  }
</style>
