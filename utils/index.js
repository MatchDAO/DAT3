/**
 * @description 科学计数法转为string
 * @param {string, number} value
 */
export const scientificNotationToString = (value) => {
  let strParam = String(value)
  let flag = /e/.test(strParam)
  if (!flag) return value
  // 指数符号 true: 正，false: 负
  let sysbol = true
  if (/e-/.test(strParam)) {
    sysbol = false
  }
  // 指数
  let index = Number(strParam.match(/\d+$/)[0])
  // 基数
  let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')

  if (sysbol) {
    return basis.padEnd(index + 1, 0)
  } else {
    return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
  }
}