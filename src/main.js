import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from './config'
import $ from 'jquery'

import 'vue2-toast/lib/toast.css'
import Toast from 'vue2-toast'

// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.config.productionTip = false
Vue.prototype.$config = config

Vue.use(Toast, {
  type: 'center',
  duration: 3000,
  wordWrap: true,
  width: '150px'
})

window.Vue = Vue
window.$ = $
window.ua = new UA(navigator.userAgent)
window.$loading = Vue.prototype.$loading
window.$toast = Vue.prototype.$toast

// 处理微信+iOS不能滑动及关闭对话框的问题
if (ua.browser.name === '微信' && ua.os.name === 'iOS') {
  $(document).delegate('input, textarea', 'blur', () => {
    setTimeout(() => {
      $('html').animate({ height: '100.1vh' }, 100, () => {
        $(this).animate({ height: '100vh' }, 1)
      })
      // 触发浏览器重绘
      /* eslint-disable no-self-assign */
      document.body.scrollTop = document.body.scrollTop
    }, 100)
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
