import originJSONP from 'jsonp'
/**
 * 封装jsonp url opts fn
 * @param url 纯净的url，无参数
 * @param data 请求参数
 * @param option 额外选项
 * @returns {Promise<any>}
 */
// 所有的参数data都追加到url后
export default function jsonp (url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      console.log(data)
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 拼接参数
function param (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
