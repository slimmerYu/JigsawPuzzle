/*
 * @Description: 登录页的网络请求
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-01-07 14:57:29
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-19 23:06:32
 */
import {request} from "./request"
import qs from 'qs'
export function getLoginData(data) {
  
  return request ({
    url: '/login',
    method: 'post',
    data,
    transformRequest: [data => {//data应是一个对象
      data = qs.stringify(data)
      return data
    }],
  })
}
export function getCode(data) {
  return request ({
    url: '/sendMsg',
    method: 'post',
    data,
    transformRequest: [data => {//data应是一个对象
      data = qs.stringify(data)
      return data
    }],
  })
}