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

