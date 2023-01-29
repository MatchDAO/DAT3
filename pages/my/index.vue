<template>
  <view class="container">
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      :border="false"
      status-bar="true"
      padding="16rpx 22rpx 16rpx 0"
      :title="''"
      background-color="transparent"
    >
			<view slot="right" class="header-nav-right">
        <suspensionbar></suspensionbar>
      </view>
    </uni-nav-bar>
    <view class="top">
      <view class="avatar-box">
        <view class="avatar-wrap">
          <image class="avatar" :src="userInfo.portrait || ''" mode="aspectFill" />
        </view>
        <view v-if="isLogin" class="user-name">{{ userInfo.userName }}</view>
        <view v-else class="user-name" @tap="goLogin">{{$t('my.toLogin')}}</view>
      </view>
    </view>
    <view class="info-list">
      <view class="info-item item-user" @tap="goDetail">
        <image class="left-icon" src="/static/my/icon-user.png" />
        <text class="item-title">{{ $t("my.profile") }}</text>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>
      <view class="info-item item-setting" @tap="goSetting">
        <image class="left-icon" src="/static/my/icon-setting.png" />
        <text class="item-title">{{ $t("my.setting") }}</text>
        <image class="right-icon" src="/static/my/icon-arrow-right.png" />
      </view>
    </view>
    <view class="contact-us">
      <!-- 需要app跳转的话这里看 https://www.html5plus.org/doc/zh_cn/messaging.html -->
      <text>{{ $t("my.contactus") }}: <a href="mailto:achat20221101@gmail.com">achat20221101@gmail.com</a> </text>
    </view>
    <tabbar activeKey="my"></tabbar>
  </view>
</template>

<script>
import { getToken,setUserInfo } from "@/config/auth";
import { getUserInfo } from "@/api/user";
let app = getApp();

export default {
  data() {
    return {
      userInfo: {
        portrait:null,
        userName:null,
      },
      isLogin: false,
    };
  },
  computed: {},
  onLoad(){
  	uni.hideTabBar({
  	  success(){
  	    console.log('隐藏tabbar:success')
  	  },
  	  fail(){
  	    console.log('隐藏tabbar:fail')
  	  }
  	})
  },
  onShow() {
    this.isLogin = getToken();
    this.userInfo = app.globalData.userInfo || {};
    this.initData();
    getApp().globalData.getWalletBalanceInfo();
  },
  methods: {
    // 初始化数据
    initData() {
      if (this.isLogin) {
        // todo 可能需要请求用户信息
        getUserInfo({ userCode: this.userInfo.userCode }).then((res) => {
          let userInfo = res.data || {};
          setUserInfo({...this.userInfo,...userInfo});

          this.userInfo = userInfo;
        });
      }
    },
    goDetail() {
      if(!this.isLogin)return this.goLogin();
      uni.navigateTo({
        url: "/pages/my/profile",
      });
    },
    goSetting() {
      if(!this.isLogin)return this.goLogin();
      uni.navigateTo({
        url: "/pages/my/setting",
      });
    },
    goLogin() {
      uni.redirectTo({
        url: "/pages/login/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  .header-nav {
    height: 0;
    .header-nav-right {
      position: relative;
      width: 100%;
    }
  }
  .top {
    height: auto;
    padding-top: 200rpx;
    background: linear-gradient(65deg, #e4e9ff 0%, #faf7ff 46%, #ecc0ff 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    .avatar-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 90rpx;
      .avatar-wrap {
        width: 224rpx;
        height: 224rpx;
        border-radius: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .avatar {
          width: 206rpx;
          height: 206rpx;
          border-radius: 100%;
          background: gray;
        }
      }
      .user-name {
        margin-top: 14rpx;
        text-align: center;
        font-weight: bold;
      }
    }
  }
  .info-list {
    background: #ffffff;
    border-radius: 45rpx 45rpx 0 0;
    margin-top: -45rpx;
    padding: 60rpx 62rpx;
    .info-item {
      display: flex;
      height: 90rpx;
      align-items: center;
      justify-content: space-between;
      &.item-user {
        font-size: 29rpx;
        color: #0e0e0e;
        line-height: 90rpx;
      }
      .item-title {
        flex: 1;
        margin-left: 33rpx;
        font-weight: bold;
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
  .contact-us {
    margin-top: 140rpx;
    font-size: 25rpx;
    color: #030303;
    line-height: 36rpx;
    text-align: center;
    text-decoration: underline;
  }
}
</style>
