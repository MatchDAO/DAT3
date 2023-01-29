<template>
	<view class="select-asset-modal">
		<view class="select-asset-modal-mask"></view>
		<view class="select-asset-modal-wrapper">
			<uni-icons class="close-icon" color="#666" type="closeempty" @tap="_onClose" />
			<view class="select-asset-option-list">
				<view class="select-asset-option-item" v-for="(assetOption,index) in assetOptions" :key="index" @tap="_onChange(assetOption.value, assetOption)">
					<image class="select-asset-option-item-icon" :src="assetOption.imageSrc"></image>
					<view class="select-asset-option-item-label">{{assetOption.label}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"select-asset-modal",
		props: {
			assetOptions: {
				type: Array,
				default: () => []
			},
		},
		data() {
			return {
				
			};
		},
		methods: {
			_onChange(value, option) {
				this.$emit("onChange", value, option);
			},
			_onClose() {
				this.$emit("onClose");
			}
		}
	}
</script>

<style lang="scss" scoped>
.select-asset-modal {
	.select-asset-modal-mask {
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
	}
	.select-asset-modal-wrapper {
		position: fixed;
		z-index: 11;
		bottom: 0;
		left: 0;
		width: 100vw;
		height: 804rpx;
		box-sizing: border-box;
		padding: 139rpx 62rpx 0;
		background: #FFFFFF;
		border-radius: 45rpx 45rpx 0 0;
		.close-icon {
			position: absolute;
			top: 47rpx;
			right: 49rpx;
			font-size: 33rpx !important;
			padding: 16rpx;
		}
		.select-asset-option-list {
			display: flex;
			flex-direction: column;
			align-items: center;
			.select-asset-option-item {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 0 20rpx;
				width: 627rpx;
				height: 123rpx;
				box-sizing: border-box;
				background: #F1EEFF;
				border-radius: 7px;
				margin-bottom: 18rpx;
				.select-asset-option-item-icon {
					width: 77rpx;
					height: 71rpx;
					margin-right: 22rpx;
				}
				.select-asset-option-item-label {
					font-size: 36rpx;
					font-family: SourceHanSansCN-Bold, SourceHanSansCN, PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #000000;
				}
			}
		}
	}
}
</style>