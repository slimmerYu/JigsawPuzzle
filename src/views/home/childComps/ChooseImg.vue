<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-28 16:17:42
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-22 17:13:10
-->
<template>
  <div class="chooseImg">
    <!-- PC拍照 -->
    <!-- 遮罩层 -->
    <v-overlay
      class="video-wrap"
      opacity="1"
      :absolute="false"
      :value="videoModal"
    >
      <!-- 功能按键 -->
      <v-row
        style="margin: auto; width: 500px"
        v-show="isShow"
        align="center"
        justify="space-between"
        class="mb-6"
      >
        <!-- 返回重新拍照 -->
        <v-col cols="4">
          <v-btn icon @click="isShow = !isShow">
            <v-icon large> mdi-chevron-left </v-icon>
          </v-btn>
        </v-col>
        <!-- 确认, 使用此照片 -->
        <v-col cols="4">
          <v-btn @click="checkImg()">
            <v-icon dark large> mdi-check </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <!-- 拍照区域 -->
      <v-row class="ma-0 pa-0">
        <video
          v-show="!isShow"
          id="video"
          width="500"
          height="500"
          muted
          autoplay="autoplay"
        ></video>
        <canvas
          style="margin: auto"
          v-show="isShow"
          id="canvas"
          width="500"
          height="500"
        ></canvas>
      </v-row>
      <!-- 功能按键 -->
      <v-row align="center" class="mt-8" style="margin: auto; width: 500px">
        <v-col cols="4">
          <v-btn icon @click="videoModal = false">
            <v-icon large> mdi-chevron-down </v-icon>
          </v-btn>
        </v-col>
        <!-- 拍照 -->
        <v-col cols="4">
          <v-btn
            fab
            dark
            large
            color=""
            style="border: 4px solid #fff"
            v-show="!isShow"
            @click="takePhoto()"
          >
            <v-icon dark large> mdi-circle </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-overlay>
    <!-- 截图 -->
    <!-- 遮罩层 -->
    <v-overlay
      class="choose-img-wrap"
      opacity="1"
      :absolute="false"
      :value="fileModal"
    >
      <v-row
        align="center"
        style="position: absolute; z-index: 999; width: 100%; bottom:15px"
        class="ma-0 pt-4"
      >
        <v-col cols="4">
          <v-btn icon @click="fileModal = false">
            <v-icon > mdi-close </v-icon>
          </v-btn>
        </v-col>
        <v-col cols="4"></v-col>
        <v-col cols="4">
          <v-btn @click="submitPhoto()">
            <v-icon dark > mdi-check </v-icon>
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
<!-- PC端 -->
    <!-- 选择图片 -->
    <v-dialog transition="dialog-top-transition" max-width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-btn style="margin:auto" class="d-none d-sm-flex" elevation="1" outlined color="primary" v-bind="attrs" v-on="on"
          >选择图片</v-btn
        >
      </template>
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar color="primary" dark>选择图片</v-toolbar>
          <v-list dense>
            <v-list-item-group color="primary">
              <!-- 拍照 -->
              <v-list-item
                class="d-none d-sm-flex"
                @click="
                  cameraImg();
                  dialog.value = false;
                "
              >
                <v-list-item-icon>
                  <v-icon>mdi-camera</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>拍照</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!-- 拍照2 -->
              <v-list-item
                class="d-flex d-sm-none"
                @click="
                  openFile();
                  dialog.value = false;
                "
              >
                <v-list-item-icon>
                  <v-icon>mdi-camera</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    >拍照
                    <input
                      type="file"
                      hidden
                      name="file"
                      @change="fileChange"
                      accept="image/*"
                      ref="cameraFile"
                      capture="camera"
                      style="display: none"
                    />
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!-- 相册 -->
              <v-list-item
                @click="
                  pcAlbumImg();
                  dialog.value = false;
                "
              >
                <v-list-item-icon>
                  <v-icon>mdi-image</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    >相册
                    <input
                      type="file"
                      hidden
                      ref="pcPhotoFile"
                      accept="image/*"
                      @change="fileChange"
                      style="display: none"
                    />
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="
                  defaultImg();
                  dialog.value = false;
                "
              >
                <v-list-item-icon>
                  <v-icon>mdi-cursor-default</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>默认图片</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-card-actions class="justify-end">
            <v-btn text @click="dialog.value = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <!-- 移动端选择图片 -->
    <v-bottom-sheet v-model="sheet">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
         elevation="1" 
         outlined 
         color="primary"
          v-bind="attrs"
          v-on="on"
          class="d-flex d-sm-none  ma-auto"
        >
          选择图片
        </v-btn>
      </template>
      <v-list>
        <v-subheader>
          <p >选择图片</p> 
        </v-subheader>
              <!-- 拍照2 -->
              <v-list-item
                class="d-flex d-sm-none "
                @click="
                  openFile();
                  sheet = false;
                "
              >
                <v-list-item-icon>
                  <v-icon>mdi-camera</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    >拍照
                    <input
                      type="file"
                      hidden
                      name="file"
                      @change="fileChange"
                      accept="image/*"
                      ref="cameraFile"
                      capture="camera"
                      style="display: none"
                    />
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <!-- 相册 -->
              <v-list-item
                @click="
                  albumImg();
                  sheet = false;
                "
              >
                <v-list-item-icon>
                  <v-icon>mdi-image</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    >相册
                    <input
                      type="file"
                      hidden
                      ref="photoFile"
                      accept="image/*"
                      @change="fileChange"
                      style="display: none"
                    />
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                @click="
                  defaultImg();
                  sheet = false;
                "
              >
                <v-list-item-icon>
                  <v-icon>mdi-cursor-default</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>默认图片</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
