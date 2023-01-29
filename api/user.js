import { request, requestFormData,requestAxios } from '@/config/request'
import { BASE_PATH } from '@/config/config'

/**
 * 查看⽤⼾信息
{ "userCode
email
wallet
}

 */
export function getUserInfo(data = {}) {
    return request({
        method: 'POST',
        data,
       url:`${BASE_PATH}/user/info`
    })
}
/**
 * 修改个⼈信息 特殊 axios
{ 
    "userCode":"test@dvsd.com", 
    userName
    bio
}
 */
export function editUserInfo(data = {},fileParams={}) {
    const { filePath = undefined, name = 'file' } = fileParams
    return requestFormData({
        method: 'POST',
        data,
       url:`${BASE_PATH}/user/modify`,
        showLoading: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        filePath,
        name
    })
}
export function editUserPortrait(data = {}, fileParams = {}) {
    const { filePath = undefined, name = 'file' } = fileParams
    return requestFormData({
        method: 'POST',
        data,
        url:`${BASE_PATH}/user/${data.userCode}/portrait`,
        showLoading: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        filePath,
        name
    })
}
/**
 * 推荐用户列表
 * 入参示例：
    {
        "profession": "["123","1234"]",
        "userName": "s",
        "current": 1,
        "size": 10
    }
 */
export function getPopularUserList(data = {}) {
    return request({
        method: 'POST',
        data,
       url:`${BASE_PATH}/popular`,
        showLoading: true,
    })
}
/**
 * 举报用户
 */
export function reportUser(data = {}) {
    return request({
        method: 'POST',
        data,
       url:`${BASE_PATH}/report`,
        showLoading: true,
    })
}

