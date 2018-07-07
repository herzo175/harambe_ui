<template>
  <div class="container">
    <h3>Login</h3>

    <div class="row">
      <div class="input field col s12">
        <input id="email" type="email" v-model="email"/>
        <label for="email">Email</label>
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
import auth from '../utils/auth'

export default {
  data: function () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    submit: function () {
      const self = this
      const query = `
        mutation {
          login(email: "${this.email}", password: "${this.password}")
        }
      `

      this.$graphQLClient.request(query)
        .then(data => {
          auth.setAccessToken(data.login)
          self.$router.push({ path: '/dashboard/performance' })
          self.$store.commit('setUserToken', data.login)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
