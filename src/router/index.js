import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: '登录页',
    component: () => import('@/views/Login')
  },
  {
    path: '*',
    name: '主页面',
    redirect: '/earth'
    // component: () => import('@/components/EarthBox')
  },
  {
    path: '/earth',
    name: '主页面',
    component: () => import('@/views/Earth/EarthBox')
  }
]

const router = new Router({
  routes
})

export default router
