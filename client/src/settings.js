export default {
  /**
   * 全局
   */
  // 頁面標題
  title: 'Vue3 Admin Template',
  // 佈局方式 Classic 經典佈局 Default 默認佈局 Streamline 精簡佈局
  layoutMode: 'Default',
  // 默認全局尺寸, 可選值 large / default /small
  size: 'default',
  // 是否展示tagsView
  tagsView: false,
  // 全局設置狀態
  showSettings: false,
  // 是否顯示Logo
  menuLogo: true,

  locale: 'zhTW',

  /**
   * 側邊欄菜單
   */
  //菜單寬度(展開時)，單位px
  menuWidth: 210,
  // 是否水平折疊收起菜單
  menuCollapse: false,
  // 背景色
  menuBackgroundColor: '#304156',
  // 文字顏色
  menuTextColor: '#bfcbd9',
  // 激活項背景色
  menuActiveBackgroundColor: '#304156',
  // 激活項文字色
  menuActiveTextColor: '#409EFF',
  // 菜單項默認圖標
  menuDefaultIcon: 'el-icon-Minus',
  // 是否只保持一個子菜單的展開(手風琴)
  menuUniqueOpened: false,
  // The default is only used in the production env，If you want to also use it in dev, you can pass ['production', 'development']
  errorLog: ['production', 'localhost'],
  unAutoUpdateEnv: ['localhost']
}
