<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:53:02
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-14 20:32:46
-->
<template>
  <div class="home">
    <v-snackbar centered text outlined color="success" v-model="snackbar">
      {{
        isCanReach == 1
          ? "可复原,正在自动拼图"
          : isCanReach == 0
          ? "无法复原,重新打乱中"
          : isCanReach == 2
          ? "拼图成功"
          : ""
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
                :cols="cols"
                @click.prevent="clickBlock(index)"
                v-for="(puzzle, index) in puzzles"
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
            <v-row no-gutters class="pe-md-12">
              <!-- 选择图片 -->
              <v-col md="12" cols="4" text class="text-center mb-4 mt-md-8">
                <ChooseImg @imgUrl="getImgUrl" />
              </v-col>
              <!-- 等级选择 -->
              <v-col md="12" cols="4" text class="text-center mb-4">
                <v-dialog transition="dialog-top-transition" max-width="600">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      elevation="1"
                      outlined
                      class="text-button"
                      v-bind="attrs"
                      v-on="on"
                      >选择等级</v-btn
                    >
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-toolbar color="primary" dark>选择等级</v-toolbar>
                      <v-list dense>
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
              </v-col>
              <!-- 打乱拼图 -->
              <v-col md="12" cols="4" text class="text-center mb-4">
                <v-btn elevation="1" outlined @click="shuffle" color="primary">
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
                      >查看原图</v-btn
                    >
                  </template>
                  <template v-slot:default="dialog">
                    <v-card>
                      <v-toolbar color="primary" dark>查看原图</v-toolbar>
                      <v-card-text class="text-center pa-0 pt-2">
                        <!-- <div class="text-h2 pa-12">Hello world!</div> -->
                        <img
                          :src="imgUrl"
                          style="width: 100%; height: 100%"
                          alt=""
                        />
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
                        <v-btn id="closeSave" text @click="dialog.value = false">Close</v-btn>
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
                            label="Bahamas, The"
                            value="bahamas"
                          ></v-radio>
                          <v-radio label="Bahrain" value="bahrain"></v-radio>
                          <v-radio
                            label="Bangladesh"
                            value="bangladesh"
                          ></v-radio>
                          <v-radio label="Barbados" value="barbados"></v-radio>
                          <v-radio label="Belarus" value="belarus"></v-radio>
                          <v-radio label="Belgium" value="belgium"></v-radio>
                          <v-radio label="Belize" value="belize"></v-radio>
                          <v-radio label="Benin" value="benin"></v-radio>
                          <v-radio label="Bhutan" value="bhutan"></v-radio>
                          <v-radio label="Bolivia" value="bolivia"></v-radio>
                          <v-radio
                            label="Bosnia and Herzegovina"
                            value="bosnia"
                          ></v-radio>
                          <v-radio label="Botswana" value="botswana"></v-radio>
                          <v-radio label="Brazil" value="brazil"></v-radio>
                          <v-radio label="Brunei" value="brunei"></v-radio>
                        </v-radio-group>
                      </v-card-text>
                      <v-divider></v-divider>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="dialog.value = false">选择</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn text @click="dialog.value = false">关闭</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </v-col>
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
import qs from "qs";
import ChooseImg from "./childComps/ChooseImg.vue";
export default {
  name: "Home",
  components: {
    ChooseImg,
  },
  data: () => ({
    puzzles: [],
    level: [
      { title: "初级 3*3" },
      { title: "中级 4*4" },
      { title: "高级 5*5" },
    ],
    cols: 4, //方块占位, 4 3*3; 3 4*4; 0 5*5
    isCanReach: 0, //控制是否可复原/拼图成功提示框内容
    snackbar: false, //控制提示框显示与隐藏
    imgUrl: require("../../assets/img/004.jpg"),
    // imgUrl: "https://image.slimmeryu.com/puzzle/004.jpg",
    isShowNum: false, //控制序号的显示与隐藏
    progress: "", //用于读取进度对话框
    saveTitle: "", //用于保存进度标题
    rules: {
      required: value => !!value || 'Required.',
    },
  }),
  methods: {
    // 难度选择:改变每行方块数量,数组长度,方块高度
    levelChoose(index) {
      if (index === 0) {
        //初级下标 3*3
        this.cols = 4;
        this.render(index);
      } else if (index === 1) {
        //中级下标 4*4
        this.cols = 3;
        this.render(index);
      } else if (index === 2) {
        //高级下标 5*5
        this.cols = 0;
        this.setLevel5();
        this.render(index);
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
      let level;
      switch (this.cols) {
        case 4:
          level = 3;
          break;
        case 3:
          level = 4;
          break;
        case 0:
          level = 5;
          break;

        default:
          break;
      }
      console.log("获取后台步骤数据");
      const _this = this;
      this.$axios
        .post(
          "http://a.wpengsen.cn:8989/puzzle/automaticCalculation",
          qs.stringify({ node: _.join(this.puzzles, ","), num: level })
        )
        .then((res) => {
          console.log(res);
          // 如果请求成功,执行点击方法,自动复原
          if (res.status === 200) {
            //通过步骤,for循环调用点击方法
            console.log(res.data.data.simpleProcess);
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

      // let Setting = this.setting()
      // if (
      //   this.canReach().canReach(
      //     Setting.originalNode,
      //     Setting.resultNode
      //   )
      // ) {
      //   // 可复原,弹出提示框
      //   this.isCanReach = 1
      //   this.snackbar = true
      //   console.log("可复原");
      //   let originalNodeStr =_.join(this.puzzles, ",")
      //   const _this = this
      //   console.log(originalNodeStr);
      //   //传递源节点, 获取点击步骤
      //   console.log("获取后台步骤数据");
      //   this.$axios.post('http://a.wpengsen.cn:8989/puzzle/automaticCalculation',qs.stringify({node:originalNodeStr,num:Setting.originalNode.length}))
      //   .then(res=>{
      //       console.log(res)
      //       // 如果请求成功,执行点击方法,自动复原
      //       if (res.status === 200) {
      //         //通过步骤,for循环调用点击方法
      //         for (let i = 0; i < res.data.data.stepNumber; i++) {
      //           (function () {//将延时器整个的包裹在一个子执行函数中
      //             setTimeout(() => {
      //               console.log(res.data.data.tabbingOrder[i]);
      //               _this.clickBlock(res.data.data.tabbingOrder[i])
      //             }, i * 500);//想要每隔0.5秒调用一次，而不是同时调用，要将参数传进时间中
      //           })(i);//把每个循环中的 i 在被回收之前直接传入到自执行函数中，这样就可以避免被回收
      //         }
      //       }else {
      //         //弹出提示框,请求有误,重新尝试
      //         console.log('请求有误');
      //       }
      //   })
      //   this.isCanReach = 0
      //   this.snackbar = false
      // } else {
      //   // this.isCanReach = 0
      //   this.snackbar = true
      //   setTimeout(() => {
      //     this.shuffle();
      //   }, 3000);
      //   console.log('重新打乱后的数组',this.puzzles);
      //   setTimeout(() => {
      //     this.autoPlay();
      //     this.snackbar = false
      //   }, 5000);
      // }
    },
    // 打乱
    shuffle() {
      this.canClick();
      // 向后台传入当前游戏等级, 请求打乱的序列
      let level;

      switch (this.cols) {
        case 4:
          level = 3;
          break;
        case 3:
          level = 4;
          break;
        case 0:
          level = 5;
          break;

        default:
          break;
      }
      console.log(level);
      // 获取后台传入的数组序列

      console.log("获取后台传入的数组序列");
      this.$axios
        .post(
          "http://a.wpengsen.cn:8989/puzzle/generatedData",
          qs.stringify({ num: level })
        )
        .then((res) => {
          console.log(res);
          // 如果请求成功,执行点击方法,自动复原
          if (res.status === 200) {
            // console.log(res.data.data);
            this.puzzles = res.data.data;
          } else {
            //弹出提示框,请求有误,重新尝试
            console.log("请求有误");
          }
        });
    },
    // 判断拼图是否能够复原
    canReach() {
      return {
        // 是否可达
        canReach(originalNode, resultNode) {
          // console.log('源数组的行数',originalNode.length);
          // console.log('源数组0的位置:',_.indexOf(_.flattenDeep(originalNode), 0));

          // console.log('源数组0所在的行数:',Math.ceil((_.indexOf(_.flattenDeep(originalNode), 0)+1)/originalNode.length));

          let OLRow, OLCol;
          // let OLCol = Math.ceil((_.indexOf(_.flattenDeep(originalNode), 0)+1)%originalNode.length)

          let RLRow = resultNode.length - 1;
          console.log("目标零的位置", RLRow);
          for (let i = 0; i < originalNode.length; i++) {
            let tmp = originalNode[i];
            console.log(tmp);
            for (let j = 0; j < tmp.length; j++) {
              if (originalNode[i][j] === 0) {
                OLRow = i;
                OLCol = j;
                console.log("源数组0所在的行列数", OLRow, OLCol);
              }
            }
          }
          originalNode = originalNode.toString().split(",");
          resultNode = resultNode.toString().split(",");

          /*
            最终的判断方法是判断两个矩阵的 ：
            逆序数 + “0”的行数 + “0”的列数的和的奇偶性是否相同
            如果相同则，则可以还原拼图，不相同则不可还原。
          */
          let originalRON = this.odevity(originalNode) + OLRow + OLCol;
          let resultRON = this.odevity(resultNode) + RLRow + RLRow;

          if (originalRON % 2 === resultRON % 2) {
            return true;
          } else {
            return false;
          }

          /*
            当N为奇数时， 当两个N数码的逆序数 奇偶性相同时，可以互达，否则不行；

            当N为偶数时，当两个N数码的奇偶性相同的话，那么两个N数码中的0所在行的差值 k，k也必须是偶数时，才能互达；
                      当两个N数码的奇偶性不同时，那么两个N数码中的0所在行的差值 k，k也必须是奇数时，才能互达；
          */
          // if (RLRow % 2) {//N是奇数

          //   if (this.odevity(originalNode) === this.odevity(resultNode)) {
          //     return true;
          //   } else {
          //     return false;
          //   }
          // } else {//N是偶数
          //   console.log('N是偶数');
          //   if (this.odevity(originalNode) === this.odevity(resultNode)) {//奇偶性相同
          //     console.log('奇偶性相同');
          //     if (Math.abs(OLRow - RLRow) % 2) {//K是奇数
          //       return false
          //     } else {
          //       return true
          //     }
          //   } else {//奇偶性不同
          //     if (Math.abs(OLRow - RLRow) % 2) {//K是奇数
          //       return true
          //     } else {return false}
          //   }
          // }
        },
        // 求逆序奇偶性
        odevity(node) {
          var num = 0; //先介绍一下逆序数：在一列数中，每个数前面有几个比自己大的数，就是这个数的逆序数，这一列数的逆序数就是这一列数的逆序数的总和；
          //node.splice(node.indexOf('0'), 1);//在算N数码的逆序数时，不把0算入在内；
          node.forEach(function (item, index) {
            for (var i = 0; i < index; i++) {
              //if (node[i] != 0) {//在算N数码的逆序数时，不把0算入在内；
              if (node[i] > item) {
                num++;
                // }
              }
            }
          });
          // console.log('逆序数',num);
          return num;
        },
      };
    },
    // 自己玩执行
    autoPuzzles(Setting) {
      let that = this;
      let queueArr = []; //队列
      let hashObj = {}; //hash
      let NodeObj = {}; //记录节点
      let originalNode = Setting.originalNode; //原始节点
      let originalNodeStr = originalNode.toString().split(",").join("");
      let resultNode = Setting.resultNode; //结果节点
      let resultNodeStr = resultNode.toString().split(",").join("");
      // console.log('结果节点字符串',resultNodeStr);
      let isFind = false;
      let delay = Setting.delayTime || 1000; //动画延迟

      return {
        // 是否可达
        canReach(originalNode, resultNode) {
          originalNode = originalNode.toString().split(",");
          resultNode = resultNode.toString().split(",");
          this.readerDom(originalNode);
          if (this.odevity(originalNode) === this.odevity(resultNode)) {
            return true;
          } else {
            return false;
          }
        },
        // 求逆序奇偶性
        odevity(node) {
          var num = 0;
          node.splice(node.indexOf("0"), 1);
          node.forEach(function (item, index) {
            for (var i = 0; i < index; i++) {
              if (node[i] != 0) {
                if (node[i] > item) {
                  num++;
                }
              }
            }
          });
          if (num % 2) {
            return 1;
          } else {
            return 0;
          }
        },
        // 寻找路径
        searchPath() {
          var _this = this;
          queueArr.push(originalNode);
          hashObj[originalNodeStr] = originalNode;
          // console.log('队列',queueArr);
          while (!isFind) {
            if (!queueArr.length) {
              alert("没搜索到结果");
              return;
            }
            let currentNode = queueArr.shift(),
              currentNodeStr = currentNode.toString().split(",").join("");
            // console.log('当前节点',currentNode);
            if (resultNodeStr === currentNodeStr) {
              let path = [];
              let pathLength = 0;
              let resultPath = [];
              for (
                let v = resultNodeStr;
                v != originalNodeStr;
                v = NodeObj[v]
              ) {
                path.push(hashObj[v]);
              }
              path.push(hashObj[originalNodeStr]);
              pathLength = path.length;
              for (let i = 0; i < pathLength; i++) {
                resultPath.push(path.pop());
              }
              console.log("结果路径", resultPath);
              setTimeout(function () {
                _this.returnStep(resultPath);
              }, 500);
              isFind = true;
              return;
            }
            // return;
            let result = this.getChildNodes(currentNode);
            result.forEach(function (item) {
              let itemStr = item.toString().split(",").join("");
              if (!hashObj[itemStr]) {
                queueArr.push(item);
                hashObj[itemStr] = item;
                NodeObj[itemStr] = currentNodeStr;
              }
            });
          }
        },
        // 返回步骤信息
        returnStep(path) {
          var _this = this;
          path.forEach(function (item, index) {
            setTimeout(
              function (node) {
                console.log("延迟时间", index * delay);
                _this.readerDom(node);
              }.bind(_this, item),
              index * delay
            );
          });
        },
        // 渲染dom
        readerDom(node) {
          let nodeArr = node.toString().split(",");
          that.puzzles = nodeArr;
          // console.log(that.puzzles);
          that.pass();
        },
        // 获取子节点
        getChildNodes(currentNode) {
          if (!Array.isArray(currentNode)) return;
          let target = {},
            // childNodesArr = [],
            direction = [],
            rowNum = currentNode.length,
            colNum = currentNode[0].length;
          currentNode.forEach(function (item, i) {
            item.forEach(function (obj, k) {
              if (obj === 0 || obj === "0") {
                target = { x: k, y: i };
              }
            });
          });
          direction = this.getDirection(target, rowNum, colNum);
          return this.changePos(currentNode, target, direction);
        },
        // 获取方向
        getDirection(target, rowNum, colNum) {
          let direction = [];
          if (!target.x) {
            direction.push("right");
          } else if (target.x === colNum - 1) {
            direction.push("left");
          } else {
            direction = direction.concat(["left", "right"]);
          }

          if (!target.y) {
            direction.push("down");
          } else if (target.y === rowNum - 1) {
            direction.push("up");
          } else {
            direction = direction.concat(["down", "up"]);
          }
          return direction;
        },
        // 改变位置
        changePos(node, target, direction) {
          if (direction.length) {
            let childNodesArr = [];
            direction.forEach(function (item) {
              let temp;
              let _node = JSON.parse(JSON.stringify(node));
              switch (item) {
                case "left":
                  temp = _node[target.y][target.x];
                  _node[target.y][target.x] = _node[target.y][target.x - 1];
                  _node[target.y][target.x - 1] = temp;
                  break;
                case "right":
                  temp = _node[target.y][target.x];
                  _node[target.y][target.x] = _node[target.y][target.x + 1];
                  _node[target.y][target.x + 1] = temp;
                  break;
                case "down":
                  temp = _node[target.y][target.x];
                  _node[target.y][target.x] = _node[target.y + 1][target.x];
                  _node[target.y + 1][target.x] = temp;
                  break;
                case "up":
                  temp = _node[target.y][target.x];
                  _node[target.y][target.x] = _node[target.y - 1][target.x];
                  _node[target.y - 1][target.x] = temp;
                  break;
              }
              childNodesArr.push(_node);
            });
            return childNodesArr;
          }
        },
      };
    },
    // 动态设置cell高度
    setHeight() {
      let puzzle = document.querySelector(".puzzle");
      puzzle.style.height = puzzle.offsetWidth + "px";
    },
    // 获取从子组件ChooseImg传来的图片地址
    getImgUrl(data) {
      this.imgUrl = data;
      // console.log('父组件',this.imgUrl);
      switch (this.cols) {
        case 4:
          this.imgRender(0);
          break;
        case 3:
          this.imgRender(1);
          break;
        case 0:
          this.imgRender(2);
          break;

        default:
          break;
      }
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
        let size;
        switch (this.cols) {
          case 4:
            size = 3;
            break;
          case 3:
            size = 4;
            break;
          case 0:
            size = 5;
            break;
          default:
            break;
        }
        let cellsArr = _.chunk(cells, size);

        // console.log(cellsArr.length);
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            // console.log(i, j);
            cellsArr[i][j].style.backgroundImage = "url(" + this.imgUrl + ")";
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
        this.puzzles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      } else if (index === 1) {
        this.puzzles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
      } else if (index === 2) {
        this.puzzles = [
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
      }
      // 发现在通过其他方式设置拼图图片后, 一旦改变窗口大小,
      // this.getImgUrl(this.imgUrl)
      this.imgRender();
    },
    // 点击方块
    clickBlock(index) {
      // console.log(index);
      let curIndex = this.puzzles[index];
      let leftIndex = this.puzzles[index - 1];
      let rightIndex = this.puzzles[index + 1];
      let topIndex = this.puzzles[index - 3];
      let bottomIndex = this.puzzles[index + 3];
      switch (this.cols) {
        case 4:
          if (leftIndex == 0 && index % 3) {
            this.$set(this.puzzles, index - 1, curIndex);
            this.$set(this.puzzles, index, 0);
          } else if (rightIndex == 0 && 2 !== index % 3) {
            this.$set(this.puzzles, index + 1, curIndex);
            this.$set(this.puzzles, index, 0);
          } else if (topIndex == 0) {
            this.$set(this.puzzles, index - 3, curIndex);
            this.$set(this.puzzles, index, 0);
          } else if (bottomIndex == 0) {
            this.$set(this.puzzles, index + 3, curIndex);
            this.$set(this.puzzles, index, 0);
          }
          break;
        case 3:
          topIndex = this.puzzles[index - 4];
          bottomIndex = this.puzzles[index + 4];
          if (leftIndex == 0 && index % 4) {
            this.$set(this.puzzles, index - 1, curIndex);
            this.$set(this.puzzles, index, 0);
          } else if (rightIndex == 0 && 3 !== index % 4) {
            this.$set(this.puzzles, index + 1, curIndex);
            this.$set(this.puzzles, index, 0);
          } else if (topIndex == 0) {
            this.$set(this.puzzles, index - 4, curIndex);
            this.$set(this.puzzles, index, 0);
          } else if (bottomIndex == 0) {
            this.$set(this.puzzles, index + 4, curIndex);
            this.$set(this.puzzles, index, 0);
          }

          break;
        case 0:
          topIndex = this.puzzles[index - 5];
          bottomIndex = this.puzzles[index + 5];
          if (leftIndex == 0 && index % 5) {
            this.$set(this.puzzles, index - 1, curIndex);
            this.$set(this.puzzles, index, 0);
          } else if (rightIndex == 0 && 4 !== index % 5) {
            this.$set(this.puzzles, index + 1, curIndex);
            this.$set(this.puzzles, index, 0);
          } else if (topIndex == 0) {
            this.$set(this.puzzles, index - 5, curIndex);
            this.$set(this.puzzles, index, 0);
          } else if (bottomIndex == 0) {
            this.$set(this.puzzles, index + 5, curIndex);
            this.$set(this.puzzles, index, 0);
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
          cell.style.backgroundImage = "url(" + this.imgUrl + ")";
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
    // 是否通过
    pass() {
      const _this = this;
      function passStyle() {
        _this.isCanReach = 2;
        _this.snackbar = true;
        _this.notClick();
      }
      switch (this.cols) {
        case 4:
          if (this.puzzles[8] === 0) {
            const newPuzzles = this.puzzles.slice(0, 8);
            console.log("newPuzzles", newPuzzles);
            const isPass = newPuzzles.every((e, i) => e === i + 1);
            console.log("isPass", isPass);
            if (isPass) {
              setTimeout(() => {
                passStyle();
              }, 1000);
            }
          }
          this.isCanReach = 0;
          break;
        case 3:
          if (this.puzzles[15] === "0" || this.puzzles[15] === 0) {
            const newPuzzles = this.puzzles.slice(0, 15);
            const isPass = newPuzzles.every((e, i) => e === i + 1);
            if (isPass) {
              setTimeout(() => {
                passStyle();
              }, 1000);
            }
          }
          break;
        case 0:
          if (this.puzzles[24] === "0" || this.puzzles[24] === 0) {
            const newPuzzles = this.puzzles.slice(0, 24);
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
      let level = this.cols === 4 ? "3*3" : this.cols === 3 ? "4*4" : "5*5";
      let date = new Date();
      let curTime = date.toLocaleString();
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
    // 将本地图片转为base64格式
    getBase64Image(img) {
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let dataURL = canvas.toDataURL();
      return dataURL;
    },
    // 将本地图片转为base64格式, 以promise返回
    getSImg() {
      // 将本地图片转为base64, 再转为blob传递给后端
      return new Promise( res => {
        let sImg
        // 一定要设置为let，不然图片不显示
        let image = new Image();
        // 解决跨域问题
        image.setAttribute('crossOrigin', 'anonymous');
        let imageUrl = this.imgUrl;
        image.src = imageUrl;
        // image.onload为异步加载
        image.onload = () => {
          sImg = this.getBase64Image(image);
          console.log('base64',sImg);
          res(sImg)
        }
      })
    },
    // 保存游戏进度
    saveProgress() {
      // 保存名称
      let sTitle = this.saveTitle;
      // 保存当前数组值
      let sPuzzle = this.puzzles;
      // 保存当前时间
      var time = new Date();
      let sTime = time.toLocaleString();
      // 保存当前拼图难度
      let sLevel = this.cols === 4 ? 3 : this.cols === 3 ? 4 : 5;
      let sUser = this.$store.state.user_tel
      
      let formData = new FormData();  
      // 保存当前拼图图片
      let sImg
      if (this.imgUrl.indexOf("data:image") > -1) {
        // base64 图片操作
        // 将图片转换为blob格式传给后台
        sImg = this.convertBase64UrlToBlob(this.imgUrl)
        formData.append("files", sImg ,"file_"+Date.parse(new Date())+".jpeg"); 
      } else {
        // path 图片操作
        this.getSImg().then((res) => {
          sImg = this.convertBase64UrlToBlob(res)
          formData.append("files", sImg ,"file_"+Date.parse(new Date())+".jpeg"); 
        })
        
      } 
//        formData.append('name', this.name)
//  formData.append('age', this.age)
//  formData.append('file', this.file)
      if (this.saveTitle !== null) {
        // 将时间, 拼图难度, 数组值存入服务器,保存成功,弹出提示框, 提示保存完成
        console.log(sTitle, sPuzzle, sTime, sLevel, sImg, sUser);
        this.$axios.post('http://a.wpengsen.cn:8989/upload',formData).then(res=>{
          // 保存成功, 提示用户保存成功
          console.log(res)
        })
        // 关闭保存进度对话框
        document.querySelector('#closeSave').click()
      }
    },
    // 读取游戏进度
    readProgress() {
      // 向服务器发送请求, 通过用户ID获取以保存的进度
      // 点击按钮弹出对话框, 显示已保存的游戏进度
      // 选择已保存的进度, 获取数组值并赋给puzzles, 调用打乱函数
    },
  },
  mounted() {
    // 为实现拼图大动态小自适应页面,每当视口发生改变, 重新渲染一次拼图面板的高度, 重新渲染背景图片大小
    window.onresize = () => {
      this.setHeight();
      this.imgRender();
    };
    this.render(0); //默认显示3*3拼图
    // window.addEventListener('render',this.render(0))
    this.notClick(); //游戏开始前无法操作
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
  background-color: #996666;
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