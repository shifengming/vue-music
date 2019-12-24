<template>
    <div class="search-list">
      <ul>
        <li @click="selectItem(item)" v-for="(item, index) in searches" :key="index" class="search-item">
          <span class="text">{{item}}</span>
          <!--子元素中有点击事件要用stop防止点击事件冒泡-->
          <span class="icon" @click.stop="deleteOne(item)">
            <i class="icon-delete"></i>
          </span>
        </li>
      </ul>
    </div>
</template>

<script>
export default {
  name: 'search-list',
  props: {
    searches: {
      type: Array,
      default: null
    }
  },
  methods: {
    // 注意：基础组件不会写太多的逻辑
    selectItem (item) {
      this.$emit('select', item)
    },
    deleteOne (item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
