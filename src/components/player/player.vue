<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <!--大的播放器-->
      <div class="normal-player" v-show="fullScreen">
        <!--背景图片-->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!--顶部部分-->
        <div class="top">
          <!--左侧返回按钮-->
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <!--歌曲名称-->
          <h1 class="title" v-html="currentSong.name"></h1>
          <!--歌手-->
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!--中间部分-->
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <!--CD大图-->
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <!--歌词显示-->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <!--时间进度条-->
          <div class="progress-wrapper">
            <!--左侧时间-->
            <span class="time time-l">{{format(currentTime)}}</span>
            <!--中间进度条-->
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <!--右侧时间-->
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <!--点击切换播放模式-->
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"></i>
            </div>
            <!--上一首歌-->
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <!--暂停播放-->
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <!--下一首歌-->
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <!--点击显示播放列表的歌曲-->
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)" class="icon" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <!--mini播放器-->
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <!--mini左侧小图-->
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <!--歌曲名称-->
          <h2 class="name" v-html="currentSong.name"></h2>
          <!--歌手名称-->
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <!--子元素的点击会冒泡到父元素中-->
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime"
           @ended="end"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import Scroll from 'base/scroll/scroll'
import {shuffle} from 'common/js/util'
import Playlist from 'components/playlist/playlist'
import Lyric from 'lyric-parser'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  data () {
    return {
      songReady: false, // 歌曲是否加载完成（注意：防止我们快速点击上一曲下一曲产生的DOM报错）
      currentTime: 0, // 当前时间
      radius: 32, // mini图控制按钮的宽度
      currentLyric: null, // 当前歌曲的歌词
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  mounted () {
    console.log(this.$store.getters.currentSong)
  },
  // 计算属性
  computed: {
    // 点击切换播放模式
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    // 当歌曲播放状态是CD图旋转，点击暂停就取消旋转
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    // 大图暂停播放切换时图片的改变
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // mini图暂停播放切换时图片的改变
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    // 当按钮不能点击时候出现按钮样式的变化
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    // 百分比=当前歌曲播放时间除以整个歌曲时间（传个父组件）
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'currentIndex', // 当前播放歌曲的索引
      'fullScreen', // 是否全屏
      'currentSong', // 当前播放的歌曲
      'playlist', // 播放列表
      'playing', // 歌曲播放状态
      'mode', // 歌曲播放模式
      'sequenceList', // 顺序的歌曲列表
      'favoriteList'
    ])
  },
  created () {
    // 在create()钩子函数中添加属性是因为不需要添加getter和setter
    this.touch = {}
  },
  methods: {
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    // 点击返回上一页
    back () {
      this.setFullScreen(false)
    },
    // 从底部mini图点击打开大图
    open () {
      this.setFullScreen(true)
    },
    // 封装获取歌词的逻辑
    getLyric () {
      this.currentSong.getLyric().then((lyric) => {
        // console.log(lyric)
        if (this.currentSong.lyric !== lyric) {
          return
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    showPlaylist () {
      this.$refs.playlist.show()
    },
    // 点击切换模式
    changeMode () {
      const mode = (this.mode + 1) % 3 // 每点一次改变一下播放模式
      this.setPlayMode(mode) // 调用mutation中的方法来改变播放模式
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 在切换播放模式时，不能改变当前播放的歌曲
      this.resetCurrentIndex(list)
      // 改变模式了后就要重新触发mutation方法来改变歌曲列表
      this.setPlaylist(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      // 在播放列表中找到和当前播放歌曲的索引相同然后mutation方法来设置
      this.setCurrentIndex(index)
    },
    // 当滚动条上的小球发生变化的时候
    onProgressBarChange (percent) {
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      // 解决当拖动进度条时歌词跟着一起走
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // el是作用的那个元素，done是执行动画完成后执行done回调函数才能执行下面的函数
    enter (el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move', // 注册动画名称
        animation, // 执行动画
        presets: { // 预设置值
          duration: 400, // 动画执行时间
          easing: 'linear' // 动画执行的变化行为
        }
      })
      // 开启动画  作用于那个元素，动画名称，执行done回调函数执行下列函数
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      // 动画完成后销毁动画
      animations.unregisterAnimation('move')
      // CD元素上的动画也要销毁
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // 暂停播放歌曲
    togglePlaying () {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 当当前歌曲播放完了
    end () {
      // 判断当前播放模式是否是单曲循环
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 单曲循环
    loop () {
      // 将audio标签的当前时间currentTime设置为0进度条就会跑到最左边
      this.$refs.audio.currentTime = 0
      // 然后打开播放
      this.$refs.audio.play()
      this.setPlayingState(true)
      // 如果在单曲循环中再次播放时，就会出现歌词不会跳转到起始位置
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 下一首歌
    next () {
      // 如果歌曲没有加载好就不让执行下一首歌
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
        return
      } else {
        // 下一首索引值加1
        let index = this.currentIndex + 1
        // 顺序播放的情况
        if (index === this.playlist.length) {
          index = 0
        }
        // 调用mutation的方法
        this.setCurrentIndex(index)
        // 如果歌曲暂停时点击下一首歌要触发歌曲播放
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      // 点击下一首歌后将原先的状态变为false
      this.songReady = false
    },
    // 上一首歌
    prev () {
      // 如果歌曲没有加载好就不让执行上一首歌
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        // 调用mutation的方法
        this.setCurrentIndex(index)
        // 如果歌曲暂停时点击上一首歌要触发歌曲播放
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      // 点击下一首歌后将原先的状态变为false
      this.songReady = false
    },
    // 当歌曲加载完成后（才能点击下一首歌）
    ready () {
      this.songReady = true
      // 将当期播放的歌曲添加到播放历史中
      this.savePlayHistory(this.currentSong)
    },
    // 当歌曲加载出错时，网络不好，歌曲URL有问题等
    error () {
      this.songReady = true
    },
    // 表示歌曲当前播放的时间(可读写的属性)
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    // 时间格式化（将时间戳格式化）
    format (interval) {
      interval = interval | 0 // | 0表示向下取整（相当于Math.floor()）
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return `${minute}:${second}`
    },
    middleTouchStart (e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd () {
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.touch.initiated = false
    },
    // 补0函数（num表示一个数，m表示要显示几位数）
    _pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    // 获取想动画元素的位置
    _getPosAndScale () {
      const targetWidth = 40 // mini图的宽度
      const paddingLeft = 40 // mini图中心点离左侧浏览器的距离
      const paddingBottom = 30 // mini图中心点离底部浏览器的距离
      const paddingTop = 80 // 大图上边缘离浏览器的距离
      const width = window.innerWidth * 0.8 // 大图CD的宽度
      const scale = targetWidth / width // 从mini变为大图所需要的比例
      const x = -(window.innerWidth / 2 - paddingLeft) // mini图中心点到大图CD中心点的横坐标的值（小图到大图所以为-）
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom // mini图中心点到大图CD中心点的纵坐标的值
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN', // 改变mutation来改变是否是全屏（显示大图）
      setPlayingState: 'SET_PLAYING_STATE', // 改变mutation来改变是否播放
      setCurrentIndex: 'SET_CURRENT_INDEX', // 改变mutation来修改索引来改变当前歌曲
      setPlayMode: 'SET_PLAY_MODE', // 改变mutation来改变歌曲的播放模式
      setPlaylist: 'SET_PLAYLIST' // 改变mutation来改变歌曲列表
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList',
      'savePlayHistory'
    ])
  },
  watch: {
    // 监听当前歌曲的变化
    // 如果当前播放歌曲的id没变，下面的逻辑都不做
    currentSong (newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      // 防止在播放过程中连续点击切换歌曲时歌词在不停的跳动
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
      // this.$nextTick(() => {
      //   this.$refs.audio.play()
      //   this.getLyric()
      // })
    },
    // 监听歌曲播放的状态
    playing (newPlaying) {
      const audio = this.$refs.audio // 给audio缓存
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar, // 进度条
    ProgressCircle, // mini图中的圆圈
    Scroll,
    Playlist
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32) // 贝塞尔曲线
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
