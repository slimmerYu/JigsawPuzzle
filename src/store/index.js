/*
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:53:02
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-21 13:38:50
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  token: '',
  score:'',//游戏积分
  phone:'',//用户手机号码
  avatar:'',//用户头像地址
  id:'',//用户ID
  imgUrl: "",//当前拼图图片地址
  level: 0,//当前拼图等级
  puzzle: [1,2,3,4,5,6,7,8,0],//当前拼图数组序列
}

export default new Vuex.Store({
  state,
  mutations: {
    set_user: (state, user) => {
      sessionStorage.token = user.token
      state.token = user.token
      state.score = user.grade
      state.phone = user.phone
      state.id = user.id
      state.avatar = user.headPortrait
    },
    changeScore: (state, score) => {
      state.score = score
    },
    changeAvatar: (state, avatar) => {
      state.avatar = avatar
    },
    changeImgUrl: (state, imgUrl) => {
      state.imgUrl = imgUrl
    },
    changeLevel: (state, level) => {
      state.level = level
    },
    changePuzzle: (state, puzzle) => {
      state.puzzle = puzzle
    }
  },
  actions: {
  },
  modules: {
  }
})
