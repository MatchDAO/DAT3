<template>
	<view class="container">
		<view 
			:walletJson="walletJson" 
			:change:walletJson="renderjs.updateWalletJson" 
			:amount="amount" 
			:change:amount="renderjs.updateAmount" 
			:address="address" 
			:change:address="renderjs.updateAddress" 
			id="renderjs" 
			class="renderjs"
		></view>
		<uni-nav-bar
      class="header-nav"
      :fixed="true"
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
			<view class="form-item">
				<view class="form-item-label">{{$t('wallet.selectAsset')}}</view>
				<view class="form-item-control form-item-select" @tap="changeSelectAssetVisible(true)">
					<image class="form-item-select-icon" :src="assetItem.imageSrc"></image>
					<view class="form-item-select-label">{{assetItem.label}}</view>
					<uni-icons class="form-item-select-btn" color="#231815" type="arrowright" size="24" />
				</view>
			</view>
			<view class="form-item">
				<view class="form-item-label">{{$t('wallet.address')}}</view>
				<view class="form-item-control form-item-input">
					<input v-model="address" :controlled="true" class="form-item-input-value" />
				</view>
			</view>
      <view class="form-item">
				<view class="form-item-label">{{$t('wallet.amount')}}</view>
				<view class="form-item-control form-item-inputNumber">
					<input v-model="amount" :controlled="true" type="number" class="form-item-inputNumber-value" />
					<view class="form-item-inputNumber-btn" @tap="toMaxAmount">{{$t('wallet.max')}}</view>
				</view>
				<view class="form-item-tip">
					<view class="form-item-tip-left">
						{{$t('wallet.balance')}}：{{availableValue}}{{assetItem.label}}
					</view>
					<view class="form-item-tip-right">
						<text>{{$t('wallet.fee')}}：</text>
						<text>{{gasPriceFee || '0.0000'}}ETH</text>
					</view>
				</view>
			</view>
			<view v-if="!disabledBtn" class="body-btn" @tap="renderjs.transferToExternal">
				<image src="/static/my/btn-middle.png" mode="" />
				<text>{{ $t("wallet.confirm") }}</text>
			</view>
			<view v-if="disabledBtn" class="body-btn">
				<image src="/static/my/btn-disabled.png" mode="" />
				<text>{{ $t("wallet.confirm") }}</text>
			</view>
		</view>
		<select-asset-modal 
			v-if="selectAssetVisible"
			:assetOptions="assetOptions"
			@onChange="onChangeAsset"
			@onClose="changeSelectAssetVisible(false)"
		>
		</select-asset-modal>
	</view>
</template>

<script module="renderjs" lang="renderjs">
	import { ethers } from 'ethers';
	import { walletEntropyPwd, formatEther, parseEther } from '@/utils/wallet';
	export default {
		data() {
			return {
				_walletJson: '',
				isInit: false,
				_Wallet: {},
				_amount: 0,
				_gasPriceInfo: {},
				_address: '',
				_chainWalletBalanceInfo: {}
			}
		},
		methods: {
			updateWalletJson(val) {
				this._walletJson = val;
				if (val) {
					this.initWalletInfo()
				}
			},
			updateAmount(val) {
				this._amount = val;
			},
			updateAddress(val) {
				this._address = val;
			},
			initWalletInfo() {
				let me = this;
				if (!me._walletJson) {
					return;
				} 
				me.$ownerInstance.callMethod('showLoading');
				ethers.Wallet.fromEncryptedJson(me._walletJson, walletEntropyPwd).then(function(wallet) {
					let provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth");
					// let provider = ethers.getDefaultProvider();
					let activeWallet = wallet.connect(provider);
					provider.getBalance(wallet.address).then(function(balance) {
						activeWallet.provider.getGasPrice().then((gasPrice) => {
							let etherString = formatEther(gasPrice, -1);
							const gasPriceInfo = {
								gasPrice,
								gasPriceStr: etherString
							};
							me._gasPriceInfo = gasPriceInfo;
							me.$ownerInstance.callMethod('updateGasPriceInfo', gasPriceInfo);
						});
						// 余额是 BigNumber (in wei); 格式化为 ether 字符串
						let etherString = formatEther(balance, 4);
						const chainWalletBalanceInfo = {
							ETH: balance,
							ETHStr: etherString
						};
						me._Wallet = activeWallet;
						me._chainWalletBalanceInfo = chainWalletBalanceInfo;
						me.$ownerInstance.callMethod('hideLoading');
						me.$ownerInstance.callMethod('initWalletInfoSuccess', {
							Wallet: activeWallet,
							chainWalletBalanceInfo: chainWalletBalanceInfo
						});
					}).catch(function(error) {
						me.$ownerInstance.callMethod('hideLoading');
						me.$ownerInstance.callMethod('showToastError', error && error.message);
					});
				}).catch(function(error) {
					me.$ownerInstance.callMethod('hideLoading');
					me.$ownerInstance.callMethod('showToastError', error && error.message);
				});
			},
			// 链钱包 转 外部
			transferToExternal() {
				let me = this;
				me.$ownerInstance.callMethod('showLoading');
				let gasLimit = 21000;
				let gasPrice = me._gasPriceInfo.gasPriceStr || '0';
				const balance = Number(formatEther(me._chainWalletBalanceInfo.ETH || '0', -1));
				const maxValue = balance - gasPrice * gasLimit;
				if (me._amount > maxValue) {
					let insufficientFunds = me.$t ? me.$t('wallet.insufficientFunds') : 'insufficient funds';
					me.$ownerInstance.callMethod('showToastError', insufficientFunds);
					return;
				}
				me._Wallet.sendTransaction({
					to: ethers.utils.getAddress(me._address),
					gasLimit: gasLimit,
					gasPrice: ethers.utils.parseEther(gasPrice),
					nonce: 0,
					value: ethers.utils.parseEther(me._amount.toString()),
        }).then(function(res) {
					me.$ownerInstance.callMethod('hideLoading');
					me.$ownerInstance.callMethod('back');
          console.log(res, res);
        }).catch((err) => {
					me.$ownerInstance.callMethod('hideLoading');
					me.$ownerInstance.callMethod('showToastError', err && err.code);
					console.log('err', err);
				});
			},
		}
	}
