import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/layout'
import { usePermissionStore } from '@/store/permission'
import exampleRouter from './modules/example'

/**
 * 當設置 true 的時候該路由不會在側邊欄出現 如401，login等頁面，或者如一些編輯頁面/edit/1
 * 
 * hidden: true
 * 
 * 當你一個路由下面的 children 聲明的路由大於1個時，自動會變成嵌套的模式--如組件頁面
 * 只有一個時，會將那個子路由當做根路由顯示在側邊欄--如引導頁面
 * 若你想不管路由下面的 children 聲明的個數都顯示你的根路由
 * 你可以設置 alwaysShow: true，這樣它就會忽略之前定義的規則，一直顯示根路由
 * 
 * alwaysShow: true
 * 
 * 因為路由的設計模式，只能當路由為目錄時，才可設置此選項，或者當當前路由只有一個菜單的時候，會自動生成外層目錄，如果設置了noRedirect，則不會在breadcrumb中重定向
 * 
 * redirect: 'noRedirect'
 * 
 * 用於退出登錄時清空動態添加的路由信息，路由的name字段必須為路由的文件名，緩存頁面時需要
 * 在 3.2.34 或以上的版本中，使用 <script setup> 的單文件組件會自動根據文件名生成對應的 name 選項，無需再頁面上手動聲明name。
 * name必須和你的文件名保持一致，否則會導致不緩存, 所以文件名不要使用index
 * 
 * name:'router-name'
 * 
 * meta : {
    設置該路由在側邊欄和麵包屑中展示的名字
    title: 'title' 
    
    設置該路由的圖標
    icon: 'menu'

    如果設置為true，則不會被 <keep-alive> 緩存(默認 true)
    noCache: true

    如果設置為true，它則會固定在tags-view中(默認 false, 只在經典佈局中展示)
    affix: false               

    如果設置為false，則不會在breadcrumb麵包屑中顯示(默認 true，只在經典佈局中展示)
    breadcrumb: false            

    當路由設置了該屬性，則會高亮相對應的側邊欄。
    這在某些場景非常有用，比如：一個文章的列表頁路由為：/article/list
    點擊文章進入文章詳情頁，這時候路由為/article/1，但你想在側邊欄高亮文章列表的路由，就可以進行如下設置
    activeMenu: '/example/list'如果設置了path，側邊欄會高亮顯示你設置的路徑
  }
 */

/**
 * 代表那些不需要動態判斷權限的路由，如登錄頁、404、等通用頁面。
 * 沒有權限要求的頁面
 * 所有角色都可以訪問
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/system/redirect/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/system/login/login'),
    hidden: true
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/system/error-page/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/system/dashboard/dashboard'),
        name: 'dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      },
    ]
  },
  {
    path: '/changepassword',
    component: Layout,
    redirect: '/changepassword/index',
    name: 'ChangePW',
    meta: {
      title: '修改密碼',
      icon: ''
    },
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'ChangePassword',
        component: () => import('@/views/system/changepassword.vue'),
        meta: {
          title: '修改密碼',
          noCache: true,
          icon: ''
        },
        hidden: true
      }
    ]
  }
]

/**
 * 有權限要求的頁面
 */
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: {
      title: '系統管理',
      icon: 'example',
      perms: ['system_manage'],
      pageId: 100
    },
    children: [{
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user'),
        meta: {
          title: '用戶管理',
          icon: 'user',
          perms: ['user_manage'],
          pageId: 101
        }
      },
      {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/views/system/organization'),
        meta: {
          title: '部門管理',
          icon: 'tree',
          perms: ['org_manage'],
          pageId: 101
        }
      },
      {
        path: 'perm',
        name: 'Perm',
        component: () => import('@/views/system/perm'),
        meta: {
          title: '權限菜單',
          icon: 'example',
          perms: ['perm_manage']
        }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role'),
        meta: {
          title: '角色管理',
          icon: 'lock',
          perms: ['role_manage']
        }
      },
      {
        path: 'position',
        name: 'Postion',
        component: () => import('@/views/system/position'),
        meta: {
          title: '崗位管理',
          icon: 'position',
          perms: ['position_manage']
        }
      },
      {
        path: 'file',
        name: 'File',
        component: () => import('@/views/system/file'),
        meta: {
          title: '文件庫',
          icon: 'documentation',
          perms: ['file_room']
        }
      },
    ]
  },
  {
    path: '/develop',
    component: Layout,
    redirect: '/develop/perm',
    name: 'Develop',
    meta: {
      title: '開發配置',
      icon: 'example',
      perms: ['dev_set']
    },
    children: [{
        path: 'form-gen-link',
        component: Layout,
        children: [{
          path: 'https://jakhuang.github.io/form-generator/',
          meta: {
            title: '表單設計器',
            icon: 'link',
            perms: ['dev_form_gen']
          }
        }]
      },
      {
        path: 'docs',
        component: Layout,
        children: [{
          path: import.meta.env.VITE_APP_BASE_API + '/docs/',
          meta: {
            title: '接口文檔',
            icon: 'link',
            perms: ['dev_docs']
          }
        }]
      },
      {
        path: 'swagger',
        component: Layout,
        children: [{
          path: import.meta.env.VITE_APP_BASE_API + '/swagger/',
          meta: {
            title: 'Swagger文檔',
            icon: 'link',
            perms: ['dev_docs']
          }
        }]
      },
      {
        path: 'admin-link',
        component: Layout,
        children: [{
          path: import.meta.env.VITE_APP_BASE_API + '/admin/',
          meta: {
            title: 'Django後台',
            icon: 'link',
            perms: ['dev_admin']
          }
        }]
      }
    ]
  },
  ...exampleRouter,
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

/**
 * @method resetRouter
 */
export const resetRouter = () => {
  const permissionStore = usePermissionStore()

  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && permissionStore.addRoutes.find((item) => item.name === name)) {
      router.removeRoute(name)
    }
  })
}

export default router
