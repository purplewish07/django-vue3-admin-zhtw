import domToImage from 'dom-to-image'

/**
 * @typedef {Object} DomToImageOptions
 * @property {number} [quality] - JPEG 圖片質量 0-1
 * @property {number} [width] - 輸出圖片寬度
 * @property {number} [height] - 輸出圖片高度
 * @property {string} [bgcolor] - 背景顏色
 * @property {boolean} [skipAutoScale] - 是否跳過自動縮放
 */

/**
 * DOM 節點轉換為圖片並下載
 */
export default () => {
  /**
   * 檢查節點是否有效
   * @param {HTMLElement} node - DOM 節點
   * @throws {Error} 如果節點無效則拋出錯誤
   */
  const validateNode = (node) => {
    if (!node || !(node instanceof HTMLElement)) {
      throw new Error('無效的 DOM 節點')
    }
  }

  /**
   * 處理轉換選項
   * @param {DomToImageOptions} options - 原始選項
   * @returns {DomToImageOptions} 處理後的選項
   */
  const processOptions = (options) => {
    const defaultOptions = {
      quality: 0.95,
      bgcolor: '#ffffff'
    }
    return { ...defaultOptions, ...options }
  }

  /**
   * 轉換並下載圖片的通用方法
   * @param {Function} converter - 轉換方法
   * @param {HTMLElement} node - DOM 節點
   * @param {DomToImageOptions} options - 配置選項
   * @param {string} fileName - 文件名
   * @param {string} ext - 文件擴展名
   * @returns {Promise<string>} 返回圖片的 data URL
   */
  const convertAndDownload = async (
    converter,
    node,
    options,
    fileName,
    ext
  ) => {
    try {
      validateNode(node)
      const processedOptions = processOptions(options)

      // 如果沒有設置尺寸且不跳過自動縮放，則使用節點的實際尺寸
      if (!processedOptions.width && !processedOptions.skipAutoScale) {
        const rect = node.getBoundingClientRect()
        processedOptions.width = rect.width
        processedOptions.height = rect.height
      }

      const dataUrl = await converter(node, processedOptions)
      downloadImage(dataUrl, fileName, ext)
      return dataUrl
    } catch (error) {
      console.error(`轉換${ext}圖片失敗:`, error)
      throw error
    }
  }

  /**
   * 下載圖片
   * @param {HTMLElement} node - DOM 節點
   * @param {Object} options - 配置選項
   * @param {string} [options.type='png'] - 圖片格式，支持 'png'、'jpeg'、'svg'
   * @param {string} [options.fileName='domToImage'] - 文件名
   * @param {DomToImageOptions} [options.imageOptions] - 圖片轉換配置
   * @returns {Promise<string>} 返回圖片的 data URL
   */
  const downloadImage = async (node, options = {}) => {
    const { type = 'png', fileName = 'domToImage', imageOptions = {} } = options

    const converters = {
      png: domToImage.toPng,
      jpeg: domToImage.toJpeg,
      svg: domToImage.toSvg
    }

    const converter = converters[type.toLowerCase()]
    if (!converter) {
      throw new Error('不支持的圖片格式')
    }

    return convertAndDownload(converter, node, imageOptions, fileName, type)
  }

  /**
   * 獲取圖片 URL
   * @param {HTMLElement} node - DOM 節點
   * @param {Object} options - 配置選項
   * @param {string} [options.type='png'] - 圖片格式，支持 'png'、'jpeg'、'svg'
   * @param {DomToImageOptions} [options.imageOptions] - 圖片轉換配置
   * @returns {Promise<string>} 圖片的 data URL
   */
  const getUrl = async (node, options = {}) => {
    const { type = 'png', imageOptions = {} } = options

    const converters = {
      png: domToImage.toPng,
      jpeg: domToImage.toJpeg,
      svg: domToImage.toSvg
    }

    const converter = converters[type.toLowerCase()]
    if (!converter) {
      throw new Error('不支持的圖片格式')
    }

    try {
      validateNode(node)
      const processedOptions = processOptions(imageOptions)
      return await converter(node, processedOptions)
    } catch (error) {
      console.error('獲取圖片 URL 失敗:', error)
      throw error
    }
  }

  return {
    downloadImage,
    getUrl
  }
}
