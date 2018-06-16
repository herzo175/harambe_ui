// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import materialize from 'materialize-css'
import Auth from './utils/auth'

Vue.config.productionTip = false

Vue.use(materialize)
Vue.use(Vuex)

Vue.prototype.$endpoint = 'http://localhost:8000'

const store = new Vuex.Store({
  state: {
    userToken: Auth.getAccessToken(),
    user: this.userToken ? Auth.readAccessToken(this.userToken).user : null
  },
  mutations: {
    setUserToken (state, token) {
      state.userToken = token
      state.user = Auth.readAccessToken(token).user
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
