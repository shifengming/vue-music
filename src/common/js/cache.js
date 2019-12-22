import storage from 'good-storage'
// 定义搜索KEY
const SEARCH_KEY = '__search__' // 搜索的key
const SEARCH_MAX_LEN = 15 // 最大存储空间
const FAVORITE_KEY = '__favorite__' // 喜欢的key
const FAVORITE_MAX_LEN = 200
const PLAY_KEY = '__play__' // 播放的key
const PLAY_MAX_LEN = 200
// 插入关键字到数组，最后搜索的在最前面 arr-数组，val-存储的值，compare-比较函数，maxLen-最大的值
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) { // 等于0是第一条数据
    return
  }
  if (index > 0) {
    arr.splice(index, 1) // 搜索的数据在数组中存在，首先删除这条数据
  }
  arr.unshift(val) // 删除过后就插入到数组的最前面
  if (maxLen && arr.length > maxLen) {
    arr.pop() // 把数组中的最后一个数pop出去
  }
}
// 从数组中删除元素
function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// 保存搜索结果
export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query // 如果与搜索关键字相等的话说明关键字已存在
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 从本地缓存中获取数据给搜索结果当默认值
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}
// 删除搜索记录
export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 删除所有的搜索记录
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}
// 存储播放
export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}
