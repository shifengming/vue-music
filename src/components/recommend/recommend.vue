<template>
    <div class="recommend">
        <scroll ref="scroll" class="recommend-content" :data="discList">
          <div>
          <!-- 此处通过v-if来解决异步请求，等推荐请求到数据后再执行渲染下面轮播组件 -->
            <div v-if="recommends.length" class="slider-wrapper">
                <slider>
                    <div v-for="(item,index) in recommends" :key="index">
                        <a :href="item.linkUrl">
                            <img class="needsclick" @load="loadImage" :src="item.picUrl"/>
                        </a>
                    </div>
                </slider>
             </div>
            <div class="recommend-list">
                <h1 class="list-title">热门歌单推荐</h1>
                <ul>
                  <li @click="selectItem(item)" v-for="(item,index) in discList" :key="index" class="item">
                    <div class="icon">
                      <img width="60" height="60" v-lazy="item.imgurl" alt=""/>
                    </div>
                    <div class="text">
                      <h2 class="name" v-html="item.creator.name"></h2>
                      <h2 class="desc" v-html="item.dissname"></h2>
                    </div>
                  </li>
                </ul>
            </div>
          </div>
          <div class="loading-container" v-show="!discList.length">
            <loading></loading>
          </div>
        </scroll>
        <!-- 显示二级路由信息 -->
        <router-view></router-view>
    </div>
</template>
<script type="text/ecmascipt-6">
    import Loading from 'base/loading/loading'
    import Scroll from 'base/scroll/scroll'
    import Slider from 'base/slider/slider'
    import {getRecommend, getDiscList} from 'api/recommend'
    import {ERR_OK} from 'api/config'
    import {playlistMixin} from 'common/js/mixin'
    import {mapMutations} from  'vuex'

    export default {
  name: 'recommend',
  data () {
    return {
      recommends: [], // 轮播数据
      discList: [] // 歌单列表数据
    }
  },
  created () {
    // 获取推荐数据
    this._getRecommend()
    // 获取歌单信息
    // setTimeout(() => {
    //   this._getDiscList()
    // }, 1000)
    this._getDiscList()
  },
  methods: {
    selectItem (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      // 跳转路由时候改变歌单信息，将当前歌单信息传入
      this.setDisc(item)
    },
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    loadImage () {
      // 监听图片加载，只要加载一张就会刷新列表，解决列表刷不到底部
      if (!this.checkloaded) {
        this.checkloaded = true
        this.$refs.scroll.refresh()
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)

</style>