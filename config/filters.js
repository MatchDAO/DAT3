const tofixed8 = val => {
	const e = String(val)
	let rex =/^[0-9]+\.[0-9]{9,}$/ // 9位以上小数
	if(rex.test(e)){
		return Math.floor(parseInt(val*1000000000))/1000000000
	}else{
		// 无8位以上小数点
		return val
	}
}
export const filters = {
  tofixed: val => {
		const e = String(val)
		let rex = /^([0-9])\.?([0-9]*)e-([0-9])/
		if( (rex.test(e) && val < 1)){
			const numArr = e.match(rex)
			const n = Number('' + numArr[1] + (numArr[2] || ''))
			const num = '0.' + String(Math.pow(10, Number(numArr[3]) - 1)).substr(1) + n
			return tofixed8(num.replace(/0*$/, ''))  // 防止可能出现0.0001540000000的情况
		}else{
			// 无小数点
			let num = new Number(val)
			return tofixed8(num.toString())
		}
  },
	tofixedNum:num =>{
		const e = Number(num)
		if(e>=1000000 && e<1000000000){
			let n = e/1000000
			return n.toFixed(4)+'M'
		}
		if(e>=1000000000){
			let n1 = e/1000000000
			return n1.toFixed(4)+'B'
		}
		
		return num
	},
	tofixed8,
}