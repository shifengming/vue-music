import * as types from './mutation-types'

const mutations = {
  // state是状态中的state，singer是传递的payload
  // 歌手信息
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  // 是否播放 flag值为true或false
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  // 是否全屏播放
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  // 播放列表 list为数组，存储播放的歌曲
  [types.SET_PLAYLIST] (state, list) {
    state.playlist = list
  },
  // 顺序播放 list为数组，存储播放的歌曲
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  // 播放模式
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  // 当前播放歌曲的索引值 index为索引值
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  // 更改歌单信息
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  // 更改热门推荐歌曲
  [types.SET_TOP_LIST] (state, topList) {
    state.topList = topList
  },
  // 更改搜索关键字歌曲
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchHistory = history
  },
  // 更改播放历史歌曲
  [types.SET_PLAY_HISTORY] (state, history) {
    state.playHistory = history
  },
  // 更改喜欢列表歌曲
  [types.SET_FAVORITE_LIST] (state, list) {
    state.favoriteList = list
  }
}

export default mutations
