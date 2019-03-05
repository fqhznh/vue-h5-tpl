import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from './config'
import $ from 'jquery'

Vue.config.productionTip = false
Vue.prototype.$config = config

window.Vue = Vue
window.$ = $

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
