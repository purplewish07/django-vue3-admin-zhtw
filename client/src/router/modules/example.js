import Layout from '@/layout/layout'



export default [
  {
    path: '/example',
    name: 'example',
    component: Layout,
    redirect: '/giveExample/markdown',
    meta: {
      title: 'Example',
      icon: 'excel',
      //roles: ['admin', 'editor'],
      perms: ['dev_testing']
    },
    children: [
      {
        path: '/permission',
        redirect: '/permission/user',
        meta: { title: 'PermissionIds', icon: 'lock', perms: ['user_manage'], pageId: 100 },
        children: [
          {
            path: 'user',
            component: () => import('@/views/system/permission/user'),
            name: 'user',
            meta: {
              title: 'User',
              icon: 'dashboard',
              pageId: 101,
              perms: ['user_manage'],
              buttonIds: [{ buttonId: 1010, buttonText: '添加用戶' }]
            }
          },
          {
            path: 'role',
            component: () => import('@/views/system/permission/role'),
            name: 'role',
            meta: {
              title: 'Role',
              icon: 'dashboard',
              pageId: 102,
              perms: ['user_manage'],
              buttonIds: [
                { buttonId: 1020, buttonText: '創建' },
                { buttonId: 1021, buttonText: '編輯' },
                { buttonId: 1022, buttonText: '刪除' }
              ]
            }
          }
        ]
      },
      {
        path: 'markdown',
        name: 'markdown',
        component: () => import('@/views/example/markdown/markdown'),
        meta: { title: 'Markdown', icon: 'markdown', perms: ['dev_testing']}
      },
      {
        path: 'dom-to-image',
        name: 'domToImage',
        component: () => import('@/views/example/dom-to-image/dom-to-image'),
        meta: { title: 'DomToImage', icon: 'dom-to-image', perms: ['dev_testing']}
      },
      {
        path: 'html2canvas',
        name: 'html2canvas',
        component: () => import('@/views/example/html2canvas/html2canvas'),
        meta: { title: 'Html2canvas', icon: 'dom-to-image', perms: ['dev_testing']}
      },
      {
        path: 'qrcode',
        name: 'qrcode',
        component: () => import('@/views/example/qrcode/qrcode'),
        meta: { title: 'QRCode', icon: 'qrcode', perms: ['dev_testing']}
      },
      {
        path: 'clipboard',
        name: 'clipboard',
        component: () => import('@/views/example/clipboard/clipboard'),
        meta: { title: 'Clipboard', icon: 'clipboard', perms: ['dev_testing']}
      },
      {
        path: 'pie-chart',
        name: 'pie-chart',
        component: () => import('@/views/example/echart/pie-chart'),
        meta: { title: 'PieChart', icon: 'chart', perms: ['dev_testing']}
      },
      {
        path: 'excel',
        name: 'excel',
        meta: { title: 'Excel', icon: 'excel', perms: ['dev_testing']},
        children: [
          {
            path: 'export-excel',
            name: 'export-excel',
            component: () => import('@/views/example/excel/export-excel'),
            meta: { title: 'Export Excel', perms: ['dev_testing']}
          },
          {
            path: 'select-excel',
            name: 'select-excel',
            component: () => import('@/views/example/excel/select-excel'),
            meta: { title: 'Export Selected', perms: ['dev_testing']}
          },
          {
            path: 'merge-header',
            name: 'merge-header',
            component: () => import('@/views/example/excel/merge-header'),
            meta: { title: 'Merge Header', perms: ['dev_testing']}
          },
          {
            path: 'upload-excel',
            name: 'upload-excel',
            component: () => import('@/views/example/excel/upload-excel'),
            meta: { title: 'Upload Excel', perms: ['dev_testing']}
          }
        ]
      }
    ]
  }
]
