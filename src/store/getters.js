// 获取歌手信息的getters
export const singer = state => state.singer

// 获取是否播放的getters
export const playing = state => state.playing

// 获取是否全屏播放的getters
export const fullScreen = state => state.fullScreen

// 获取播放列表的getters
export const playlist = state => state.playlist

// 获取顺序播放列表的getters
export const sequenceList = state => state.sequenceList

// 获取播放模式的getters
export const mode = state => state.mode

// 获取当前播放歌曲的索引值
export const currentIndex = state => state.currentIndex

// 获取当前歌曲的getters
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
console.log(currentSong)

// 获取当前歌单的getters
export const disc = state => state.disc

// 获取热门推荐列表getters
export const topList = state => state.topList

// 获取搜索关键字历史getters
export const searchHistory = state => state.searchHistory

// 获取喜欢列表getters
export const favoriteList = state => state.favoriteList

// 获取播放历史getters
export const playHistory = state => state.playHistory
