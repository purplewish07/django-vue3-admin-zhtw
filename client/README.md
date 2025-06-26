<p align="center">
  <strong>vue3-admin-template</strong>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/vue-3.3.4-brightgreen.svg" >
    <img src="https://img.shields.io/badge/element--plus-2.3.12-brightgreen.svg" >
    <img src="https://img.shields.io/badge/vue--router-4.2.4-brightgreen.svg" >
    <img src="https://img.shields.io/badge/pinia-2.1.6-brightgreen.svg" >
    <img src="https://img.shields.io/badge/vite-5.0.0-brightgreen.svg" >
</p>

# 介紹

[vue3-admin-template](https://github.com/zhihuifanqiechaodan/vue3-admin-template.git)  是一個後台前端解決方案，它基於  [vue](https://github.com/vuejs/vue)  和  [element-plus](https://github.com/element-plus/element-plus.git)實現。它使用了最新的前端技術棧，內置了動態路由，權限驗證，提供了多種佈局方式，它可以幫助你快速搭建企業級中後台產品原型。相信不管你的需求是什麼，本項目都能幫助到你。

> 建議
>
> 本項目的定位是管理後台開發模版，適合當基礎模板來進行二次開發，部分公共組件會在後續持續集成，歡迎提 issues。

## 功能

```js
- 登錄 / 註銷

- 權限驗證
  - 頁面權限
  - 指令權限
  - 權限配置

- 多環境發佈
  - dev
  - prod

- 全局功能
  - 國際化多語言
  - 多種動態換膚
  - 動態側邊欄（支持多級路由嵌套）
  - 動態麵包屑
  - 快捷導航(標籤頁)
  - Svg Sprite 圖標
  - Screenfull全屏
```

## 前序準備

你需要在本地安裝  [node](http://nodejs.org/)  和  [git](https://git-scm.com/)。本項目技術棧基於  [ES2015+](http://es6.ruanyifeng.com/)、[element-plus](https://github.com/element-plus/element-plus.git)、[axios](https://github.com/axios/axios.git[)、[pinia](https://github.com/vuejs/pinia.git)、[vue-router](https://github.com/vuejs/vue-router.git)和[vite](https://github.com/vitejs/vite.git)和提前瞭解和學習這些知識會對使用本項目有很大的幫助。

## 目錄結構

本項目已經為你生成了一個完整的開發框架，提供了涵蓋中後台開發的各類功能和坑位，下面是整個項目的目錄結構。

```js
├── README.md
├── deploy.sh
├── index.html
├── jsconfig.json
├── package.json
├── public
│   └── favicon.ico
├── src
│   ├── App.vue
│   ├── api
│   ├── assets
│   ├── components
│   ├── icons
│   ├── layout
│   ├── main.js
│   ├── permission.js
│   ├── router
│   ├── settings.js
│   ├── store
│   ├── styles
│   ├── utils
│   └── views
├── vite.config.js
├── yarn.loc
└──.env.prod
```

## 安裝

```js
# 克隆項目
git clone https://github.com/zhihuifanqiechaodan/vue3-admin-template.git

# 進入項目目錄
cd vue3-admin-template

# 安裝依賴
yarn install

# 本地開發 啟動項目
yarn dev
```

> TIP
>
> 強烈建議使用 yarn 安裝依賴，避免使用 npm 或者 cnpm 安裝，可能會有各種詭異的 bug。

啟動完成後，當你看到下面的頁面說明你操作成功了。

- 默認佈局

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c76aaa53677e4eedb902d4d8eff26f2c~tplv-k3u1fbpfcp-watermark.image?)

- 經典佈局

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/756b3304cbe44070be9d00d2cd1ff977~tplv-k3u1fbpfcp-watermark.image?)

- 單欄佈局

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7b33442d9ac408283f2d38d0300b234~tplv-k3u1fbpfcp-watermark.image?)

- 全局管理

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8342beb159a644b398df17778719ac90~tplv-k3u1fbpfcp-watermark.image?)
接下來你可以修改代碼進行業務開發了，本項目內建了常用公共組件、全局路由管理等等各種實用的功能來輔助開發，你可以通過查看已有的工具類和封裝方法來使用。

> 建議
>
> 使用前建議將目前項目中已有的配置和文件夾工具類先行查看一番，方便後續使用。

## 其它

基於[vue3-admin-template](https://github.com/zhihuifanqiechaodan/vue3-admin-template.git)模版開發管理後台，你可以通過微量的改造來達到符合你司項目的需求。

對於一些開發中常遇到的問題和解決方案歡迎討論。

歡迎您提供寶貴的意見和建議，也歡迎提 issues 增加和修改功能或組件，另外如果可以的話請給個 start，感謝～
