// 储存钱包json
export function setWalletJson(json){
	const app = getApp()
	const userInfo = app.globalData.userInfo || {};
	if (userInfo.userCode) {
		uni.setStorageSync(`wallet.keystore.${userInfo.userCode}`, json);
	}
}
// 获取钱包json
export function getWalletJson(){
	const app = getApp()
	const userInfo = app.globalData.userInfo || {};
	if (userInfo.userCode) {
		const walletJson = uni.getStorageSync(`wallet.keystore.${userInfo.userCode}`);
		return walletJson;
	} else {
		return;
	}
}
