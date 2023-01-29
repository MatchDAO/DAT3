<template>
  <view class="container">
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      status-bar="true"
      :title="$t('my.profile') + '（1/2）'"
      background-color="#F9F8FF"
      @clickLeft="back"
    >
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png"></image>
        </view>
      </block>
    </uni-nav-bar>
    <view class="info">
      <view class="info-item name">
        <info-item-label :txt="$t('my.myName')" />
        <input class="input" v-model="userName" />
      </view>
    </view>
    <view class="btn-next btn" :class="{ gray: !userName }" @click="save">
      <!-- <image src="/static/my/btn-middle.png" mode="" /> -->
      <image
        :src="`/static/my/btn-${userName ? 'middle' : 'disabled'}.png`"
        mode=""
      />
      <text>{{ $t("login.next") }}</text>
    </view>
  </view>
</template>
<script>
import { setUserInfo } from "@/config/auth";
import { editUserInfo } from "@/api/user";
let app = getApp();

export default {
  data() {
    return {
      userName: "",
      userInfo: app.globalData.userInfo,
    };
  },
  computed: {},
  onLoad() {
    // this.userName = this.userInfo.userName;
  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    save() {
      console.log("save:userName", this.userName);
      if (!this.userName) return;
      uni.navigateTo({
        url: `/pages/login/set-avatar?userName=${this.userName}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 0 56rpx;
  .info {
    padding-top: 154rpx;
    .info-item {
      .input {
        margin-top: 54rpx;
        box-sizing: border-box;
        background: #f1eeff;
        border-radius: 7px;

        font-size: 26rpx;
        color: #0e0e0e;
      }
      &.name {
        .input {
          padding: 27rpx;
          height: 111rpx;
          line-height: 57rpx;
        }
      }
    }
  }
  .btn {
    margin-top: 210rpx;
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
      font-weight: bold;
      font-family: PingFangSC-Semibold, PingFang SC;
    }
  }
}
</style>