import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home }
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
