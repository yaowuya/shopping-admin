import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login'),
    hidden: true
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: () => import('@/layout'),
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/dashboard'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/good',
    component: Layout,
    redirect: '/good/category',
    name: 'Good',
    meta: { title: '商品管理', icon: 'example' },
    children: [
      {
        path: '/category',
        name: 'category',
        component: () => import('@/views/goods/category'),
        meta: { title: '商品分类' }
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import('@/views/goods/goods'),
        meta: { title: '商品列表' }
      }
    ]
  }, {
    path: '/auth',
    component: Layout,
    redirect: '/auth/user',
    name: 'Auth',
    meta: { title: '权限管理', icon: 'lock' },
    children: [
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/user/user'),
        meta: { title: '用户管理' }
      },
      {
        path: '/role',
        name: 'role',
        component: () => import('@/views/user/role'),
        meta: { title: '角色管理' }
      },
      {
        path: '/menus',
        name: 'menus',
        component: () => import('@/views/user/menus'),
        meta: { title: '菜单管理' }
      },
      {
        path: '/userrole',
        name: 'userrole',
        component: () => import('@/views/user/userrole'),
        meta: { title: '用户角色管理' }
      },
      {
        path: '/rolemenu',
        name: 'rolemenu',
        component: () => import('@/views/user/rolemenu'),
        meta: { title: '角色菜单管理' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
