<template>
  <div>
    <ele-header :seller="seller"></ele-header>
    <div class="tab">
      <div class="tab-item">
        <a v-link="{path: '/goods'}">商品</a>
      </div>
      <div class="tab-item">
        <a v-link="{path: '/ratings'}">评价</a>
      </div>
      <div class="tab-item">
        <a v-link="{path: '/seller'}">商家</a>
      </div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>
<script>
  import header from './components/header/header.vue'

  export default {
    data () {
      return {
        seller: {}
      }
    },
    // 发送ajax请求
    created () {
      // 发送ajax请求（mockjs提供的接口）
      this.$http.get('/api2/seller')
        .then(response => {
//          console.log(response.body)
          const result = response.body
          if (result.code === 0) {
            this.seller = result.data
          }
        })
      // 发送ajax请求(express提供的接口)
      this.$http.get('/api/seller')
        .then(response => {
//          console.log(response.body)
        })
    },
    components: {
      'ele-header': header
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixins.styl'
  .tab
    display flex
    height 40px
    line-height 40px
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      /*display inline-block*/
      flex-grow 1
      text-align center
      font-size 14px
      color rgb(77,85,93)
      a
        display block
        &.v-link-active
          color red
</style>
