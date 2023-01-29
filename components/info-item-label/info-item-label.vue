<template>
  <view class="label-container">
    <view class="title">
      <image class="icon-arrow" src="/static/icon-arrow-bold-right.png" mode="" />
      <text>{{txt}}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "label-container",
  props: {
	txt:{
		type:String,
		default:''
	}
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.container {
  .title {
    display: flex;
    align-items: center;
    
    height: 90rpx;
    .icon-arrow {
      width: 18rpx;
      height: 29rpx;
      margin-right: 16rpx;
    }
    text {
      height: 40rpx;
      font-size: 40rpx;
      font-weight: bold;
      color: #0e0e0e;
      line-height: 1;
    }
  }
}
</style>