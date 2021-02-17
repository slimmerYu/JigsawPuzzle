<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:53:02
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-17 18:08:58
-->
<template>
  <div class="login">
      <v-row justify="center" class="mt-4">
        <v-col text class="text-center">
          <div>
            <img class="logo" src="~assets/img/puzzle.png">
          </div>
          <div>
            <h1>Jigsaw-Puzzle</h1>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-snackbar
            centered
            text
            outlined
            :timeout="2000"
            color="success"
            v-model="snackbar"
          >
            {{ success ? '登录成功' : '验证码错误' }}

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
          <v-card
            class="mx-auto pa-6 my-2"
            min-width="300"
            outlined
            >
              <!-- <div text class="text-center text-h4">LOGIN</div> -->
            <v-card-text class="ma-0 pa-0">
              <v-form 
                ref="form"
                v-model="valid"
                lazy-validation>
                <v-container class="ma-0 pa-0">
                  <v-row class="ma-0 my-4">
                    <v-col class="pa-0">
                      <v-text-field
                        dense
                        label="PhoneNumber"
                        prepend-icon="mdi-cellphone"
                        autofocus
                        :rules="[rules.required, rules.moblie]"
                        ref="PhoneNumber">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="ma-0" justify="space-between"
                  align="start">
                    <v-col class="pa-0" cols="8">
                       <v-text-field
                        hide-details="auto"
                       dense
                        label="PhoneCode"
                        prepend-icon="mdi-cellphone"
                        autofocus
                        :rules="[rules.required]">
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
                        v-text="btnTitle"
                        ></v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="ma-0">
                    <v-col  class="pa-0">
                      <v-btn
                        block
                        class="primary mt-8 "
                        @click="login();snackbar = true"
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
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-footer padless absolute>
        <v-col
          class="text-center"
          cols="12"
        >
          Copyright © 2021 slimmerYu. All rights reserved. 
        </v-col>
      </v-footer>
  </div>
</template>

<script>
// import {getLoginData} from "network/login"
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
    snackbar: false,//控制提示框显示与隐藏
    loading: false,//控制登录按钮的加载动画
    rules: {
      required: value => !!value || 'Required.',
      moblie: (value) => {
        const pattern = /^[1]([3-9])[0-9]{9}$/;
        return pattern.test(value) || 'Please input the correct mobile phone number'
      }
    },
    result:[]//用户数据
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
  },
    // 获取验证码
    getCode() {
      // console.log(this.$refs.PhoneNumber.valid);
      if(this.$refs.PhoneNumber.valid) {
        // 手机号码格式正确, 发送请求
        this.validateBtn()
        // 请求验证码
      }
    },
    login() {
      if(this.$refs.form.validate()){//将验证所有输入并返回它们是否都有效
        
              // 用于登录按钮加载动画
              this.loading = true
        // console.log(this.user.tel,this.user.pwd);
        this.$axios.post('http://47.94.84.88:8989/login',qs.stringify({tel:this.user.tel,password:this.user.pwd}))
        .then(res=>{
            console.log(res)
            if (res.data.code === 200) {
              // console.log(res.data.message);
              // 用于判断提示框
              this.success = true
              // 跳转页面
              setTimeout(() => {
                this.$router.push({path: "/"})
              }, 1000);
              
              // 用于登录按钮加载动画
              this.loading = false
              // localStorage.setItem('token',res.data.data)
                // 将登录名使用vuex传递到Home页面
            this.$store.commit('handleUserName',res.data.data.tel);
          
            }else {
              this.success = false
              console.log('手机号或密码错误');
            }
        })
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
