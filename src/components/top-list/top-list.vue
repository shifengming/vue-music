<template>
    <transition name="slide">
      <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {createSong} from 'common/js/song'
import {getMusic} from 'api/singer'

export default {
  name: 'top-list',
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  created () {
    this._getMusicList()
  },
  methods: {
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res)
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        // console.log(musicData)
        // if (musicData.songid && musicData.albummid) {
        //   ret.push(createSong(musicData))
        // }
        getMusic(musicData.songmid).then(res => {
          // console.log(res)
          if (res.code === ERR_OK) {
            const svkey = res.data.items
            const songVkey = svkey[0].vkey
            const newSong = createSong(musicData, songVkey)
            ret.push(newSong)
          }
        })
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