export default {
  name: "ChooseImg",
  components: {
    VueCropper
  },
  data: () => {
    return {
      imgUrl: "", //需要传递给父组件的图片地址
      videoModal: false, //控制拍照遮罩层的显示与隐藏
      fileModal: false, //控制相册选择图片后图片展示遮罩层的显示与隐藏
      isShow: false, //控制拍照页[video, canvas, 确认, 重新拍照]的显示与隐藏
      // 裁剪组件的基础配置option
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
        sheet: false,//控制底部工作表
    };
  },
  methods: {
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
    // 默认图片
    defaultImg() {
      let imgUrl = require("../../../assets/img/imgPuzzle.png")
      
      // console.log(imgUrl);
      // this.$emit("imgUrl", this.imgUrl);
       // 一定要设置为let，不然图片不显示
        let image = new Image();
        image.src = imgUrl;
        // image.onload为异步加载
        image.onload = () => {
          imgUrl = this.getBase64Image(image)
      this.$store.commit('changeImgUrl',imgUrl)
        this.$emit("imgUrl", "success");
        };
      
    },
    // PC打开相机
    cameraImg() {
      this.videoModal = true;
      this.closeVideo();
      let constraints = {
        video: {
          width: 500,
          height: 500,
        },
        audio: true,
      };
      // console.log(constraints);
      // 此处等待UI渲染进程结束，再执行js逻辑线程
      setTimeout(() => {
        let promise = navigator.mediaDevices.getUserMedia(constraints);

        let video = document.querySelector("#video");
        // console.log(video);
        let _this = this;
        promise
          .then(function (MediaStream) {
            // 关闭摄像头
            _this.MediaStreamTrack =
              typeof MediaStream.stop === "function"
                ? MediaStream
                : MediaStream.getTracks()[0];
            video.srcObject = MediaStream;
            video.srcObject = MediaStream;
            video.play();
          })
          .catch(function (PermissionDeniedError) {
            console.log(PermissionDeniedError);
          });
      }, 500);

      /*
        这里介绍新的方法:H5新媒体接口 navigator.mediaDevices.getUserMedia()
        这个方法会提示用户是否允许媒体输入,(媒体输入主要包括相机,视频采集设备,屏幕共享服务,麦克风,A/D转换器等)
        返回的是一个Promise对象。
        如果用户同意使用权限,则会将 MediaStream对象作为resolve()的参数传给then()
        如果用户拒绝使用权限,或者请求的媒体资源不可用,则会将 PermissionDeniedError作为reject()的参数传给catch()
        */
    },
    // PC拍照
    takePhoto() {
      let video = document.getElementById("video");
      let canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        CHeight = video.clientHeight, //获取屏幕大小让canvas自适应
        CWidth = video.clientWidth;
      canvas.width = CWidth;
      canvas.height = CHeight;

      // 水平翻转
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(video, 0, 0, CWidth, CHeight);
      this.isShow = !this.isShow;
    },
    // 返回PC拍摄图片地址
    checkImg() {
      let canvas;
      if (this.isShow === true) {
        canvas = document.getElementById("canvas");
        this.isShow = !this.isShow;
        this.videoModal = false;
      } else {
        canvas = document.querySelector("#file-canvas");
        this.fileModal = false;
      }
      let dataURL = canvas.toDataURL("image/jpeg"); //dataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA'
      console.log(dataURL);
      this.imgUrl = dataURL;
      // this.$emit("imgUrl", this.imgUrl);
      this.$store.commit('changeImgUrl',dataURL)

        this.$emit("imgUrl", "success");
      this.closeVideo();
    },
    // 关闭摄像头
    closeVideo() {
      this.MediaStreamTrack && this.MediaStreamTrack.stop();
    },
    // 打开Android相机
    openFile(){
        this.isCamera = true
        this.$refs.cameraFile.click();
    },
    
    // 打开相册
    albumImg() {
      // document.querySelector("#imgReader").click();
            this.$refs.photoFile.click();
            // console.log(this.$refs.photoFile);
      // this.fileModal = true;
    },
    pcAlbumImg() {
      // document.querySelector("#imgReader").click();
            this.$refs.pcPhotoFile.click();
            // console.log(this.$refs.photoFile);
      // this.fileModal = true;
    },
    // 修改图片尺寸
      fileChange() {
      console.log("输出files:", this.$refs.photoFile.files);
      let file = null
        if(this.isCamera){
            file = this.$refs.cameraFile.files[0]//相机拍照的
        }else{
            file = this.$refs.photoFile.files[0] || this.$refs.pcPhotoFile.files[0];//相册选择的
           
        }
      if (/.(png|jpg|jpeg|JPG|JPEG)$/.test(file.name)) {
        let fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = e => {
          // 将图像置于裁剪框中
          console.log("输出e:", e);
          this.option.img = e.target.result;
          this.fileModal = true;
          this.$refs.photoFile.value = "";
          this.$refs.pcPhotoFile.value = "";
          this.$refs.cameraFile.value = "";
        };
      } else {
        this.$message({
          message: "请选择符合格式要求的图片",
          type: "warning"
        });
        this.$refs.photoFile.value = "";
        this.$refs.pcPhotoFile.value = "";
          this.$refs.cameraFile.value = "";
      }
    },
    // 获取截图
        submitPhoto() {
          // 获取截图的base64数据
      this.$refs.cropper.getCropData(data => {
        // this.imgUrl = data
      this.$store.commit('changeImgUrl',data)
        this.$emit("imgUrl", "success");
        // console.log(data);
        this.fileModal = false
      })
    },
    // 设置截图框大小适应屏幕
    setSize() {
      let width = window.innerWidth + 'px'
       this.option.autoCropWidth = width
       this.option.autoCropHeight = width
    }
  },
  mounted() {
    this.setSize()
  }
};
</script>

<style>
#video {
  width: 500px;
  height: 500px;
  margin: auto;
  /* max-width: 500px;
  max-height: 500px; */
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  transform: scaleX(-1);
}

.v-overlay__content {
  width: 100%;
}
.cropper-content {
  width: 100%;
  height: calc(100vh);
}
.vue-cropper {
  width: 100%;
  height: 100%;
  /* max-width: 500px;
  max-height: 500px; */
}
</style>