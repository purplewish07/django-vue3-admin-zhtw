export const base64ToFile = (
  base64Data,
  fileName = `${new Date().getTime()}.jpg`,
  mimeType = 'image/jpeg'
) => {
  try {
    if (!base64Data) {
      throw new Error('base64Data 不能為空')
    }

    // 將 Base64 字符串轉換為 Uint8Array
    const binaryData = atob(base64Data)
    const arrayBuffer = new ArrayBuffer(binaryData.length)
    const uint8Array = new Uint8Array(arrayBuffer)

    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i)
    }

    // 創建 Blob 對像
    const blob = new Blob([uint8Array], { type: mimeType })

    // 創建 File 對像
    const file = new File([blob], fileName, { type: mimeType })
    return file
  } catch (error) {
    console.error('Base64轉File失敗:', error)
    throw error
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function genTree(data) {
  const result = []
  if (!Array.isArray(data)) {
    return result
  }
  data.forEach(item => {
    delete item.children
  })
  const map = {}
  data.forEach(item => {
    item.label = item.name
    if(item.fullname){
      item.label = item.fullname
    }
    item.value = item.id
    map[item.id] = item
  })
  data.forEach(item => {
    const parent = map[item.parent]
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      result.push(item)
    }
  })
  return result
}