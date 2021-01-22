/*
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:53:02
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-01-08 08:31:19
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user_tel: '' || localStorage.getItem('user_tel')
}

export default new Vuex.Store({
  state,
  mutations: {
    handleUserName: (state, user_tel) => {
      state.user_tel = user_tel//// 把登录的用户的名保存到localStorage中，防止页面刷新，导致vuex重新启动，用户名就成为初始值（初始值为空）的情况
      localStorage.setItem('user_tel', user_tel)
    }
  },
  actions: {
  },
  modules: {
  }
})
