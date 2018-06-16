import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Landing from '@/components/Landing'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Algorithm from '@/components/Algorithm'
import Performance from '@/components/Performance'
import Funding from '@/components/Funding'
import Settings from '@/components/Settings'
import Auth from '../utils/auth'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      mode: 'history',
      props: true,
      beforeEnter: function (to, from, next) {
        if (!Auth.checkAuth()) {
          Auth.clearAccessToken()
          next({ path: '/login' })
        } else {
          next()
        }
      },
      children: [
        {
          path: 'algorithm',
          name: 'Algorithm',
          component: Algorithm
        },
        {
          path: 'performance',
          name: 'Performance',
          component: Performance
        },
        {
          path: 'funding',
          name: 'Funding',
          component: Funding
        },
        {
          path: 'settings',
          name: 'Settings',
          component: Settings
        }
      ]
    }
  ]
})
