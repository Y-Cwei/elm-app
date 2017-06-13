<template>
  <div class="goods">
    <div class="menu-wrapper" v-el:menu-wrapper>
      <ul>
        <!--current代表当前选中的-->
        <li class="menu-item" :class="{current:currentIndex===$index}"
            @click="clickMenu($index, $event)" v-for="good in goods">
          <span class="text border-1px">
            <span class="icon" v-show="good.type>=0" :class="classMap[good.type]"></span>
            {{good.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li class="food-list food-list-hook" v-for="good in goods">
          <h1 class="title">{{good.name}}</h1>
          <ul>
            <li class="food-item border-1px" v-for="food in good.foods" @click="showFood(food)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}</span>
                </div>
                <div class="price">
                  <span class="now">{{food.price | currency '￥'}}</span>
                  <span class="old" style="display: none;">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food" :update-food-count="updateFoodCount"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <shop-cart :food-list="foodList" v-ref:shop-cart :update-food-count="updateFoodCount" :min-price="seller.minPrice"
               :delivery-price="seller.deliveryPrice" @clear="clearCart"></shop-cart>
  </div>
  <food :food="selectFood" v-ref:food :update-food-count="updateFoodCount"></food>
</template>
<script>
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  // 引入cartcontrol组件
  import cartControl from '../cartcontrol/cartcontrol.vue'
  import shopCart from '../shopcart/shopcart.vue'
  import food from '../food/food.vue'

  export default {
    props: ['seller'],

    data () {
      return {
        goods: [],
        scrollY: 0,
        tops: [],
        selectFood: {}
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      // 发送ajax请求
      this.$http.get('/api2/goods')
        .then(response => {
          const result = response.body
//          console.log(result)
          if (result.code === 0) {
            this.goods = result.data

            /* setTimeout(() => {
              this._initScroll()
            }, 200)*/

            // 将回调延迟到下次 DOM 更新循环之后执行
            this.$nextTick(() => {
              this._initScroll()
              this._initTops()
            })
          }
        })
    },

    methods: {
      _initScroll () {
        new BScroll(this.$els.menuWrapper, {
          click: true
        })
        this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
          click: true, // 是否派发 click 事件
          probeType: 3 // 实时派发scroll事件
        })

        // 监视goods列表的scroll
        this.foodsScroll.on('scroll', pos => {
          // console.log(pos.y)
          this.scrollY = -pos.y
//          console.log(this.scrollY)
        })
      },

      _initTops () {
        // 初始化tops
        var tops = this.tops
        // top初始值为 0
        var top = 0
        // 添加第一个top值
        tops.push(top)
        // 得到所有分类的li
        var lis = this.$els.foodsWrapper.getElementsByClassName('food-list-hook')
        // 将lis伪数组转化为真数组
        ;[].slice.call(lis).forEach(li => {
          top += li.clientHeight
          tops.push(top)
        })
//        console.log(tops)
      },

      clickMenu (index, event) {
        // 过滤掉pc系统的回调，保险
        if (!event._constructed) {
          return
        }
        var topY = -this.tops[index]
        this.foodsScroll.scrollTo(0, topY, 300)
      },

      // 定义一个更新数量的函数
      updateFoodCount (food, isAdd, event) {
        // 过滤系统的点击回调
        if (!event._constructed) {
          return
        }
        if (isAdd) {
          // 加
          if (!food.count) {
            // food.count = 1 // 新增的没有数据绑定，没有监视
            Vue.set(food, 'count', 1) // 有监视
          } else {
            food.count++
          }

          // 启动一个小球的动画,调用shopCart组件
          this.$refs.shopCart.drop(event.target)
        } else {
          // 减
          if (food.count) {
            food.count--
          }
        }
      },

      clearCart (foodList) {
        // 让所有购物车中所有 food 的 count 为 0
        foodList.forEach(food => {
          food.count = 0
        })
      },

      showFood (food) {
        // 指定当前选中的food
        this.selectFood = food
        // 显示当前的food: 找到组件对象调用他的方法
        this.$refs.food.showOrHide(true)
      }
    },

    computed: {
      // 计算当前分类的下标
      currentIndex () {
        // 判断，当top为0时向下拉仍然将current添加到左侧热销榜
        // 如果没有判断，向下拉时没有li会有current属性
        if (this.scrollY < 0) {
          return 0
        }
        return this.tops.findIndex((top, index) => {
          // 如果返回true,结果就为对应的index
          return this.scrollY >= top && this.scrollY < this.tops[index + 1]
        })
      },

      foodList () {
        const foods = []
        this.goods.forEach(good => {
          good.foods.forEach(food => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },

    components: {
      cartControl,
      shopCart,
      food
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image2("decrease_3")
          &.discount
            bg-image2("discount_3")
          &.guarantee
            bg-image2("guarantee_3")
          &.invoice
            bg-image2("invoice_3")
          &.special
            bg-image2("special_3")
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
