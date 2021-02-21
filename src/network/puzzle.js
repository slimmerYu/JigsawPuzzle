/*
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-02-19 00:07:08
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-21 10:51:25
 */
import {request} from "./request"
import qs from 'qs'
// 获取生成的拼图序列
export function getPuzzle(data) {
  
  return request ({
    url: '/puzzle/generatedData',
    method: 'post',
    headers: {
      'Authorization': sessionStorage.getItem('token') //请求头设置
  },
    data,
    transformRequest: [data => {//data应是一个对象
      data = qs.stringify(data)
      return data
    }],
    timeout: 10000, 
  })
}
// 自动拼图
export function autoPlay(data) {
  
  return request ({
    url: '/puzzle/automaticCalculation',
    method: 'post',
    headers: {
      'Authorization': sessionStorage.getItem('token') //请求头设置
  },
    data,
    transformRequest: [data => {//data应是一个对象
      data = qs.stringify(data)
      return data
    }]
  })
}
// 保存进度
export function saveProgress(data) {
  
  return request ({
    url: '/puSchedule/insertPuSchedule',
    method: 'post',
    headers: {
      'Authorization': sessionStorage.getItem('token') //请求头设置
  },
    data,
  })
}
// 读取进度
export function getProgress(data) {
  
  return request ({
    url: '/puSchedule/selectPuScheduleByUserId',
    method: 'post',
    headers: {
      'Authorization': sessionStorage.getItem('token')//请求头设置
  },
    data,
    transformRequest: [data => {//data应是一个对象
      data = qs.stringify(data)
      return data
    }]
  })
}
// 删除进度
export function deletePro(data) {
  
  return request ({
    url: '/puSchedule/deletePuScheduleById',
    method: 'post',
    headers: {
      'Authorization': sessionStorage.getItem('token')//请求头设置
  },
    data,
    transformRequest: [data => {//data应是一个对象
      data = qs.stringify(data)
      return data
    }]
  })
}
// 添加分数
export function addScore(data) {
  return request ({
    url: '/sysUser/plusGradeById',
    method: 'post',
    headers: {
      'Authorization': sessionStorage.getItem('token') //请求头设置
  },
    data,
    transformRequest: [data => {//data应是一个对象
      data = qs.stringify(data)
      return data
    }]
  })
}