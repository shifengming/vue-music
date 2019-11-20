<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
      <div class="bar-inner">
        <!--整个进度条-->
        <div class="progress" ref="progress"></div>
        <!--注意：在操作进度条上小球的移动时候要禁止浏览器的默认行为prevent-->
        <div class="progress-btn-wrapper" ref="progressBtn"
             @touchstart.prevent="progressTouchStart"
             @touchmove.prevent="progressTouchMove"
             @touchend.prevent="progressTouchEnd"
        >
          <!--进度条当前的位置-->
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'
// 进度条上小球的宽度
const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  name: 'progress-bar',
  props: {
    percent: { // 进度条的百分比
      type: Number,
      default: 0
    }
  },
  created () {
    // 移动小球时下面三个时间可以将内容挂载到touch对象上
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true // 表示小球已经初始化了
      this.touch.startX = e.touches[0].pageX // 记录手指点击小球后第一个横向坐标
      this.touch.left = this.$refs.progress.clientWidth // 记录小球已经在进度条上滚动距离坐标的长度
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX // 记录小球被拉了多长
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      this.touch.initiated = false // 移动小球结束后将初始化数据变为false
      this._triggerPercent()
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    },
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left // e.pageX是获取小球到浏览器边缘的距离，getBoundingClientRect是进度条最左边到浏览器边缘的距离
      this._offset(offsetWidth)
      // 这里当我们点击progressBtn的时候，e.offsetX获取不对
      // this._offset(e.offsetX)
      this._triggerPercent()
    }
  },
  watch: {
    // 监测外面传来的百分比
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        // 整个进度条的宽度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 小球在进度条上向左偏移的长度
        const offsetWidth = newPercent * barWidth
        // this.$refs.progress.style.width = `${offsetWidth}px`
        // this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "~common/stylus/variable"
.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>
