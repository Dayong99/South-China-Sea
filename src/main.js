import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.css'
import './styles/index.scss'
import animate from 'animate.css'
import utils from './utils/utils'
import "leaflet/dist/leaflet.css"
import L from "leaflet";
import './utils/leaflet.fix'

import map from './utils/map.js'

import store from './store'
import router from './router'

import './utils/error-log' // error log
import request from '@/utils/request'

import '@/permission' // permission control
import db from '@/utils/localstorage'

if (process.env.NODE_ENV === 'development') {
  window.globalConfig = {
    baseURL: 'http://192.168.1.122:8301/warship'
  }
}

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(animate)

Vue.prototype.$getbuffer = request.getbuffer
Vue.prototype.$jsonPut = request.jsonPut
Vue.prototype.$jsonPost = request.jsonPost
Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$delete = request.delete
Vue.prototype.$download = request.download
Vue.prototype.$upload = request.upload
Vue.prototype.$login = request.login
Vue.prototype.$utils = utils
Vue.prototype.$db = db
Vue.prototype.$L = L
Vue.prototype.$utilsMap = map

// const on = Vue.prototype.$on
// // 防抖处理
// Vue.prototype.$on = function(event, func) {
//   let timer
//   let newFunc = func
//   if (event === 'click') {
//     newFunc = function() {
//       clearTimeout(timer)
//       timer = setTimeout(function() {
//         func.apply(this, arguments)
//       }, 5000)
//     }
//   }
//   on.call(this, event, newFunc)
// }
// const on = Vue.prototype.$on
// // 节流
// Vue.prototype.$on = function(event, func) {
//   let previous = 0
//   let newFunc = func
//   if (event === 'click') {
//     newFunc = function() {
//       const now = new Date().getTime()
//       if (previous + 1000 <= now) {
//         func.apply(this, arguments)
//         previous = now
//       }
//     }
//   }
//   on.call(this, event, newFunc)
// }

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
