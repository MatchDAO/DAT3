<script>
import { getUserInfo, getEmToken } from "@/config/auth";
import { getWalletBalanceInfo as fetchWalletBalanceInfo } from "@/api/wallet";
let WebIM = (wx.WebIM = require("@/utils/WebIM")["default"]);

export default {
  onLaunch: function () {
    // #ifdef APP-PLUS
    //设置2秒后主动关闭启动页，最多设置6秒
    setTimeout(() => {
      plus.navigator.closeSplashscreen();
    }, 2000);
    // #endif

    // 隐藏tabbar
    this.hideTabBar();
    WebIM.conn.listen({
      onOpened(message) {
        console.log("------------------");
        console.log("环信：登录成功");
        console.log("------------------");
      },
    });
    this.globalData.getWalletBalanceInfo();
  },
  onShow: function () {
    const userInfo = getUserInfo();
    const emToken = getEmToken();
    if (userInfo.userCode && emToken && !WebIM.conn.isOpened()) {
      WebIM.conn.open({
        accessToken: emToken,
        user: userInfo.userCode,
      });
    }
    this.hideTabBar();
  },
  onHide: function () {
    console.log("App Hide");
  },
  globalData: {
    userInfo: getUserInfo(), // 检测登录
    walletBalanceInfo: [],
    getWalletBalanceInfo() {
      const userInfo = getUserInfo();
      let me = this;
      if (userInfo && userInfo.wallet) {
        fetchWalletBalanceInfo({ wallet: userInfo.wallet }).then((res) => {
          me.walletBalanceInfo = res.data || [];
          setTimeout(() => {
            uni.$emit("updateWalletBalanceInfo", { data: res.data || [] });
          }, 1000);
        });
      } else {
        me.walletBalanceInfo = [];
        setTimeout(() => {
          uni.$emit("updateWalletBalanceInfo", { data: [] });
        }, 1000);
      }
    },
  },
  methods: {
    hideTabBar() {
      uni.hideTabBar({
        success() {
          console.log("隐藏tabbar:success");
        },
        fail() {
          console.log("隐藏tabbar:fail");
        },
      });
    },
  },
};
</script>

<style>
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import "./common/uni.css";
@import "./common/reset.scss";
</style>
