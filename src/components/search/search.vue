<!-- 搜索页组件 -->
<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll ref="shortcut" class="shortcut" :data="shortcut">
        <div>
          <!-- 热门搜索 -->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <!-- <div class="item special">{{ hotkey.special_key }}</div> -->
            <ul>
              <li class="item" v-for="(item,index) in hotkey" @click="addQuery(item.k)" :key="index">
                <span>{{ item.k }}</span>
              </li>
            </ul>
          </div>
          <!--搜索历史-->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <!--<span class="clear" @click="clearSearchHistory">-->
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest @select="saveSearch" ref="suggest" @listScroll="blurInput" :query="query" :zhida="zhida"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import SearchList from 'base/search-list/search-list'
import Suggest from 'components/suggest/suggest'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import { getHotKey } from 'api/search'
import {mapActions, mapGetters} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  components: {
    SearchBox,
    Suggest,
    Scroll,
    SearchList,
    Confirm
  },
  data () {
    return {
      // 热门搜索关键系
      hotkey: [],
      // 搜索字段 (my-search-box -> my-search -> my-suggest-List)
      query: '',
      // 是否显示歌手
      zhida: true
    }
  },
  computed: {
    shortcut () {
      return this.hotkey.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  props: {},
  filters: {},
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()

      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
    // 删除所有的搜索记录
    // deleteAll () {
    //   this.clearSearchHistory()
    // },
    // deleteSearchHistory (item) {
    //   this.deleteSearchHistory(item)
    // },
    // 保存搜索结果
    showConfirm () {
      this.$refs.confirm.show()
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    // 使输入框去掉焦点
    blurInput () {
      this.$refs.searchBox.blur()
    },
    // 当检索值改变时
    onQueryChange (query) {
      this.query = query
    },
    // 点击将搜索记录放入到搜索框中
    addQuery (k) {
      this.$refs.searchBox.setQuery(k)
    },
    // 获取热搜索数据
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === 0) {
          // console.log(res.data.hotkey)
          this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    // 保存搜索结果
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  created () {
    this._getHotKey()
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
