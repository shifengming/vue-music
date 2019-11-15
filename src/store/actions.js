import * as types from './mutation-types'

export const selectPlay = function ({commit,state},{list,index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAYLIST,list)
    //就是我们点的第几首歌
    commit(types.SET_CURRENT_INDEX,index)
    //播放器打开，默认为true
    commit(types.SET_FULL_SCREEN,true)
    //播放状态 true
    commit(types.SET_PLAYING_STATE,true)
}