<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:53:02
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-21 15:21:51
-->
<template>
  <div class="home">
    <v-snackbar centered text outlined color="success" v-model="snackbar">
      {{
        isPass === 1
          ? "拼图成功, 使用了自动拼图功能, 不计分"
          : "拼图成功, 当前拼图等级: " +
            (stateLevel === 0 ? "3*3" : stateLevel === 1 ? "4*4" : "5*5") +
            " 积分 + " +
            (stateLevel === 0 ? "2" : stateLevel === 1 ? "5" : "10")
      }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-container class="wrap">
      <v-row no-gutters class="mb-4">
        <v-col md="7" cols="12" class="pa-4">
          <!-- 拼图面板 -->
          <v-container class="pa-0">
            <v-row no-gutters class="puzzle mx-auto">
              <v-col
                :cols="stateLevel === 0 ? 4 : stateLevel === 1 ? 3 : 0"
                @click.prevent="clickBlock(index)"
                v-for="(puzzle, index) in statePuzzle"
                :key="puzzle"
                v-text="puzzle"
                :class="
                  puzzle === '0' || puzzle === 0 ? 'cell cell-zero' : 'cell'
                "
              >
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col md="4" offset-md="1" cols="12" class="">
          <!-- 功能面板 -->
          <v-container class="operate ma-0">
            <v-row no-gutters class="pe-md-12" justify="center">
              <!-- 选择图片 -->
              <v-col md="12" cols="4" text class="text-center mb-4 mt-md-8">
                <!-- <ChooseImg @imgUrl="getImgUrl" /> -->
                <ChooseImg @imgUrl="getImgUrl" />
              </v-col>
              <!-- 等级选择 -->
              <v-col md="12" cols="4" text class="text-center mb-4">
                <!-- PC端 -->
                <v-dialog transition="dialog-top-transition" max-width="600">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      elevation="1"
                      outlined
                      v-bind="attrs"
                      v-on="on"
                      class="d-none d-sm-flex ma-auto"
                      >选择等级</v-btn
                    >
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-toolbar color="primary" dark>选择等级</v-toolbar>
                      <v-list class="text-center">
                        <v-list-item
                          v-for="(item, i) in level"
                          :key="i"
                          @click="
                            levelChoose(i);
                            dialog.value = false;
                          "
                        >
                          <v-list-item-title>{{
                            item.title
                          }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                      <v-card-actions class="justify-end">
                        <v-btn text @click="dialog.value = false">Close</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
                <!-- 移动端 -->
                <v-bottom-sheet v-model="sheet">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="d-flex d-sm-none"
                      color="primary"
                      elevation="1"
                      outlined
                      v-bind="attrs"
                      v-on="on"
                    >
                      选择等级
                    </v-btn>
                  </template>
                  <v-list class="text-center">
                    <v-subheader>选择等级</v-subheader>
                    <v-list-item
                      class="my-2"
                      v-for="(item, i) in level"
                      :key="i"
                      @click="
                        levelChoose(i);
                        sheet = false;
                      "
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-bottom-sheet>
              </v-col>
              <!-- 打乱拼图 -->
              <v-col md="12" cols="4" text class="text-center mb-4">
                <v-btn id="btnShuffle" elevation="1" outlined @click="shuffle" color="primary">
                  打乱拼图
                </v-btn>
              </v-col>
              <!-- 查看原图 -->
              <v-col md="12" cols="4" text class="text-center mb-4">
                <v-dialog transition="dialog-top-transition" max-width="600">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      elevation="1"
                      outlined
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      id="btnSeeImg"
                      >查看原图</v-btn
                    >
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-toolbar color="primary" dark>查看原图</v-toolbar>
                      <v-card-text class="text-center pa-0 pt-2">
                        <!-- <div class="text-h2 pa-12">Hello world!</div> -->
                        <img :src="stateImgUrl" style="width: 86%" alt="" />
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn text @click="dialog.value = false">关闭</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </v-col>
              <!-- 自动拼图 -->
              <v-col md="12" cols="4" text class="text-center mb-4">
                <v-btn
                  id="btnAutoPlay"
                  elevation="1"
                  outlined
                  @click="autoPlay()"
                  color="primary"
                >
                  自动拼图
                </v-btn>
              </v-col>
              <!-- 显隐序号 -->
              <v-col md="12" cols="4" text class="text-center mb-4">
                <v-btn
                  elevation="1"
                  outlined
                  @click="showNumber()"
                  color="primary"
                >
                  {{ isShowNum ? "隐藏序号" : "显示序号" }}
                </v-btn>
              </v-col>
              <!-- 保存进度 -->
              <v-col md="12" cols="6" text class="text-center mb-4">
                <v-dialog transition="dialog-top-transition" max-width="600">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      elevation="1"
                      outlined
                      id="btnSave"
                      @click="saveBefore"
                      >保存进度</v-btn
                    >
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-toolbar color="primary" dark>保存进度</v-toolbar>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-text-field
                                label="title: "
                                required
                                clearable
                                v-model="saveTitle"
                                :rules="[rules.required]"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn id="closeSave" text @click="dialog.value = false"
                          >Close</v-btn
                        >
                        <v-btn text @click="saveProgress()">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </v-col>
              <!-- 读取进度 -->
              <v-col md="12" cols="6" text class="text-center mb-4">
                <v-dialog
                  transition="dialog-top-transition"
                  max-width="600"
                  scrollable
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      elevation="1"
                      outlined
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click="readProgress()"
                      >读取进度</v-btn
                    >
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-toolbar color="primary" dark>选择游戏进度</v-toolbar>
                      <v-divider></v-divider>
                      <v-card-text style="height: 300px" class="">
                        <v-radio-group v-model="progress" column>
                          <v-radio
                            v-for="(radio,index) in progressData"
                            :key="index"
                            :value="index"
                            style="border-bottom:1px solid #F3E5F5"
                          >
                            <template v-slot:label>
                              <v-row class="ma-0 pa-2">
                                <v-col class="pa-0 mb-2 text-h5" cols="12">
                                {{radio.title}}
                                </v-col>
                                <v-col class="pa-0" cols="12">
                                  保存时间: 
                                  
                                {{radio.createTime | formatDate}}
                                </v-col>
                              </v-row>
                            </template>
                          </v-radio>
                        </v-radio-group>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-btn text @click="delProgress">删除</v-btn>
                        <v-btn text @click="dialog.value = false;chooseProgress()">选择</v-btn>
                        <v-btn text @click="dialog.value = false">关闭</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </v-col>
              <v-snackbar v-model="progressSnackbar" 
      :timeout="2000" centered color="primary">
                {{progressSnackbarText}}
                <template v-slot:action="{ attrs }">
                  <v-btn
                    color="white"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                  >
                    Close
                  </v-btn>
                </template>
              </v-snackbar>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import testJson from '../../public/test.json'
import _ from "lodash";
// import qs from "qs";
import ChooseImg from "./childComps/ChooseImg.vue";
import {
  getPuzzle,
  autoPlay,
  saveProgress,
  getProgress,
  addScore,
  deletePro
} from "network/puzzle";
export default {
  name: "Home",
  components: {
    ChooseImg,
  },
  data: () => ({
    // puzzles: [],
    level: [
      { title: "初级 3*3" },
      { title: "中级 4*4" },
      { title: "高级 5*5" },
    ],
    sheet: false, //移动端等级选择底部工作表
    // cols: 4, //方块占位, 4 3*3; 3 4*4; 0 5*5
    isPass: null, //判断是否拼图成功
    snackbar: false, //控制提示框显示与隐藏
    imgUrl: "",
    isShowNum: false, //控制序号的显示与隐藏
    progress: "", //用于读取进度单选组的值
    progressData: [], //获取的进度数据
    saveTitle: "", //用于保存进度标题
    rules: {
      //保存进度title
      required: (value) => !!value || "Required.",
    },
    isAuto: false, //判断是否使用了自动拼图功能
    progressSnackbar: false, //进度消息条
    progressSnackbarText:'',//进度消息条内容
    resizePuzzle:[],//用于窗口大小变化重新赋值puzzle
  }),
  computed: {
    stateImgUrl() {
      return this.$store.state.imgUrl;
    },
    stateLevel() {
      return this.$store.state.level;
    },
    statePuzzle() {
      return this.$store.state.puzzle;
    }
  },
  filters: {
    // 将时间戳转换为时间
    formatDate(value){
	var date = new Date(value * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y+M+D+h+m+s
  }
  },
  methods: {
    // 难度选择:改变每行方块数量,数组长度,方块高度
    levelChoose(index) {
      this.$store.commit('changeLevel',index)
      if (this.stateLevel === 0) {
        //初级下标 3*3
        // this.cols = 4;
        this.render(this.stateLevel);
      } else if (this.stateLevel === 1) {
        //中级下标 4*4
        // this.cols = 3;
        this.render(this.stateLevel);
      } else if (this.stateLevel === 2) {
        //高级下标 5*5
        // this.cols = 0;
        this.setLevel5();
        this.render(this.stateLevel);
      }
      this.notClick();
    },
    setLevel5() {
      this.$nextTick(() => {
        // console.log(this.puzzles);
        let cells = document.querySelectorAll(".cell");
        // console.log(cells);
        for (let i = 0; i < cells.length; i++) {
          // console.log('cells');
          // 无论有没有此类名都移除
          cells[i].classList.toggle("col-4", false);
          cells[i].classList.toggle("col-3", false);
          cells[i].classList.toggle("col-0", false);
          cells[i].classList.add("level-5");
          // console.log("类名", cells[i].classList);
        }
      });
    },
    // 自己拼图
    autoPlay() {
      this.isAuto = !this.isAuto;
      let level = this.stateLevel === 0 ? 3 : this.stateLevel === 1 ? 4 : 5;
      // switch (this.stateLevel) {
      //   case 4:
      //     level = 3;
      //     break;
      //   case 3:
      //     level = 4;
      //     break;
      //   case 0:
      //     level = 5;
      //     break;

      //   default:
      //     break;
      // }
      console.log("获取后台步骤数据");
      const _this = this;
      autoPlay({ node: _.join(this.statePuzzle, ","), num: level }).then((res) => {
        console.log(res);
        // 如果请求成功,执行点击方法,自动复原
        if (res.data.code === 200) {
          //通过步骤,for循环调用点击方法
          let step = res.data.data.simpleProcess;
          for (let i = 0; i < step.length; i++) {
            (function () {
              //将延时器整个的包裹在一个子执行函数中
              setTimeout(() => {
                console.log(step[i]);
                _this.clickBlock(step[i]);
              }, i * 500); //想要每隔0.5秒调用一次，而不是同时调用，要将参数传进时间中
            })(i); //把每个循环中的 i 在被回收之前直接传入到自执行函数中，这样就可以避免被回收
          }
        } else {
          //弹出提示框,请求有误,重新尝试
          console.log("请求有误");
        }
      });
      // this.$axios
      //   .post(
      //     "http://a.wpengsen.cn:8989/puzzle/automaticCalculation",
      //     qs.stringify({ node: _.join(this.puzzles, ","), num: level })
      //   )
      //   .then((res) => {
      //     console.log(res);
      //     // 如果请求成功,执行点击方法,自动复原
      //     if (res.status === 200) {
      //       //通过步骤,for循环调用点击方法
      //       console.log(res.data.data.simpleProcess);
      //       let step = res.data.data.simpleProcess;
      //       for (let i = 0; i < step.length; i++) {
      //         (function () {
      //           //将延时器整个的包裹在一个子执行函数中
      //           setTimeout(() => {
      //             console.log(step[i]);
      //             _this.clickBlock(step[i]);
      //           }, i * 500); //想要每隔0.5秒调用一次，而不是同时调用，要将参数传进时间中
      //         })(i); //把每个循环中的 i 在被回收之前直接传入到自执行函数中，这样就可以避免被回收
      //       }
      //     } else {
      //       //弹出提示框,请求有误,重新尝试
      //       console.log("请求有误");
      //     }
      //   });
    },
    // 打乱
    shuffle() {
      this.canClick();
      // 向后台传入当前游戏等级, 请求打乱的序列
      let level = this.stateLevel === 0 ? 3 : this.stateLevel === 1 ? 4 : 5;
      console.log(level);
      console.log(this.progress);
      if (this.progress !== '') {
        console.log('读取打乱');
      // 读取进度打乱拼图
        let data = this.progressData[this.progress]
        // 将返回的字符串以逗号分割转为数组
        data.array = _.split(data.array,',')
        // 将字符串数组转为数字数组
        data.array = data.array.map(Number)
        setTimeout(() => {
          this.$store.commit('changePuzzle',data.array)
        },1000)
      } else {
        // 开始新的游戏, 打乱拼图
        console.log("获取后台传入的数组序列");
        getPuzzle({ num: level }).then((res) => {
          console.log(res);
          if (res.data.code === 200) {
            // console.log(res.data.data);
          this.$store.commit('changePuzzle',res.data.data)
          } else {
            //弹出提示框,请求有误,重新尝试
            console.log("请求有误");
          }
        });
      }
      // this.$axios
      //   .post(
      //     "http://a.wpengsen.cn:8989/puzzle/generatedData",
      //     qs.stringify({ num: level }),
      //     {headers:{'Authorization': 'Bearer ' + this.$store.token,}}
      //   )
      //   .then((res) => {
      //     console.log(res);
      //     // 如果请求成功,执行点击方法,自动复原
      //     if (res.status === 200) {
      //       // console.log(res.data.data);
      //       this.puzzles = res.data.data;
      //     } else {
      //       //弹出提示框,请求有误,重新尝试
      //       console.log("请求有误");
      //     }
      //   });
    },
    // 动态设置cell高度
    setHeight() {
      let puzzle = document.querySelector(".puzzle");
      puzzle.style.height = puzzle.offsetWidth + "px";
    },
    // 获取从子组件ChooseImg传来的图片地址
    // 获取存储在state中的拼图图片地址
    getImgUrl(data) {
      //子组件data
      // this.imgUrl = data;
      // console.log('父组件',this.imgUrl);
      console.log(data);
      // console.log(this.stateImgUrl);
      this.imgRender()
       document.querySelector('#btnShuffle').classList.remove("v-btn--disabled");
      document.querySelector('#btnSeeImg').classList.remove("v-btn--disabled");
      // switch (this.cols) {
      //   case 4:
      //     this.imgRender(0);
      //     break;
      //   case 3:
      //     this.imgRender(1);
      //     break;
      //   case 0:
      //     this.imgRender(2);
      //     break;

      //   default:
      //     break;
      // }
      // 重新选择图片后, 需要再次打乱拼图
      this.notClick();
    },
    // 图片渲染
    imgRender() {
      // console.log('图片渲染',this.imgUrl);
      this.$nextTick(() => {
        let cells = document.querySelectorAll(".cell");
        let cellWidth = cells[0].offsetWidth;
        // console.log(cells);
        let size = this.stateLevel === 0 ? 3 : this.stateLevel === 1 ? 4 : 5;
        // switch (this.cols) {
        //   case 4:
        //     size = 3;
        //     break;
        //   case 3:
        //     size = 4;
        //     break;
        //   case 0:
        //     size = 5;
        //     break;
        //   default:
        //     break;
        // }
        let cellsArr = _.chunk(cells, size);

        // console.log(cellsArr.length);
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            // console.log(i, j);
            cellsArr[i][j].style.backgroundImage =
              "url(" + this.stateImgUrl + ")";
            // 背景图片大小为整个拼图面板的大小
            cellsArr[i][j].style.backgroundSize =
              size * cellWidth + "px " + size * cellWidth + "px";
            // 将图片根据行列数分割
            cellsArr[i][j].style.backgroundPosition =
              -j * cellWidth + "px " + -i * cellWidth + "px";
            // console.log(
            //   cellsArr[i][j].style.backgroundSize,
            //   cellsArr[i][j].style.backgroundPosition
            // );
          }
        }
      });
    },
    // 渲染数组, 调用渲染图片方法
    render(index) {
      this.setHeight();
      if (index === 0) {
        let puzzle = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        this.$store.commit('changePuzzle',puzzle)
      } else if (index === 1) {
        let puzzle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
        this.$store.commit('changePuzzle',puzzle)
      } else if (index === 2) {
        let puzzle = [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          0,
        ];
        this.$store.commit('changePuzzle',puzzle)
      }
      // 发现在通过其他方式设置拼图图片后, 一旦改变窗口大小,
      // this.getImgUrl(this.imgUrl)
      this.imgRender();
    },
    // 点击方块
    clickBlock(index) {
      // console.log(index);
      let curIndex = this.statePuzzle[index];
      let leftIndex = this.statePuzzle[index - 1];
      let rightIndex = this.statePuzzle[index + 1];
      let topIndex = this.statePuzzle[index - 3];
      let bottomIndex = this.statePuzzle[index + 3];
      switch (this.stateLevel) {
        case 0:
          if (leftIndex == 0 && index % 3) {
            this.$set(this.statePuzzle, index - 1, curIndex);
            this.$set(this.statePuzzle, index, 0);
          } else if (rightIndex == 0 && 2 !== index % 3) {
            this.$set(this.statePuzzle, index + 1, curIndex);
            this.$set(this.statePuzzle, index, 0);
          } else if (topIndex == 0) {
            this.$set(this.statePuzzle, index - 3, curIndex);
            this.$set(this.statePuzzle, index, 0);
          } else if (bottomIndex == 0) {
            this.$set(this.statePuzzle, index + 3, curIndex);
            this.$set(this.statePuzzle, index, 0);
          }
          break;
        case 1:
          topIndex = this.statePuzzle[index - 4];
          bottomIndex = this.statePuzzle[index + 4];
          if (leftIndex == 0 && index % 4) {
            this.$set(this.statePuzzle, index - 1, curIndex);
            this.$set(this.statePuzzle, index, 0);
          } else if (rightIndex == 0 && 3 !== index % 4) {
            this.$set(this.statePuzzle, index + 1, curIndex);
            this.$set(this.statePuzzle, index, 0);
          } else if (topIndex == 0) {
            this.$set(this.statePuzzle, index - 4, curIndex);
            this.$set(this.statePuzzle, index, 0);
          } else if (bottomIndex == 0) {
            this.$set(this.statePuzzle, index + 4, curIndex);
            this.$set(this.statePuzzle, index, 0);
          }

          break;
        case 2:
          topIndex = this.statePuzzle[index - 5];
          bottomIndex = this.statePuzzle[index + 5];
          if (leftIndex == 0 && index % 5) {
            this.$set(this.statePuzzle, index - 1, curIndex);
            this.$set(this.statePuzzle, index, 0);
          } else if (rightIndex == 0 && 4 !== index % 5) {
            this.$set(this.statePuzzle, index + 1, curIndex);
            this.$set(this.statePuzzle, index, 0);
          } else if (topIndex == 0) {
            this.$set(this.statePuzzle, index - 5, curIndex);
            this.$set(this.statePuzzle, index, 0);
          } else if (bottomIndex == 0) {
            this.$set(this.statePuzzle, index + 5, curIndex);
            this.$set(this.statePuzzle, index, 0);
          }

          break;
        default:
          break;
      }

      this.pass();
    },
    // 禁止点击, 取消拼图时的样式
    notClick() {
      this.$nextTick(() => {
        let cells = document.querySelectorAll(".cell");
        let btnAutoPlay = document.querySelector("#btnAutoPlay");
        let btnSave = document.querySelector("#btnSave");
        // console.log(cells);
        for (let i = 0; i < cells.length; i++) {
          let cell = cells[i];
          // console.log(cell);
          // 取消方块边框与阴影样式, 取消白块背景色
          cell.style.border = "none";
          cell.style.boxShadow = "none";
          cell.style.backgroundImage = "url(" + this.stateImgUrl + ")";
          cell.classList.remove("cell-zero");
          // 调用禁止点击函数, 使方块禁止被点击, 只有再重新打乱后才能点击
          cell.classList.add("notClick");
        }
        btnAutoPlay.classList.add("v-btn--disabled");
        btnSave.classList.add("v-btn--disabled");
      });
    },
    // 允许点击, 添加拼图时的样式
    canClick() {
      this.$nextTick(() => {
        let cells = document.querySelectorAll(".cell");
        let btnAutoPlay = document.querySelector("#btnAutoPlay");
        let btnSave = document.querySelector("#btnSave");
        btnAutoPlay.classList.remove("v-btn--disabled");
        btnSave.classList.remove("v-btn--disabled");
        // console.log(cells);
        for (let i = 0; i < cells.length; i++) {
          let cell = cells[i];
          // console.log(cell);

          cell.style.border = "1px solid #fff";
          cell.style.boxShadow = "0px 0px 3px #333333";
          // 为0方块添加白背景色
          if (cell.innerHTML === "0") {
            cell.classList.add("cell-zero");
            cell.style.backgroundImage = "none";
          }
          // cell.style.textIndent = '-999px'
          // 调用禁止点击函数, 使方块禁止被点击, 只有再重新打乱后才能点击
          cell.classList.remove("notClick");
        }
      });
    },
    // addScore
    computeScore() {
      if (!this.isAuto) {
        let score = this.stateLevel === 0 ? 2 : this.stateLevel === 1 ? 5 : 10;
        addScore({ grade: score, id: this.$store.state.id }).then((res) => {
          console.log(res);
        this.$store.commit("changeScore", res.data.data);
        });
      }
    },
    // 是否通过
    pass() {
      const _this = this;
      function passStyle() {
        _this.isPass = _this.isAuto ? 1 : 0; //1表示使用了自动拼图, 0表示没有
        _this.snackbar = true;
        _this.notClick();

        console.log(_this.isAuto);
        _this.computeScore();
        _this.isAuto = !_this.isAuto;
      }
      switch (this.stateLevel) {
        case 0:
          if (this.statePuzzle[8] === 0) {
            const newPuzzles = this.statePuzzle.slice(0, 8);
            console.log("newPuzzles", newPuzzles);
            const isPass = newPuzzles.every((e, i) => e === i + 1);
            console.log("isPass", isPass);
            if (isPass) {
              setTimeout(() => {
                passStyle();
              }, 1000);
            }
          }
          break;
        case 1:
          if (this.statePuzzle[15] === "0" || this.statePuzzle[15] === 0) {
            const newPuzzles = this.statePuzzle.slice(0, 15);
            const isPass = newPuzzles.every((e, i) => e === i + 1);
            if (isPass) {
              setTimeout(() => {
                passStyle();
              }, 1000);
            }
          }
          break;
        case 2:
          if (this.statePuzzle[24] === "0" || this.statePuzzle[24] === 0) {
            const newPuzzles = this.statePuzzle.slice(0, 24);
            const isPass = newPuzzles.every((e, i) => e === i + 1);
            if (isPass) {
              setTimeout(() => {
                passStyle();
              }, 1000);
            }
          }
          break;
        default:
          break;
      }
    },
    // 控制每个方块的序号是否显示
    showNumber() {
      this.isShowNum = !this.isShowNum;
      // console.log(this.isShowNum);
      let cells = document.querySelectorAll(".cell");
      for (let i = 0; i < cells.length; i++) {
        if (this.isShowNum) {
          cells[i].style.textIndent = "0px";
        } else {
          cells[i].style.textIndent = "-9999px";
        }
      }
    },
    // 设置游戏进度标题
    saveBefore() {
      let level = this.stateLevel === 0 ? '3*3' : this.stateLevel === 1 ? '4*4' : '5*5'
      let date = new Date();
      let curTime = date.toLocaleDateString();
      this.saveTitle = level + "--" + curTime;
    },
    // 将base64转为blob
    convertBase64UrlToBlob(urlData) {
      var bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      //     let file = new File([ia], 'imgurl', {
      //     type: 'image/jpg'
      //  })
      //     return file
      return new Blob([ab], { type: "image/jpeg" });
    },
    // 保存游戏进度
    saveProgress() {
      // 保存名称
      let sTitle = this.saveTitle;
      // 保存当前数组值
      let sPuzzle = this.statePuzzle;
      // 保存当前拼图难度
      let sLevel = this.stateLevel === 0 ? 3 : this.stateLevel === 1 ? 4 : 5
      let sUser = this.$store.state.id;

      let formData = new FormData();
      // 保存当前拼图图片
      let sImg;
      // if (this.stateImgUrl.indexOf("data:image") > -1) {}
        // base64 图片操作
        // 将图片转换为blob格式传给后台
        // console.log(this.stateImgUrl);
        sImg = this.convertBase64UrlToBlob(this.stateImgUrl);
        formData.append(
          "file",
          sImg,
          "file_" + Date.parse(new Date()) + ".jpeg"
        );
     
      formData.append("array", sPuzzle);
      formData.append("level", sLevel);
      formData.append("title", sTitle);
      formData.append("userId", sUser);
      if (this.saveTitle !== null) {
        // 将时间, 拼图难度, 数组值存入服务器,保存成功,弹出提示框, 提示保存完成
        // console.log(sTitle, sPuzzle, sLevel, sImg, sUser);
        saveProgress(formData).then((res) => {
          // 保存成功, 提示用户保存成功
          console.log(res);
          if (res.data.code === 200) {
            console.log("保存成功");
            this.progressSnackbar = true;
            this.progressSnackbarText = '已保存游戏进度 ' + this.saveTitle
          } else {
            console.log('qingqiuchaoshi');
          }
        });
        // this.$axios
        //   .post("http://a.wpengsen.cn:8989/upload", formData)
        //   .then((res) => {
        //     // 保存成功, 提示用户保存成功
        //     console.log(res);
        //   });
        // 关闭保存进度对话框
        document.querySelector("#closeSave").click();
      }
    },
    // 读取游戏进度
    readProgress() {
      // 向服务器发送请求, 通过用户ID获取已保存的进度
      // 点击按钮弹出对话框, 显示已保存的游戏进度
      // 选择已保存的进度, 获取数组值并赋给puzzles, 调用打乱函数
      getProgress({ userId: this.$store.state.id }).then((res) => {
        // console.log(res);
        if (res.data.code === 200) {
          this.progressData = res.data.data;
          console.log(this.progressData);
        }
      });
    },
     // 将本地图片转为base64格式
    getBase64Image(img) {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let dataURL = canvas.toDataURL();
      return dataURL;
    },
    // 选择游戏进度
    chooseProgress() {
      console.log(this.progress);
      if (this.progress != null) {
        let data = this.progressData[this.progress]
        // // 将返回的字符串以逗号分割转为数组
        // data.array = _.split(data.array,',')
        // // 将字符串数组转为数字数组
        // data.array = data.array.map(Number)
        let levelIndex = data.level === 3 ? 0 : data.level === 4 ? 1 : 2
        
        // 将拼图图片转base64保存至状态管理
         let image = new Image();
        image.src = data.imgUrl + '?v=' + Math.random() // 处理缓存;
        image.crossOrigin = '*' // 支持跨域图片
        // image.onload为异步加载
        image.onload = () => {
         let imgUrl = this.getBase64Image(image)
      this.$store.commit('changeImgUrl',imgUrl)
        // 读取进度等级
        this.levelChoose(levelIndex)
        // 打乱拼图
        this.shuffle()
        this.progress = ''
        // 读取成功
        this.progressSnackbar = true
            this.progressSnackbarText = '已读取游戏进度 ' + data.title
            this.canClick()
        };
      }
    },
    // 删除游戏进度
    delProgress() {
      let data = this.progressData[this.progress]
      console.log(data);
      deletePro({id:data.id}).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          // 删除成功, 更新页面
          this.readProgress()
          // 提示
          this.progressSnackbar = true
            this.progressSnackbarText = '已删除游戏进度 '+data.title
            this.progress = ''
        }
      })
    }
  },
  mounted() {
    //默认显示3*3拼图
  this.levelChoose(0)
    // window.addEventListener('render',this.render(0))
    this.notClick(); //游戏开始前无法操作
    if (this.stateImgUrl === '') {
      // btnShuffle
      document.querySelector('#btnShuffle').classList.add("v-btn--disabled");
      document.querySelector('#btnSeeImg').classList.add("v-btn--disabled");
    }
    // 为实现拼图大动态小自适应页面,每当视口发生改变, 重新渲染一次拼图面板的高度, 重新渲染背景图片大小,重新打乱拼图
    // window.onresize = () => {
    //   this.setHeight()
    //   this.imgRender()
    //   }
  },
  destroyed() {
    // 注销window.onresize事件
    window.onresize = null;
  },
};
</script>
<style>
.puzzle {
  max-width: 550px;
}
.puzzle .row {
  /* width: 300px;
  height: 300px; */
  box-sizing: border-box;
}

.puzzle .cell.col {
  box-sizing: border-box;
}
.cell {
  color: #fff;
  font-size: 20px;
  /* width: 100px; */
  border: 1px solid #fff;
  -moz-box-shadow: 0px 0px 3px #333333;
  -webkit-box-shadow: 0px 0px 3px #333333;
  box-shadow: 0px 0px 3px #333333;
  background-color: #f5f5f5;
  /* background-image: url('~assets/img/004.jpg'); */
  text-indent: -9999px;
  text-shadow: 0 0 10px #000;
}
.cell-zero {
  background-color: #fff;
}
.notClick {
  pointer-events: none;
  cursor: not-allowed;
}
.level-5 {
  min-height: 1px;
  flex: 0 0 20%;
  max-width: 20%;
  float: left;
}
</style>