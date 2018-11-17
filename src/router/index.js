import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/users/Users'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/rights/Roles'
import Categories from '@/components/categories/Categories.vue'
import Goods from '@/components/categories/Goods'
import Params from '@/components/categories/Params'
import Orders from '@/components/orders/Orders'
import Reports from '@/components/reports/Reports'
import Add from '@/components/categories/Add'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Categories },
        { path: '/goods', component: Goods },
        { path: '/params', component: Params },
        { path: '/orders', component: Orders },
        { path: '/reports', component: Reports },
        { path: '/goods-add', component: Add }
      ]
    }
  ]
})
// 注册全局导航守卫拦截
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})

export default router
