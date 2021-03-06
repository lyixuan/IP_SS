// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'


Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueResource)

window.BASE_PATH ='http://' +window.location.host+':3000/'

/* eslint-disable no-new */
require('../static/tool')
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
