# 配置

1. 颜色在根目录 uni.scss 配置，新颜色都需要配置一下（请配置后，提交一下这个文件）
2. 静态资源图片等请放到 static 目录下， 图片请按照页面或者模块放置（即使重复图片，也请都放置一份，不要跨模块｜页面引入图片，除非俩模块是你负责的）
3. 接口在 @/api/\*[页面名] ，具体请求实例 可以看 pages/help/index
4. router 页面路由配置在 pages.json 里面
5. css 单位使用 rpx 替换 rem、px 、upx
6. 国际化参考 home 首页写法（国际化语言只写中文，配置在/local/zhHans.json | /local/lang/zh.js）
7. 导航栏可以用系统自带，或者用 [uni-nav-bar](https://uniapp.dcloud.net.cn/component/uniui/uni-nav-bar) [使用 demo ｜具体在本项目/pages/extUI/nav-bar/index.vue](https://hellouniapp.dcloud.net.cn/pages/extUI/nav-bar/nav-bar)
8. 没有 window 相关方法，请用[uni 的 API](https://uniapp.dcloud.net.cn/api/router?id=navigateto)
9. 引入外部 插件｜组件 请兼容 App，具体可以用 运行-运行到手机或模拟器 查看效果

## renderjs 使用

```js
   // 视图层 是script lang=renderjs 区块；逻辑层是我们原来默认用的script区块
   //0 视图层获取组件实例 this.$ownerInstance； 可以向逻辑层通信
   //1. 视图层向逻辑层通信 changeMnemonic 是逻辑层的方法，第二个参数是传递值
   // 注意 uni.方法都不支持， 请求接口等等 展示toast都不可以
   this.$ownerInstance.callMethod('changeMnemonic', 345)
   //2.视图层从逻辑层取值 直接可以区data里的属性
   console.log("mnemonic",this.mnemonic);
   // 3.视图层改变data数据 通过<1>向视图层向逻辑层通信

   // 页面上可以监听数据、事件改变触发逻辑层方法
   <view @click="echarts.onClick" :prop="option" :change:prop="echarts.updateEcharts" id="echarts" class="echarts"></view>
   // 逻辑层里面可以
   updateEcharts(newValue, oldValue, ownerInstance, instance) {
       // 监听数据变更 ownerInstance是this.$ownerInstance
   },
   onClick(event, ownerInstance) {
       // 调用 service 层的方法
       ownerInstance.callMethod('onViewClick', {
           test: 'test'
       })
   }
```

# hello-uniapp

`uni-app`框架示例，一套代码，同时发行到 iOS、Android、H5、小程序等多个平台，请使用手机扫码快速体验`uni-app`的强大功能。

<div class="quick">
    <h3 id="快速体验"><a href="/README?id=%e5%bf%ab%e9%80%9f%e4%bd%93%e9%aa%8c" data-id="快速体验" class="anchor"><span>快速体验</span></a></h3>
    <p>一套代码编到10个平台，这不是梦想。眼见为实，扫描10个二维码，亲自体验最全面的跨平台效果！</p>
    <div class="flex-img-group-view">
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/ba7d0750-517d-11eb-bdc1-8bd33eb6adaa.png" width="160" />
        </div>
        <b>Android版</b>
      </a>
      <a href="https://itunes.apple.com/cn/app/hello-uni-app/id1417078253?mt=8" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/bb3ef7c0-517d-11eb-bdc1-8bd33eb6adaa.png" width="160" />
        </div>
        <b>iOS版</b>
      </a>
      <a href="https://hellouniapp.dcloud.net.cn/" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/bb3ef7c0-517d-11eb-bdc1-8bd33eb6adaa.png" width="160" />
        </div>
        <b>H5版</b>
      </a>
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box"><img src="//img.cdn.aliyun.dcloud.net.cn/guide/uniapp/gh_33446d7f7a26_430.jpg" width="160" /></div>
        <b>微信小程序版</b>
      </a>
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box"><img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b131e0d0-517d-11eb-a16f-5b3e54966275.png" width="160" /></div>
        <b>支付宝小程序版</b>
      </a>
    </div>
    <div class="flex-img-group-view" style="margin-top: 20px;">
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box"><img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b204e840-517d-11eb-8ff1-d5dcf8779628.png" width="160" /></div>
        <b>百度小程序版</b>
      </a>
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/mp-toutiao.png" width="160" />
        </div>
        <b>字节跳动小程序版</b>
      </a>
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/hello-uni-qq.png" width="160" />
        </div>
        <b>QQ小程序版</b>
      </a>
      <a href="//m3w.cn/uniapp" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/hello-uni-qa-union.png" width="160" />
        </div>
        <b>快应用</b>
      </a>
      <a href="https://so.mp.360.cn/mp.html?appid=qh4j181qqtru354st6" target="_blank" class="clear-style barcode-view">
        <div class="barcode-img-box">
          <img src="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/hello-uni-mp-360-qr.png" width="160" />
        </div>
        <b>360小程序</b>
      </a>
    </div>
    <p>
        <em>注：某些平台不能提交简单demo，故补充了一些其他功能；hello uni-app示例代码可从[github](https://github.com/dcloudio/hello-uniapp)获取</em></br>
        <em>快应用仅支持 vivo 、oppo、华为</em></br>
        <em>360小程序仅 windows平台支持，需要在360浏览器中打开</em></br>
    </p>
</div>

`uni-app`官网文档详见[https://uniapp.dcloud.io](https://uniapp.dcloud.io)

更多 uni-app 的模板、示例详见[插件市场](https://ext.dcloud.net.cn/)

# =====================================

# hello-i18n

# en

A demo project for uni-app globalization

This template include uni-framework, manifest.json, pages.json, tabbar, Page, Component, API

# zh-hans

uni-app 国际化演示

包含 uni-framework、manifest.json、pages.json、tabbar、页面、组件、API
