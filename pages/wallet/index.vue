<template>
	<view class="container">
		<view 
			:switchKey="switchKey" 
			:change:switchKey="renderjs.updateSwitchKey" 
			:walletJson="walletJson" 
			:change:walletJson="renderjs.updateWalletJson" 
			:loop="loop" 
			:change:loop="renderjs.updateLoop" 
			id="renderjs" 
			class="renderjs"
		></view>
		<uni-nav-bar
      class="header-nav"
      :fixed="true"
      status-bar="true"
      background-color="#ffffff"
			padding="20rpx 0 0"
      @clickLeft="back"
			:border="false"
    >
			<block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png"></image>
        </view>
      </block>
			<view class="title-wrapper">
				<image class="switch-control-bg" :src="`/static/wallet/wallet-switch-${switchKey === 'spending' ? 'left' : 'right'}.png`"></image>
				<view class="switch-control">
					<view class="switch-control-item" @tap="onSwitch('spending')" :class="{ active: switchKey === 'spending'}">{{$t('wallet.spending')}}</view>
					<view class="switch-control-item" @tap="onSwitch('wallet')" :class="{ active: switchKey === 'wallet'}">{{$t('wallet.wallet')}}</view>
				</view>
			</view>
    </uni-nav-bar>
		<view class="body">
			<view class="spending-wrapper" v-if="switchKey === 'spending'">
				<view class="body-title">{{$t('wallet.spendingAccount')}}</view>
				<view class="body-list">
					<view class="body-item">
						<image class="body-item-icon" src='/static/dat3-icon.png'></image>
						<view class="body-item-name">DAT3</view>
						<view class="body-item-value">0.0000</view>
					</view>
					<view class="body-item">
						<image class="body-item-icon" src='/static/vedat3-icon.png'></image>
						<view class="body-item-name">VEDAT3</view>
						<view class="body-item-value">0.0000</view>
					</view>
					<view class="body-item">
						<image class="body-item-icon" src='/static/eth-icon.png'></image>
						<view class="body-item-name">ETH</view>
						<view class="body-item-value">{{data.ETHStr || '0.0000'}}</view>
					</view>
				</view>
				<view class="body-btn" @tap="goTransferPage(false)">
					<image src="/static/my/btn-middle.png" mode="" />
					<text>{{ $t("wallet.transfer") }}</text>
				</view>
			</view>
			<view class="wallet-wrapper" v-if="switchKey === 'wallet'">
				<view class="body-top-tag">
					<image class="body-top-tag-icon" src='/static/eth-icon.png'></image>
					<view class="body-top-tag-text">{{$t('wallet.ethereumERC20')}}</view>
				</view>
				<view class="body-title">
					<text>{{chainWalletBalanceInfo.ETHStr || '0.0000'}}{{' '}}</text>
					<text>ETH</text>
				</view>
				<view class="body-address">
					<view class="body-address-value">{{Wallet.address}}</view>
					<view class="body-address-btn" @tap="copy(Wallet.address)">{{$t('wallet.copy')}}</view>
				</view>
				<view class="body-btn-list">
					<view class="body-btn-item" @tap="changeScanAddressModalVisible(true)">
						<image class="body-btn-item-icon" src='/static/wallet/received.png'></image>
						<view class="body-btn-item-text">{{$t('wallet.received')}}</view>
					</view>
					<view class="body-btn-item" @tap="goTransferPage(true)">
						<image class="body-btn-item-icon" src='/static/wallet/transfer_to_spending.png'></image>
						<view class="body-btn-item-text">
							{{$t('wallet.transfer')}}
							<view class="body-btn-item-text-after">{{$t('wallet.transfer_to_spending')}}</view>
						</view>
					</view>
					<view class="body-btn-item" @tap="goExternalPage">
						<image class="body-btn-item-icon" src='/static/wallet/transfer_to_external.png'></image>
						<view class="body-btn-item-text">
							{{$t('wallet.transfer')}}
							<view class="body-btn-item-text-after">{{$t('wallet.transfer_to_external')}}</view>
						</view>
					</view>
					<view class="body-btn-item" @tap="goTradePage">
						<image class="body-btn-item-icon" src='/static/wallet/trade.png'></image>
						<view class="body-btn-item-text">{{$t('wallet.trade')}}</view>
					</view>
				</view>
				<view class="body-list-title">{{$t('wallet.wallet')}}</view>
				<view class="body-list">
					<view class="body-item">
						<image class="body-item-icon" src='/static/dat3-icon.png'></image>
						<view class="body-item-name">DAT3</view>
						<view class="body-item-value">0.0000</view>
					</view>
					<view class="body-item">
						<image class="body-item-icon" src='/static/vedat3-icon.png'></image>
						<view class="body-item-name">VEDAT3</view>
						<view class="body-item-value">0.0000</view>
					</view>
					<view class="body-item">
						<image class="body-item-icon" src='/static/eth-icon.png'></image>
						<view class="body-item-name">ETH</view>
						<view class="body-item-value">{{chainWalletBalanceInfo.ETHStr || '0.0000'}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 普通弹窗 -->
    <w-popup-dialog 
      ref="walletPopup"
			:popupContentStyle="{ padding: '0', background: 'transparent' }"
    >
			<view class="dialog-wrapper">
				<image class="dialog-wrapper-bg" src="/static/wallet/wallet-dialog-bg.png"></image>
				<view class="dialog-content">
					<view class="title">{{$t('wallet.wallet')}}</view>
					<view class="body-btn body-btn-sub" @tap="goCreateWalletPage">
						<image src="/static/my/btn-sub.png" mode="" />
						<text>{{ $t("wallet.createWallet") }}</text>
					</view>
					<view class="body-btn" @tap="goImportWalletPage">
						<image src="/static/my/btn-middle.png" mode="" />
						<text>{{ $t("wallet.importWallet") }}</text>
					</view>
				</view>
			</view>
		</w-popup-dialog>
		<scan-address-qr-code-modal
			:scanAddress="Wallet.address"
			v-if="scanAddressModalVisible"
			@onClose="changeScanAddressModalVisible(false)"
		>
		</scan-address-qr-code-modal>
	</view>
</template>

<script module="renderjs" lang="renderjs">
	import { ethers } from 'ethers';
	import { walletEntropyPwd, formatEther } from '@/utils/wallet';
	export default {
		data() {
			return {
				_switchKey: 'spending',
				_walletJson: '',
				_loop: null,
				loopCount: 12,
				_Wallet: null
			}
		},
		methods: {
			updateLoop(val) {
				let me = this;
				me._loop = val;
			},
			updateSwitchKey(val) {
				let me = this;
				me._switchKey = val;
				if (val === 'wallet') {
					if (!me._walletJson) {
						me.$ownerInstance.callMethod('openWalletPopup');
						return;
					} else {
						me.initWalletInfo();
					}
				} else {
					me.$ownerInstance.callMethod('getWalletBalanceInfo');
				}
			},
			updateWalletJson(val) {
				this._walletJson = val;
			},
			initWalletInfo() {
				let me = this;
				if (me._Wallet) {
					me.fromEncryptedJsonCb();
				} else {
					me.loopCount === 12 && me.$ownerInstance.callMethod('showLoading');
					ethers.Wallet.fromEncryptedJson(me._walletJson, walletEntropyPwd).then(function(wallet) {
						me.loopCount === 12 && me.$ownerInstance.callMethod('hideLoading');
						me._Wallet = wallet;
						me.fromEncryptedJsonCb();
					}).catch(function(error) {
						me.loopCount === 12 && me.$ownerInstance.callMethod('hideLoading');
						me.$ownerInstance.callMethod('initWalletInfoError', error && error.message);
					});
				}
			},
			fromEncryptedJsonCb() {
				let me = this;
				me.loopCount === 12 && me.$ownerInstance.callMethod('showLoading')
				let provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth");
				// let provider = ethers.getDefaultProvider();
				let activeWallet = me._Wallet.connect(provider);
				provider.getBalance(me._Wallet.address).then((balance) => {
					// 余额是 BigNumber (in wei); 格式化为 ether 字符串
					let etherString = formatEther(balance, 4);
					me.loopCount === 12 && me.$ownerInstance.callMethod('hideLoading');
					me.$ownerInstance.callMethod('initWalletInfoSuccess', {
						Wallet: activeWallet,
						chainWalletBalanceInfo: {
							ETH: balance,
							ETHStr: etherString
						}
					});
					if (me.loopCount > 0 && me.loop === 'wallet') {
						me.loopCount--;
						let t = setTimeout(() => {
							me.initWalletInfo();
							clearTimeout(t);
						}, 5000);
					}
				}).catch(function(error) {
					me.loopCount === 12 && me.$ownerInstance.callMethod('hideLoading');
					me.$ownerInstance.callMethod('initWalletInfoError', error && error.message);
				});
			}
		}
	}
</script>

<script>
	import { getWalletJson } from '@/config/wallet';
	import { walletEntropyPwd, formatEther } from '@/utils/wallet';
	import { ethers } from 'ethers';
	import { 
		exchangePrice, 
		getChains as fetchChains, 
	} from "@/api/wallet";
	export default {
		data() {
			return {
				switchKey: 'spending',
				scanAddressModalVisible: false,
				data: this.formatWalletBalanceInfo(getApp().globalData.walletBalanceInfo),
				Wallet: {},
				chainWalletBalanceInfo: {},
				walletJson: '',
				loop: null, // 轮询类型
				loopCount: 12, // 轮询次数
			};
		},
		onLoad(option) {
			const switchKey = option.switchKey || 'spending';
			const walletJson = getWalletJson();
			this.switchKey = switchKey;
			this.loop = option.loop || null;
			this.walletJson = walletJson;
			this.getChains();
			this.emitData();
		},
		methods: {
			getWalletBalanceInfo() {
				getApp().globalData.getWalletBalanceInfo();
			},
			initWalletInfoSuccess({ Wallet, chainWalletBalanceInfo }) {
				this.Wallet = Wallet;
				this.chainWalletBalanceInfo = chainWalletBalanceInfo;
			},
			initWalletInfoError(errMsg) {
				uni.showToast({
					title: errMsg,
					icon: 'none'
				});
			},
			getChains() {
				fetchChains().then(res => {

				});
			},
			emitData() {
				let me = this;
				uni.$on('updateWalletBalanceInfo', function({ data }){
					const walletBalanceInfo = me.formatWalletBalanceInfo(data);
					me.data = walletBalanceInfo;
					if (me.loopCount > 0 && me.loop === 'spending') {
						me.loopCount--;
						let t = setTimeout(() => {
							me.getWalletBalanceInfo();
							clearTimeout(t);
						}, 5000);
					}
				})
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
			openWalletPopup() {
				setTimeout(() => {
					this.$refs.walletPopup.open();
				}, 300)
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
			changeScanAddressModalVisible(visible) {
				this.scanAddressModalVisible = visible;
			},
			onSwitch(key) {
				this.switchKey = key;
			},
			back() {
				const currentPages = getCurrentPages();
				let delta = 0;
				while(currentPages.length - 1 - delta >=0 && currentPages[currentPages.length - 1 - delta].route.startsWith('pages/wallet')) {
					delta++;
				}
				uni.navigateBack({
					delta,
				});
			},
			goTransferPage(reverseFromTo = false) {
				if (!this.walletJson) {
					this.openWalletPopup();
					return;
				}
				uni.navigateTo({
          url: `/pages/wallet/transfer?reverseFromTo=${reverseFromTo}`,
        });
			},
			goExternalPage() {
				uni.navigateTo({
          url: `/pages/wallet/trade`,
        });
			},
			goTradePage() {
				//#ifdef APP-PLUS
				if (plus && plus.runtime && plus.runtime.openURL) {
					plus.runtime.openURL('https://app.uniswap.org/#/swap');
				}
				//#endif
			},
			goCreateWalletPage() {
				uni.navigateTo({
          url: `/pages/wallet/create-wallet`,
        });
			},
			goImportWalletPage() {
				uni.navigateTo({
          url: `/pages/wallet/import-wallet`,
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
	background: #fff;
	height: 100vh;
	display: flex;
	align-items: center;
	flex-direction: column;
	.header-nav {
		margin-bottom: 49rpx;
		.title-wrapper {
			width: 395rpx;
			height: 78rpx;
			position: relative;
			.switch-control-bg {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}
			.switch-control {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				box-sizing: border-box;
				padding: 4rpx;
				// background: #CAD4FF;
				// border-radius: 30rpx;
				display: flex;
				align-items: center;
				flex-direction: row;
			
				.switch-control-item {
					flex: 1;
					text-align: center;
					color: #fff;
					height: 70rpx;
					line-height: 70rpx;
					font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
				}
			}
		}
	}
	.body {
		flex: 1;
		width: 100%;
		background: #F1EEFF;
		border-radius: 45rpx 45rpx 0 0;
		box-sizing: border-box;
		.spending-wrapper {
			padding: 54rpx 60rpx;
			.body-title {
				font-size: 45rpx;
				font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #000000;
				line-height: 65rpx;
				margin-bottom: 43rpx;
			}
			.body-list {
				background: #fff;
				border-radius: 22rpx;
				padding: 20rpx 0;
				margin-bottom: 143rpx;
				.body-item {
					height: 130rpx;
					display: flex;
					align-items: center;
					flex-direction: row;
					padding: 0 54rpx;
					&:not(:first-child) {
						border-top: 2rpx solid #F1EEFF;
					}
					.body-item-icon {
						width: 77rpx;
						height: 71rpx;
						margin-right: 33rpx;
					}
					.body-item-name {
						flex: 1;
						font-size: 36rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #000000;
					}
					.body-item-value {
						font-size: 40rpx;
						font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #000000;
					}
				}
			}
			.body-btn {
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
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
		}
		.wallet-wrapper {
			padding: 98rpx 60rpx 54rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			.body-top-tag {
				width: 455rpx;
				height: 60rpx;
				background: #CAD4FF;
				border-radius: 38rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: 60rpx;
				.body-top-tag-icon {
					width: 37rpx;
					height: 34rpx;
					margin-right: 14rpx;
				}
				.body-top-tag-text {
					font-size: 29rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 40rpx;
				}
			}
			.body-title {
				font-size: 92rpx;
				font-family: SourceHanSansCN-Heavy, SourceHanSansCN;
				font-weight: 800;
				color: #000000;
				line-height: 150rpx;
				margin-bottom: 54rpx;
			}
			.body-address {
				width: 663rpx;
				height: 56rpx;
				background: #FFFFFF;
				border-radius: 49rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 27rpx;
				margin-bottom: 87rpx;
				box-sizing: border-box;
				.body-address-value {
					font-size: 22rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #000000;
					margin-right: 4rpx;
				}
				.body-address-btn {
					font-size: 24rpx;
					font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #D841FF;
				}
			}
			.body-btn-list {
				width: 627rpx;
				margin-bottom: 109rpx;
				display: flex;
				// align-items: center;
				flex-direction: row;
				justify-content: space-between;
				.body-btn-item {
					display: flex;
					align-items: center;
					flex-direction: column;
					.body-btn-item-icon {
						width: 100rpx;
						height: 100rpx;
						margin-bottom: 14rpx;
					}
					.body-btn-item-text {
						width: 148rpx;
						text-align: center;
						font-size: 28rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #0E0E0E;
						line-height: 33rpx;
						.body-btn-item-text-after {
							font-size: 20rpx;
							line-height: 20rpx;
							font-family: PingFangSC-Regular, PingFang SC;
						}
					}
				}
			}
			.body-list-title {
				width: 627rpx;
				text-align: left;
				font-size: 40rpx;
				font-family: SourceHanSansCN-Bold, SourceHanSansCN;
				font-weight: bold;
				color: #0E0E0E;
				line-height: 60rpx;
				margin-bottom: 18rpx;
			}
			.body-list {
				background: #fff;
				border-radius: 22rpx;
				padding: 20rpx 0;
				margin-bottom: 143rpx;
				width: 627rpx;
				.body-item {
					height: 130rpx;
					display: flex;
					align-items: center;
					flex-direction: row;
					padding: 0 54rpx;
					&:not(:first-child) {
						border-top: 2rpx solid #F1EEFF;
					}
					.body-item-icon {
						width: 77rpx;
						height: 71rpx;
						margin-right: 33rpx;
					}
					.body-item-name {
						flex: 1;
						font-size: 36rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #000000;
					}
					.body-item-value {
						font-size: 40rpx;
						font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #000000;
					}
				}
			}
		}
	}
	.dialog-wrapper {
		position: relative;
		width: 634rpx;
		height: 511rpx;
		.dialog-wrapper-bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.dialog-content {
			display: flex;
			align-items: center;
			flex-direction: column;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			padding: 76rpx 100rpx;
			box-sizing: border-box;
			.title {
				font-size: 45rpx;
				font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #000000;
				line-height: 65rpx;
				margin-bottom: 38rpx;
			}
			.body-btn {
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				width: 582rpx;
				height: 101rpx;
				margin-bottom: 31rpx;
				&.body-btn-sub {
					text {
						color: #D841FF;
					}
				}
				image {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					z-index: 1;
					width: 582rpx;
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
}
</style>
