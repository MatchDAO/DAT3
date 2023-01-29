<template>
  <view class="container">
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      :border="false"
      status-bar="true"
      background-color="#F1EEFF"
      @clickLeft="back"
    >
      <block>
        <view class="user-title-wrapper" @tap="goFriendDetailPage">
          <image mode='aspectFill' :src="other.portrait"></image>
          <text>{{other.userName}}</text>
        </view>
      </block>
      <block slot="left">
        <view class="left">
          <image class="back-icon" src="/static/icon-back.png"></image>
        </view>
      </block>
    </uni-nav-bar>
    <scroll-view 
      class="body" 
      scroll-y="true" 
      :scroll-into-view="toView"
      scroll-with-animation="true"
    >
      <view class="message-list">
        <view class="message-item" v-for="(item,index) in list" :key="index" :class="{isOther: item.from === other.userCode}">
          <view class="picture">
            <image mode='aspectFill' :src="item.from === other.userCode ? other.portrait : me.portrait"></image>
          </view> 
          <view class="message-box">
            <view class="message-content" :class="{'message-image-content': item.contentsType === 'IMAGE'}">
              <view class="trangle"></view>
              <view class="profit-box" v-if="item.from === other.userCode && chatRel === 2">
                <image src='/static/chat/profit.png'></image>
                <text>+{{profitNum}}eth</text>
              </view>
              <text v-if="item.contentsType === 'TEXT'">{{item.data}}</text>
              <image 
                mode='aspectFill'
                @tap="clickImg([item.url])"
                v-if="item.contentsType === 'IMAGE'" 
                :src="item.url"
              ></image>
            </view>
          </view> 
        </view>
      </view>
      <view :id="'dade'+(list.length)"></view>
    </scroll-view>
    <view class="control-box">
      <view class="input-box">
        <image @tap="sendImage" class="image-type-icon" src="/static/chat/image-type-icon.png"></image>
        <view class="split-line"></view>
        <input v-model="inputMessage" @confirm="sendMessage" class="input" :placeholder="$t('chat.typing') + '...'"/>
      </view>
      <image @tap="sendMessage" class="send-icon" src="/static/chat/send-icon.png"></image>
    </view>
    <!-- 普通确认弹窗 -->
    <w-popup-confirm
      ref="popup"
      :content="$t('chat.insufficientBalanceMsg')"
      :cancelText="$t('chat.insufficientBalanceCancelText')"
      :confirmText="$t('chat.insufficientBalanceConfirmText')"
      @cancel="insufficientBalanceCancel"
      @confirm="insufficientBalanceConfirm"
    />
  </view>
</template>

