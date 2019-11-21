<template>
    <transition name="slide">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {getSongList} from 'api/recommend' // 获取歌单列表
import {mapGetters} from 'vuex'
// import {createSong1} from 'common/js/song'
export default {
  name: 'disc',
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    }
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      // 如果没有发现dissid就回退到上一个路由
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then((res) => {
        // console.log(res)
        if (res.code === 0) {
          // console.log(res.cdlist[0].songlist)
          this.songs = res.cdlist[0].songlist
          // console.log(this.songs)
        }
      })
    }
    // _normalizeSongs (list) {
    //   let ret = []
    //   list.forEach((musicData) => {
    //     console.log(musicData)
    //     if (musicData.songid && musicData.albummid) {
    //       ret.push(createSong1(musicData))
    //     }
    //   })
    //   return ret
    // }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
