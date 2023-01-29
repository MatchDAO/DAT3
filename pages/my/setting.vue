<template>
  <view class="container">
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      status-bar="true"
      :title="$t('setting')"
      background-color="#ffffff"
      @clickLeft="back"
    >
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png"></image>
        </view>
      </block>
    </uni-nav-bar>

    <view class="top">
      <view class="avatar-box">
        <view class="avatar-wrap">
          <image class="avatar" src="/static/logo.png" mode="" />
        </view>
        <view class="user-name">version 0.1</view>
      </view>
    </view>
    <view class="info-list">
      <view class="info-item item-user" @click="goLink(1)">
        <text class="item-title">{{ $t("my.termsOfUse") }}</text>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>
      <view class="info-item item-setting" @click="goLink(2)">
        <text class="item-title">{{ $t("my.privacyPolicy") }}</text>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>
      <!-- 退出登录，不用二次确认 -->
      <view class="info-item item-user" @click="logout">
        <text class="item-title">{{ $t("my.deleteAccount") }}</text>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>
    </view>
    <view class="bottom-btn" @click="openPopup">
      <image src="/static/my/btn-large.png" />
      <text>{{ $t("my.logout") }}</text>
    </view>
    <!-- 普通确认弹窗 -->
    <w-popup-confirm
      ref="popup"
      :content="$t('my.logoutTip') + '?'"
      :cancelText="$t('my.cancel')"
      :confirmText="$t('my.confirm')"
      @cancel="cancel"
      @confirm="confirm"
    />
  </view>
</template>

<script>
import { logout } from "@/api/login";
import { removeUserInfo } from "@/config/auth";
import config from "@/config/config";
let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
const { privacyPoliceUrl,termsOfUseUrl } = config

export default {
  data() {
    return {};
  },
  computed: {},
  onLoad() {},
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    goLink(type) {
      let url =null;
      let title =null;
      // 使用条款
      if(type === 1){
        title = this.$t("my.termsOfUse")
        url= termsOfUseUrl
      }
      // 隐私协议
      if(type === 2){
        title = this.$t("my.privacyPolicy")
        url = privacyPoliceUrl
      }
      uni.navigateTo({
        url: `/pages/web-view/index?url=${url}&title=${title}`,
      });
    },
    openPopup() {
      this.$refs.popup.open();
    },
    cancel() {
      this.$refs.popup.close();
    },
    confirm() {
      if (WebIM.conn.isOpened()) {
        WebIM.conn.close();
      }
      this.$refs.popup.close();
      this.logout()
    },
    logout(){
      logout().finally(()=>{
        removeUserInfo()
        uni.redirectTo({
          url: '/pages/login/index'
        });
      })
    }
  },
};
</script>

<style lang="scss" scoped>


.container {
  height: 100vh;
  .top {
    height: 300rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .avatar-box {
      .avatar-wrap {
        width: 141rpx;
        height: 141rpx;
        border-radius: 100%;
        .avatar {
          width: 141rpx;
          height: 141rpx;
          border-radius: 100%;
          // background: #d8d8d8;
        }
      }
      .user-name {
        margin-top: 11rpx;
        text-align: center;
        font-size: 22rpx;
        color: #797979;
        line-height: 31rpx;
      }
    }
  }
  .info-list {
    background: #ffffff;
    // border-radius: 45rpx 45rpx 0 0;
    padding: 0rpx 62rpx 45px;
    .info-item {
      display: flex;
      height: 120rpx;
      align-items: center;
      justify-content: space-between;
      &.item-user {
        font-size: 29rpx;
        color: #0e0e0e;
        line-height: 90rpx;
      }
      .item-title {
        flex: 1;
        font-weight: bold;
        font-size: 29rpx;
        line-height: 40rpx;
      }
      image.left-icon {
        width: 58rpx;
        height: 58rpx;
      }
      image.right-icon {
        width: 22rpx;
        height: 34rpx;
      }
    }
  }
  .bottom-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    image {
      width: 632rpx;
      height: 101rpx;
      position: relative;
    }
    text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 9;

      font-size: 36rpx;
      color: #ffffff;
      font-weight: bold;
      font-family: PingFangSC-Semibold, PingFang SC;
    }
  }
}
</style>
