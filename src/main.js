
import Vue from 'vue'
import App from './App'
import router from './router'
import util from './common/util'
import store from './store'
import Vuex from 'vuex'
import  $ from 'jquery'

// import layui from '../static/ladmin/lib/layui/layui.js'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
var axios = require('axios')
axios.defaults.baseURL = 'http://localhost:8088/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据

/*import '../static/css/main.css';
import '../static/css/theme-green/index.css';
import '../static/css/theme-green/color-green.css';*/
window.moment=require('moment')
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(util);
Vue.use(Vuex);
// Vue.use(layui);
// Vue.use(xadmin);
// Vue.use($);
//axios拦截器

 // axios.defaults.withCredentials=true
axios.interceptors.request.use(
  config => {
// config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    let token =sessionStorage.getItem('token');
    if (token) {
      /*config.headers.common['token'] =localStorage.getItem('token');*/
      config.headers.common['Authorization']=token

   config.headers.Token=token
     // axios.defaults.headers.common['Authorization']=token

    }
    return config
  },
  err => {
    return Promise.reject(err);
  }

)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
