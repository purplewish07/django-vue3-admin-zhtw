import router from './router'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from './utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasPerms = userStore.perms && userStore.perms.length > 0
      // const addRoutes = permissionStore.addRoutes
      // if (addRoutes.length) {
      //   next()
      //   NProgress.done()
      // }
      if (hasPerms) {
        next()
      } else {
        try {
          await userStore.getInfo()
          const perms = userStore.perms
          // console.log(perms)
          const accessRoutes = await permissionStore.generateRoutes(perms)
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })
          next({ ...to, replace: true })
        } catch (error) {
          console.log(error)
          await userStore.resetToken()
          ElMessage.error(error.message || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
