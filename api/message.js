import { request, requestFormData,requestAxios } from '@/config/request'
import { BASE_PATH } from '@/config/config'

/**
 * 发送消息回执(发送之前扣款)
 */
export function sendMsgBefore(data = {}) {
  return request({
      method: 'POST',
      data: {
        timestamp: new Date().getTime(),
        ...data
      },
      url:`${BASE_PATH}/interactive/sendMsg`,
      showLoading: false,
  })
}

/**
 * 已读消息回执(分配收益)
 */
export function replyMsgBefore(data = {}) {
  return request({
      method: 'POST',
      data: {
        timestamp: new Date().getTime(),
        ...data
      },
      url:`${BASE_PATH}/interactive/reply`,
      showLoading: false,
  })
}

/**
 * 判断某用户与当前用户的会话关系 
 */
export function getChatRel(userCode) {
  return request({
      method: 'GET',
      url:`${BASE_PATH}/interactive/before/${userCode}`,
      showLoading: false,
  })
}