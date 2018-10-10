<template>
  <div class="container">
    <h3>Login</h3>

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
      <a class="right btn-floating btn-large black" v-on:click="submit">
        <i class="material-icons">send</i>
      </a>
    </div>
  </div>
</template>

<script>
// TODO: enter button activates login
import auth from '../utils/auth'

export default {
  data: function () {
    return {
      emailAddress: '',
      password: ''
    }
  },
  methods: {
    submit: function () {
      const self = this
      const query = `
        mutation {
          loginUser(emailAddress: "${this.emailAddress}", password: "${this.password}") {
            token
          }
        }
      `

      this.$graphQLClient.request(query)
        .then(data => {
          auth.setAccessToken(data.loginUser.token)
          self.$router.push({ path: '/dashboard/performance' })
          self.$store.commit('setUserToken', data.loginUser.token)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
