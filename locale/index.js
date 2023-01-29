import zhHans from './zh-Hans.json'
import zhPlus from './lang/zh.js'

import enPlus from './lang/en.js'
import en from "./en.json"

import zhHant from './zh-Hant.json'
import hkPlus from "./lang/hk.js"

import ja from './ja.json'
import jaPlus from './lang/ja.js'
// zh-Hant\zh-Hans是uniapp UI自带的默认对应中文，必须为这个
// 语言映射 （uniapp组件语言用的短的），正常用的 是xx_XX
export const LANG_MAP = {
	'zh-Hans': 'zh_CN',
	'zh-Hant': 'zh_HK',
	'en': 'en_US',
	'ja': 'ja_JP',
	'ko': 'ko_KR',
	'de': 'de_DE',
	'fr': 'fr_FR',
	'it': 'it_IT',
	'es': 'es_ES',
	'id': 'id_ID',

	"ph": "en_PH",
	"vi": "vi_VN",
	"sg": "zh_SG",
	"km": "km_KH",
	"ar": "ar_AE",
	"pk": "ur_PK",
	"in":"hi_IN",
	"ms": "ms_MY",

	'zh_CN': 'zh-Hans',
	'zh_HK': 'zh-Hant',
	'en_US': 'en',
	'ja_JP': 'ja',
	'ko_KR': 'ko',
	'de_DE': 'de',
	'fr_FR': 'fr',
	'it_IT': 'it',
	'es_ES': 'es',
	'id_ID': 'id',

	"en_PH": "ph",
	"vi_VN": "vi",
	"zh_SG": "sg",
	"km_KH": "km",
	"ar_AE": "ar",
	"ur_PK": "pk",
	"hi_IN":"in",
	"ms_MY": "ms",
}

export default {
	'en': { ...en, ...enPlus },
	'zh-Hans': {...zhHans,...zhPlus},
	'zh-Hant': { ...zhHant, ...hkPlus },
	
	'hk': { ...zhHant, ...hkPlus },
	'ja': { ...ja, ...jaPlus },
}
