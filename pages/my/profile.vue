<template>
  <view class="container" :prop="userInfo" :change:prop="profile.userInfoUpdate">
    <uni-nav-bar class="header-nav" :fixed="true" status-bar="true" :title="$t('profile')" background-color="#ffffff"
      @clickLeft="back">
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png"></image>
        </view>
      </block>
      <block slot="right">
        <view class="right" @click="save">
          <image class="btn-save" src="/static/my/btn-small.png"> </image>
          <text>{{ $t("my.save") }}</text>
        </view>
      </block>
    </uni-nav-bar>
    <view class="top">
      <view class="avatar-box">
        <view class="user-name">{{ userInfo.userName }}</view>

        <view class="avatar-wrap">
          <image class="avatar" :src="file || avatarUrl" mode="aspectFill" />
          <image @click="choosePic" class="icon-edit" src="/static/my/icon-edit.png" />
        </view>
      </view>
    </view>
    <view class="info">
      <view class="info-item name">
        <info-item-label :txt="$t('my.myName')" />
        <input v-model="userName" :prop="userName" :change:prop="profile.userNameUpdate" class="input" />
      </view>
      <view class="info-item bio">
        <info-item-label :txt="$t('my.bio')" />
        <textarea v-model="bio" :prop="bio" :change:prop="profile.bioUpdate" class="input"
          :placeholder="$t('my.bioTip')" />
      </view>
    </view>

    <!-- 普通确认弹窗 -->
    <!-- <w-popup-confirm ref="popup" :content="$t('my.saveModified') + '?'" :cancelText="$t('my.cancel')"
      :confirmText="$t('my.confirm')" @cancel="cancel" @confirm="profile.confirm" /> -->
    <uni-popup ref="popup" :mask-click="false" :is-mask-click="false" background-color="#fff"
      mask-background-color="rgba(0,0,0,0)" type="center">
      <view class="popup-content">
        <image class="dialog-bg" src="/static/login/dialog-bg.png" mode="">
          <text class="title">
            {{ $t("my.saveModified") }}？
          </text>
          <view class="btns">
            <view class="btn btn-cancel" @click="cancel">
              {{ $t("my.cancel") }}
            </view>
            <view class="btn btn-confirm" @click="profile.confirm">
              {{ $t("my.confirm") }}
            </view>
          </view>
        </image>
      </view>
    </uni-popup>
  </view>
</template>
<script module="profile" lang="renderjs">
import config,{BASE_PATH} from '@/config/config';
// import { setUserInfo } from "@/config/auth";
// import { editUserInfo } from "@/api/user";
import axios from "axios"
let domainPath = config.domainPath;
	export default {
    data(){
      return {
        // userInfo:{}
        userName:null,
        bio:null
      }
    },
		mounted() {
			// ...
      this.initData()
		},
		methods: {
      userInfoUpdate (newValue, oldValue, ownerInstance, instance) {
				// 监听 service 层数据变更
        console.log('renderjs:userInfoUpdate',newValue,oldValue)
        this.userInfo = newValue
			},
      userNameUpdate (newValue, oldValue, ownerInstance, instance) {
        console.log('renderjs:userNameUpdate',newValue,oldValue)
        this.userName = newValue
      },
      bioUpdate (newValue, oldValue, ownerInstance, instance) {
        console.log('renderjs:bioUpdate',newValue,oldValue)
        this.bio = newValue
      },
      async initData(){
      },
      confirm(event,ownerInstance) {
          // console.log('renderjs:confirm',JSON.stringify(this.userInfo) )
        let userCode = this.userInfo.userCode
        let userName = this.userName
        let bio = this.bio
        let formData = new FormData();
        formData.append("userCode", userCode);
        formData.append("userName", userName);
        formData.append("bio", bio);
        let url = domainPath + `${BASE_PATH}/user/modify`
          console.log('renderjs:formData',userCode,userName,bio )
        axios.post(url, formData, {
          //设置请求头
          headers: { 
            "Content-Type": "multipart/form-data",
            token: this.userInfo.token ,
            lang:this.lang
          }
        }).then(res=>{
          let response = res.data
          console.log(res)
          if (response.code === 200) {
            ownerInstance.callMethod('success', response)
          }else  if (response.code === 401) {
            ownerInstance.callMethod('back', response)
          }
        })
      }
    }
	}
