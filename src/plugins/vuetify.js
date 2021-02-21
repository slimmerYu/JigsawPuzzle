/*
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 20:00:06
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-18 21:22:56
 */
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg'|| 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  theme: {
    themes: {
      light: {
        primary: '#9652ff',
        success: '#4caf50',
        info: '#e9f5ea',
        error: '#ff5252' 
      }
    }
  }
});
