import axios from 'axios'

import config from '@/config/config';
import { removeUserInfo } from '@/config/auth.js';



let domainPath = config.domainPath;

// import {
// 	showModal
// } from "@/components/G_show_modal/modal"
/*
 * Request(): 请求后台数据，返回成功后，执行callback
 * url: 请求的半路径
 * params: { data：请求参数，methods：请求方式，callback：回调方法 }
 */
export const request = async (options) => {
	const app = getApp()
	// if(!app.globalData.hasCheckLogin){
	// 	await checkLogin()
	// 	app.globalData.hasCheckLogin = true
	// }
	let {
		data,
		method,
		url,
		header = {},
		showLoading,
	} = options
	showLoading && uni.showLoading();
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('token') || ''
		const lang = uni.getStorageSync('lang') || 'en_US'
		header['token'] = token
		header['lang'] = lang

		uni.request({
			url: domainPath + url,
			data: {
				lang,
				...data
			},
			header: {
				...header,
			},
			method,
			sslVerify: false,
			success: function (res) {
				handleSuccess(res, resolve, reject)
			},
			fail: function (res) {
				handleFail(res, reject)
			}
		})


	});
};
export const requestFormData = (options={}) => {
	
	return new Promise((resolve, reject) => {
		const {
			data,
			url,
			header = {},
			filePath = undefined,// 上传文件临时路径
			name = 'file' // 上传文件 名称
		} = options
	
		let domainPath = config.domainPath;
		const token = uni.getStorageSync('token') || ''
		const lang = uni.getStorageSync('lang') || 'en_US'
		header['token'] = token
		header['lang'] = lang
		console.log(filePath)
		uni.uploadFile({
			filePath: filePath||'null',
			url: domainPath + url,
			name:'file',
			formData: {
				lang,
				...data
			},
			header: {
				...header
			},
			success: function (res) {
				console.log(res)
				res.data = JSON.parse(res.data);
				handleSuccess(res, resolve, reject)
			},
			fail: function (res) {
				console.log(res)
				handleFail(res, reject)
			}
		});
	})
}
export const requestAxios = (optios={})=>{
let domainPath = config.domainPath;
let {
		method,
		data,
		params,
		url,
		headers,
	} = optios
	return new Promise(function (resolve, reject) {
		axios({
			url:domainPath + url,
			method,
			data,
			params,
			headers
		}).then((res)=>{
			handleSuccess(res, resolve, reject,true)
		}).catch(res=>{
			handleFail(res, reject,true)
		})
	})
}
function handleFail(res, reject,isAxios) {
	!isAxios && uni.hideLoading();
	let {
		errMsg = null
	} = res
	if (errMsg) {
		console.log("errMsg:", errMsg)
	}
	reject(res)
}
function handleSuccess(res, resolve, reject,isAxios) {
	console.log('handleSuccess',JSON.stringify(res) )

	!isAxios&&uni.hideLoading();
	const message = res.data.msg || ''

	if (res.statusCode === 200 || res.status === 200) {
		let response = res.data
		if (response.code === 200) {
			resolve(response);
		} else {

			// 401 参数错误
			if (response.code == 401) {
				removeUserInfo()
				uni.redirectTo({
					url: '/pages/login/index?from=home'
				})
			}
			message && uni.showToast({
				icon: "none",
				title: message
			})
			reject(response)
		}
	} else {
		// 401 参数错误
		if (res.statusCode == 401) {
			removeUserInfo()
			uni.redirectTo({
				url: '/pages/login/index?from=home'
			})
		}
		message && uni.showToast({
			icon: "none",
			title: message
		})
		reject(res)
	}
}
/**
 * ws web socket
 */
