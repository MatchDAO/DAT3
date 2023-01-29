启动页和引导页

参考链接(Uni-App 启动页和引导页介绍)[https://blog.csdn.net/yeyushaqiu/article/details/124451803]

注意：若App启动时有动态显示其他页面的需求，场景举例：

欢迎页场景：首次启动，显示App欢迎页；否则，显示首页内容
登录页场景：用户未登录，打开登录页；否则，显示首页内容
此时，App引擎无法高效判断首页及跳转页渲染情况，建议将alwaysShowBeforeRender 设置为false，开发者手动调用 plus.navigator.closeSplashscreen() 关闭启动界面。
>设置为true，则splash的关闭逻辑为：App启动时，App引擎自动检测首页渲染情况，若首页未渲染（白屏），则不关闭splash；否则，关闭splash；若启动时间超过10秒，则不管首页是否白屏，自动关闭splash

