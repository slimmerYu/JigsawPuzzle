/*
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 20:08:27
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-08 13:35:37
 */
const path = require('path');//引入path模块
function resolve(dir){
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}

module.exports = {
  // devServer: {
  //   overlay: { // 让浏览器 overlay 同时显示警告和错误
  //    warnings: true,
  //    errors: true
  //   },
  //   host: "localhost",
  //   port: 8080, // 端口号
  //   https: false, // https:{type:Boolean}
  //   open: false, //配置自动启动浏览器
  //   hotOnly: true, // 热更新
  //   // proxy: 'http://localhost:8080'  // 配置跨域处理,只有一个代理
  //   proxy: { //配置多个跨域
  //     "/api": {
  //       target: "http://172.11.11.11:7071",
  //       changeOrigin: true,
  //       // ws: true,//websocket支持
  //       secure: false,
  //       pathRewrite: {
  //         "^/api": "/"
  //       }
  //     },
  //     "/api2": {
  //       target: "http://172.12.12.12:2018",
  //       changeOrigin: true,
  //       //ws: true,//websocket支持
  //       secure: false,
  //       pathRewrite: {
  //         "^/api2": "/"
  //       }
  //     },
  //   }
  // },
  "transpileDependencies": [
    "vuetify"
  ],
  
  chainWebpack:(config)=>{
    config.resolve.alias
        .set('@',resolve('./src'))
        .set('components',resolve('./src/components'))
        .set('views',resolve('./src/views'))
        .set('assets',resolve('./src/assets'))
        .set('network',resolve('./src/network'))
        .set('common',resolve('./src/common'))
    //set第一个参数：设置的别名，第二个参数：设置的路径

  }
}

