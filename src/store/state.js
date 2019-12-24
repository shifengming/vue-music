import {playMode} from 'common/js/config'
import {loadSearch, loadFavorite, loadPlay} from 'common/js/cache'

const state = {
  singer: {}, // 歌手信息
  playing: false, // 是否播放
  fullScreen: false, // 是否全屏
  playlist: [], // 播放列表，前进后退，说明歌曲是一个列表
  sequenceList: [], // 播放顺序
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放的是那一首歌，前进后退就会修改这个index值
  disc: {}, // 歌单信息
  topList: {}, // 热门推荐歌曲信息
  searchHistory: loadSearch(), // 搜索关键字历史
  favoriteList: loadFavorite(), // 喜欢列表
  playHistory: loadPlay() // 播放历史
}

export default state
