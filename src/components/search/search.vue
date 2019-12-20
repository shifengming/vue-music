<!--搜索页组件-->
<template>
    <div class="search">
      <!-- 搜索框 -->
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
            <Scroll class="shortcut" ref="shortcut" :data="shortcut">
              <div>
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                      <li @click="addQuery(item.k)" class="item" v-for="(item,index) in hotkey" :key="index">
                        <span>{{ item.k }}</span>
                      </li>
                    </ul>
                </div>
                <div class="search-history" v-show="searchHistory.length">
                  <h1 class="title">
                    <span class="text">搜索历史</span>
                    <span class="clear" @click="showConfirm">
                      <i class="icon-clear"></i>
                    </span>
                  </h1>
                  <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
                </div>
              </div>
            </Scroll>
        </div>
        <div ref="searchResult" class="search-result" v-show="query">
          <suggest ref="suggest" @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
        </div>
        <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
        <router-view></router-view>
    </div>
</template>
<script type="text/ecmascript-6">
    import SearchBox from 'base/search-box/search-box'
    import {getHotKey} from 'api/search'
    import {ERR_OK} from 'api/config'
    import Suggest from 'components/suggest/suggest'
    import SearchList from 'base/search-list/search-list'
    import Confirm from 'base/confirm/confirm'
    import Scroll from 'base/scroll/scroll'
    import {mapActions, mapGetters} from 'vuex'
    import {playlistMixin} from 'common/js/mixin'

    export default {
        mixins: [playlistMixin],
        created () {
          this._getHotKey()
        },
        data(){
          return {
            hotkey: [],
            query: ''
          }
        },
        computed:{
          shortcut(){
            return this.hotkey.concat(this.searchHistory)
          },
          ...mapGetters([
            'searchHistory'
          ])
        },
        methods:{
          handlePlaylist(playlist){
            const bottom = playlist.length > 0 ? '60px' : ''

            this.$refs.shortcutWrapper.style.bottom = bottom
            this.$refs.shortcut.refresh()

            this.$refs.searchResult.style.bottom = bottom
            this.$refs.suggest.refresh()
          },
          addQuery(query){
            this.$refs.searchBox.setQuery(query)
          },
          onQueryChange(query){
            this.query = query
          },
          saveSearch(){
            this.saveSearchHistory(this.query)
          },
          showConfirm(){
            this.$refs.confirm.show()
          },
          blurInput(){
            this.$refs.searchBox.blur()
          },
          _getHotKey () {
            getHotKey().then((res) => {
              if (res.code === 0) {
                // console.log(res.data.hotkey)
                this.hotkey = res.data.hotkey.slice(0, 10)
              }
            })
        },
        ...mapActions([
          'saveSearchHistory',
          'deleteSearchHistory',
          'clearSearchHistory'
        ])
        },
        watch:{
          query(newQuery){
            if(!newQuery){
              setTimeout(() => {
                this.$refs.shortcut.refresh()
              },20)
            }
          }
        },
        components:{
            SearchBox,
            Suggest,
            SearchList,
            Confirm,
            Scroll
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