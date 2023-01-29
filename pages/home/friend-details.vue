<template>
	<view class="container">
		<uni-nav-bar
      class="header-nav"
      :fixed="true"
      status-bar="true"
      :title="' '"
      background-color="#ffffff"
      @clickLeft="back"
			@clickRight="openReportPopup"
    >
			<block slot="left">
				<view class="left">
					<image class="back-icon" src="/static/icon-back.png"></image>
				</view>
			</block>
			<view slot="right" class="header-nav-right">
				<image src="/static/home/report-bg.png"></image>
				<text>{{$t('home.friendDetails.report')}}</text>
			</view>
    </uni-nav-bar>
		<view class="body">
			<view class="picture">
				<image mode='aspectFill' :src="info.portrait"></image>
			</view>
			<view class="content-1">
				<view class="top">
					<view class="friend-name">{{info.userName || $t('common.empty.userName')}}</view>
					<view class="friend-online" v-if="info.online">{{$t('common.online')}}</view>
				</view>
				<view class="bottom">
					<view class="friend-tag" v-for="(item,index) in info.profession" :key="index">
						<text>{{item}}</text>
					</view>
				</view>
			</view>
			<view class="content-2">
				<view class="top">{{$t('home.friendDetails.bio')}}</view>
				<view class="bottom">{{info.professionBio || $t('common.empty.professionBio')}}</view>
			</view>
			<view class="btn" @tap="goChat()">
				<image src="/static/my/btn-large.png"></image>
				<text>{{ $t("home.friendDetails.hi") }}</text>
			</view>
		</view>
		<!-- 普通弹窗 -->
    <w-popup-dialog 
      ref="reportPopup"
			:popupContentStyle="{ padding: '0', background: 'transparent' }"
    >
			<view class="dialog-wrapper">
				<image class="dialog-wrapper-bg" src="/static/home/report-dialog-bg.png"></image>
				<view class="dialog-content">
					<view class="title">{{$t('home.friendDetails.reportTitle')}}</view>
					<view class="list">
						<view class="item" @tap="report('porn')">{{$t('home.friendDetails.porn')}}</view>
						<view class="item" @tap="report('politicallySensitive')">{{$t('home.friendDetails.politicallySensitive')}}</view>
						<view class="item" @tap="report('violentAndBloody')">{{$t('home.friendDetails.violentAndBloody')}}</view>
						<view class="item" @tap="report('children')">{{$t('home.friendDetails.children')}}</view>
						<view class="item" @tap="report('other')">{{$t('home.friendDetails.other')}}</view>
					</view>
				</view>
			</view>
		</w-popup-dialog>
	</view>
</template>

<script>
	import { getUserInfo } from "@/api/user";
	export default {
		data() {
			return {
				userCode: '',
				info: {},
			};
		},
		onLoad(option) {
			this.userCode = option.userCode;
		},
		onShow() {
      this.getInfo();
    },
		methods: {
			getInfo() {
        getUserInfo({ 
          userCode: this.userCode
        }).then((res) => {
					let it = res.data || {};
					if (it.online) {
						it.online = new Date().getTime() - it.online < 1000 * 60;
					} else {
						it.online = false;
					}
					if (!it.profession) {
						it.profession = [];
					} else if (it.profession.indexOf('[') !== -1) {
						it.profession = JSON.parse(it.profession) || [];
					} else {
						it.profession = [it.profession];
					}
          this.info = it;
        });
      },
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			openReportPopup() {
				this.$refs.reportPopup.open();
			},
			goChat() {
        uni.navigateTo({
          url: `/pages/message/chat?userCode=${this.info.userCode || ''}`,
        });
      },
			report(type) {
				this.$refs.reportPopup.close();
				uni.showToast({
					icon: "none",
					title: this.$t('home.friendDetails.reportSuccess'),
					duration: 1000,
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {
	.header-nav-right {
		position: relative;
		width: 129rpx;
		height: 49rpx;
		color: #E47AFF;
		font-size: 24rpx;
		font-family: PingFangSC-Semibold;
  	font-weight: 600;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	.body {
		padding: 40rpx 45rpx 160rpx;
		box-sizing: border-box;
		.picture {
			height: 828rpx;
			margin-bottom: 25rpx;
			image {
				width: 100%;
				height: 100%;
				background: #000;
				border-radius: 30rpx;
			}
		}
		.content-1 {
			margin-bottom: 51rpx;
			.top {
				height: 72rpx;
				display: flex;
				align-items: center;
				flex-direction: row;
				margin-bottom: 20rpx;
				.friend-name {
					font-size: 51rpx;
					font-weight: 600;
					font-family: PingFangSC-Semibold, PingFang SC;
					margin-right: 24rpx;
				}	
				.friend-online {
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #3BD726;
					margin-bottom: -6rpx;
				}
			}
			.bottom {
				display: flex;
				align-items: center;
				flex-direction: row;
				.friend-tag {
					height: 44rpx;
					line-height: 44rpx;
					font-size: 22rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					padding: 0 34rpx;
					background: #A1B3FF;
					border-radius: 22rpx;
					margin-right: 5rpx;
				}
			}
		}
		.content-2 {
			.top {
				font-size: 36rpx;
				line-height: 45rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #000000;
				margin-bottom: 5rpx;
			}
			.bottom {
				font-size: 25rpx;
				font-family: PingFangSC-Light, PingFang SC;
				font-weight: 300;
				color: #424242;
				line-height: 36rpx;
			}
		}
		.btn {
			position: fixed;
			width: 632rpx;
			height: 101rpx;
			line-height: 101rpx;
			text-align: center;
			left: 54rpx;
			bottom: 40rpx;
			image {
				width: 100%;
				height: 100%;
			}
			text {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				z-index: 9;
				font-size: 36rpx;
				color: #ffffff;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
			}
		}
	}
}
.dialog-wrapper {
	position: relative;
	width: 634rpx;
	height: 855rpx;
	.dialog-wrapper-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 634rpx;
		height: 855rpx;
	}
	.dialog-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 634rpx;
		height: 855rpx;
		padding: 76rpx 100rpx;
		box-sizing: border-box;
		.title {
			font-size: 38rpx;
			margin-bottom: 70rpx;
			font-weight: 600;
			color: #000000;
			text-align: center;
			font-family: PingFangSC-Semibold, PingFang SC;
		}
		.list {
			font-size: 30rpx;
			border-top: 2rpx solid #F1EEFF;
			font-weight: 400;
			color: #030303;
			text-align: center;
			.item {
				font-size: 28rpx;
				padding: 36rpx 0;
				border-bottom: 2rpx solid #F1EEFF;
			}
		}
	}
}
</style>
