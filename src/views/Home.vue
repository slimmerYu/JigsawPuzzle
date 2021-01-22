<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:53:02
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-01-22 20:46:22
-->
<template>
  <div class="home">
    <h1>home</h1>
    <v-snackbar
      centered
      text
      outlined
      :timeout="2000"
      color="success"
      v-model="snackbar"
    >
      {{ isCanReach == 1 ? '可复原,正在自动拼图' : isCanReach == 0 ? '无法复原,重新打乱中' : isCanReach == 2 ? '拼图成功' : ''}}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <div class="puzzle-box">
      <v-container class="pa-0 ma-4 mx-auto puzzle">
        <v-row no-gutters>
          <v-col
            :cols="cols"
            @click.prevent="clickBlock(index)"
            v-for="(puzzle, index) in puzzles"
            :key="puzzle"
            v-text="puzzle"
            :class="puzzle === '0' || puzzle === 0 ? 'cell cell-zero' : 'cell'"
          >
          </v-col>
        </v-row>
      </v-container>
      <v-btn @click="shuffle" outlined> 打乱拼图 </v-btn>
      <v-btn @click="aotoPlay()" outlined> 自动拼图 </v-btn>
      <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn outlined v-bind="attrs" v-on="on">
            <v-icon left>mdi-chevron-down</v-icon>
            <span>等级选择</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in level" :key="i" @click="levelChoose(i)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn @click="pass()" outlined> pass </v-btn>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import testJson from '../../public/test.json'
