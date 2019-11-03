<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail, getMusic} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  name: 'singer-detail',
  data () {
    return {
      songs: []
    }
  },
  // 计算属性
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    // console.log(this.singer)
    this._getDetail()
  },
  methods: {
    _getDetail () {
      // 在歌曲列表详情页刷新时，跳回歌手列表页面
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      // 获取歌曲列表的接口
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res)
          this.songs = this._normallizeSongs(res.data.list)
          // console.log(this.songs)
        }
      })
    },
    _normallizeSongs (list) {
      let ret = []
      // 遍历之前要检查list是否存在，不然会报错：Cannot read property 'forEach' of underfined
      if (!list) {
        return
      }
      list.forEach((item) => {
        // 对象的结构赋值
        let {musicData} = item
        // if (musicData.songid && musicData.albummid) {
        //   ret.push(createSong(musicData))
        // }
        if (musicData.songid && musicData.albummid) {
          getMusic(musicData.songmid).then(res => {
            // console.log(res)
            if (res.code === ERR_OK) {
              const svkey = res.data.items
              const songVkey = svkey[0].vkey
              const newSong = createSong(musicData, songVkey)
              ret.push(newSong)
            }
          })
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
  .slider-enter-active, .slider-leave-active
    transition: all 0.5s
  .slider-enter, .slider-leave-to
    transform: translate3d(100%, 0, 0)
</style>
