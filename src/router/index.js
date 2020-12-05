import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home, redirect: '/welcome', children: [{ path: '/welcome', component: Welcome }, { path: '/users', component: Users }, { path: '/rights', component: Rights }, { path: '/roles', component: Roles }, { path: '/categories', component: Cate }, { path: '/params', component: Params }, { path: '/goods', component: GoodsList }, { path: '/goods/add', component: Add }, { path: '/orders', component: Order }] }
  ]
})

// 挂载路由导航守卫，to 表示将要访问的路径，from 表示从哪里来，next 是下一个要做的操作
router.beforeEach((to, from, next) => {
  // 直接放行
  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  // token 不存在，跳转登录界面
  if (!tokenStr) return next('/login')
  // token 存在，放行
  next()
})

export default router
