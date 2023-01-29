<template>
	<view class="container">
		<view 
			:inputMnemonic="inputMnemonic" 
			:change:inputMnemonic="renderjs.updateInputMnemonic" 
			id="renderjs" 
			class="renderjs"
		></view>
		<uni-nav-bar
      class="header-nav"
      :fixed="true"
			:title="$t('wallet.importWallet')"
      status-bar="true"
      background-color="#F9F8FF"
      @clickLeft="back"
			:border="false"
    >
		 	<block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png"></image>
        </view>
      </block>
		</uni-nav-bar>
		<view class="body">
			<view class="form-wrapper">
				<view class="form-item">
					<view class="form-item-label">{{$t('wallet.seedPhrase')}}</view>
					<view class="form-item-value">
						<textarea :maxlength="1000" v-model="inputMnemonic" :placeholder="$t('wallet.seedPhrasePlaceholder')" :controlled="true" />
					</view>
				</view>
				<view class="body-btn" @tap="renderjs.onImport">
					<image :src="`/static/my/btn-${inputMnemonic ? 'middle' : 'disabled'}.png`"  mode="" />
					<text>{{ $t("wallet.confirm") }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script module="renderjs" lang="renderjs">
	import { ethers } from 'ethers';
	import { walletEntropyPwd } from '@/utils/wallet';
	export default {
		data() {
			return {
				_inputMnemonic: '',
			}
		},
		methods: {
			updateInputMnemonic(val) {
				this._inputMnemonic = val;
			},
			onImport() {
				let me = this;
				if (!me._inputMnemonic) {
					return;
				}
				me.$ownerInstance.callMethod('showLoading');
				try {
					let Wallet = ethers.Wallet.fromMnemonic(me._inputMnemonic);
					Wallet.encrypt(walletEntropyPwd).then(function(json) {
						me.$ownerInstance.callMethod('hideLoading');
						me.$ownerInstance.callMethod('confirmSuccess', json);
					});
				} catch (error) {
					me.$ownerInstance.callMethod('hideLoading');
					me.$ownerInstance.callMethod('confirmError', error && error.message);
				}
			}
		}
	}
</script>

<script>
	import { ethers } from 'ethers';
	import { setWalletJson } from '@/config/wallet';
	import { walletEntropyPwd } from '@/utils/wallet';
	export default {
		data() {
			return {
				inputMnemonic: '',
			};
		},	
		methods: {
			onRemember(){
				this.hasRemember = true;
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			confirmSuccess(json) {
				setWalletJson(json);
				uni.redirectTo({
					url: `/pages/wallet/index?switchKey=wallet`,
				});
			},
			confirmError(errMsg) {
				uni.showToast({
					title: errMsg,
					icon: 'none'
				});
			},
			showLoading() {
				uni.showLoading({
					mask: true
				});
			},
			hideLoading() {
				uni.hideLoading();
			},
		}
	}
</script>

<style lang="scss" scoped>
.container {
	#renderjs {
		display: none;
	}
	.body {
		padding: 58rpx 60rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.form-wrapper {
			.form-item {
				width: 627rpx;
				.form-item-label {
					height: 40rpx;
					font-size: 40rpx;
					font-family: SourceHanSansCN-Bold, SourceHanSansCN;
					font-weight: bold;
					color: #0E0E0E;
					line-height: 60rpx;
					margin-bottom: 25rpx;
				}
				.form-item-value {
					width: 627rpx;
					height: 399rpx;
					padding: 45rpx 40rpx;
					box-sizing: border-box;
					background: #F1EEFF;
					border-radius: 7rpx;
					margin-bottom: 67rpx;
					textarea {
						width: 547rpx;
						font-weight: 100;
					}
				}
			}
		}
		.body-btn {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
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
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
			}
		}
	
	}
}
</style>