<script>
  let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);
  import { getUserInfo as fetchUserInfo } from "@/api/user";
  import { sendMsgBefore, replyMsgBefore, getChatRel as fetchChatRel } from "@/api/message";
  import { getChatFee as fetchChatFee } from "@/api/wallet";
  import { formatEther } from '@/utils/wallet';
  import msgType from './msgtype';
  export default {
    data() {
      return {
        other: {},
        chatType: 'singleChat',
        me: {},
        list: [],
        option: {},
        inputMessage: "", // render input 的值
        toView: "",
        chatRel: null, 
        walletBalanceInfo: this.formatWalletBalanceInfo(getApp().globalData.walletBalanceInfo),
        chatFeeInfo: {},
        // chatRel为0:当前用户或当前会话user信息异常
        // chatRel为1:u1是u2的消费者
        // chatRel为2:u2是u1的消费者
      }
    },
    onLoad(option) {
      let me = this;
      me.option = option;
      WebIM.conn.listen({
        onTextMessage(message) {
          me.getMessageList();
        },
        onPictureMessage(message) {
          console.log('onPictureMessage', message);
          me.getMessageList();
        },
        onReceivedMessage(message) {
          console.log('onReceivedMessage', message);
        },
      });
    },
    onShow() {
      let me = this;
      const userInfo = getApp().globalData.userInfo || {};
      me.getUserInfo(me.option.userCode);
      me.getChatRel(me.option.userCode);
      me.getChatFee();
      me.me = userInfo;
      uni.$on('updateWalletBalanceInfo', function({ data }){
				me.walletBalanceInfo = me.formatWalletBalanceInfo(data);
			})
    },
    computed: {
      profitNum() {
        return formatEther((this.chatFeeInfo.ethChatFee * 0.8).toFixed(0), 4);
      }
    },
    methods: {
      insufficientBalanceCancel() {
        this.$refs.popup.close();
      },
      insufficientBalanceConfirm() {
        uni.navigateTo({
					url: `/pages/wallet/index?switchKey=wallet`,
				});
      },
      formatWalletBalanceInfo(walletBalanceInfo) {
        let data = {
					DAT3: 0,
					ETH: 0,
					VEDAT3: 0,
				};
				walletBalanceInfo.forEach(element => {
					switch (element.token) {
						case 'ETH':
							data.ETH = element.amount;
							break;
						// case 'DAT3':
						// 	data.DAT3 = element.amount;
						// 	break;
						// case 'VEDAT3':
						// 	data.VEDAT3 = element.amount;
						// 	break;
						default:
							break;
					}
				});
        return data;
      },
      getChatFee() {
        let me = this;
        fetchChatFee().then(res => {
          me.chatFeeInfo = res.data || {};
        });
      },
      getChatRel(userCode) {
        let me = this;
        fetchChatRel(userCode).then(res => {
          me.chatRel = res.data || 0;
        });
      },
      clickImg(urls) {
        wx.previewImage({
					urls: urls, //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
					current: '', // 当前显示图片的http链接，默认是第一个
					success: function(res) {},
					fail: function(res) {},
					complete: function(res) {},
				})
      },
      getUserInfo(userCode) {
        let me = this;
        fetchUserInfo({ userCode }).then(res => {
          me.other = res.data || {};
          me.getMessageList();
        })
      },
      getMessageList() {
        let me = this;
        console.log('----------');
        console.log('环信登录状态', WebIM.conn.isOpened() ? '已连接' : '已断开');
        console.log('----------');
        const options = {
          queue: this.other.userCode,
          isGroup: false,
          count: 1000,
          success: function(res){
            console.log('----------');
            console.log('拉取历史消息成功：', res);
            console.log('----------');
            const list = res || [];
            me.list = list;
            setTimeout(() => {
              me.toView = 'dade' + list.length;
            }, 300);
          },
          fail: function(error){
            console.log('----------');
            console.log('拉取历史消息失败：', error);
            console.log('----------');
          }
        }
        WebIM.conn.mr_cache = [];
        WebIM.conn.fetchHistoryMessages(options)
      },
      sendMessage() {
        let me = this;
        String.prototype.trim = function () {
          return this.replace(/(^\s*)|(\s*$)/g, "");
        };
        const userMessage = me.inputMessage;
        if (!userMessage.trim()) {
          return;
        }
        me.beforeSend(function() {
          let id = WebIM.conn.getUniqueId();
          let msg = new WebIM.message(msgType.TEXT, id);
          msg.set({
            msg: userMessage,
            to: me.other.userCode,
            // roomType: false,
            chatType: me.chatType,
            success(id, serverMsgId) {
              me.inputMessage = '';
              me.getMessageList();
            },
            fail(id, serverMsgId) {
              console.log("失败了");
            },
          });
          
          WebIM.conn.send(msg.body);
        });
      },
      sendImage() {
				var me = this;
        uni.chooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType: ["album"],
          success(res) {
            me.beforeSend(function() {
              me.upLoadImage(res);
            });
          }
        });
			},
      beforeSend(sendFn) {
        let me = this;
        switch (me.chatRel) {
          case 0:
            uni.showToast({
              icon: "none",
              title: this.$t('chat.errorChatRelMsg'),
              duration: 2000,
            });
            break;
          case 1:
            const ethBalance = Number(me.walletBalanceInfo.ETH || 0);
            const ethChatFee = Number(me.chatFeeInfo.ethChatFee || 0);
            if (ethBalance < ethChatFee) {
              this.$refs.popup.open();
              return;
            }
            sendMsgBefore({
              userCode: me.me.userCode,
              creator: me.other.userCode,
              amount: me.chatFeeInfo.ethChatFee
            }).then(res => {
              sendFn && sendFn();
              getApp().globalData.getWalletBalanceInfo();
            })
            break;
          case 2:
            replyMsgBefore({
              userCode: me.other.userCode,
              creator: me.me.userCode
            }).then(res => {
              sendFn && sendFn();
              getApp().globalData.getWalletBalanceInfo();
            })
            break;
          default:

            break;
        }
      },
      upLoadImage(res) {
        var me = this;
				var tempFilePaths = res.tempFilePaths;
				var token = WebIM.conn.context.accessToken;
        uni.getImageInfo({
					src: res.tempFilePaths[0],
					success(res) {
            var allowType = {
							jpg: true,
							jpeg: true,
							gif: true,
							png: true,
							bmp: true
						};
						var str = WebIM.config.appkey.split("#");
						var width = res.width;
						var height = res.height;
						var index = res.path.lastIndexOf(".");
						var filetype = ~index && res.path.slice(index + 1) || "";
						if (!res.type) {
							uni.showToast({
								title: "H5端，uni-app暂未支持",
                      			icon: "none"
							})
						}
						if (filetype.toLowerCase() in allowType || res.type in allowType) {
              console.log('url::', WebIM.config.apiURL + str[0] + "/" + str[1] + "/chatfiles");
              uni.uploadFile({
								url: WebIM.config.apiURL + "/" + str[0] + "/" + str[1] + "/chatfiles",
								filePath: tempFilePaths[0],
								fileType: 'image',
								name: "file",
								header: {
									// "Content-Type": "multipart/form-data",
									'Content-Type': 'application/x-www-form-urlencoded',
									Authorization: "Bearer " + token
								},
								success: (res)=>{
									if (res.statusCode == 400) {
										// 图片上传阿里云检验不合法
										// var errData = JSON.parse(res.data);
										// if (errData.error === 'content improper') {
										uni.showToast({
											title: "图片检测不合法",
											duration: 1000
										});
										return false
										// }
									}
									var data = res.data;
									var dataObj = JSON.parse(data);
									var id = WebIM.conn.getUniqueId(); // 生成本地消息 id

									var msg = new WebIM.message(msgType.IMAGE, id);
									var file = {
										type: msgType.IMAGE,
										size: {
											width: width,
											height: height
										},
										url: dataObj.uri + "/" + dataObj.entities[0].uuid,
										filetype: filetype,
										filename: tempFilePaths[0]
									};
									msg.set({
										apiUrl: WebIM.config.apiURL,
										body: file,
										to: me.other.userCode,
										roomType: false,
										chatType: me.chatType,
										success: function(argument) {
                      me.getMessageList();
										}
									});

									if (me.chatType == msgType.chatType.CHAT_ROOM) {
										msg.setGroup("groupchat");
									}

									WebIM.conn.send(msg.body);
								},
								fail: (err) => {
									console.log('上传失败', err)
								},
								complete: (err) => {
									console.log('上传完成', err)
								}
							});
            }
          }
        })
      },
      goFriendDetailPage() {
        let me = this;
	      uni.navigateTo({
					url: `/pages/home/friend-details?userCode=${me.other.userCode}`,
				});
      },
      back() {
				uni.navigateBack({
					delta: 1,
				});
			},
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    background: #F1EEFF;
    .user-title-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      image {
        width: 58rpx;
        height: 58rpx;
        margin-right: 16rpx;
        border-radius: 50%;
        background: #000;
      }
      text {
        font-size: 36rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #000000;
      }
    }
    .body {
      margin-top: 20rpx;
      height: calc(100vh - 160rpx);
      background: #FFFFFF;
      box-shadow: 0px -5rpx 27rpx 0rpx rgba(216,80,233,0.18);
      border-radius: 65rpx 65rpx 0 0;
      box-sizing: border-box;
      .message-list {
        padding: 80rpx 54rpx 150rpx;
        .message-item {
          margin-bottom: 63rpx;
          display: flex;
          align-items: start;
          flex-direction: row-reverse;
          .picture {
            width: 96rpx;
            height: 96rpx;
            margin-left: 24rpx;
            image {
              width: 96rpx;
              height: 96rpx;
              border-radius: 50%;
              background: #000;
            }
          }
          .message-box {
            .message-content {
              background: #F1EEFF;
              border-radius: 30rpx;
              font-size: 22rpx;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #000000;
              line-height: 32rpx;
              padding: 22rpx;
              margin-top: 12rpx;
              position: relative;
              word-break: break-all;
              &.message-image-content {
                image {
                  width: 400rpx;
                  height: 400rpx;
                }
              }
              .profit-box {
                position: absolute;
                bottom: -44rpx;
                height: 32rpx;
                left: 30rpx;
                display: flex;
                align-items: center;
                min-width: 200rpx;
                image {
                  width: 29rpx;
                  height: 25rpx;
                  margin-right: 6rpx;
                }
                text {
                  font-size: 22rpx;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: #000000;
                }
              }
              .trangle {
                position: absolute;
                top: 28rpx;
                right: -20rpx;
                width: 0rpx;
                height: 0rpx;
                border-top: 15rpx solid transparent;
                border-left: 30rpx solid #F1EEFF;
                border-bottom: 15rpx solid transparent;
              }
            }
          }
          &.isOther {
             flex-direction: row;
            .picture {
              margin-right: 24rpx;
              margin-left: 0;
            }
            .message-box {
              .message-content {
                background: #EDEDED;
                .trangle {
                  left: none;
                  left: -20rpx;
                  border-top: 15rpx solid transparent;
                  border-right: 30rpx solid #EDEDED;
                  border-bottom: 15rpx solid transparent;
                  border-left: none;
                }
              
              }
            }
          }
        }
      }
    }
    .control-box {
      display: flex;
      align-items: center;
      flex-direction: row;
      position: fixed;
      bottom: 34rpx;
      left: 31rpx;
      .input-box {
        width: 591rpx;
        height: 96rpx;
        border-radius: 48rpx;
        box-sizing: border-box;
        background: #F8F6FF;
        margin-right: 12rpx;
        display: flex;
        align-items: center;
        flex-direction: row;
        padding: 0 30rpx;
        .image-type-icon {
          width: 40rpx;
          height: 38rpx;
        }
        .split-line {
          width: 2rpx;
          height: 42rpx;
          background: #1F1F1F;
          margin: 0 20rpx 0 16rpx;
        }
        .input {
          height: 96rpx;
          flex: 1;
        }
      }
      .send-icon {
        width: 92rpx;
        height: 92rpx;
      }
    }
  }
</style>
