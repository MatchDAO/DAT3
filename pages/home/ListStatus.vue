<template>
  <view>
    <view class="empty" v-if="isEmpty"> {{$t('market.empty')}} </view>
    <view class="end" v-if="isEnd"> {{$t('market.end')}} </view>
    <view class="loading" v-if="loading"> {{$t('market.loading')}} </view>
    <view v-if=" showLogin" class="login-box">
      <view class="btn" @tap="goLogin"> {{$t('market.goLogin')}} </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    isEmpty: {
      default: false,
      type: [Boolean,Number],
    },
    isEnd: {
      default: false,
      type: [Boolean,Number],
    },
    loading: {
      default: false,
      type: [Boolean,Number],
    },
    showLogin: {
      default: false,
      type: [Boolean,Number],
    },
  },
  data() {
    return {
      isLogin: false,
    };
  },
  created() {
  },
  onShow() {
  },
  methods: {
    goLogin() {
      uni.navigateTo({
        url: "/pages/login/login",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.loading,
.empty,
.end {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40vh;
  color: $font-gray-color1;
  font-size: 26upx;
  &.loading,&.end {
    height: 44upx;
  }
}
.login-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40vh;
  .btn {
    background-color: $bg;
    padding: 10upx 30upx;
    color: $font-gray-color1;
    font-size: 26upx;
  }
}
</style>