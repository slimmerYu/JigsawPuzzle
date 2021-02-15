<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 20:23:22
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-15 14:59:09
-->
<template>
  <nav>
    <v-app-bar class="grey lighten-4">
      <v-app-bar-nav-icon
        class="grey--text"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title class="text-uppercase grey--text">
        <span>JigsawPuzzle</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-dialog transition="dialog-top-transition" max-width="600" scrollable>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" color="white" class="grey--text"
            >Rank</v-btn
          >
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="primary" dark>Rank</v-toolbar>
            <v-card-text style="height: 300px;" class="pa-0">
              <v-row v-for="item in 100" :key="item" class="ma-0 px-2">
                <v-col cols="2" class="text-center">{{item}}</v-col>
                <v-col cols="6" class="text-center">
                  <v-avatar size="25" color="success">
                    <img src="~assets/img/puzzle.png" alt="" />
                  </v-avatar>
                  {{ $store.state.user_tel }}
                </v-col>
                <v-col cols="4" class="text-left">100</v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" class="primary">
      <v-container>
        <v-row class="mt-4 mb-16">
          <v-col class="text-center" text cols="12">
            <v-avatar size="80" color="success" >
              <img src="~assets/img/puzzle.png" alt="" />
            </v-avatar>
            <!-- <CheckAvatar :drawer="drawer" @changeDrawer="changeDrawer"/> -->
            <p class="white--text mt-10">
              {{ $store.state.user_tel }}
            </p>
          </v-col>
          <v-col class="text-center" text cols="12">
            <p class="white--text mt-2">
              score :
              <!-- 根据当前用户获取积分 -->
            </p>
          </v-col>
        </v-row>
        <v-row class="mt-16">
          <v-col class="text-center mt-16" text>
            <v-btn
              text
              color="white"
              class="white--text"
              block
              @click="logOut()"
            >
              <span>Logout</span>
              <v-icon right>mdi-exit-to-app</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-footer padless absolute>
        <v-col class="text-center" cols="12">
          Copyright © 2021 slimmerYu. All rights reserved.
        </v-col>
      </v-footer>
    </v-navigation-drawer>
  </nav>
</template>

<script>
// import CheckAvatar from './common/CheckAvatar'
export default {
  components: {
    // CheckAvatar
  },
  data: () => ({
    drawer: null,
  }),
  methods: {
    logOut() {
      this.$router.replace({ path: "/login" });
      location.reload();
    },
    // changeDrawer(param) {
    //   this.drawer = param
    //   console.log(this.drawer);
    // }
  },
};
</script>

<style>
</style>