<template>
	<view class="container">
		<view 
			:walletJson="walletJson" 
			:change:walletJson="renderjs.updateWalletJson" 
			:reverseFromTo="reverseFromTo" 
			:change:reverseFromTo="renderjs.updateReverseFromTo" 
			:depositAddressInfo="depositAddressInfo" 
			:change:depositAddressInfo="renderjs.updateDepositAddressInfo" 
			:amount="amount" 
			:change:amount="renderjs.updateAmount" 
			id="renderjs" 
			class="renderjs"
		></view>
		<uni-nav-bar
      class="header-nav"
      :fixed="true"
			:title="$t('wallet.transfer')"
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
			<view class="transfer-wrapper">
				<view class="transfer-item">
					<view class="transfer-item-label">{{$t('wallet.from')}}</view>
					<view class="transfer-item-value">{{!reverseFromTo ? $t('wallet.spending') : $t('wallet.wallet')}}</view>
				</view>
				<view class="transfer-item">
					<view class="transfer-item-label">{{$t('wallet.to')}}</view>
					<view class="transfer-item-value">{{!reverseFromTo ? $t('wallet.wallet') : $t('wallet.spending')}}</view>
				</view>
				<image @tap="switchReverseFromTo" class="transfer-switch-btn" src='/static/wallet/transfer_switch.png'></image>
			</view>
			<view class="form-item">
				<view class="form-item-label">{{$t('wallet.selectAsset')}}</view>
				<view class="form-item-control form-item-select" @tap="changeSelectAssetVisible(true)">
					<image class="form-item-select-icon" :src="assetItem.imageSrc"></image>
					<view class="form-item-select-label">{{assetItem.label}}</view>
					<uni-icons class="form-item-select-btn" color="#231815" type="arrowright" size="24" />
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
						{{$t('wallet.available')}}：{{availableValue}}{{assetItem.label}}
					</view>
					<view class="form-item-tip-right">
						<text>{{$t('wallet.fee')}}：</text>
						<text v-if="!reverseFromTo">0.50%</text>
						<text v-if="reverseFromTo">{{gasPriceFee || '0.0000'}}ETH</text>
					</view>
				</view>
			</view>
			<view v-if="!disabledBtn" class="body-btn" @tap="renderjs.transfer">
				<image src="/static/my/btn-middle.png" mode="" />
				<text>{{ $t("wallet.confirmTransfer") }}</text>
			</view>
			<view v-if="disabledBtn" class="body-btn">
				<image src="/static/my/btn-disabled.png" mode="" />
				<text>{{ $t("wallet.confirmTransfer") }}</text>
			</view>
			<view class="body-btn-tip">
				<text class="bold">{{$t('wallet.tips')}}：</text>
				<text>{{$t('wallet.transferTipContent')}}</text>
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
				_reverseFromTo: false,
				_Wallet: {},
				_depositAddressInfo: {},
				_amount: 0,
				_gasPriceInfo: {},
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
			updateReverseFromTo(val) {
				this._reverseFromTo = val;
			},
			updateDepositAddressInfo(val) {
				this._depositAddressInfo = val;
			},
			updateAmount(val) {
				this._amount = val;
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
			transfer() {
				let me = this;
				if (me._reverseFromTo) {
					me.transferToSpending();
				} else { 
					me.$ownerInstance.callMethod('transferToWallet');
				}
			},
			// 链钱包 转 平台钱包
			transferToSpending() {
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
					to: ethers.utils.getAddress(me._depositAddressInfo.ETH),
					gasLimit: gasLimit,
					gasPrice: ethers.utils.parseEther(gasPrice),
					nonce: 0,
					value: ethers.utils.parseEther(me._amount.toString()),
        }).then(function(res) {
					me.$ownerInstance.callMethod('hideLoading');
					me.$ownerInstance.callMethod('backWallet');
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
	import { getUserInfo } from '@/config/auth';
	import { withdraw, getDepositAddress as fetchDepositAddress } from "@/api/wallet";
	import { formatEther, parseEther } from '@/utils/wallet';
	import { getWalletJson } from '@/config/wallet';
	import { scientificNotationToString } from '@/utils/index';
	export default {
		data() {
			return {
				reverseFromTo: false,
				asset: 'eth',
				amount: 0,
				selectAssetVisible: false,
				depositAddressInfo: {},
				gasPriceInfo: {},
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
				],
				Wallet: {},
				spendingBalanceInfo: this.formatWalletBalanceInfo(getApp().globalData.walletBalanceInfo),
				chainWalletBalanceInfo: {}
			};
		},	
		onLoad(option) {
			const walletJson = getWalletJson();
			this.reverseFromTo = option.reverseFromTo == 'true';
			this.walletJson = walletJson;
			this.emitData();
		},
		onShow: function () {
			this.getDepositAddress();
			getApp().globalData.getWalletBalanceInfo();
		},
		computed: {
			disabledBtn() {
				return this.amount <= 0;
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
				let val;
				if (this.reverseFromTo) {
					val = Number(this.chainWalletBalanceInfo.ETHStr);
				} else {
					val = Number(this.spendingBalanceInfo.ETHStr);
				}
				return (val > 0 ? val : 0).toFixed(4);
			},
		},
		methods: {
			// transfer() {
			// 	if (this.reverseFromTo) {
			// 		this.transferToSpending();
			// 	} else { 
			// 		this.transferToWallet();
			// 	}
			// },
			// 平台钱包 转 链钱包
			transferToWallet() {
				let me = this;
				const params = {
					transferAddress: me.Wallet.address,
					token: 'ETH',
					chain: 'ETH',
					amount: parseEther(me.amount.toString())
				}
				withdraw(params).then(res => {
					me.backWallet();
				});
			},
			backWallet() {
				uni.redirectTo({
					url: `/pages/wallet/index?loop=${this.reverseFromTo ? 'spending' : 'wallet'}`, // 轮询到账目标
				});
			},
			// // 链钱包 转 平台钱包
			// transferToSpending() {
			// 	let me = this;
			// 	let targetAddress = ethers.utils.getAddress(me.depositAddressInfo.ETH);
			// 	let amountWei = parseEther(me.amount.toString());
			// 	let provider = ethers.getDefaultProvider();
			// 	let activeWallet = me.Wallet.connect(provider);
			// 	debugger
			// 	activeWallet.sendTransaction({
			// 		to: targetAddress,
			// 		value: amountWei,
			// 		// gasPrice: activeWallet.provider.getGasPrice(),  (可用默认值)
			// 		// gasLimit: 21000,
      //   }).then(function(tx) {
			// 		debugger
      //     console.log(tx);
      //   });
			// },
			emitData() {
				let me = this;
				uni.$on('updateWalletBalanceInfo', function({ data }){
					const walletBalanceInfo = me.formatWalletBalanceInfo(data);
					me.spendingBalanceInfo = walletBalanceInfo;
				})
			},
			updateGasPriceInfo(gasPriceInfo) {
				this.gasPriceInfo = gasPriceInfo;
			},
			formatWalletBalanceInfo(walletBalanceInfo) {
        let data = {};
				walletBalanceInfo.forEach(element => {
					switch (element.token) {
						case 'ETH':
							data.ETH = element.amount;
							data.ETHStr = formatEther(element.amount, 4);
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
			getDepositAddress() {
				const userInfo = getUserInfo();
				if (userInfo && userInfo.userCode) {
					fetchDepositAddress({ userCode: userInfo.userCode }).then(res => {
						let data = {};
						res.data.forEach(element => {
							switch (element.chain) {
								case 'ETH':
									data.ETH = element.address;
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
						this.depositAddressInfo = data;
					}) 
				}
			},
			onChangeAsset(value, option) {
				this.asset = value;
				this.changeSelectAssetVisible(false);
			},
			switchReverseFromTo() {
				this.reverseFromTo = !this.reverseFromTo;
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
				let maxValue;
				// 链钱包 转 平台钱包
				if (this.reverseFromTo) {
					const balance = Number(formatEther(this.chainWalletBalanceInfo.ETH || '0', -1));
					const gasPrice = Number(formatEther(this.gasPriceInfo.gasPrice || '0', -1));
					const gasLimit = 21000;
					const amount = balance - gasPrice * gasLimit;
					maxValue = amount > 0 ? amount : 0;
				} else { // 平台钱包 转 链钱包
					maxValue = Number(ethers.utils.formatEther(this.spendingBalanceInfo.ETH || '0'));
				}
				this.amount = scientificNotationToString(maxValue);
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
		.transfer-wrapper {
			width: 627rpx;
			position: relative;
			margin-bottom: 58rpx;
			.transfer-item {
				width: 100%;
				height: 133rpx;
				border-radius: 7rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				align-items: center;
				padding-left: 42rpx;
				background: #F1EEFF;
				&:first-child {
					border-bottom: 5rpx solid #fff;
				}
				.transfer-item-label {
					font-size: 36rpx;
					font-family: PingFangSC-Thin, PingFang SC;
					font-weight: 100;
					color: #000000;
					width: 160rpx;
					text-align: left;
				}
				.transfer-item-value {
					font-size: 45rpx;
					font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #000000;
				}
			}
			.transfer-switch-btn {
				position: absolute;
				width: 98rpx;
				height: 100rpx;
				top: 83rpx;
				right: 27rpx;
			}
		}
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
				// align-items: center;
				justify-content: space-between;
				font-size: 29rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #0E0E0E;
				line-height: 40rpx;
				// .form-item-tip-left {
				// 	max-width: 50%;
				// }
				// .form-item-tip-right {
				// 	max-width: 50%;
				// }
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
				font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
			}
		}
		.body-btn-tip {
			width: max-content;
			max-width: 580rpx;
			margin: 0 auto;
			text-align: left;
			font-size: 22rpx;
			color: #0E0E0E;
			line-height: 31rpx;
			.blod {
				font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
			}
		}
	}
}
</style>
