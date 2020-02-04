import { constantRoutes } from '../router/index'

export function routerFormat (menus) {
  // 404路由
  const notFoundRoutes = [
    { path: '*', redirect: '/404', hidden: true }
  ]

  const menuList = rFormat(menus)
  const routes = menuList.concat(notFoundRoutes)
  let croute = constantRoutes
  const formatRoute = croute.concat(routes)
  return formatRoute
  // const globalRoutes = constantRoutes.concat(routes)
  // router.options.routes = globalRoutes
  // router.addRoutes(routes)
  // console.log(router)
  // router.push({ path: '/' })
}

export function rFormat (menus) {
// 初始化路由信息对象
  const menusMap = []
  menus.map(v => {
    let { path, name, component, redirect, hidden, icon, title, children } = v
    if (children && children.length > 0) {
      children = rFormat(children)
    }
    let item
    if (component === 'layout') {
      item = {
        path,
        name,
        component: () => import('@/layout'),
        redirect,
        hidden: hidden,
        meta: { title: title, icon: icon },
        children: children
      }
    } else {
      item = {
        path,
        name,
        component: () => import(`@/views/${component}`),
        redirect,
        hidden: hidden,
        meta: { title: title, icon: icon },
        children: children
      }
    }

    menusMap.push(item)
  })
  return menusMap
}
