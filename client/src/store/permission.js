import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 檢查用戶是否有權限訪問該路由
 * @param {Array} userPermissions 用戶權限列表
 * @param {Object} route 路由對像
 */
function hasPermission(userPermissions, route) {
  console.log(route.meta)
  if (route.meta && route.meta.perms) {
    return userPermissions.some(perm => route.meta.perms.includes(perm))
  } else {
    return true
  }
}

/**
 * 遞歸過濾異步路由表
 * @param routes asyncRoutes
 * @param userPermissions 用戶權限
 */
export function filterAsyncRoutes(routes, userPermissions) {
  const res = []
  // console.log(routes)
  // console.log(userPermissions)

  routes.forEach((route) => {
    const tmp = { ...route }

    // 檢查是否有子路由有權限
    // const hasChildPermission =
    //   tmp.children && filterAsyncRoutes(tmp.children, userPermissions).length > 0

    // 如果當前路由有權限或者子路由有權限，都應該保留當前路由
    // if (hasPermission(userPermissions, tmp) || hasChildPermission) {
    if (hasPermission(userPermissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, userPermissions)
      }
      res.push(tmp)
    }
  })
  return res
}

export const usePermissionStore = defineStore('permission', {
  state: () => {
    return {
      routes: [],
      addRoutes: []
    }
  },
  actions: {
    /**
     * @method generateRoutes
     */
    generateRoutes(perms) {
      return new Promise((resolve) => {
        let accessedRoutes
        if (perms.includes('admin')) {
          // 如果是超級管理員，則返回所有異步路由
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(
          asyncRoutes,
          perms)
        }
        this.addRoutes = accessedRoutes
        this.routes = constantRoutes.concat(accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
})
