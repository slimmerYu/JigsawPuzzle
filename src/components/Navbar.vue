<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 20:23:22
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-23 12:12:42
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
          <v-btn
            @click="Rank"
            v-bind="attrs"
            v-on="on"
            color="white"
            class="grey--text"
            >Rank</v-btn
          >
        </template>
        <template v-slot:default="dialog">
          <div
            v-show="isShow"
            style="
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              text-align:center;
              z-index:999;
            "
          >
            <v-progress-circular
              :size="100"
              :width="10"
              indeterminate
              color="#f3e5f5"
            ></v-progress-circular>
          </div>
          <v-card>
            <v-card-title class="title"> Rank </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 300px" class="pa-0">
              <v-row class="ma-0 px-2">
                <v-col>排名</v-col>
                <v-col>用户</v-col>
                <v-col>积分</v-col>
              </v-row>
              <v-row
                v-for="(item, index) in rankData"
                :key="index"
                class="ma-0 px-2"
              >
                <v-col cols="2" class="text-center">{{ index + 1 }}</v-col>
                <v-col cols="6" class="text-center">
                  <v-avatar size="25" color="success">
                    <img :src="item.headPortrait" alt="" />
                  </v-avatar>
                  {{ item.phone | showPhone }}
                </v-col>
                <v-col cols="4" class="text-left">
                  {{ item.grade }}
                </v-col>
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
            <!-- <v-avatar size="80" color="success" >
              <img src="~assets/img/puzzle.png" alt="" />
            </v-avatar> -->
            <!-- 头像 -->

            <CheckAvatar />
            <!-- 用户手机号 -->
            <p class="white--text mt-10">
              {{ $store.state.phone }}
            </p>
          </v-col>
          <v-col class="text-center" text cols="12">
            <p class="white--text mt-2">
              score : {{ $store.state.score }}
              <!-- 根据当前用户获取积分 -->
            </p>
          </v-col>
        </v-row>
        <v-row class="mt-16"></v-row>
        <v-row class="mt-16">
          <v-col class="text-center mt-16" text>
            <v-btn depressed block @click="logOut()" class="py-6">
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
import CheckAvatar from "./common/CheckAvatar";
import { seeRank } from "network/user";
export default {
  components: {
    CheckAvatar,
  },
  data: () => ({
    drawer: null,
    rankData: {}, //排名数据
    isShow: true,
  }),
  filters: {
    showPhone(phone) {
      return phone.substr(0, 3) + "****" + phone.substr(7);
    },
  },
  methods: {
    logOut() {
      // 清空sessionS torage
      sessionStorage.clear();
      this.$router.push("/login");
    },
    Rank() {
      if (JSON.stringify(this.rankData)== '{}') {
        this.isShow = true
      }
      seeRank().then((res) => {
        // console.log(res);
        if (res.data.code === 200) {
          setTimeout(() => {
            this.rankData = res.data.data;
            this.isShow = false
          }, 300);
        }
      });
    },
  },
};
</script>

<style>
</style>