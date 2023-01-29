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