import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
import { reject } from 'q'

export default class Song {
    constructor({id,mid,singer,name,album,duration,image,url}){
        //做这些初始化，绑定到当前实例对象上
        //把这里设置为类有两大好处，可以把代码集中到一个地方维护，不需要在大量的地方去写代码，类的扩展性要比对象强很多，而且它是一种面向对象的编程方式

        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }
    getLyric(){
        if(this.lyric){
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve, reject)=>{
            getLyric(this.mid).then((res) => {
                if(res.retcode === ERR_OK){
                    this.lyric = Base64.decode(res.lyric)
                    // console.log(this.lyric)
                    resolve(this.lyric)
                }else{
                    reject('no lyric')
                }
            })
        })
    }
}
//扩展一个方法
export function createSong(musicData, songVkey){
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${songVkey}&guid=1849502645&fromtag=66`

    })
}
function filterSinger(singer){
    let ret = []
    if(!singer){
        return ''
    }
    singer.forEach((s)=>{
        ret.push(s.name)
    })
    return ret.join('/')
}
