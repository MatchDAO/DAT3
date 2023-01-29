<template>
  <view class="container">
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      :border="false"
      status-bar="true"
      padding="16rpx 22rpx 16rpx 0"
      :title="''"
    >
			<view slot="right" class="header-nav-right">
        <suspensionbar :bgColor="true"></suspensionbar>
      </view>
    </uni-nav-bar>
    <view class="message-list"  v-if="list && list.length || loading">
      <view class="message-item" v-for="(item,index) in list" :key="index" :info="item" @tap="goChat(item)">
        <view class="picture">
          <image mode='aspectFill' :src="item.webIMProps.avatarurl"></image>
          <view v-if="item.isOnline" class="online-dot"></view>
        </view>
        <view class="content">
          <view class="name">{{item.webIMProps.nickname || item.userCode}}</view>
          <view class="message">
            {{formatMsg(item.lastMsg)}}
          </view>
        </view>
        <view class="time">
          <uni-dateformat locale="en" :date="item.time" :threshold="[60000,3600000 * 24]" format="MM/dd hh:mm:ss"></uni-dateformat>
        </view>
      </view>
    </view>
    <!-- 空状态 -->
    <view v-else class="no-data">
      {{$t('common.empty.data')}}
    </view>
    <tabbar activeKey="message"></tabbar>
  </view>
</template>

<script>
  let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
  import { getUserInfo, getEmToken } from '@/config/auth';
  export default {
    data() {
      return {
        list: [],
        loading: false
      }
    },
    computed:{
      
    },
	onLoad(){
    let me = this;
    WebIM.conn.listen({
      onTextMessage(message) {
        me.getSessionList(false);
      },
      onPictureMessage(message) {
        console.log('onPictureMessage', message);
        me.getSessionList(false);
      },
      onReceivedMessage(message) {
        console.log('onReceivedMessage', message);
      },
    });
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
    const userInfo = getUserInfo()
    const emToken = getEmToken()
    let me = this;
    getApp().globalData.getWalletBalanceInfo();
    if (userInfo.userCode && emToken) {
      if (WebIM.conn.isOpened()) {
        me.getSessionList();
      } else {
        WebIM.conn.listen({
          onOpened(message) {
            me.getSessionList();
          },
        });
      }
    } else {
      this.list = [];
    }
  },
    methods: {
      formatMsg(msg) {
        switch (msg.type) {
          case 'txt':
            return msg.msg;
          case 'img':
            return this.$t('chat.image');
          default:
            return this.$t('chat.other');
        }
      },
      getSessionList(loading = true) {
        let me = this;
        me.loading = true;
        loading && uni.showLoading();
        WebIM.conn.getSessionList().then((res) => {
          if (res && res.data && res.data.channel_infos) {
            me.list = this.formatChannelInfos(res.data.channel_infos);
            const usernames = me.list.map(it => it.userCode);
            WebIM.conn.getPresenceStatus( {
              usernames,
              expiry: 7 * 24 * 3600
            }).then(res => {
              me.list = me.list.map((item) => {
                const data = res.result.find(it => it.uid === item.userCode);
                item.isOnline = data && data.status && !(Array.isArray(data.status) && data.status.length === 0);
                return item;
              });
            });
            WebIM.conn.fetchUserInfoById(usernames, ['nickname', 'avatarurl']).then((res) => {
              this.list.map(it => {
                const webIMProps = res.data[it.userCode]
                if (webIMProps) {
                  it.webIMProps = webIMProps;
                }
                return it;
              })
            })
          }
        }).finally(() => {
          me.loading = false;
          loading && uni.hideLoading();
        });
      },
      getChannelName(channel_id) {
        if (
          !channel_id || 
          channel_id.indexOf(WebIM.config.appkey) === -1 || 
          (channel_id.indexOf('@easemob.com') === -1 && channel_id.indexOf('@conference.easemob.com') === -1)
        ) {
          return;
        }
        const isGroup = channel_id.indexOf('@conference.easemob.com') !== -1;
        const startIndex = WebIM.config.appkey.length + 1;
        const endIndex = isGroup ? channel_id.indexOf('@conference.easemob.com') : channel_id.indexOf('@easemob.com');
        const userCode = channel_id.slice(startIndex, endIndex);
        return userCode;
      },
      formatChannelInfos(channel_infos) {
           console.log('channel_infos', channel_infos);
        return channel_infos.map(({ channel_id, meta, unread_num }) => {
          let payloadJson = {};
          try {
            payloadJson = JSON.parse(meta.payload) || {};
          } catch (error) {
            
          }
          const { bodies = [], ext, from, to } = payloadJson;
          const lastMsg = bodies[0] || {};
       
          return {
            userCode: this.getChannelName(channel_id),
            unread_num,
            lastMsg,
            time: meta.timestamp,
            webIMProps: {}
          };
        });
      },
      goChat(userInfo) {
        uni.navigateTo({
          url: `/pages/message/chat?userCode=${userInfo.userCode}`,
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header-nav-right {
    position: relative;
    width: 100%;
  }
  .no-data {
    height: 1000rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 220rpx;
      height: 278rpx;
    }
  }
  .container {
    .message-list {
      margin-top: 32rpx;
      padding: 32rpx 62rpx 140rpx;
      .message-item {
        height: auto;
        margin-bottom: 62rpx;
        display: flex;
        align-items: center;
        flex-direction: row;
        .picture {
          width: 90rpx;
          height: 90rpx;
          margin-right: 24rpx;
          position: relative;
          image {
            width: 90rpx;
            height: 90rpx;
            border-radius: 50%;
            background: #F1EEFF;
          }
          .online-dot {
            position: absolute;
            width: 18rpx;
            height: 18rpx;
            border-radius: 50%;
            background: #3DD42D;
            box-sizing: border-box;
            border: 3rpx solid #fff;
            right: 6rpx;
            bottom: 6rpx;
          }
        }
        .content {
          flex: 1;
          min-width: 0;
          .name {
            font-size: 29rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #000000;
            line-height: 40rpx;
            margin-bottom: 7rpx;
          }
          .message {
            font-size: 22rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #424242;
            line-height: 31rpx;
          }
        }
        .time {
          font-size: 22rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000000;
        }
      }
    }
  }
</style>
