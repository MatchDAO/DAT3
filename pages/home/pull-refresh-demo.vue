<template>
  <view class="pages">
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      status-bar="true"
      :title="$t('myBusiness.title')"
      background-color="#ffffff"
      left-icon="arrowleft"
      @clickLeft="back"
    ></uni-nav-bar>
    <!-- 列表数据 -->
    <view v-if="list && list.length || listParam.loading">
      <view class="list">
        <view class="item" v-for="(item, index) in list" :key="index">
          <view class="item-top">
            <view class="item-top-left">
              <image :src="item.member.avatar" mode='aspectFill'></image>
              <template v-if="item.advertiseType === 0">
                <view>{{$t('myBusiness.buyTip')}}</view>
                <image
                  src="/static/images/tabBar/otc_list_sell_icon.png"
                  mode=""
                ></image>
              </template>
              <template v-if="item.advertiseType === 1">
                <view>{{$t('myBusiness.saleTip')}}</view>
                <image
                  src="/static/images/tabBar/otc_list_buy_icon.png"
                  mode=""
                ></image>
              </template>
            </view>
            <view class="item-top-right">
              <view v-if="item.status === 0" class="item-status green"
                >{{$t('myBusiness.gallery')}}</view
              >
              <view v-else-if="item.status === 1" class="item-status black"
                >{{$t('myBusiness.pulled')}}</view
              >
              <view v-else class="item-status yellow">{{$t('myBusiness.inShelves')}}</view>
            </view>
          </view>
          <view class="item-detail">
            <view class="item-detail-left">
              <view class="left-top left-item">
                <text class="tit">{{ $t("tabBar.unitPrice") }}</text>
              </view>
              <view class="left-center">
                <text class="num">{{ item.price }}</text>
                <text class="tit">{{ item.country.localCurrency }}</text>
              </view>

              <view class="left-item">
                <text class="tit">{{ $t("tabBar.num") }}</text>
                <text class="txt">{{ item.number }} {{ item.coin.unit }}</text>
              </view>
              <view class="left-item">
                <text class="tit">{{ $t("tabBar.limit") }}</text>
                <text class="txt">
                  {{
                    `${item.maxLimit}${item.country.localCurrency} - ${item.minLimit}${item.country.localCurrency}`
                  }}
                </text>
              </view>
              <view class="left-item pay-type">
                <text class="tit">{{ $t("tabBar.paymentMethod") }}</text>
                <image
                  v-if="item.payMode.indexOf( '银行卡') !== -1"
                  src="/static/images/tabBar/otc_list_buy_1.png"
                  mode=""
                ></image>
                <!-- <image
                  v-if="item.payMode === '支付宝'"
                  src="/static/images/tabBar/otc_list_buy_2.png"
                  mode=""
                ></image>
                <image
                  v-if="item.payMode === '微信'"
                  src="/static/images/tabBar/otc_list_buy_3.png"
                  mode=""
                ></image> -->
              </view>
            </view>
            <!-- <view class="item-detail-right">
							<view class="btn">
								{{$t('tabBar.toBuy')}}
							</view>
						</view> -->
          </view>
          <view class="bottom-btn">
            <view
              v-if="item.status === 0"
              class="btn"
              @tap="shelvesOffItem(item)"
            >
              {{$t('myBusiness.fromShelves')}} 
            </view>
            <view
              v-else-if="item.status === 1"
              class="btn btn-yellow"
              @tap="shelvesOnItem(item)"
            >
              {{$t('myBusiness.added')}}
            </view>
            <view class="btn" @tap="goEditItem(item)"> {{$t('uc.account.change')}} </view>
            <view class="btn" @tap="delItem(item)"> {{$t('myBusiness.del')}} </view>
          </view>
        </view>
      </view>
	  <ListStatus
		:isEmpty="listParam.isEnd && list.length === 0"
		:isEnd="listParam.isEnd && list.length"
		:loading="listParam.loading"
		:showLogin="!isLogin"
		/>
    </view>
    <!-- 空状态 -->
    <view v-else class="no-data">
      <image src="/static/images/tabBar/myBusiness_empty.png" mode=""></image>
    </view>

    <!-- 发布按钮 -->
    <view class="fab-btn" @tap="openPopup">
      <uni-icons type="plus-filled" size="60" color="#FFCB6D"></uni-icons>
    </view>

    <!-- 基本示例 -->
    <uni-popup
      id="popup"
      ref="popup"
      type="bottom"
      background-color="rgba(0,0,0,.88)"
    >
      <view class="popup-content">
        <view class="popup-content-title">
          {{ $t("myBusiness.fabTip") }}
        </view>
        <view class="popup-content-btns">
          <view class="popup-btn" @tap="goBuySale('BUY')">
            <image
              src="/static/images/tabBar/myBusiness_popup_btn1.png"
              mode=""
            ></image>
            <text>{{ $t("myBusiness.buyTip") }}</text>
          </view>
          <view class="popup-btn" @tap="goBuySale('SELL')">
            <image
              src="/static/images/tabBar/myBusiness_popup_btn2.png"
              mode=""
            ></image>
            <text>{{ $t("myBusiness.saleTip") }}</text>
          </view>
        </view>
        <view class="popup-close">
          <image
            @tap="closePopup()"
            src="/static/images/tabBar/myBusiness_popup_close.png"
            mode=""
          ></image>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import ListStatus from "@/pages/tabBar/Market/components/ListStatus.vue";

