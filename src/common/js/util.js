// 返回最大值和最小值之间的一个数 random()返回[0,1)
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
// 洗牌算法 ------将数组打乱
export function shuffle (arr) {
  let _arr = arr.slice() // 克隆一份 _arr与arr一样
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[t] = t
  }
  return _arr
}
// 节流函数 (函数柯里化====一个函数执行返回一个函数)
export function debounce (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
