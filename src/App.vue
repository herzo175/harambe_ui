<template>
  <div id="app">
    <div class="row">
      <br />
      <div v-if="$store.state.userToken">
        <div class="col s1 offset-s11">
          <a class="center btn-floating btn-large black" v-on:click="logout">
            <i class="material-icons">exit_to_app</i>
          </a>
        </div>
      </div>
      <div v-else>
        <div class="col s1 offset-s10">
          <router-link
            :to="{ name: 'Login' }"
            v-bind:class="'right btn-floating btn-large black'">
            <i class="material-icons">person</i>
          </router-link>
        </div>
        <div class="col s1">
          <router-link
            :to="{ name: 'Register' }"
            v-bind:class="'center btn-floating btn-large black'">
            <i class="material-icons">person_add</i>
          </router-link>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col s12">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import auth from './utils/auth'

export default {
  name: 'App',
  methods: {
    logout: function () {
      auth.clearAccessToken()
      this.$store.commit('removeUserToken')
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style>
/*
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
*/
#app {
  font-family: 'Source Code Pro'
}

input {
  font-family: 'Source Code Pro';
}

.container {
  padding-top: 5%;
  padding-bottom: 5%;
}

.tabs .tab a {
  color: rgba(0, 0, 0, 0.7);
}

.tabs .tab a:hover, .tabs .tab a.active {
  color: rgba(0, 0, 0, 0.7);
}

.tabs .tab.disabled a,
.tabs .tab.disabled a:hover {
  color: rgba(0, 0, 0, 0.7);
  cursor: default;
}

.tabs .indicator {
  background-color: #000000;
}
</style>
