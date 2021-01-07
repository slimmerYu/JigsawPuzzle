/*
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-06 19:55:24
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-01-07 20:33:44
 */
import axios from 'axios'
// 考虑扩展性,不用default
export function request(config) {
  // 1.创建axios实例
  const instance = axios.create({
    baseURL: 'http://47.94.84.88:8989',
    timeout: 5000
  })

  // 2.axios拦截器
  // 请求拦截
  instance.interceptors.request.use(config => {
    // console.log(config);
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