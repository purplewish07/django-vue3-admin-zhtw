export default {
  mounted(el, binding) {
    const bottomOffset = binding.value?.bottomOffset || 30

    const calcHeight = () => {
      const tableDom = el.querySelector('.el-table__body-wrapper')
      const top = el.getBoundingClientRect().top
      const height = window.innerHeight - top - bottomOffset
      if (tableDom) {
        tableDom.style.height = `${height}px`
        tableDom.style.overflowY = 'auto'
      }
    }

    // 初始化 + 綁定 resize
    calcHeight()
    window.addEventListener('resize', calcHeight)
    el.__resizeHandler__ = calcHeight
  },

  unmounted(el) {
    window.removeEventListener('resize', el.__resizeHandler__)
    delete el.__resizeHandler__
  }
}