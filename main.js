import App from './App'
import messages from './locale/index'
import store from './store'
import { LANG_MAP } from "@/locale";

let langApi = "en_US"//uni.getStorageSync("lang") || "en_US"; // 默认英文
console.log("langApi", langApi);
// 映射 lang
const lang = LANG_MAP[langApi]
let i18nConfig = {
	locale: lang,//uni.getLocale(),
	messages
}
uni.setStorageSync('lang',LANG_MAP[lang])

import { filters } from '@/config/filters.js'
// 定义全局自定义过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
// #ifndef VUE3

import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
const app = new Vue({
	i18n,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import {
	createI18n
} from 'vue-i18n'
const i18n = createI18n(i18nConfig)
export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	return {
		app
	}
}
// #endif
