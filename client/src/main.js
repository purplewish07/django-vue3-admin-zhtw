import { createApp } from 'vue'

// fix: 自動導入函數式組件樣式沒有自動導入
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-dialog.css'

import 'normalize.css' // a modern alternative to CSS resets

import '@/styles/index.scss' // global css

import App from '@/App'
import { createPinia } from 'pinia' // pinia
import router from '@/router/index'

import 'virtual:svg-icons-register'

import '@/permission' // permission control

import registerIcons from './plugins/elementIcons'
import tableHeight from '@/directives/el-table/index'
import errorLog from '@/utils/error-log'
import autoUpdate from '@/utils/auto-update'

import i18n from '@/locales/index'

const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(registerIcons)
  .use(tableHeight)
  .use(errorLog)
  .use(autoUpdate)
  .mount('#app')
