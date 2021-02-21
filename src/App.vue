<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:53:02
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-21 11:43:38
-->
<template>
  <v-app>
    <v-main>
      <Navbar v-show="$route.path !== '/login'" />
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import Navbar from "./components/Navbar";
export default {
  name: "App",

  components: {
    Navbar,
  },
  data: () => ({
    showNav: false, //控制Navbar的显示,在登录页不显示,用户成功登录后显示
  }),
  created() {
    
    //在页面加载时读取sessionStorage里的状态信息

    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  },
};
</script>
