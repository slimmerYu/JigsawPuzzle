<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-02-22 16:53:14
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-22 18:18:17
-->
<template>
  <div class="help">
    <v-dialog max-width="600" scrollable width="80%">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on" icon>
          <v-icon>mdi-help-circle</v-icon>
        </v-btn>
      </template>

      <template v-slot:default="dialog">
        <v-card>
          <v-card-title class="title"> 游戏介绍 </v-card-title>
          <v-divider></v-divider>
          <v-card-text style="height: 500px" class="">
            <v-row class="mt-4">
              <v-col cols="4" class="pe-0 text-subtitle-1">
                <strong>选择图片:</strong>
              </v-col>
              <v-col cols="8" class="pl-0">
                提供三种方式选择游戏图片, 分别是
                <strong>拍照、从相册|文件夹选择、默认图片</strong>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="pe-0 text-subtitle-1">
                <strong>选择等级:</strong>
              </v-col>
              <v-col cols="8" class="pl-0">
                提供三种游戏等级, 分别是
                <strong>初级3*3、中级 4*4、高级 5*5</strong>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="pe-0 text-subtitle-1">
                <strong>打乱拼图:</strong>
              </v-col>
              <v-col cols="8" class="pl-0">
                点击按钮 <strong>打乱拼图</strong> 开始游戏
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="pe-0 text-subtitle-1">
                <strong>查看原图:</strong>
              </v-col>
              <v-col cols="8" class="pl-0">
                提供 <strong>查看原图</strong> 功能，
                玩家可通过查看原图决定如何继续游戏
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="pe-0 text-subtitle-1">
                <strong>显示序号:</strong>
              </v-col>
              <v-col cols="8" class="pl-0">
                提供 <strong>显示序号</strong> 功能，
                玩家可通过查看拼图块序号决定如何继续游戏
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="pe-0 text-subtitle-1">
                <strong>自动拼图:</strong>
              </v-col>
              <v-col cols="8" class="pl-0">
                提供 <strong>自动拼图</strong> 功能， 点击按钮后游戏自己执行，
                期间无法进行另外的操作
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="pe-0 text-subtitle-1">
                <strong>提示:</strong>
              </v-col>
              <v-col cols="8" class="pl-0">
                提供 <strong>提示</strong> 功能， 每点击一次提示按钮，
                拼图走一格， 直到提示步数用完。<br />
                提示步数计算方法：<br />
                - 3*3 ： 1/5 * step 步<br />
                - 4*4 ： 2/5 * step 步<br />
                - 5*5 ： 3/5 * step 步<br />
                - step : 当前拼图所需最少步数
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="pe-0 text-subtitle-1">
                <strong>保存进度:</strong>
              </v-col>
              <v-col cols="8" class="pl-0">
                提供 <strong>保存进度</strong> 功能， 点击保存进度按钮，
                输入当前进度标题， 或使用默认标题，
                选择保存按钮即可成功保存当前游戏
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="pe-0 text-subtitle-1">
                <strong>读取进度:</strong>
              </v-col>
              <v-col cols="8" class="pl-0">
                提供 <strong>读取进度</strong> 功能， 点击读取进度按钮，
                展示已保存的游戏进度， 选择想要加载的游戏进度，
                你也可以删除不需要的游戏进度
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="pe-0 text-subtitle-1">
                <strong>查看排名:</strong>
              </v-col>
              <v-col cols="8" class="pl-0">
                提供 <strong>查看排名</strong> 功能， 选择游戏右上角的排名按钮，
                展示积分排名前 <strong>100</strong> 的游戏玩家
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="pe-0 text-subtitle-1">
                <strong>更换头像:</strong>
              </v-col>
              <v-col cols="8" class="pl-0">
                提供 <strong>更换头像</strong> 功能， 点击自己的头像，
                点击右上角的相册按钮，选择图片更换即可
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text color="purple" @click="dialog.value = false"> Ok </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
  }),
};
</script>

<style>
</style>