import {
  getMyOtcAd,
  shelvesOffOtcAd,
  shelvesOnOtcAd,
  deleteOtcAd,
} from "@/api/otc.js";
const listParam = {
  pageNo: 1,
  pageSize: 10,
  //   status: "",
  loading: false,
  isEnd: false,
};
export default {
  components: {
    ListStatus,
  },
  data() {
    return {
      listParam: { ...listParam },
      list: [], // [{}, {}]
      isLogin: false,
    };
  },
  created() {
    this.isLogin = uni.getStorageSync("token");
  },
  onShow() {
    this.isLogin = uni.getStorageSync("token");
    this.initData();
  },
  onReachBottom() {
    console.log("onReachBottom", this.orderType);
    this.listParam.pageNo++;
    this.getList();
  },
  methods: {
    back() {
      let pages = getCurrentPages();
      if (pages.length <= 1) {
        uni.switchTab({
          url: "/pages/tabBar/Home/index",
        });
      } else {
        uni.navigateBack({
          delta: 1,
        });
      }
    },
    initData() {
      this.listParam.pageNo = 1;
      this.getList();
    },
    getList() {
      let { pageNo, pageSize, isEnd, loading } = this.listParam;
      if (isEnd && pageNo > 1) return;
      if (loading) return;
      this.listParam.loading = true;

      getMyOtcAd({
        ...this.listParam,
      })
        .then((res) => {
          console.log("res:getCurrent", res);
          let list = (res.data && res.data.content) || [];
          // 页码为1则为刷新
          if (this.listParam.pageNo === 1) {
            this.list = list;
          } else {
            this.list = [...this.list, ...list];
          }
          // 判断是否结束
          let { last } = res.data || {};
          this.listParam.isEnd = last;

          this.listParam.pageNo = Math.ceil(this.list.length / pageSize);
        })
        .finally(() => {
          this.listParam.loading = false;
        });
    },
    shelvesOffItem(item) {
      shelvesOffOtcAd({ id: item.id }).then((res) => {
        this.initData();
      });
    },
    shelvesOnItem(item) {
      shelvesOnOtcAd({ id: item.id }).then((res) => {
        this.initData();
      });
    },
    goEditItem(item) {
		uni.navigateTo({
        url: `/pages/tabBar/OTC/buySale?mode=edit&id=${item.id}`,
      });
	},
    delItem(item) {
      deleteOtcAd({ id: item.id }).then((res) => {
        this.initData();
      });
    },
    goBuySale(action) {
      this.closePopup();
      uni.navigateTo({
        url: `/pages/tabBar/OTC/buySale?action=${action}`,
      });
    },
    openPopup() {
      this.$refs.popup.open();
    },
    /**
     * 点击取消按钮触发
     * @param {Object} done
     */
    closePopup() {
      // TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
      // ...
      this.$refs.popup.close();
    },
    /**
     * 点击确认按钮触发
     * @param {Object} done
     * @param {Object} value
     */
    confirmPopup(value) {
      // 输入框的值
      console.log(value);
      // TODO 做一些其他的事情，手动执行 close 才会关闭对话框
      // ...
      this.$refs.popup.close();
    },
  },
};
</script>

