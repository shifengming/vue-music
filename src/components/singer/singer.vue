<template>
    <div class="singer" ref="singer">
        <!-- <list-view @select="selectSinger" :data="singers"></list-view> -->
        <router-view></router-view>
    </div>
</template>
<script>
    import {getSingerList} from 'api/singer'
    import {ERR_OK} from 'api/config'
    import Singer from 'common/js/singer'
    import ListView from 'base/listview/listview'
    import {mapMutations} from 'vuex'

    const HOT_NAME = '热门'
    const HOT_SINGER_LEN = 10//热门数据10条
    export default {
        name: 'singer',
        data() {
            return{
                singers: []
            }
        },
        created(){
            this._getSingerList()
        },
        methods:{
            _getSingerList(){
                getSingerList().then((res) => {
                    console.log(res)
                    if(res.code === ERR_OK){
                        // this.singers = this._normalizeSinger(res.data.list)
                    }
                })
            },
            //vue的编程式开发
            selectSinger(singer){
                this.$router.push({
                    path: `/singer/${singer.id}`
                })
                this.setSinger(singer)
                },
                //规范歌手
            _normalizeSinger(list){
                let map ={
                    hot: {//热门数据
                        title: HOT_NAME,
                        items: []
                    }
                }
                // 整个数据的前十条为热门数据
                list.forEach((item, index) => {
                    if(index < HOT_SINGER_LEN){
                        map.hot.items.push(new Singer({
                            id: item.Fsinger.mid,
                            name: item.Fsinger_name
                        }))
                    }
                    //通过Findex进行聚类
                    const key = item.Findex
                    //判断map中有没这个key
                    if(!map[key]){
                        map[key] = {
                            title: key,
                            items: []
                        }
                    }
                    map[key].item.push(new Singer({
                        id: item.Fsinger.mid,
                        name: item.Fsinger_name
                    }))
                });
                //为了得到有序列表，我们需要处理map
                let ret = [] // 字母A-Z
                let hot = [] // 热门
                for (let key in map) {
                    let val = map[key]
                    if (val.title.match(/[a-zA-Z]/)) {
                    ret.push(val)
                    } else if (val.title === HOT_NAME) {
                    hot.push(val)
                    }
                }
                //对ret按字母的升序进行排列
                ret.sort((a,b) => {
                    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                })
                return hot.concat(ret)
            },
             ...mapMutations({
                setSinger: 'SET_SINGER'
            })
        },
        components:{
            ListView
        }
    }

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    .singer
      position: fixed
      top: 88px
      bottom: 0
      width: 100%
</style>
