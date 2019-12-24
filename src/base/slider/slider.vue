<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{'active': currentPageIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script>
import {addClass} from 'common/js/dom'
import BScroll from 'better-scroll'

export default {
  name: 'slider',
  props: {
    loop: { // 循环轮播
      type: Boolean,
      default: true
    },
    autoPlay: { // 自动轮播
      type: Boolean,
      default: true
    },
    interval: { // 轮播的间隔
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dots: [], // 小圆点
      currentPageIndex: 0 // 当前第几页
    }
  },
  mounted () {
    // 注意：浏览器通常刷新是17ms一次，this.$nextTick() 或者是setTimeout()
    setTimeout(() => {
      this._setSliderWidth() // 设置ul轮播的宽度
      this._initDots()
      this._initSlider() // 初始化轮播

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    // 解决改变窗口大小，图片宽度还没变
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  activated () {
    if (this.autoPlay) {
      this._play()
    }
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    // 设置ul的宽度
    _setSliderWidth (isResize) {
      // 获取ul下子元素li
      this.children = this.$refs.sliderGroup.children
      let width = 0 // 初始化总的ul宽度
      // 获取屏幕的宽度(由图片撑开)
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 水平滚动
        scrollY: false, // 垂直滚动
        momentum: false, // 当快速在屏幕滑动一段距离的时候，会根据滑动的距离和时间计算出动量，并生成滚动动画，默认为true，则开启动画
        snap: true, // 这个配置是为了做Slide组件用的，默认为false
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400
        // click: true 如果加上手机端不能点击
      })

      // scrollEnd{Object} {x,y} 滚动结束的位置坐标；触发时机：滚动结束
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        // if (this.loop) {
        //   pageIndex -= 1
        // }
        this.currentPageIndex = pageIndex
        // 因为setTimeout()只会执行一次，所有在scrollEnd一张结束后重新调用
        if (this.autoPlay) {
          // 解决防止手滑动，所有每次滑动都要clearTimeout下
          clearTimeout(this.timer)
          this._play()
        }
      })
      this.slider.on('beforeScrollerStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _play () {
      let pageIndex = this.currentPageIndex + 1
      // if (this.loop) {
      //   pageIndex += 1
      // }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
