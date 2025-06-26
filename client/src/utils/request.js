import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'
import { getToken } from '@/utils/auth'

// create an axios instance
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
request.interceptors.request.use(
  (config) => {
    // do something before request is sent
    const userStore = useUserStore()

    if (userStore.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + userStore.token
      // console.log(config.headers['Authorization'])
      // config.headers['authorization'] = userStore.token
      // config.headers['userId'] = userStore.userInfo.id
    } else {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  (error) => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data
    if(res.code>=200 && res.code<400){
      return res
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code === 401) {
      if(res.msg.indexOf('No active account')!=-1){
      ElMessage({
        message: '用戶名或密碼錯誤',
          type: 'error',
          duration: 3 * 1000
      })
    }else{
        // to re-login
        ElMessageBox.confirm('認證失敗,請重新登陸.', '確認退出', {
          confirmButtonText: '重新登陸',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const userStore = useUserStore()
          userStore.resetToken().then(() => {
            location.reload()
          })
        })
      } 
    } else if (res.code >= 400) {
      ElMessage({
        message: res.msg || '請求出錯',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(new Error(res.msg || '請求出錯'))
    }
  },
  (error) => {
    console.log('ߚ࠾ file: request.js:80 ~ error:', error)

    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default request
