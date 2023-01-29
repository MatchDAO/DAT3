## 如下

```js
import en from './en.json'
import zhHans from './zh-Hans.json'
import zhHant from './zh-Hant.json'
import ja from './ja.json'
export default {
	en,
	'zh-Hans': zhHans,
	'zh-Hant': zhHant,
	ja
}
```
## 页面国际化
_ import en from './en.json'
这是某种国际化语言文件
_ zh-Hans.json是中文
_ zh-Hant.json是繁体（香港、台湾）

## 组件国际化
uniapp UI组件国际化文件
_ local/目录下 uni-app.xx.json
xx为ja时是ja国际化文件目录，必须为json

## 页面配置国际化（pags.json）
_ local/目录下 xx.json
xx为ja时是ja国际化文件目录，必须为json(有待探索)