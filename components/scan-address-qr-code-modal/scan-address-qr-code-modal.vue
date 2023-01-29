<template>
	<view class="scan-address-qr-code-modal">
		<view class="scan-address-qr-code-modal-mask"></view>
		<view class="scan-address-qr-code-modal-wrapper">
			<uni-icons class="close-icon" color="#666" type="closeempty" @tap="_onClose" />
			<view class="body-top-tag">
				<image class="body-top-tag-icon" src='/static/eth-icon.png'></image>
				<view class="body-top-tag-text">{{$t('wallet.ethereumERC20')}}</view>
			</view>
			<view class="qr-code-wrapper">
				<canvas canvas-id="qrcode"/>
			</view>
			<view class="scan-address-qr-code-des">{{$t('wallet.scanAddressDes')}}</view>
			<view class="scan-address">{{scanAddress}}</view>
			<view class="body-btn" @tap="copy(scanAddress)">
				<image src="/static/my/btn-middle.png" mode="" />
				<text>{{ $t("wallet.copyAddress") }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js' //引入uqrcode.js
	export default {
		name:"scan-address-qr-code-modal",
		props: {
			scanAddress: {
				type: String,
				default: ''
			},
		},
		created() {
			this.qrFun(this.scanAddress);
		},
		data() {
			return {
			};
		},
		watch: {
			scanAddress(newVal, oldVal) {
				if (newVal) {
					this.qrFun(newVal);
				}
			}
		},
		methods: {
			//**生成二维码**//
			qrFun(text) {
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: text,
					size: 150,
					margin: 0,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H,
					success: res => {
						console.log('res', res);
					},
					error: (err) => {
						console.log('err', err);
					}
				})
			},
			_onClose() {
				this.$emit("onClose");
			},
			copy(val) {
				//#ifdef APP-PLUS
				if (plus && plus.android) {
					var Context = plus.android.importClass("android.content.Context");  
					var main = plus.android.runtimeMainActivity();  
					var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);  
					plus.android.invoke(clip,"setText", val); 
					uni.showToast({
						icon: "none",
						title: 'copy success',
						duration: 1000,
					});
				}
				//#endif
			},
		}
	}
</script>

<style lang="scss" scoped>
.scan-address-qr-code-modal {
	.scan-address-qr-code-modal-mask {
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
	}
	.scan-address-qr-code-modal-wrapper {
		position: fixed;
		z-index: 11;
		bottom: 0;
		left: 0;
		width: 100vw;
		height: 1038rpx;
		box-sizing: border-box;
		padding: 98rpx 62rpx 0;
		background: #FFFFFF;
		border-radius: 45rpx 45rpx 0 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		.close-icon {
			position: absolute;
			top: 47rpx;
			right: 49rpx;
			font-size: 33rpx !important;
			padding: 16rpx;
		}
		.body-top-tag {
			width: 455rpx;
			height: 60rpx;
			background: #CAD4FF;
			border-radius: 38rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 54rpx;
			.body-top-tag-icon {
				width: 37rpx;
				height: 34rpx;
				margin-right: 14rpx;
			}
			.body-top-tag-text {
				font-size: 29rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #000000;
				line-height: 40rpx;
			}
		}
		.qr-code-wrapper {
			width: 333rpx;
			height: 333rpx;
			background: #F3F5FF;
			border-radius: 14rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 20rpx;
			canvas {
				width: 290rpx;
				height: 290rpx;
			}
		}
		.scan-address-qr-code-des {
			font-size: 36rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #000000;
			line-height: 51rpx;
			margin-bottom: 45rpx;
		}
		.scan-address {
			width: 632rpx;
			height: 96rpx;
			background: #F1EEFF;
			border-radius: 49rpx;
			font-size: 24rpx;
			text-align: center;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #000000;
			line-height: 96rpx;
			box-sizing: border-box;
			margin-bottom: 71rpx;
		}
		.body-btn {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			width: 632rpx;
			height: 101rpx;
			image {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				z-index: 1;
				width: 632rpx;
				height: 101rpx;
			}
			text {
				position: relative;
				z-index: 9;
				font-size: 36rpx;
				color: #ffffff;
			}
		}
	}
}
</style>