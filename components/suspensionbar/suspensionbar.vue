<template>
	<view class="suspensionbar-container" @tap="goWalletPage">
		<image class="wallet-balance-bg" :src="bgColor ? '/static/wallet/wallet-balance-has-bg.png' : '/static/wallet/wallet-balance-bg.png'"></image>
		<view class="suspensionbar-list">
			<view class="suspensionbar-item">
				<image src='/static/dat3-icon.png'></image>
				<text>0.00</text>
			</view>
			<view class="suspensionbar-item">
				<image src='/static/vedat3-icon.png'></image>
				<text>0.00</text>
			</view>
			<view class="suspensionbar-item">
				<image src='/static/eth-icon.png'></image>
				<text>{{data.ETHStr || '0.00'}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { formatEther } from '@/utils/wallet';
	import { ethers } from 'ethers';
	export default {
		name:"suspensionbar",
		props: {
			bgColor: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				data: this.formatWalletBalanceInfo(getApp().globalData.walletBalanceInfo)
			}
		},
		created() {
			this.emitData();
		},
		methods: {
			emitData() {
				let me = this;
				uni.$on('updateWalletBalanceInfo', function({ data }){
					const walletBalanceInfo = me.formatWalletBalanceInfo(data);
					me.data = walletBalanceInfo;
				})
			},
			formatWalletBalanceInfo(walletBalanceInfo) {
        let data = {};
				walletBalanceInfo.forEach(element => {
					switch (element.token) {
						case 'ETH':
							data.ETH = element.amount;
							data.ETHStr = formatEther(element.amount);
							break;
						// case 'DAT3':
						// 	data.DAT3 = element.amount;
						// 	break;
						// case 'VEDAT3':
						// 	data.VEDAT3 = element.amount;
						// 	break;
						default:
							break;
					}
				});
        return data;
      },
			goWalletPage() {
        uni.navigateTo({
          url: `/pages/wallet/index`,
        });
      },
		}
	}
</script>

<style>
.suspensionbar-container {
	min-width: 340rpx;
	height: 80rpx;
	border-radius: 28rpx;
	position: absolute;
	top: -40rpx;
	right: 0;
}
image.wallet-balance-bg {
	position: absolute;
	width: 100%;
	height: 80rpx;
}
.suspensionbar-container .suspensionbar-list {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	min-width: 340rpx;
	height: 100%;
	box-sizing: border-box;
	padding: 18rpx 24rpx;
}
.suspensionbar-container .suspensionbar-list .suspensionbar-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 29rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #000000;
	margin-right: 20rpx;
}
.suspensionbar-container .suspensionbar-list .suspensionbar-item:last-child {
	margin-right: 0;
}
.suspensionbar-container .suspensionbar-list .suspensionbar-item image {
	width: 44rpx;
	height: 44rpx;
	margin-right: 2rpx;
}
</style>
