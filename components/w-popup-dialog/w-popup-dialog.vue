<template>
  <uni-popup
    ref="popup"
    :mask-click="false"
    :is-mask-click="false"
    background-color="#fff"
    mask-background-color="rgba(0,0,0,0)"
    type="center"
  >
    <view 
      class="popup-content" 
      :style="{ background: '#fff', padding: '82rpx 96rpx', 'border-radius': '20rpx', ...popupContentStyle }"
    >
      <text class="content">
        <slot />
      </text>
      <image v-if="showCloseBtn" @tap="close" class="popup-close-icon" src="/static/close-icon.png"></image>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: "w-popup-dialog",
  props: {
    showCloseBtn: {
      type: Boolean,
      default: true,
    },
    popupContentStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },
  methods: {
    open(){
      this.$refs.popup.open();
    },
    close() {
			this.$refs.popup.close()
		},
  },
};
</script>

<style scoped lang="scss">
.popup-content {
  position: relative;
  width: 634rpx;
  box-sizing: border-box;
  .popup-close-icon {
    width: 27rpx;
    height: 25rpx;
    padding: 16rpx;
    position: absolute;
    top: 30rpx;
    right: 40rpx;
    z-index: 3;
  }
  .dialog-bg {
    width: 560rpx;
    height: 384rpx;
    position: relative;
  }
  .content {
   
  }
}
</style>