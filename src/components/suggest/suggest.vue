<!-- 搜索建议页列表组件 -->
<template>
  <scroll class="suggest" ref="suggest" :data="result" @beforeScroll="listScroll" :beforeScroll="beforeScroll" :pullup="pullup" @scrollToEnd="searchMore">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" @click="selectItem(item)" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>

        <div class="name">
          <p class="text" v-html="getSingernameOrSongname(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { search } from 'api/search'
import { createSong1 } from 'common/js/song'
import Singer from 'common/js/singer'
import {ERR_OK} from 'api/config'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import {mapMutations, mapActions} from 'vuex'
const TYPE_SINGER = 'singer'
export default {
  components: {
    Scroll,
    Loading,
    NoResult
  },
  data () {
    return {
      // 当前检索页数，用于下拉加载
      page: 1,
      // 每一页的数量
      perpage: 20,
      // 接受检索结果
      result: [],
      // 标志位。是否加载完
      hasMore: true,
      beforeScroll: true,
      pullup: true
    }
  },
  props: {
    // 接受的检索值
    query: {
      type: String,
      default: ''
    },
    // 是否显示歌手
    zhida: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    query (newVal) {
      this.search()
    }
  },
  methods: {
    refresh () {
      this.$refs.suggest.refresh()
    },
    // 监听列表有滚动
    listScroll () {
      this.$emit('listScroll')
    },
    search () {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.perpage, this.zhida).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data)
          // console.log(this._formatSearch(res.data))
          this.result = this._formatSearch(res.data)
          this._checkMore(res.data)
          // console.log(this.result)
        }
      })
    },
    // 重组 res.data 数据
    _formatSearch (data) {
      let ret = []
      if (data.zhida && data.zhida.zhida_singer) {
        // 解构赋值
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    // 格式化歌手信息
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        if (item.songid && item.albummid) {
          ret.push(createSong1(item))
        }
        // ret.push(createSong2(item))
      })
      return ret
    },
    // 获取 icon class 图标样式
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getSingernameOrSongname (item) {
      if (item.type === TYPE_SINGER) {
        return item.zhida_singer.singerName
        // return this.query
      } else {
        return `${item.name}-${item.singer}`
      }
      // return `${item.name}-${item.singer}`
    },
    // 路由跳转逻辑
    selectItem (item) {
      console.log(item)
      if (item.type === TYPE_SINGER) {
        let singer = new Singer({
          id: item.zhida_singer.singerMID,
          name: item.zhida_singer.singerName
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      // 父组件为search.vue
      this.$emit('select', item)
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.zhida, this.perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._formatSearch(res.data))
          this._checkMore(res.data)
        }
      })
    },
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * this.perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