</script>
<script>
import { setUserInfo,getToken } from "@/config/auth";
import { editUserInfo,editUserPortrait } from "@/api/user";
let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
let app = getApp();
export default {
  data() {
    return {
      userInfo: app.globalData.userInfo,
      avatarUrl: null,
      file: null,
      userName: null,
      bio: null,
      token:getToken(),
      lang: uni.getStorageSync("lang")
    };
  },
  computed: {},
  onLoad() {
    let { portrait, userName, bio } = this.userInfo;
    this.avatarUrl = portrait === "default" ? null : portrait;
    this.userName = userName;
    this.bio = bio;

  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    // confirm(){
    //   this.profile.confirm()
    // },
    choosePic() {
      uni.chooseImage({
        sizeType:['compressed'],
        count: 1,
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          this.file = tempFilePaths[0];
          let fileParam = {
                filePath: this.file,
              };
          editUserPortrait(
            {
              userCode: this.userInfo.userCode,
            },
            { ...fileParam }
          ).then((res) => {
            let userInfo = res.data || {};
            setUserInfo({...this.userInfo,...userInfo});
            if (WebIM.conn.isOpened()) {
              WebIM.conn.updateUserInfo({
                nickname: userInfo.userName,
                avatarurl: userInfo.portrait
              }); 
            }
            uni.showToast({
              title: this.$t("my.saveTip"),
              icon: "none",
              success() {
              },
            });
          });
        },
      });
    },
    save() {
      this.$refs.popup.open();
    },
    cancel() {
      uni.showToast({
        icon: "none",
        title: this.$t("my.cancel"),
        duration: 1000,
      });
      this.$refs.popup.close();
    },
    success(response){
      if (WebIM.conn.isOpened()) {
        let userInfo = response.data || {};
        WebIM.conn.updateUserInfo({
          nickname: userInfo.userName,
          avatarurl: userInfo.portrait
        }); 
      }
      this.$refs.popup.close();
      uni.showToast({
        title: this.$t("my.saveTip"),
        icon: "none",
        success:()=> {
          this.back()
        },
      });
    }
    
  },
};
</script>

<style lang="scss" scoped>
$color: #d7ceff;

.header-nav {
  // .back-icon{

  // }
  .right {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .btn-save {
      width: 141rpx;
      height: 49rpx;
      position: relative;
      z-index: 2;
    }
    text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 9;
      font-size: 28rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      color: #ffffff;
      font-weight: 600;
    }
  }
}

.container {
  padding: 0 56rpx;

  .top {
    height: 415rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .avatar-box {
      margin-bottom: 90rpx;

      .avatar-wrap {
        width: 224rpx;
        height: 224rpx;
        border-radius: 100%;
        background: #d7ceff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;

        .avatar {
          width: 206rpx;
          height: 206rpx;
          border-radius: 100%;
          background: gray;
        }

        .icon-edit {
          position: absolute;
          bottom: 10rpx;
          right: 10rpx;
          width: 54rpx;
          height: 53rpx;
          z-index: 2;
        }
      }

      .user-name {
        margin: 40rpx 0 16rpx;
        text-align: center;
        font-weight: bold;
      }
    }
  }

  .info {
    .info-item {
      .input {
        box-sizing: border-box;
        background: #f1eeff;
        border-radius: 7px;
        line-height: 31rpx;

        font-size: 26rpx;
        color: #0e0e0e;
      }

      &.name {
        .input {
          padding: 27rpx;
          height: 91rpx;
        }
      }

      &.bio {
        .input {
          padding: 27rpx;
          height: 260rpx;
          width: 638rpx;
        }
      }
    }
  }
}

// 确认框
.popup-content {
  position: relative;

  .dialog-bg {
    width: 560rpx;
    height: 384rpx;
    position: relative;
  }

  .title {
    font-size: 36rpx;
    color: #000000;
    line-height: 51rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -100%);
  }

  .btns {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 560rpx;
    display: flex;

    .btn {
      flex: 1;
      text-align: center;
      line-height: 124rpx;
      font-size: 33rpx;

      &.btn-cancel {
        color: #d841ff;
      }

      &.btn-confirm {
        color: #fff;
      }
    }
  }
}
</style>