<style scoped lang="scss">
.no-data {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  image {
    width: 220upx;
    height: 278upx;
  }
}

.list {
  padding: 30upx;

  .item {
    background-color: $bg-white;
    padding: 30upx 30upx;

    margin-bottom: 30upx;
    position: relative;
    .item-top {
      display: flex;

      .item-top-left {
        flex: 1;
        display: flex;
        align-items: center;

        image {
          &:nth-child(1) {
            width: 80upx;
            height: 80upx;
            border-radius: 50%;
            background: $bg;
          }

          &:nth-child(3) {
            width: 27upx;
            height: 26upx;
          }
        }

        view {
          font-size: 33upx;
          line-height: 46upx;
          margin: 0 20upx 0 10upx;
        }
      }

      .item-top-right {
        display: flex;
        align-items: center;

        .item-status {
          width: 130upx;
          height: 54upx;

          position: absolute;
          right: 0;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24upx;
          color: $font-white;
          border-top-left-radius: 27upx;
          border-bottom-left-radius: 27upx;
          &.green {
            background: $base-green;
          }
          &.yellow {
            background: $bg-yellow;
          }
          &.black {
            background: $bg-black;
          }
        }
      }
    }

    .item-detail {
      display: flex;

      .item-detail-left {
        flex: 1;

        .left-center {
          margin-top: 12upx;

          .num {
            font-size: 50upx;
            font-weight: bold;
            line-height: 58upx;
            margin-right: 36upx;
          }

          .tit {
            font-size: 24upx;
            line-height: 33upx;
          }
        }

        .left-item {
        //   margin-top: 12upx;
			&.pay-type{
				margin-top:12upx;
			}
          .tit {
            font-size: 24upx;
            color: $font-tab-color;
            line-height: 33upx;
            margin-right: 20upx;
          }

          .txt {
            font-size: 24upx;
            line-height: 33upx;
          }

          image {
            margin-left: 20upx;

            &:nth-child(2) {
              width: 39upx;
              height: 27upx;
            }

            &:nth-child(3) {
              width: 29upx;
              height: 29upx;
            }

            &:nth-child(4) {
              width: 34upx;
              height: 29upx;
            }
          }
        }
      }

      .item-detail-right {
        display: flex;
        align-items: flex-end;

        view {
          width: 155upx;
          height: 68upx;
          background: $base-green;
          border-radius: 6upx;
          display: flex;
          align-items: center;
          justify-content: center;
          color: $font-white;
        }
      }
    }

    .bottom-btn {
		margin-top:30upx;
      padding: 30upx 0upx 0;
      display: flex;
      @include border(top);

      .btn {
        margin-right: 20upx;
        width: 180upx;
        height: 60upx;

        border-radius: 6upx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $bg-gray;
        color: $font-black;

        &.btn-yellow {
          background: $base-color;
          color: $font-white;
        }
      }
    }
  }
}

.fab-btn {
  position: fixed;
  z-index: 9;
  right: 80upx;
  bottom: 120upx;

  .uni-icons {
  }
}

.popup-content {
  background-color: $bg-white;
  height: 578upx;
  border-top-left-radius: 20upx;
  border-top-right-radius: 20upx;

  .popup-content-title {
    padding-top: 30upx;
    height: 45upx;
    font-size: 32upx;
    line-height: 45upx;
    text-align: center;
  }

  .popup-content-btns {
    margin-top: 100upx;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .popup-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      image {
        width: 140upx;
        height: 140upx;
      }

      text {
        margin-top: 30upx;
        height: 45upx;
        font-size: 32upx;
        line-height: 45upx;
      }
    }
  }

  .popup-close {
    margin-top: 30upx;
    display: flex;
    align-items: center;
    justify-content: center;

    image {
      width: 68upx;
      height: 68upx;
    }
  }
}
</style>
