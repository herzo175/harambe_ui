<template>
  <div class="container">
    <h3>Register</h3>

    <br />

    <div class="row">
      <div class="input field col s12">
        <input id="first-name" type="text" v-model="firstName"/>
        <label for="first-name">First Name</label>
      </div>
    </div>

    <div class="row">
      <div class="input field col s12">
        <input id="last-name" type="text" v-model="lastName"/>
        <label for="last-name">Last Name</label>
      </div>
    </div>

    <br />

    <div class="row">
      <div class="input field col s12">
        <input id="emailAddress" type="email" v-model="emailAddress"/>
        <label for="emailAddress">Email Address</label>
      </div>
    </div>

    <div class="row">
      <div class="input field col s12">
        <input id="password" type="password" v-model="password"/>
        <label for="password">Password</label>
      </div>
    </div>

    <div class="row">
      <div class="input field col s12">
        <input id="confirm-password" type="password" v-model="confirmPassword"/>
        <label for="confirm-password">Confirm Password</label>
      </div>
    </div>

    <div class="row">
      <a class="right btn-floating btn-large black" v-on:click="submit">
        <i class="material-icons">send</i>
      </a>
    </div>
  </div>
</template>

<script>
import auth from '../utils/auth'

// TODO: VALIDATION ESPECIALLY CONFIRM PASSWORD
export default {
  data: function () {
    return {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    submit: function () {
      if (this.verify()) {
        const self = this
        const query = `
          mutation {
            registerUser(
              emailAddress: "${this.emailAddress}",
              password: "${this.password}",
              firstName: "${this.firstName}",
              lastName: "${this.lastName}"
            ) {
              token
            }
          }
        `

        this.$graphQLClient.request(query)
          .then(data => {
            auth.setAccessToken(data.registerUser.token)
            self.$router.push({ path: '/dashboard/performance' })
            self.$store.commit('setUserToken', data.registerUser.token)
          })
          .catch(err => {
            console.error(err)
          })
      }
    },
    verify: function () {
      return (
        (this.firstName && this.lastName && this.emailAddress && this.password && this.confirmPassword) &&
        (this.password === this.confirmPassword))
    }
  }
}
</script>
