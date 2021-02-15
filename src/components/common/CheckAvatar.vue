<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-02-15 14:19:16
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-15 14:47:30
-->
<template>
  <div class="check-avatar">
    <v-overlay
      opacity="1"
      :absolute="false"
      :value="avatarModal"
    >
    <v-row class="ma-0">
      <v-col>
        <img src="~assets/img/puzzle.png" alt="" />
      </v-col>
    </v-row>
    </v-overlay>
     <v-avatar size="80" color="success" @click="avatarModal = true">
              <img src="~assets/img/puzzle.png" alt="" />
            </v-avatar>
            <input
              type="file"
              hidden
              ref="photoFile"
              accept="image/*"
              @change="fileChange"
              style="display: none"
            />
  </div>
</template>

<script>
export default {
  props: {
    drawer: {
      type: Boolean
    }
  },
  data: () => ({
    avatarModal: false,//控制头像展示
    option: {
      img: "",
      outputSize: 0.8,
      info: false, // 裁剪框的大小信息
      outputType: "jpeg", // 裁剪生成图片的格式
      canScale: false, // 图片是否允许滚轮缩放
      autoCrop: true, // 是否默认生成截图框
      autoCropWidth: window.innerWidth - 100 + "px", // 默认生成截图框宽度
      autoCropHeight: window.innerWidth - 100 + "px", // 默认生成截图框高度
      high: true, // 是否按照设备的dpr 输出等比例图片
      fixedBox: true, // 固定截图框大小 不允许改变
      fixed: true, // 是否开启截图框宽高固定比例
      fixedNumber: [1, 1], // 截图框的宽高比例
      full: true, // 是否输出原图比例的截图
      canMoveBox: false, // 截图框能否拖动
      original: false, // 上传图片按照原始比例渲染
      centerBox: false, // 截图框是否被限制在图片里面
      infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      mode: "100% auto", // 图片默认渲染方式
    },
  }),
  methods: {
    changeDrawer() {
      this.$emit("changeDrawer",!this.drawer)
    },
    // 打开相册
    
    albumImg() {
      // document.querySelector("#imgReader").click();
      this.$refs.photoFile.click();
      // console.log(this.$refs.photoFile);
      // this.fileModal = true;
    },
    fileChange() {
      // console.log("输出files:", this.$refs.photoFile.files);
      let 
            file = this.$refs.photoFile.files[0];//相册选择的
        
      if (/.(png|jpg|jpeg|JPG|JPEG)$/.test(file.name)) {
        let fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = e => {
          // 将图像置于裁剪框中
          console.log("输出e:", e);
          this.option.img = e.target.result;
          this.fileModal = true;
          this.$refs.photoFile.value = "";
        };
      } else {
        this.$message({
          message: "请选择符合格式要求的图片",
          type: "warning"
        });
        this.$refs.photoFile.value = "";
      }
    },
  },
}
</script>

<style>

</style>