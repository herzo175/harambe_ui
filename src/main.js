// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import materialize from 'materialize-css'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import Auth from './utils/auth'
import { GraphQLClient } from 'graphql-request'

Vue.config.productionTip = false

Vue.use(materialize)
Vue.use(Vuex)
Vue.use(VueMaterial)

// TODO: 404 page
Vue.prototype.$endpoint = 'http://localhost:5000'
Vue.prototype.$graphQLClient = new GraphQLClient(Vue.prototype.$endpoint + '/graphql')

const store = new Vuex.Store({
  state: {
    userToken: Auth.checkAuth() ? Auth.getAccessToken() : null,
    userId: this.userToken ? Auth.readAccessToken(this.userToken)._id : null
  },
  mutations: {
    setUserToken (state, token) {
      state.userToken = token
      state.userId = Auth.readAccessToken(token)._id
    },
    removeUserToken (state) {
      state.userToken = null
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  materialize,
  components: { App },
  template: '<App/>',
  store
})
