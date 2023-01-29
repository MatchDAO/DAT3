<template>
  <view class="container">
    <view class="bg"></view>
    <image class="top-logo" src="/static/login/login-logo.png" />
    <view class="login-form">
      <view class="form-item">
        <input
          v-model="account"
          class="form-input"
          :placeholder="$t('login.emailTip')"
          placeholder-class="u-placeholder-class"
        />
      </view>
      <view class="form-item">
        <input
          v-model="captcha"
          class="form-input"
          :placeholder="$t('login.codeTip')"
          placeholder-class="u-placeholder-class"
        />
        <view class="btn-code" @click="senCode">
          <text v-if="time === 0">{{ $t("login.sendCode") }}</text>
          <text v-else>{{ time }}s</text>
        </view>
      </view>
      <view class="form-agree">
        <view class="agree-wrap">
          <radio
            class="agree-radio"
            :checked="agree"
            value="1"
            style="transform: scale(0.7)"
            color="#d841ff"
            @click="agree = !agree"
          />
          <text class="txt">{{ $t("login.agreeTip") }}</text>
          <text class="pink underline" @click="goLink(1)">{{
            $t("my.termsOfUse")
          }}</text>
          <text class="txt">&</text>
          <text class="pink underline" @click="goLink(2)">{{
            $t("my.privacyPolicy")
          }}</text>
        </view>
      </view>
      <view class="btn-login btn" @click="save">
        <!-- <image src="/static/my/btn-login.png" /> -->
        <!-- <image src="/static/my/btn-middle.png" mode="" /> -->
        <image
          :src="`/static/my/btn-middle.png`"
          mode=""
        />
        <text>{{ $t("login.loginSignup") }}</text>
      </view>
    </view>
    <!-- 普通确认弹窗 -->
    <w-popup-confirm
      ref="popup"
      :content="`${$t('login.agreeTip')}${$t('my.termsOfUse')} & ${$t(
        'my.privacyPolicy'
      )}`"
      :cancelText="$t('my.cancel')"
      :confirmText="$t('my.confirm')"
      @cancel="cancel"
      @confirm="confirm"
    />
  </view>
</template>

<script>
import config from "@/config/config";
import { setUserInfo, setToken, setEmToken } from "@/config/auth";
import { loginRegister, sendEmailCode } from "@/api/login";
let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
const { privacyPoliceUrl, termsOfUseUrl } = config;
export default {
  data() {
    return {
      time: 0,
      agree: false,
      captcha: null,
      account: null,
    };
  },
  computed: {},
  onLoad() {},
  onUnload() {
    this.clearTimer();
  },
  methods: {
    senCode() {
      if (!this.account) {
        return uni.showToast({
          title: this.$t("login.emailTip"),
          icon: "none",
          duration: 2000,
        });
      }
      sendEmailCode({
        account: this.account,
        type: 3, //
      }).then((res) => {
        // 发送成功
        uni.showToast({
          // title: this.$t('login.sendSuccess'),
          title: res.msg || this.$t("login.sendSuccess"),
          duration: 2000,
          icon: "none",
        });
        this.setTimer();
      });
    },
    setTimer() {
      this.clearTimer();

      this.time = 60;
      this.timer = setInterval(() => {
        this.time--;
        if (this.time === 0) {
          this.clearTimer();
        }
      }, 1000);
    },
    clearTimer() {
      this.timer && clearInterval(this.timer);
      this.timer = null;
    },
    goLink(type) {
      let url = null;
      let title = null;
      // 使用条款
      if (type === 1) {
        title = this.$t("my.termsOfUse");
        url = termsOfUseUrl;
      }
      // 隐私协议
      if (type === 2) {
        title = this.$t("my.privacyPolicy");
        url = privacyPoliceUrl;
      }
      uni.navigateTo({
        url: `/pages/web-view/index?url=${url}&title=${title}`,
      });
    },
    save() {
      let { account, captcha } = this;
      let me = this;
      if (!captcha) {
        return uni.showToast({
          title: this.$t("login.sendCodeTip"),
          duration: 2000,
          icon: "none",
        });
      }
      if (!this.agree) {
        return this.$refs.popup.open();
      }
      loginRegister({
        account,
        captcha,
      }).then((res) => {
        // 登录成功---》
        let userInfo = res.data;
        setUserInfo(userInfo);
        // 第一次注册有逻辑要做 先设置头像等才会有
        // todo 删掉
        if (userInfo.firstLogin) {
          uni.navigateTo({
            url: "/pages/login/set-name",
          });
        } else {
          // 原来登陆逻辑不变
          // 设置本地token和userInfo
          setToken(userInfo.token);
          setEmToken(userInfo.emToken);
          getApp().globalData.getWalletBalanceInfo();
          if (WebIM.conn.isOpened()) {
            WebIM.conn.close();
          }
          // 真实 app 调试
          WebIM.conn.open({
            accessToken: userInfo.emToken,
            user: userInfo.userCode,
          });
          uni.showToast({
            title: this.$t("login.success"),
            icon: "none",
            success: function () {
              uni.switchTab({
                url: "/pages/home/index",
              });
            },
          });
        }
      });
    },
    cancel() {
      uni.showToast({
        icon: "none",
        title: "取消",
        duration: 1000,
      });
      this.$refs.popup.close();
    },
    confirm() {
      this.agree = true;
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.pink {
  color: $baseColor;
}
.underline {
  text-decoration: underline;
}

.container {
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #f1eeff;
  position: relative;
  padding: 179rpx 54rpx 0;
  .bg {
    position: absolute;
    right: -100rpx;
    top: -20rpx;
    z-index: 1;
    width: 533rpx;
    height: 550rpx;
    background: #d841ff;
    opacity: 0.8;
    filter: blur(150rpx);
    // background: linear-gradient(45deg,#F1EEFF,#D841FF);
  }
  .top-logo {
    display: block;
    position: relative;
    z-index: 2;
    width: 145rpx;
    height: 147rpx;
    margin: 0 auto;
  }
  .login-form {
    position: relative;
    z-index: 2;
    margin-top: 114rpx;
    .form-item {
      padding: 0 12rpx 0 27rpx;
      width: 626rpx;
      height: 91rpx;
      background: #fff;
      border-radius: 7rpx;
      margin-bottom: 54rpx;
      display: flex;
      align-items: center;
      .form-input {
        line-height: 91rpx;
        flex: 1;
        font-size: 29rpx;
      }
      .btn-code {
        width: 164rpx;
        height: 69rpx;
        background: #f9f5ff;
        border-radius: 7px;
        text-align: center;
        font-size: 25rpx;
        font-family: SourceHanSansCN-Heavy, SourceHanSansCN;
        font-weight: bold;
        color: #d841ff;
        line-height: 69rpx;
      }
    }
    .form-agree {
      .agree-wrap {
        display: flex;
        align-items: center;
        font-size: 22rpx;
        font-weight: bold;
        .agree-radio {
          margin-left: -10rpx;
        }
        .txt {
          color: #0e0e0e;
          margin: 0 4rpx;
        }
      }
    }
    // .btn-login {
    //   margin-top: 210rpx;
    //   display: flex;
    //   justify-content: center;
    //   image {
    //     width: 632rpx;
    //     height: 101rpx;
    //   }
    // }
    .btn {
      margin-top: 107rpx;
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
}
</style>
