import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

function findIndex(list,song){
    return list.findIndex((item)=>{
        return item.id === song.id
    })
}

export const selectPlay = function ({commit,state},{list,index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    if(state.mode == playMode.random){
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST,randomList)
        index = findIndex(randomList,list[index])
    }else{
        commit(types.SET_PLAYLIST,list)
    }
    //就是我们点的第几首歌
    commit(types.SET_CURRENT_INDEX,index)
    //播放器打开，默认为true
    commit(types.SET_FULL_SCREEN,true)
    //播放状态 true
    commit(types.SET_PLAYING_STATE,true)
}

export const randomPlay = function({commit},{list}){
    commit(types.SET_PLAY_MODE,playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST,randomList)
    commit(types.SET_CURRENT_INDEX,0)
    //播放器打开，默认为true
    commit(types.SET_FULL_SCREEN,true)
    //播放状态 true
    commit(types.SET_PLAYING_STATE,true)
}
