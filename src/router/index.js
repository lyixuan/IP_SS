import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Statistics from '@/components/Statistics'
import Deploy from '@/components/Deploy'
import Upgrade from '@/components/Upgrade'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/statistics',
      name: 'Statistics',
      component: Statistics
    },
    {
      path: '/deploy',
      name: 'Deploy',
      component: Deploy
    },
    {
      path: '/upgrade',
      name: 'Upgrade',
      component: Upgrade
    }
  ]
})
