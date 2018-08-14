/**
 * 格式化时间
 * @param  {string} fmt 时间格式，例如yyyy-MM-dd hh:mm:ss
 * @param  {Date} date 日期对象，例如new Date()
 * @return {string} 2018-02-27 15:16:00
 */
export function dateFormat (fmt, date) {
  date = date || new Date()
  let hash = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'S': date.getMilliseconds()
  }

  for (let mod in hash) {
    let reg = new RegExp(`(${mod})`)
    fmt = fmt.replace(reg, (match) => {
      let zeros = new Array(match.length + 1).join('0')
      return (zeros + hash[mod]).substr(0 - match.length)
    })
  }

  return fmt
}
