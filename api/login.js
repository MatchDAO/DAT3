import { request,requestFormData } from '@/config/request'
import { BASE_PATH } from '@/config/config'

/**
 * 邮箱登陆
 * { 
 * "account":"test@dvsd.com", 
 * "password": "efergerthertjhertjhs", 
 * "captcha":”1234”, }
 */
 export function loginEmail(data={}){
	return request({
		method:'POST',
		data,
		url:`${BASE_PATH}/login`,
        showLoading:true
	})
}

/**
 * 邮箱邀请登陆
 * { "account":"erhgfnbioe@dvsd.com", 
 * "captcha":"1234", 
 * "invitation":"20" }
 */
 export function loginRegister(data={}){
	return request({
		method:'POST',
		data,
		url:`${BASE_PATH}/register/login`,
        showLoading:true
	})
}
// 第一次登陆修改头像file 昵称userName 个人介绍bio（暂无） userCode
export function registerEnd(data = {},fileParams={}) {
    const { filePath = undefined, name = 'file' } = fileParams
    return requestFormData({
        method: 'POST',
        data,
		url:`${BASE_PATH}/register/end`,
        showLoading: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        filePath,
        name
    })
}
/**
 * 获取
{ "account":"test@dvsd.com", 
"type":"3" //验证码类型: "1": login ,"2":modify,"3":login_register,"4":register 
}

 */
 export function sendEmailCode(data={}){
	return request({
		method:'POST',
		data,
		url:`${BASE_PATH}/sendMessage`,
        showLoading:true
	})
}

/**
 * 登出
 */
 export function logout(data={}){
	return request({
		method:'GET',
		data,
		url:`${BASE_PATH}/user/logout`,
        showLoading:true
	})
}
/**
 * 删除账号
 */
 export function delAccount(data={}){
	return request({
		method:'GET',
		data,
		url:`${BASE_PATH}/user/delAccount`,
        showLoading:true
	})
}
