/*
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:53:02
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-01-21 16:14:22
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'
Vue.prototype.$axios = axios;


Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