import _ from "lodash";
import qs from 'qs'
export default {
  name: "Home",
  components: {},
  data: () => ({
    puzzles: [],
    level: [
      { title: "初级 3*3" },
      { title: "中级 4*4" },
      { title: "高级 5*5" },
    ],
    cols: 4,
    isCanReach: 0,//控制是否可复原/拼图成功提示框内容
    snackbar: false,//控制提示框显示与隐藏
  }),
  methods: {
    // 难度选择:改变每行方块数量,数组长度,方块高度
    levelChoose(index) {
      const cells = document.querySelectorAll('.cell')
      if (index === 0) {
        this.cols = 4
        this.rander(index)
      } else if (index === 1) {
        this.cols = 3
        this.rander(index)
        console.log(this.puzzles);
        for (let i = 0; i < cells.length; i++) {
          cells[i].classList.remove('cell-3-height')
          cells[i].classList.add('cell-4-height')
        }
      } else {
        this.cols = 2.5
        this.rander(index)
      }
    },
    // 自己拼图
    aotoPlay() {
      let Setting = {};
      switch (this.cols) {
        case 4:
          Setting = {
            originalNode: _.chunk(this.puzzles, 3),
            resultNode: [
              [1, 2, 3],
              [4, 5, 6],
              [7, 8, 0],
            ]
          };
          break;
        case 3:
          Setting = {
            originalNode: _.chunk(this.puzzles, 4),
            resultNode: [
              [1, 2, 3, 4],
              [5, 6, 7, 8],
              [9, 10, 11, 12],
              [13, 14, 15, 0],
            ]
          };
          break;
        default:
          break;
      }
      if (
        this.canReach().canReach(
          Setting.originalNode,
          Setting.resultNode
        )
      ) {
        // 可复原,弹出提示框
        this.isCanReach = 1
        this.snackbar = true
        console.log("可复原");
        let originalNodeStr =_.join(this.puzzles, ",")
        const _this = this
        console.log(originalNodeStr);
        //传递源节点, 获取点击步骤
        console.log("获取后台步骤数据");
        this.$axios.post('http://47.94.84.88:8989/puzzle/automaticCalculation',qs.stringify({node:originalNodeStr,num:Setting.originalNode.length,type:3}))
        .then(res=>{
            console.log(res)
            // 如果请求成功,执行点击方法,自动复原
            if (res.status === 200) {
              //通过步骤,for循环调用点击方法
              for (let i = 0; i < res.data.data.stepNumber; i++) {
                (function () {//将延时器整个的包裹在一个子执行函数中
                  setTimeout(() => {
                    console.log(res.data.data.tabbingOrder[i]);
                    _this.clickBlock(res.data.data.tabbingOrder[i]) 
                  }, i * 500);//想要每隔0.5秒调用一次，而不是同时调用，要将参数传进时间中
                })(i);//把每个循环中的 i 在被回收之前直接传入到自执行函数中，这样就可以避免被回收
              }
            }else {
              //弹出提示框,请求有误,重新尝试
              console.log('请求有误');
            }
        })
        this.isCanReach = 0
        this.snackbar = false
      } else {
        // this.isCanReach = 0
        this.snackbar = true
        setTimeout(() => {
          this.shuffle();
        }, 3000);
        console.log('重新打乱后的数组',this.puzzles);
        setTimeout(() => {
          this.aotoPlay();
          this.snackbar = false
        }, 5000);
      }
    },
    // 打乱
    shuffle() {
      let cells = document.querySelectorAll('.cell')
        // console.log(cells);
        for (let i = 0; i < cells.length; i++) {
          let cell = cells[i]
          console.log(cell);
          // 取消方块边框与阴影样式, 
          
          cell.style.border = '1px solid #fff'
          cell.style.boxShadow = '0px 0px 3px #333333'
          // 为0方块添加白背景色
          if (cell.innerHTML === '0') {
            cell.classList.add('cell-zero')
          }
          // 调用禁止点击函数, 使方块禁止被点击, 只有再重新打乱后才能点击
          cell.classList.remove('notClick')
        }
      this.puzzles = _.shuffle(this.puzzles);
      // this.puzzles = [5, 1, 2, 4, 9, 6, 3, 8, 13, 15, 10, 11, 14, 0, 7, 12]
      // this.puzzles = [1, 6, 2, 4, 9, 5, 3, 8, 13, 7, 0, 11, 14, 10, 15, 12]
      let Setting = {};
      switch (this.cols) {
        case 4:
          Setting = {
            originalNode: _.chunk(this.puzzles, 3),
            resultNode: [
              [1, 2, 3],
              [4, 5, 6],
              [7, 8, 0],
            ]
          };
          break;
        case 3:
          Setting = {
            originalNode: _.chunk(this.puzzles, 4),
            resultNode: [
              [1, 2, 3, 4],
              [5, 6, 7, 8],
              [9, 10, 11, 12],
              [13, 14, 15, 0],
            ]
          };
          break;
        default:
          break;
      }
      if (
        this.canReach().canReach(
          Setting.originalNode,
          Setting.resultNode
        )
      ) {
        console.log("可复原");
        console.log(this.puzzles);
      } else {
        this.isCanReach = 0
        this.snackbar = true
        setTimeout(() => {
          this.shuffle();
          this.snackbar = false
        }, 3000);
        console.log('重新打乱后的数组',this.puzzles);
      }
    },


    // 判断拼图是否能够复原
    canReach() {
      return {
        // 是否可达
        canReach(originalNode, resultNode) {
          // console.log('源数组的行数',originalNode.length);
          // console.log('源数组0的位置:',_.indexOf(_.flattenDeep(originalNode), 0));

          // console.log('源数组0所在的行数:',Math.ceil((_.indexOf(_.flattenDeep(originalNode), 0)+1)/originalNode.length));

          
          let OLRow,OLCol
          // let OLCol = Math.ceil((_.indexOf(_.flattenDeep(originalNode), 0)+1)%originalNode.length)
          
          let RLRow = resultNode.length-1
          console.log('目标零的位置',RLRow);
          for (let i = 0; i < originalNode.length; i++) {
            let tmp = originalNode[i]
            console.log(tmp);
            for (let j = 0; j < tmp.length; j++) {
              if (originalNode[i][j] === 0) {
                OLRow = i
                OLCol = j
                console.log('源数组0所在的行列数',OLRow,OLCol);
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
          let originalRON = this.odevity(originalNode) + OLRow + OLCol
          let resultRON = this.odevity(resultNode) + RLRow + RLRow

          if ( originalRON % 2 === resultRON % 2 ){
            return true
          } else {
            return false
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
          var num = 0;//先介绍一下逆序数：在一列数中，每个数前面有几个比自己大的数，就是这个数的逆序数，这一列数的逆序数就是这一列数的逆序数的总和；
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
          return num
        }
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
              console.log('结果路径',resultPath);
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
                console.log('延迟时间',index * delay);
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
    // 渲染
    rander(index) {
      if (index === 0) {
        this.puzzles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      } else if(index === 1) {
        this.puzzles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
      } else if(index === 2) {
        this.puzzles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0];
      }
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
          bottomIndex = this.puzzles[index + 4]
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
        default:
          break;
      }

      this.pass();
    },
    // 是否通过
    pass() {
      const _this = this
      function passStyle() {
        _this.isCanReach = 2
        _this.snackbar = true
        let cells = document.querySelectorAll('.cell')
        // console.log(cells);
        for (let i = 0; i < cells.length; i++) {
          let cell = cells[i]
          // console.log(cell);
          // 取消方块边框与阴影样式, 取消白块背景色
          cell.style.border = 'none'
          cell.style.boxShadow = 'none'
          cell.classList.remove('cell-zero')
          // 调用禁止点击函数, 使方块禁止被点击, 只有再重新打乱后才能点击
          cell.classList.add('notClick')
        }
      }

      
      switch (this.cols) {
        case 4:
          if (this.puzzles[8] === 0) {
            const newPuzzles = this.puzzles.slice(0, 8);
            console.log('newPuzzles',newPuzzles);
            const isPass = newPuzzles.every((e, i) => e === i + 1);
            console.log('isPass',isPass);
            if (isPass) {
              setTimeout(() => {
                passStyle()
              }, 1000);
            }
          }
          this.isCanReach = 0
          break;
        case 3:
          if (this.puzzles[15] === "0" || this.puzzles[15] === 0) {
            const newPuzzles = this.puzzles.slice(0, 15);
            const isPass = newPuzzles.every((e, i) => e === i + 1);
            if (isPass) {
              alert("666！");
            }
          }
          
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.rander(0);
  },
  created() {},
};
</script>
<style>
.puzzle-box {
  width: 300px;
  margin: auto;
}
.puzzle .row {
  width: 300px;
  height: 300px;
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
}
.cell-3-height {
  height: 100px;
}
.cell-4-height {
  height: 75px;
}
.cell-zero {
  background-color: #fff;
}
.notClick {
    pointer-events: none;
    cursor: default;
}

</style>