/**
 * 添加类名
 * @param el DOM元素
 * @param className 类名
 */
export function addClass (el, className) {
    // console.log(el)
    console.log(className)
    // 如果存在 就什么都不做
    if (hasClass(el, className)) {
      return
    }
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
  }
  
  // 判断该元素是否有该class，有就没必要添加类名了，没有就添加
  export function hasClass (el, className) {
    // 如果类名前面是空字符或者以自己开头，以及以空字符或者以类名结尾，说明有类名
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
  }
  
  export function getData (el, name, val) {
    const prefix = 'data-'
    if (val) {
      return el.setAttribute(prefix + name + val)
    }
    return el.getAttribute(prefix + name)
  }
  

  //创建一个div
  let elementStyle = document.createElement('div').style
  
  // 浏览器供应商
  let vendor = (() => {
    let transformNames = {
      webkit: 'webkitTransform',
      Moz: 'MozTransform',
      O: 'OTransform',
      ms: 'msTransform',
      standard: 'transform'
    }
  //遍历key
    for (let key in transformNames) {
      if (elementStyle[transformNames[key]] !== undefined) {
        return key
      }
    }
  
    return false
  })()
  
  export function prefixStyle (style) {
    if (vendor === false) {
      return false
    }
  
    if (vendor === 'standard') {
      return style
    }
  //首字母大写加上剩余部分
    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
  }
  