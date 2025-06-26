import { defineStore } from 'pinia'
import { setCookieItem, getCookieItem, removeCookieItem } from '@/utils/storage'
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router/index'
import { useTagsViewStore } from '@/store/tagsView'

const getDefaultState = () => ({
  token: getToken(),
  //userInfo: getCookieItem('userInfo'),
  name: '',
  avatar: '',
  perms: []
})

export const useUserStore = defineStore('user', {
  state: () => getDefaultState(),

  actions: {
    resetState() {
      Object.assign(this, getDefaultState())
    },

    setToken(token) {
      this.token = token
      setToken(token)
      //setCookieItem('token', token)
    },
    setUserInfo({ userInfo }) {
      this.userInfo = userInfo

      //setCookieItem('userInfo', userInfo)
    },
    setName(name) {
      this.name = name
    },

    setAvatar(avatar) {
      this.avatar = avatar
    },

    setPerms(perms) {
      this.perms = perms
    },

    // user login
    login(userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password }).then(response => {
          const { data } = response
          console.log('r',data)
          this.setToken(data.access)

          resolve()
      
        }).catch(error => {
          reject(error)
        })
      })
    },

    // get user info
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo(this.token).then(response => {
          if (!response || !response.data) {
            return reject('驗證失敗，請重新登入。')
          }

          const { perms, name, avatar } = response.data

          // perms must be a non-empty array
          if (!perms || perms.length <= 0) {
            reject('沒有任何權限!')
          }
          
          this.setPerms(perms)
          this.setName(name)
          this.setAvatar(avatar)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // user logout
    logout() {
      return new Promise((resolve, reject) => {
        logout(this.token).then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          this.resetState()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // remove token
    resetToken() {
      return new Promise(resolve => {
        removeToken() // must remove  token  first
        this.resetState()
        resolve()
      })
    }

    // logout() {
    //   const tagsViewStore = useTagsViewStore()
    //   return new Promise((resolve) => {
    //     this.token = ''

    //     this.userInfo = null

    //     removeCookieItem('token')

    //     removeCookieItem('userInfo')

    //     resetRouter()

    //     tagsViewStore.delAllViews()

    //     resolve()
    //   })
    // },
    // resetToken() {
    //   return new Promise((resolve) => {
    //     this.token = ''

    //     this.userInfo = null

    //     removeCookieItem('token')

    //     removeCookieItem('userInfo')

    //     resolve()
    //   })
    // }
  }
})
