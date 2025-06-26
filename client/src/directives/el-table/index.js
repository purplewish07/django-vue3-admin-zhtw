import adaptive from './adaptive'

const directives = {
  'el-height-adaptive-table': adaptive
}
export default {
  install(app) {
    for (const [name, directive] of Object.entries(directives)) {
      app.directive(name, directive) // 正確註冊方式
    }
  }
}
