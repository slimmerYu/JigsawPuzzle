/*
 * @Description: 
 * @version: 
 * @Author: slimmerYu
 * @Date: 2021-02-19 00:47:14
 * @LastEditors: slimmerYu
 * @LastEditTime: 2021-02-19 21:09:51
 */
import {request} from "./request"

// 更换头像
export function changeAvatar(data) {
  
  return request ({
    url: '/sysUser/uploadHeadPortrait',
    method: 'post',
    headers: {
      'Authorization': sessionStorage.getItem('token') //请求头设置
  },
    data,
  })
}
// 查看排名
export function seeRank() {
  
  return request ({
    url: '/sysUser/selectGrade',
    method: 'post',
    headers: {
      'Authorization': sessionStorage.getItem('token') //请求头设置
  },
  })
}