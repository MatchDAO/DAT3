<template>
  <view class="container">
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      status-bar="true"
      :title="$t('my.profile') + '（2/2）'"
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
        <info-item-label :txt="$t('login.avatarTip')" />
        <view class="input" @click="choosePic">
          <image
            class="icon-upload"
            v-if="!file"
            src="/static/login/icon-plus.png"
            mode=""
          />
          <image class="image-url" v-else :src="file" mode="aspectFit" />
        </view>
      </view>
    </view>
    <view class="btn-next btn" @click="save">
			<image :src="`/static/my/btn-${file ? 'middle' : 'disabled'}.png`" mode="" />
      <!-- <image src="/static/my/btn-middle.png" mode="" /> -->
      <text>{{ $t("login.start") }}</text>
    </view>
  </view>
</template>
<script>
import { setUserInfo, setToken, setEmToken } from "@/config/auth";
import { registerEnd } from "@/api/login";
let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
let app = getApp();

export default {
  data() {
    return {
      userInfo: app.globalData.userInfo,
      userName: null,
      avatarUrl: null,
      file: null,
    };
  },
  computed: {},
  onLoad(options) {
    console.log(options)
    this.userName = options.userName
    // let portrait = this.userInfo.portrait;
    // this.avatarUrl = portrait === "default" ? null : portrait;
  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    choosePic() {
      uni.chooseImage({
        sizeType:['compressed'],
        count: 1,
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          this.file = tempFilePaths[0];
        },
      });
    },
    save() {
      if(!this.file)return

      let fileParam = {};

      if (this.file) {
        fileParam = {
          filePath: this.file,
        };
      }
      registerEnd(
        {
          userCode: this.userInfo.userCode,
          userName:this.userName
        },
        { ...fileParam }
      ).then((res) => {
        let userInfo = res.data || {};
        setUserInfo({...this.userInfo,...userInfo});
         // 设置本地token和userInfo
        setToken(userInfo.token);
        setEmToken(userInfo.emToken);
        getApp().globalData.getWalletBalanceInfo();

        if (WebIM.conn.isOpened()) {
          WebIM.conn.updateUserInfo({
            nickname: userInfo.userName,
            avatarurl: userInfo.portrait
          }); 
        }else{
          // 真实 app 调试
          WebIM.conn.open({
            accessToken: userInfo.emToken,
            user: userInfo.userCode,
          });
        }
        uni.showToast({
          title: this.$t("my.saveTip"),
          icon: "none",
          success() {
            uni.switchTab({
              url: "/pages/home/index",
            });
          },
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 0 56rpx;
  .info {
    padding-top: 120rpx;
    .info-item {
      .input {
        margin-top: 54rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        background: #f1eeff;
        border-radius: 7px;
        line-height: 31rpx;
        font-size: 26rpx;
        color: #0e0e0e;
        image.icon-upload {
          width: 72rpx;
          height: 85rpx;
        }
        .image-url {
          height: 770rpx;
        }
      }
      &.name {
        .input {
          height: 770rpx;
        }
      }
    }
  }
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
</style>