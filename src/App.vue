<template>
  <div id="app">
    <!--头部部分-->
    <m-header></m-header>
    <!--中间选项卡部分-->
    <tab></tab>
    <!--DOM缓存到内存中-->
    <keep-alive>
      <!--页面路由跳转后信息显示的位置-->
      <router-view></router-view>
    </keep-alive>
    <!--应用相关的播放器-->
    <player></player>

  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
