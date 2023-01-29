<template>
	<view class="tabbar-container">
		<view class="tabbar-list">
			<view class="tabbar-item" @tap="navigateTo('/pages/home/index')">
				<image :src="`/static/home${activeKey === 'home' ? '-active' : ''}.png`"></image>
			</view>
			<view class="tabbar-item" @tap="navigateTo('/pages/message/index')">
				<image :src="`/static/message${activeKey === 'message' ? '-active' : ''}.png`"></image>
			</view>
			<view class="tabbar-item" @tap="navigateTo('/pages/my/index')">
				<image :src="`/static/my${activeKey === 'my' ? '-active' : ''}.png`"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"tabbar",
		props: {
			activeKey: {
				type: String,
				default: 'home',
			}
		},
		data() {
			return {
			};
		},
		methods: {
			navigateTo(url) {
				// uni.navigateTo({
				// 	url,
				// });
				uni.switchTab({
					 url
				});

			}
		}
	}
</script>

<style>
.tabbar-container {
	width: 688rpx;
	height: 118rpx;
	background: linear-gradient(360deg, #DBD3FD 0%, #F8F7FF 100%);
	box-shadow: 0rpx 0rpx 9rpx 0rpx rgba(121,121,121,0.25);
	border-radius: 72rpx;
	padding: 14rpx 62rpx 14rpx 78rpx;
	box-sizing: border-box;
	position: fixed;
	bottom: 29rpx;
	left: 0;
	right: 0;
	margin: auto;
}
.tabbar-container .tabbar-list {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.tabbar-container .tabbar-list .tabbar-item > image {
	width: 98rpx;
	height: 89rpx;
}
</style>
