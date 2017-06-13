<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟到达</div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="supports_count" v-if="seller.supports" @click="showDetail(true)">
        <span class="count">{{seller.supports.length}}个</span>
        <span class="icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail(true)">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">
        {{seller.bulletin}}
      </span>
      <span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="background">
      <img :src="seller.avatar">
    </div>

    <div class="detail" v-show="detailShow" transition="fade">
      <div class="detail-wrapper">
        <div class="detail-main clearfix">
          <div class="name">{{seller.name}}</div>
          <div class="star-wrapper">
            <star :score="seller.score" :size="48"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul class="supports" v-if="seller.supports">
            <li class="support" v-for="support in seller.supports">
              <span class="icon" :class="classMap[support.type]"></span>
              <span class="text">{{support.description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="content">
            <p>{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="showDetail(false)">
        <span class="icon-close"></span>
      </div>
    </div>
  </div>
</template>
<script>
  import star from '../star/star.vue'

  export default {
    props: ['seller'],

    data () {
      return {
        detailShow: false
      }
    },

    created () {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    },

    methods: {
      showDetail (show) {
        this.detailShow = show
      }
    },

    components: {
      star
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixins.styl'
  .header
    background-color rgba(7,17,27,0.5)
    position relative
    color reb(255,255,255)
    overflow hidden
    .content-wrapper
      padding 24px 12px 18px 24px
      font-size 0
      position relative
      .avatar
        display inline-block
        width 64px
        height 64px
        img
          width 100%
          height 100%
          vertical-align middle
      .content
        display inline-block
        margin-left 16px
        vertical-align middle
        .brand
          bg-image(brand, 30px, 18px)
        .name
          margin-left 8px
          margin-top 2px
          font-size 16px
          color rgb(255,255,255)
          font-weight bold
          line-height 18px
          vertical-align middle

        .description
          margin-top 8px
          font-size 12px
          color rgb(255,255,255)
          font-weight 200
          line-height 12px
        .support
          margin-top 10px
          margin-bottom 2px
          .text
            font-size 10px
            color rgb(255,255,255)
            font-weight 200
            vertical-align middle
            margin-left 4px
          .discount
            bg-image(discount_1, 12px, 12px)
          .decrease
            bg-image(decrease_1, 12px, 12px)
          .guarantee
            bg-image(guarantee_1, 12px, 12px)
          .invoice
            bg-image(invoice_1, 12px, 12px)
          .special
            bg-image(special_1, 12px, 12px)
      .supports_count
        padding 7px 8px
        background: rgba(0,0,0,0.2)
        position absolute
        bottom 18px
        right 12px
        border-radius 10px
        .count
          font-size 10px
          color rgb(255,255,255)
          font-weight 200
          line-height 12px
          margin 7px 2px 7px 8px
        .icon-keyboard_arrow_right
          font-size 10px
          color rgb(255,255,255)

    .bulletin-wrapper
      height 28px
      padding 0 12px
      background rgba(7,17,27,0.2)
      color rgb(255,255,255)
      line-height 28px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      position relative
      .bulletin-title
        bg-image(bulletin, 22px, 12px)
      .bulletin-text
        font-size 10px
        font-weight 200
        vertical-align middle
      .icon-keyboard_arrow_right
        position absolute
        top 8px
        right 0

    .background
      width 100%
      height 100%
      position absolute
      top 0
      left 0
      z-index -1
      &>img
        width 100%
        height 100%
        filter blur(10px)


    .detail
      position fixed
      top 0
      right 0
      bottom 0
      left 0
      width 100%
      height 100%
      background-color rgba(7,17,27,0.8)
      blur 10px
      z-index 996
      /*display none*/
      &.fade-transition
        transition: opacity .3s linear
        opacity: 1
      &.fade-enter, &.fade-leave
        opacity: 0
      .detail-wrapper
        min-height 100%
        .detail-main
          padding 64px 36px
        .name
          font-size 16px
          font-weight 700
          color rgb(255,255,255)
          line-height 16px
          text-align center

        .star-wrapper
          margin-top 16px
          height 24px
          line-height 24px
          text-align center


        .title
          margin-top 28px
          display flex
          .line
            flex 1
            width 112px
            height 2px
            background: rgba(255,255,255,0.2)
            margin-top 7px
          .text
            padding 0 12px
            font-size 14px
            font-weight 700
            color rgb(255,255,255)
            line-height 14px


        .supports
          padding 24px 12px 0
          .support
            height 16px
            font-size 12px
            font-weight 200
            color rgb(255,255,255)
            line-height 12px
            margin-top 12px
            margin-left 6px
            .text
              vertical-align middle
              margin-left 3px
            .decrease
              bg-image(decrease_2, 14px, 14px)
            .discount
              bg-image(discount_2, 14px, 14px)
            .guarantee
              bg-image(guarantee_2, 14px, 14px)
            .invoice
              bg-image(invoice_2, 14px, 14px)
            .special
              bg-image(special_2, 14px, 14px)
        .content
          padding 24px 12px 0
          font-size 12px
          font-weight 200
          color rgb(255,255,255)
          line-height 24px

      .detail-close
        margin-top -64px
        font-size 32px
        width 100%
        height 32px
        color rgba(255,255,255.0.5)
        text-align center




</style>
