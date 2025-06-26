import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'

export default () => {
  /**
   * @method handleClipboard 處理剪切板
   * @param {*} e 事件源
   * @param {*} text 文本內容
   */
  const handleClipboard = (e, text) => {
    const clipboard = new Clipboard(e.target, {
      text: () => text
    })
    clipboard.on('success', () => {
      ElMessage.success('複製成功')
      clipboard.destroy()
    })
    clipboard.on('error', () => {
      ElMessage.error('複製失敗')
      clipboard.destroy()
    })
    clipboard.onClick(event)
  }

  return {
    handleClipboard
  }
}
