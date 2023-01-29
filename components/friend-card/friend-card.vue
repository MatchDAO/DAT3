<template>
	<view class="friend-card-container" @tap="navigateTo(`/pages/home/friend-details?userCode=${info.userCode}`)">
		<image mode='aspectFill' class="friend-image" :src="info.portrait"></image>
		<image class="friend-card-container-bg" src="/static/home/photo-frame.png"></image>
		<view class="friend-card-header">
			<view class="friend-tag" v-for="(item,index) in info.profession" :key="index" v-show="index === 0">
				<text>{{item}}</text>
			</view>
		</view>
		<view class="friend-card-footer">
			<view class="friend-card-footer-top">
				<view class="friend-name">{{info.userName || $t('common.empty.userName')}}</view>
				<view class="friend-online" v-if="info.online">{{$t('common.online')}}</view>
			</view>
			<view class="friend-card-footer-bottom">
				<view class="friend-des">{{info.professionBio || $t('common.empty.professionBio')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"friend-card",
		props: {
			info: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
			};
		}, 
		methods: {
      navigateTo(url) {
        uni.navigateTo({
          url,
        });
      }
    }
	}
</script>

<style scoped lang="scss">
.friend-card-container {
	width: 326rpx;
	height: 443rpx;
	margin: 0 11rpx 36rpx;
	padding: 12rpx;
	box-sizing: border-box;
	border-radius: 28rpx;
	position: relative;
	.friend-card-container-bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
}
.friend-card-container .friend-card-header {
	position: absolute;
	top: 28rpx;
	left: 32rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.friend-card-container .friend-card-header .friend-tag {
	height: 32rpx;
	line-height: 32rpx;
	font-size: 18rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #FFFFFF;
	padding: 0 12rpx;
	background: #A1B3FF;
	border-radius: 16rpx;
	margin-right: 5rpx;
}
.friend-card-container .friend-card-footer {
	position: absolute;
	bottom: 34rpx;
	left: 32rpx;
}
.friend-card-container .friend-card-footer .friend-card-footer-top {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 40rpx;
}
.friend-card-container .friend-card-footer .friend-name {
	font-size: 29rpx;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: #FFFFFF;
	margin-right: 16rpx;
}
.friend-card-container .friend-card-footer .friend-online {
	font-size: 18rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #3BD726;
	margin-bottom: -6rpx;
}
.friend-card-container .friend-card-footer .friend-des {
	font-size: 22rpx;
	font-family: PingFangSC-Light, PingFang SC;
	font-weight: 300;
	color: #FFFFFF;
	line-height: 31rpx;
	height: 31rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 240rpx;
	opacity: 0.8;
}
.friend-card-container .friend-image {
	width: 303rpx;
	height: 421rpx;
	background: #000;
	border-radius: 30rpx;
}
</style>