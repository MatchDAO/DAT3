<template>
    <view id="guide">
        <swiper
      class="swiper"
      circular 
      :indicator-dots="true" >
            <swiper-item
            @click="goHome"
        class="item"
        v-for="(item, index) in guidelList" :key="index">
                <image  :src="item" mode="aspectFill">
                </image>
            </swiper-item>
        </swiper>
    </view>
</template>
<script>
import { getToken } from "@/config/auth";
import guide2 from "@/static/start/guide2.png"
import guide3 from "@/static/start/guide3.png"
import guide4 from "@/static/start/guide4.png"
export default {
  data(){
    return {
      guidelList:[
        guide2,
        guide3,
        guide4
      ]
    }
  },
  onLoad(){
    // 暂时倒计时跳转
    setTimeout(() => {
      this.goHome()
    }, 10000);
  },
  methods:{
    goHome(){
      let isLogin = getToken();
      // 如果没登录过 直接去登录页面
      if (isLogin) {
        uni.switchTab({
          url: "/pages/home/index"
        });
      }else{
        uni.redirectTo({
          url: "/pages/login/index"
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#guide{
  background: #F1EEFF;
  width: 100vw;
  height: 100vh;
  .swiper{
width: 100vw;
  height: 100vh;
    .item{
      width: 100vw;
      image{
        width: 100vw;
        height: 100vh;
      }

    }
  }
}
</style>