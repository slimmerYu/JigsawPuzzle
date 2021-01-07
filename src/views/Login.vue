<!--
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:53:02
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-01-07 22:20:24
-->
<template>
  <div class="login">
    <h1>This is an login page</h1>
    <v-card
      class="mx-auto pa-6 my-16"
      min-width="300"
      outlined
      >
      <v-card-title>
        <h2>Login</h2>
      </v-card-title>
      <v-card-text>
        <v-form 
          ref="form"
          v-model="valid"
          lazy-validation>
          <v-text-field
            label="PhoneNumber"
            prepend-icon="mdi-cellphone"
            autofocus
            :rules="[rules.required, rules.moblie]"
            v-model="user.tel">
          </v-text-field>
          <v-text-field
            :type="show ? 'text' : 'password'"
            name="password"
            label="Password"
            prepend-icon="mdi-lock-outline"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show = !show"
            :rules="[rules.required]"
            v-model="user.pwd">
          </v-text-field>
          <v-btn
            block
            class="primary mt-8 "
            @click="login()"
          >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
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
    show: false,//密码显示或显示*
    valid: true,
    rules: {
      required: value => !!value || 'Required.',
      moblie: (value) => {
        const pattern = /^[1]([3-9])[0-9]{9}$/;
        return pattern.test(value) || 'Please input the correct mobile phone number'
      }
    },
    user: {
      tel: '13931112192',//用户手机号
      pwd: '123456789'//用户密码
    },
    result:[]//用户数据
  }),
  methods: {
    login() {
      if(this.$refs.form.validate()){//将验证所有输入并返回它们是否都有效
        
        // console.log(this.user.tel,this.user.pwd);
        this.$axios.post('http://47.94.84.88:8989/login',qs.stringify({tel:this.user.tel,password:this.user.pwd}))
        .then(res=>{
            console.log(res)
            if (res.data.code === 200) {
              // console.log(res.data.message);
              setTimeout(() => {
                this.$router.push({path: "/"})
              }, 1000);

              // localStorage.setItem('token',res.data.data)
                // 将登录名使用vuex传递到Home页面
            this.$store.commit('handleUserName',res.data.data.tel);
            }else {
              console.log('手机号或密码错误');
            }
        })
      }
    }
  },
};
</script>