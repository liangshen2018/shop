import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import '@/assets/common.css'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
Vue.prototype.axios = axios
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器
axios.interceptors.response.use(
  function(res) {
    // 对响应数据做点什么
    return res.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
Vue.config.productionTip = false
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
