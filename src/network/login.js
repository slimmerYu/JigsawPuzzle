/*
 * @Description: 登录页的网络请求
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-07 14:57:29
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-01-07 21:20:12
 */
import {request} from "./request"

export function getLoginData() {
  return request ({
    url: '/login'
  })
}