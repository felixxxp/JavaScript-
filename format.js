/**
 * 格式化时间
 * @param  {string} fmt 时间格式，例如yyyy-MM-dd hh:mm:ss
 * @param  {Date} date 日期对象，例如new Date()
 * @return {string} 2018-02-27 15:16:00
 */
export function formatDate (fmt, date) {
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

/**
 * 格式化请求数据
 * @param  data
 * @param  traditional
 * @return String key1=value1&key2=value2
 */
export function formatRequestData (data, traditional = false) {
  let r20 = /%20/g // 空格符号
  let prefix
  let s = []

  if (Array.isArray(data)) {
    data.forEach((v, k) => {
      add(k, v)
    })
  } else {
    for (prefix in data) {
      buildParams(prefix, data[ prefix ], traditional, add)
    }
  }

  function add (key, value) {
    value = typeof value === 'function' ? value() : (value === null ? '' : value)
    s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value)
  }

  // 用&拼接数组，%20(空格)用+表示
  return s.join('&').replace(r20, '+')
}

function buildParams (key, data, traditional, add) {
  if (Array.isArray(data)) {
  // traditional为true，直接调用add方法传入键名和数组项
    data.forEach((value, index) => {
      if (traditional) {
        add(key, value)
      } else {
        buildParams(key + '[' + (typeof value === 'object' ? index : '') + ']', value, traditional, add)
      }
    })
  } else if (!traditional && typeof value === 'object') {
    for (let name in data) {
      buildParams(key + '[' + name + ']', data[ name ], traditional, add)
    }
  } else {
    add(key, data)
  }
}

/**
 * 下划线转驼峰
 * @param  {String} 转换字符串
 * @param  {Boolean} 首字符是否转大写
 * @return {String}
 */
export function formatCamelString (str = '', upperTtileCase = false) {
  let reg = upperTtileCase ? `/(?:_|\b)(\w)/g` : /(?:_)(\w)/g
  return str.replace(reg, (s, s1) => s1.toUpperCase())
}

/**
 * 驼峰转下划线
 * @param  {String} 转换字符串
 * @param  {String} 连接符
 * @return {[type]}
 */
export function formatUnderlineString (str = '', seq = '_') {
  return str.replace(/(\w{1})(\w*)/, (s, s1, s2) => (s1.toLowerCase() + s2.replace(/[A-Z]/g, (s) => `${seq}${s.toLowerCase()}`)))
}

/**
 * 金额添加分隔符和小数位
 * @param  {Number|String} 金额 1000
 * @param  {Number} 小数位数
 * @param  {String} 千分位分隔符
 * @return {String} '1,000.00'
 */
export function formatMoney (money = 0, fixed = 2, seq = ',') {
  let re = /\d{1,3}(?=(\d{3})+$)/g
  money = (+money).toFixed(fixed)
  return money.replace(/^(\d+)((\.\d+)?)$/, (s, s1, s2) => (s1.replace(re, `$&${seq}`) + s2))
}
