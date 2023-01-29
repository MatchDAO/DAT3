<template>
	<view class="container">
		<view 
			:inputMnemonic="inputMnemonic" 
			:change:inputMnemonic="renderjs.updateInputMnemonic" 
			:mnemonic="mnemonic" 
			:change:mnemonic="renderjs.updateMnemonic" 
			id="renderjs" 
			class="renderjs"
		></view>
		<uni-nav-bar
      class="header-nav"
      :fixed="true"
			:title="$t('wallet.createWallet')"
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
			<view class="remember-wrapper" v-if="!hasRemember">
				<view class="remember-content">
					<view class="rememberTip">{{$t('wallet.rememberTip')}}</view>
					<view class="mnemonic-list">
						<view class="mnemonic-item" v-for="(item, index) in mnemonicList" :key="index">
							{{index+1}}. {{item}}
						</view>
					</view>
				</view>
				<view class="body-btn" @tap="onRemember">
					<image src="/static/my/btn-middle.png" mode="" />
					<text>{{ $t("wallet.rememberIt") }}</text>
				</view>
			</view>
			<view class="form-wrapper" v-if="hasRemember">
				<view class="form-item">
					<view class="form-item-label">{{$t('wallet.seedPhrase')}}</view>
					<view class="form-item-value">
						<textarea :maxlength="1000" v-model="inputMnemonic" :placeholder="$t('wallet.seedPhrasePlaceholder')" :controlled="true" />
					</view>
				</view>
				<view class="body-btn" @tap="renderjs.confirm">
					<image :src="`/static/my/btn-${inputMnemonic === mnemonic ? 'middle' : 'disabled'}.png`" mode="" />
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
				_mnemonic: ''
			}
		},
		created() {
			this.genMnemonic();
		},
		methods: {
			updateInputMnemonic(val) {
				this._inputMnemonic = val;
			},
			updateMnemonic(val) {
				this._mnemonic = val;
			},
			genMnemonic() {
 				let wallet = ethers.Wallet.createRandom();
				let mnemonic = wallet.mnemonic.phrase;
				this.$ownerInstance.callMethod('changeMnemonic', mnemonic);
			},
			confirm() {
				let me = this;
				if (me._inputMnemonic !== me._mnemonic) {
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
	export default {
		data() {
			return {
				inputMnemonic: '',
				hasRemember: false,
				mnemonic: ''
			};
		},
		computed: {
			mnemonicList(){
				if (!this.mnemonic) {
					return [];
				}
				const list = this.mnemonic.split(' ');
				return list;
			}
		},
		methods: {
			changeMnemonic(mnemonic) {
				this.mnemonic = mnemonic;
			},
			onRemember(){
				this.hasRemember = true;
				// this.inputMnemonic = this.mnemonic;
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
			showToast(opt) {
				uni.showToast(opt);
			},
			showLoading() {
				uni.showLoading({
					mask: true
				});
			},
			hideLoading() {
				uni.hideLoading();
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
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
		.remember-wrapper {
			.remember-content {
				margin-bottom: 58rpx;
				width: 627rpx;
				box-sizing: border-box;
				background: #F1EEFF;
				border-radius: 7rpx;
				padding: 54rpx 36rpx;
				.rememberTip {
					font-size: 25rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #000000;
				}
				.mnemonic-list {
					font-size: 29rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #000000;
					line-height: 60rpx;
					text-align: center;
					margin-top: 42rpx;
					.mnemonic-item {
					}
				}
			}
		}
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