</script>

<script>
	import { ethers } from 'ethers';
	import { formatEther, parseEther } from '@/utils/wallet';
	import { scientificNotationToString } from '@/utils/index';
	import { getWalletJson } from '@/config/wallet';
	export default {
		data() {
			return {
				asset: 'eth',
        address: '',
				amount: 0,
				selectAssetVisible: false,
				gasPriceInfo: {},
				Wallet: {},
				chainWalletBalanceInfo: {},
				assetOptions: [
					{
						label: 'ETH',
						value: 'eth',
						imageSrc: '/static/eth-icon.png'
					},
					// {
					// 	label: 'DAT3',
					// 	value: 'dat3',
					// 	imageSrc: '/static/dat3-icon.png'
					// },
					// {
					// 	label: 'VEDAT3',
					// 	value: 'vedat3',
					// 	imageSrc: '/static/vedat3-icon.png'
					// }
				]
			};
		},	
		onLoad() {
			const walletJson = getWalletJson();
			this.walletJson = walletJson;
		},
		computed: {
			disabledBtn() {
				return this.amount <= 0 || !this.address;
			},
			assetItem() {
				if (!this.asset) {
					return {};
				}
				const item = this.assetOptions.find(it => it.value === this.asset);
				return item || {};
			},
			gasPriceFee() {
				return (Number(this.gasPriceInfo.gasPriceStr || '0') * 21000).toFixed(4);
			},
			availableValue() {
				const	val = Number(this.chainWalletBalanceInfo.ETHStr);
				return (val > 0 ? val : 0).toFixed(4);
			},
		},
		methods: {
			onChangeAsset(value, option) {
				this.asset = value;
				this.changeSelectAssetVisible(false);
			},
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			changeSelectAssetVisible(visible) {
				this.selectAssetVisible = visible;
			},
			toMaxAmount() {
				const balance = Number(formatEther(this.chainWalletBalanceInfo.ETH || '0', -1));
				const gasPrice = Number(formatEther(this.gasPriceInfo.gasPrice || '0', -1));
				const gasLimit = 21000;
				const amount = balance - gasPrice * gasLimit;
				const maxValue = amount > 0 ? amount : 0;
				this.amount = scientificNotationToString(maxValue);
			},
			updateGasPriceInfo(gasPriceInfo) {
				this.gasPriceInfo = gasPriceInfo;
			},
			initWalletInfoSuccess({ Wallet, chainWalletBalanceInfo }) {
				this.Wallet = Wallet;
				this.chainWalletBalanceInfo = chainWalletBalanceInfo;
			},
			showToastError(errMsg) {
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
	.body {
		padding: 58rpx 60rpx;
		.form-item {
			width: 627rpx;
			margin-bottom: 58rpx;
			.form-item-label {
				font-size: 40rpx;
				font-family: SourceHanSansCN-Bold, SourceHanSansCN;
				font-weight: bold;
				color: #0E0E0E;
				line-height: 60rpx;
				margin-bottom: 25rpx;
			}
			.form-item-control {
				width: 627rpx;
				height: 123rpx;
				box-sizing: border-box;
				background: #F1EEFF;
				border-radius: 7px;
				&.form-item-select {
					display: flex;
					align-items: center;
					padding: 0 20rpx;
					.form-item-select-icon {
						width: 77rpx;
						height: 71rpx;
						margin-right: 22rpx;
					}
					.form-item-select-label {
						flex: 1;
						font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #000000;
					}
				}
        &.form-item-input {
					display: flex;
					align-items: center;
					padding: 0 42rpx;
					.form-item-input-value {
						flex: 1;
						font-size: 45rpx;
						font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #000000;
					}
				}
				&.form-item-inputNumber {
					display: flex;
					align-items: center;
					padding: 0 42rpx;
					.form-item-inputNumber-value {
						flex: 1;
						font-size: 45rpx;
						font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #000000;
					}
					.form-item-inputNumber-btn {
						font-size: 36rpx;
						font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #D841FF;	
					}
				}
			}
			.form-item-tip {
				margin-top: 11rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 29rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #0E0E0E;
				line-height: 40rpx;
			}
		}
		.body-btn {
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			margin-top: 203rpx;
			margin-bottom: 18rpx;
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
