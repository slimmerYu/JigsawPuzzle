<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-02-15 14:19:16
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-15 20:32:35
-->
<template>
  <div class="check-avatar">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-avatar
          v-bind="attrs"
          v-on="on"
          size="80"
          color="success"
          @click="avatarModal = true"
        >
          <img :src="avatarUrl" alt="" />
        </v-avatar>
      </template>
      <v-card color="black">
        <!-- 遮罩层 -->
        <v-overlay
          class="choose-img-wrap"
          opacity="1"
          :absolute="false"
          :value="fileModal"
        >
        <v-row
            align="center"
            style="position: absolute; z-index: 999; width: 100%; bottom:14px"
            class="ma-0 pt-4"
          >
            <v-col cols="4" class="text-center">
              <v-btn icon dark @click="fileModal = false">
                <v-icon> mdi-close </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="4"  class="text-center">
              <v-btn @click="rotateImage()">
                <v-icon dark> mdi-rotate </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="4"  class="text-center">
              <v-btn @click="submitPhoto()">
                <v-icon dark> mdi-check </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col cols="12" class="pa-0 cropper-content">
              <vueCropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.outputSize"
                :outputType="option.outputType"
                :info="option.info"
                :full="option.full"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :fixed="option.fixed"
                :fixedNumber="option.fixedNumber"
                :centerBox="option.centerBox"
                :infoTrue="option.infoTrue"
                :fixedBox="option.fixedBox"
                :high="option.high"
                :mode="option.mode"
              ></vueCropper>
            </v-col>
          </v-row>
          
        </v-overlay>
        <v-toolbar dark color="black">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title>avatar</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="albumImg">
              <v-icon>mdi-image</v-icon>
              <input
                type="file"
                hidden
                ref="photoFile"
                accept="image/*"
                @change="fileChange"
                style="display: none"
              />
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <!-- <v-list >
          <v-list-item>
            <v-list-item-content> -->
        <v-row class="ma-0 mt-16" style="height: 100%">
          <v-col cols="12" class="pa-0" align-self="center">
            <img style="width: 100%" :src="avatarUrl" alt="" />
          </v-col>
        </v-row>
        <!-- </v-list-item-content>
          </v-list-item>
        </v-list> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
export default {
  components: {
    VueCropper,
  },
  data: () => ({
    snackbar: false,
    avatarUrl: require("../../assets/img/puzzle.png"),
    dialog: false,
    fileModal: false,
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
    // 打开相册

    albumImg() {
      this.$refs.photoFile.click();
    },
    // 获取选择的图片, 截图
    fileChange() {
      // console.log("输出files:", this.$refs.photoFile.files);
      let file = this.$refs.photoFile.files[0]; //相册选择的

      if (/.(png|jpg|jpeg|JPG|JPEG)$/.test(file.name)) {
        let fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = (e) => {
          // 将图像置于裁剪框中
          console.log("输出e:", e);
          this.option.img = e.target.result;
          this.fileModal = !this.fileModal;
          this.$refs.photoFile.value = "";
        };
      } else {
        this.$message({
          message: "请选择符合格式要求的图片",
          type: "warning",
        });
        this.$refs.photoFile.value = "";
      }
    },
    // 旋转图片
    rotateImage() {
      this.$refs.cropper.rotateRight();
    },
    // 获取截图
    submitPhoto() {
      // 获取截图的base64数据
      let formData = new FormData();
      this.$refs.cropper.getCropData((data) => {
        this.avatarUrl = data;
        formData.append(
          "avatar",
          data,
          "avatar_" + Date.parse(new Date()) + ".jpeg"
        );
        // formData私有类对象，访问不到，可以通过get判断值是否传进去
        // console.log(formData.get("avatar"));
        // 上传头像至服务器
        this.fileModal = !this.fileModal;
        this.dialog = !this.dialog;
      });
    },
  },
};
</script>

<style>
</style>