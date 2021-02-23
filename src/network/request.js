/*
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:55:24
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-23 21:53:59
 */
import axios from 'axios'
// 考虑扩展性,不用default
export function request(config) {
  // 1.创建axios实例
  const instance = axios.create({
    // baseURL: 'http://127.0.0.1:8989',
    baseURL: 'http:///192.168.3.6:8989',
    timeout: 5000, 
  })
  // instance({
  //   url:'login',
  // params:{
  //   key:value
  // }
  // })
  // 2.axios拦截器
  // 请求拦截
  instance.interceptors.request.use(config => {
    // console.log(config);
    // 为请求头对象, 添加Token 验证的Authorization字段
    // config.headers.Authorization = sessionStorage.getItem('token')
    return config;//拦截下来做出处理后,必须返回,不然内部在发送请求时就没有config了
  } ,err => {
    console.log(err);
  })
  // 响应拦截
  instance.interceptors.response.use(res => {
    // console.log(res);
    return res;//处理完后返回data,data才是需要的
  }, err  => {
    console.log(err);
  })

  // 3.发送真正的网络请求
  return instance(config)
 
}