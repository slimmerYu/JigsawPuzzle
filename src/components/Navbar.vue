<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 20:23:22
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-01-22 20:53:12
-->
<template>
  <nav>
    <v-app-bar
      class="grey lighten-4">
      <v-app-bar-nav-icon 
        class="grey--text"  
        @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title 
        class="text-uppercase grey--text">
        <span>JigsawPuzzle</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn 
        color="white"
        class="grey--text">
        <span>Sign Out</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer app 
      v-model="drawer" 
      class="primary">
      <v-container>
      <v-row class="mt-4 mb-16">
        <v-col class="mb-16 text-center" text>
            <v-avatar size="100" color="success">
              <img src="~assets/img/puzzle.png" alt="">
            </v-avatar>
            <p class="white--text mt-10">
              {{$store.state.user_tel}}
            </p>
        </v-col>
      </v-row>
      <v-row class="mt-16">
        <v-col class="text-center mt-16" text>
          <v-btn 
            text 
            color="white" 
            class="white--text"
            @click="logOut()"
            >
            <span>Sign Out</span>
            <v-icon right>mdi-exit-to-app</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      </v-container>
      <v-footer padless absolute>
        <v-col
          class="text-center"
          cols="12"
        >
          Copyright © 2021 slimmerYu. All rights reserved. 
        </v-col>
      </v-footer>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data: () => ({
    drawer: null 
  }),
  methods: {
    logOut() {
      
      this.$router.replace({path: '/login'});
      location.reload();
    }
  }
}
</script>

<style>

</style>