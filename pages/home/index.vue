<template>
  <view class="home-container">
    <uni-nav-bar
      class="header-nav"
      :fixed="true"
      :border="false"
      status-bar="true"
      padding="16rpx 22rpx 16rpx 0"
      :title="''"
      background-color="#F1EEFF"
    >
			<view slot="right" class="header-nav-right">
        <suspensionbar></suspensionbar>
      </view>
    </uni-nav-bar>
    <!-- 列表数据 -->
    <view class="friend-list" v-if="list && list.length || listParam.loading">
      <friend-card v-for="(item,index) in list" :key="index" :info="item"></friend-card>
    </view>
    <!-- 空状态 -->
    <view v-else class="no-data">
      {{$t('common.empty.data')}}
    </view>
    <tabbar activeKey="home"></tabbar>
  </view>
</template>

<script>
  import { getPopularUserList } from "@/api/user";
  export default {
    data() {
      return {
        list: [],
        listParam: { 
          pageNo: 1,
          pageSize: 10,
          loading: false,
          isEnd: false,
        },
      }
    },
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
      this.initData();
      getApp().globalData.getWalletBalanceInfo();
    },
    onPullDownRefresh() {
      console.log('onPullDownRefresh');
      this.initData();
    },
    onReachBottom() {
      console.log('onReachBottom');
      this.listParam.pageNo++;
      this.getList();
    },
    methods: {
      initData() {
        this.listParam = { 
          pageNo: 1,
          pageSize: 10,
          loading: false,
          isEnd: false,
        };
        this.getList();
      },
      getList() {
        let { pageNo, pageSize, isEnd, loading } = this.listParam;
        if (isEnd && pageNo > 1) return;
        if (loading) return;
        this.listParam.loading = true;
        getPopularUserList({ 
          current: pageNo,
          size: pageSize
        }).then((res) => {
          const list = ((res.data || {}).records || []).map(it => {
            if (it.online) {
              it.online = new Date().getTime() - it.online < 1000 * 60;
            } else {
              it.online = false;
            }
            if (!it.profession) {
              it.profession = [];
            } else if (it.profession.indexOf('[') !== -1) {
              it.profession = JSON.parse(it.profession) || [];
            } else {
              it.profession = [it.profession];
            }
            return it;
          });
          // 页码为1则为刷新
          if (this.listParam.pageNo === 1) {
            this.list = list;
          } else {
            this.list = [...this.list, ...list];
          }
          // 判断是否结束
          let { total } = res.data || {};
          this.listParam.isEnd = this.list.length >= total;
          this.listParam.pageNo = Math.ceil(this.list.length / pageSize);
        }).finally(() => {
          uni.stopPullDownRefresh();
          this.listParam.loading = false;
        });
      },
      navigateTo(url) {
        uni.navigateTo({
          url,
        });
      }
    }
  }
</script>

<style scoped lang="scss">
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
  .home-container {
    background: #F1EEFF;
    min-height: 100vh;
  }
  .friend-list {
    margin-top: 32rpx;
    padding: 38rpx 28rpx 130rpx 28rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    box-sizing: border-box;
  }
</style>
