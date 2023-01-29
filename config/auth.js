export function removeUserInfo(){
	const app = getApp()
	app.globalData.userInfo =null
	app.globalData.walletBalanceInfo =[]
	uni.removeStorageSync('token')
	uni.removeStorageSync('userInfo')
}
export function setUserInfo(userInfo={}){
	const app = getApp()
	app.globalData.userInfo = userInfo;
	uni.setStorageSync("userInfo", JSON.stringify(userInfo));
}
export function setToken(token){
	uni.setStorageSync("token", token);
}
export function setEmToken(emToken){
	uni.setStorageSync("emToken", emToken);
}
export function getUserInfo(){
	let userInfoStr = uni.getStorageSync('userInfo')
	return userInfoStr && JSON.parse(userInfoStr) || {}
}
export function getToken(){
	return uni.getStorageSync('token')
}
export function getEmToken(){
	return uni.getStorageSync('emToken')
}
