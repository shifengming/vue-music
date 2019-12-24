<template>
    <div class="no-result">
        <div class="no-result-icon"></div>
        <p class="no-result-text">{{title}}</p>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'no-result',
        props:{
            title:{
                type: String,
                default: ''
            }
        }
    }
</script>
<style scoped lang="stylus" ref="stylesheet/stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"

    .no-result
      text-align:center
      .no-result-icon
        width: 86px
        height: 98px
        margin: 0 auto
        bg-image('no-result')
        background-size: 86px 90px
      .no-result-text
        margin-top: 30px
        font-size: $font-size-medium
        color: $color-text-d

</style>