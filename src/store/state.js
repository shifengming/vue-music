//state只保留一些最基础的数据，通过这些基础数据计算而来的，都不放在state里面，放getters
import {playMode} from "common/js/config"
const state = {
    singer:{},
    //播放器默认为false
    playing: false,
    //默认全屏false
    fullScreen: false,
    //歌曲播放列表
    playlist: [],
    //顺序列表
    sequenceList:[],
    //播放模式,默认顺序播放(sequence)
    mode: playMode.sequence,
    //当前播放的一个索引(比如当前播放的是哪首歌)
    currentIndex: -1
}
export default state
