import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  // Promise 封装
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        // console.log(res)
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}
export class Singer {
  constructor ({singer, name}) {
    this.singer = singer
    this.name = name
  }
}
export function createSong1 (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filerSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // 歌源url
    // url: `http://thirdparty.gtimg.com/C100${musicData.songmid}.m4a?fromtag=38`
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}/${musicData.songid}.m4a?guid=263427534&fromtag=66`
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    url: `http://ws.stream.qqmusic.qq.com/C100/${musicData.songid}.m4a?fromtag=0&guid=126548448`
  })
}
export function createSong2 (musicData) {
  return new Singer({
    mid: musicData.singerMID,
    singer: musicData.fsinger,
    name: musicData.fsong
  })
}
export function createSong (musicData, songVkey) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filerSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // 歌源url
    // url: `http://thirdparty.gtimg.com/C100${musicData.songmid}.m4a?fromtag=38`
    url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${songVkey}&guid=1849502645&fromtag=66`
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    // url: `http://ws.stream.qqmusic.qq.com/C100/${musicData.songid}.m4a?fromtag=0&guid=126548448`
  })
}
function filerSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
