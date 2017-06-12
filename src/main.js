import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import App from './App.vue'
import goods from './components/goods/goods.vue'
import ratings from './components/ratings/ratings.vue'
import seller from './components/seller/seller.vue'

import './common/stylus/fonts.styl'

// 引入mockjs定义的模拟接口模块,保证mockjs路由执行一遍
import './mock/mockServer'

// 声明使用 vue 的扩展插件
Vue.use(VueRouter)
// 声明使用VueResource插件
Vue.use(VueResource)

// 创建 router 对象
let router = new VueRouter({
  history: true
})

// 映射路由
router.map({
  '/goods': {
    component: goods
  },
  '/ratings': {
    component: ratings
  },
  '/seller': {
    component: seller
  }
})
// 启动路由
router.start(App, '#app')
// 请求默认路径
router.go('/goods')
