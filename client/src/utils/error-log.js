import { nextTick } from 'vue'
import settings from '@/settings'
import { isString, isArray } from '@/utils/validate'
import { useErrorLogStore } from '@/store/errorLog'

const { errorLog } = settings

/**
 * @method checkNeed 檢查需要日誌
 * @returns
 */
const checkNeed = () => {
  const env = import.meta.env.VITE_NODE_ENV

  if (isString(errorLog)) {
    return env === errorLog
  }

  if (isArray(errorLog)) {
    return errorLog.includes(env)
  }

  return false
}

export default {
  install(app) {
    if (checkNeed()) {
      const errorLogStore = useErrorLogStore()

      app.config.errorHandler = (err, vm, info) => {
        console.log(
          'ߚ࠾ file: error-log.js:32 ~ install ~ err, vm, info:',
          err,
          vm,
          info
        )

        // `info` 是 Vue 特定的錯誤信息，比如錯誤所在的生命週期鉤子
        nextTick(() => {
          errorLogStore.addErrorLog({
            err,
            vm,
            info,
            url: window.location.href
          })
        })
      }
    }
  }
}
