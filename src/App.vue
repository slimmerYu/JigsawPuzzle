<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:53:02
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-01-07 23:26:27
-->
<template>
  <v-app>
    <v-main>
      <Navbar v-show="$route.path!=='/login'"/>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import Navbar from './components/Navbar'
export default {
  name: 'App',

  components: {
    Navbar
  },
  data: () => ({ 
    showNav: false//控制Navbar的显示,在登录页不显示,用户成功登录后显示
  }),
  watch: {
   
  }
};
</script>
