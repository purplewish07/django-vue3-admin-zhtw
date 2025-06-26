import { defineStore } from 'pinia'
import defaultSettings from '@/settings'
import { getCookieItem, setCookieItem } from '@/utils/storage'
const {
  layoutMode,
  menuWidth,
  showSettings,
  tagsView,
  menuLogo,
  menuCollapse,
  size,
  menuBackgroundColor,
  menuTextColor,
  menuActiveBackgroundColor,
  menuActiveTextColor,
  menuDefaultIcon,
  menuUniqueOpened,
  locale
} = defaultSettings

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      /**
       * 全局
       */
      // 展示設置
      showSettings,
      // 佈局方式 Classic 經典佈局 Default默認佈局 Streamline 精簡佈局
      layoutMode: getCookieItem('layoutMode', layoutMode),
      // 默認全局尺寸, 可選值 large / default /small
      size: getCookieItem('size', size),
      // 是否展示tagsView
      tagsView: getCookieItem('tagsView', tagsView),
      // 是否顯示Logo
      menuLogo: getCookieItem('menuLogo', menuLogo),
      locale: getCookieItem('locale', locale),
      /**
       * 側邊欄菜單
       */
      // 菜單項默認圖標
      menuDefaultIcon,
      //菜單寬度(展開時)，單位px
      menuWidth: getCookieItem('menuWidth', menuWidth),
      // 是否水平折疊收起菜單
      menuCollapse: getCookieItem('menuCollapse', menuCollapse),
      // 背景色
      menuBackgroundColor: getCookieItem(
        'menuBackgroundColor',
        menuBackgroundColor
      ),
      // 文字顏色
      menuTextColor: getCookieItem('menuTextColor', menuTextColor),
      // 激活項背景色
      menuActiveBackgroundColor: getCookieItem(
        'menuActiveBackgroundColor',
        menuActiveBackgroundColor
      ),
      // 激活項文字色
      menuActiveTextColor: getCookieItem(
        'menuActiveTextColor',
        menuActiveTextColor
      ),
      // 是否只保持一個子菜單的展開(手風琴)
      menuUniqueOpened: getCookieItem('menuUniqueOpened', menuUniqueOpened)
    }
  },
  actions: {
    changeSetting({ key, value }) {
      this[key] = value
      setCookieItem(key, value)
    },
    restoreDefault() {
      this.changeSetting({ key: 'layoutMode', value: layoutMode })
      this.changeSetting({ key: 'size', value: size })
      this.changeSetting({ key: 'tagsView', value: tagsView })
      this.changeSetting({ key: 'menuLogo', value: menuLogo })
      this.changeSetting({ key: 'menuWidth', value: menuWidth })
      this.changeSetting({ key: 'menuCollapse', value: menuCollapse })
      this.changeSetting({
        key: 'menuBackgroundColor',
        value: menuBackgroundColor
      })
      this.changeSetting({ key: 'menuTextColor', value: menuTextColor })
      this.changeSetting({
        key: 'menuActiveBackgroundColor',
        value: menuActiveBackgroundColor
      })
      this.changeSetting({
        key: 'menuActiveTextColor',
        value: menuActiveTextColor
      })
      this.changeSetting({ key: 'menuUniqueOpened', value: menuUniqueOpened })
    }
  }
})
