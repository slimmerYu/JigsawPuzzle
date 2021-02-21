<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:53:02
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-20 14:13:22
-->
<template>
  <div class="login">
    <v-row justify="center" class="mt-4">
      <v-col text class="text-center">
        <div>
          <img class="logo" src="~assets/img/puzzle.png" />
        </div>
        <div>
          <h1>Jigsaw-Puzzle</h1>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- <v-snackbar
          centered
          absolute
          outlined
          :timeout="2000"
          :color="success ? 'success' : 'error'"
          v-model="snackbar"
        >
          {{ success ? "登录成功" : "登录失败,请重新尝试" }}
        </v-snackbar> -->
       
        <v-card class="mx-auto pa-6 my-2" min-width="300" outlined>
          <!-- <div text class="text-center text-h4">LOGIN</div> -->
          <v-card-text class="ma-0 pa-0">
            <v-form ref="form" v-model="valid">
              <v-container class="ma-0 pa-0">
                <v-row class="ma-0 my-4">
                  <v-col class="pa-0">
                    <v-text-field
                      dense
                      label="PhoneNumber"
                      prepend-icon="mdi-cellphone"
                      autofocus
                      :rules="[rules.required, rules.moblie]"
                      ref="PhoneNumber"
                      v-model="PhoneNumber"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row class="ma-0" justify="space-between" align="start">
                  <v-col class="pa-0" cols="8">
                    <v-text-field
                      hide-details="auto"
                      dense
                      label="PhoneCode"
                      prepend-icon="mdi-shield-lock-outline"
                      :rules="[rules.required]"
                      v-model="PhoneCode"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col class="pa-0" cols="3">
                    <v-btn
                      outlined
                      block
                      class="ma-0 pa-0"
                      color="primary"
                      @click="getCode()"
                      id="btnCode"
                      ref="btnCode"
                      v-text="btnTitle"
                    ></v-btn>
                  </v-col>
                </v-row>
                <v-row class="ma-0">
                  <v-col class="pa-0">
                    <v-checkbox
                      v-model="checkbox"
                      required
                      :rules="[rules.checkbox]"
                      color="green"
                    >
                      <template v-slot:label>
                        <div @click.stop="">
                          Do you accept the
                          <a href="#" @click.prevent="terms = true">terms</a>
                          and
                          <a href="#" @click.prevent="conditions = true"
                            >conditions?</a
                          >
                        </div>
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
                <v-row class="ma-0">
                  <v-col class="pa-0">
                    <v-btn
                      block
                      class="primary mt-8"
                      @click="
                        login();
                        snackbar = true;
                      "
                      :loading="loading"
                    >
                      Login
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>

              <!-- <v-text-field
                  :type="show ? 'text' : 'password'"
                  name="password"
                  label="Password"
                  prepend-icon="mdi-lock-outline"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show = !show"
                  :rules="[rules.required]"
                  v-model="user.pwd">
                </v-text-field> -->
            </v-form>
            <v-dialog v-model="terms" width="70%">
              <v-card>
                <v-card-title class="title"> Terms </v-card-title>
                <v-card-text v-for="n in 5" :key="n">
                  {{ content }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="purple" @click="terms = false"> Ok </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="conditions" width="70%">
              <v-card>
                <v-card-title class="title"> Conditions </v-card-title>
                <v-card-text v-for="n in 5" :key="n">
                  {{ content }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="purple" @click="conditions = false">
                    Ok
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-expand-x-transition>
     <v-alert dense
      v-model="alert"
      absolutely
      :type="success ? 'success' : 'error'"
    >
      {{ success ? "登录成功" : "登录失败,请重新尝试" }}
    </v-alert>
      </v-expand-x-transition>
    <v-footer padless absolute>
      <v-col class="text-center" cols="12">
        Copyright © 2021 slimmerYu. All rights reserved.
      </v-col>
    </v-footer>
  </div>
</template>

<script>
import {getCode,getLoginData} from "network/login"
// import {getCode} from "network/login"
// import axios from 'axios'
import qs from 'qs'
export default {
  name: 'Login',

  components: {
  },
  data: () => ({ 
    btnTitle:'获取验证码',
    // show: false,//密码显示或显示*
    valid: true,
    success: false,//登录成功
    alert: false,//控制登录提示框显示与隐藏
    loading: false,//控制登录按钮的加载动画
    rules: {
      required: value => !!value || 'Required.',
      moblie: (value) => {
        const pattern = /^[1]([3-9])[0-9]{9}$/;
        return pattern.test(value) || 'Please input the correct mobile phone number'
      },
      checkbox: v => !!v || 'You must agree to continue!'
    },
    PhoneNumber: '',
    PhoneCode: null, 
    checkbox: false,
    terms: false,
    conditions: false,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.',
  }),
  methods: {
    validateBtn(){
   //倒计时
    let time = 60;
    let timer = setInterval(() => {
    if(time == 0) {
      clearInterval(timer);

      document.querySelector('#btnCode').classList.remove("v-btn--disabled");
      this.btnTitle = "获取验证码";
    } else {
      this.btnTitle =time + '秒后重试';
      document.querySelector('#btnCode').classList.add("v-btn--disabled");
      time--
    }
    },1000)
    // 跳转页面清除计时器, 否则会一直执行报错
    this.$once('hook:beforeDestroy', () => {            
          clearInterval(timer);     
           })
           
  },
    // 获取验证码
    getCode() {
      // console.log(this.$refs.PhoneNumber.valid);
      if(this.$refs.PhoneNumber.valid) {
        // 手机号码格式正确, 发送请求
        this.validateBtn()
        // 请求验证码
        // http://a.wpengsen.cn:8989
        getCode({phone:this.PhoneNumber}).then(res => {
          console.log(res);
          if(res.data.code === 200) {
            console.log('请求成功');
            
          }
        })
        // this.$axios.post('http://a.wpengsen.cn:8989/sendMsg',qs.stringify({phone:this.PhoneNumber})).then(res => {
        //   // console.log(res);
        //   if(res.data.code === 200) {
        //     console.log('请求成功');
            
        //   }
        // })
      }
    },
    login() {
      if(this.$refs.form.validate()){//将验证所有输入并返回它们是否都有效
        // console.log('手机号: ',typeof this.PhoneNumber,'验证码: ',typeof parseInt(this.PhoneCode) );
              // 用于登录按钮加载动画
              this.loading = true
        // console.log(this.user.tel,this.user.pwd);
console.log(qs.stringify({code:parseInt(this.PhoneCode),phone:this.PhoneNumber}));
        getLoginData({code:parseInt(this.PhoneCode),phone:this.PhoneNumber}).then(res => {
          console.log(res);
           if (res.data.code === 200) {
              console.log(res.data);
              // 用于判断提示框
                this.success = true
                this.alert = !this.alert
              // 跳转页面
              setTimeout(() => {
                this.$router.push({path: "/"})
                this.alert = !this.alert
              }, 1500);
              
                // 保存token到sessionStorage
                // sessionStorage.setItem('token',res.data.data.token)
            this.$store.commit("set_user", res.data.data)
            }else {
              this.success = false
                this.alert = !this.alert
              console.log(res.data.message);
                setTimeout(() => {
                this.alert = !this.alert
              }, 2000);
              this.loading = false
            }
        })
        
        // this.$axios.post('http://a.wpengsen.cn:8989/login',qs.stringify({code:parseInt(this.PhoneCode),phone:this.PhoneNumber}))
        // .then(res=>{
        //     // console.log(res)
        //     if (res.data.code === 200) {
        //       console.log(res.data);
        //       // 用于判断提示框
        //         this.success = true
        //         this.alert = !this.alert
        //       // 跳转页面
        //       setTimeout(() => {
        //         this.$router.push({path: "/"})
        //         this.alert = !this.alert
        //       }, 1500);
              
        //         // 保存token到sessionStorage
        //         // sessionStorage.setItem('token',res.data.data.token)
        //     this.$store.commit("set_user", res.data.data)
        //     console.log(sessionStorage.getItem('store').token);
        //     }else {
        //       this.success = false
        //         this.alert = !this.alert
        //       console.log(res.data.message);
        //         setTimeout(() => {
        //         this.alert = !this.alert
        //       }, 2000);
        //       this.loading = false
        //     }
        // })
      }
    }
  },
};
</script>

<style scoped>
.login {
  overflow: hidden;
}
.logo {
  width: 100px;
  height: 100px;
}
</style>
