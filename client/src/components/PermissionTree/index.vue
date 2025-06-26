<template>
  <el-tree
    ref="treeRef"
    :data="treeData"
    show-checkbox
    node-key="id"
    default-expand-all
    :default-checked-keys="defaultCheckedKeys"
    :props="{ children: 'children', label: 'label' }"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { asyncRoutes } from '@/router/index'

defineProps({
  defaultCheckedKeys: {
    type: Array,
    default: () => []
  }
})

const treeRef = ref(null)

const treeData = computed(() => transformRoutesToTree(asyncRoutes))
/**
 * 將路由數組轉換為樹形結構
 * @param {Array} routes 路由數組
 * @returns {Array} 樹形結構
 */
 const transformRoutesToTree = (routes) => {
  return routes
    .filter((route) => route.meta?.pageId || route.meta?.buttonIds)
    .map((route) => {
      const node = {
        id: route.meta.pageId,
        label: route.meta.title,
        children: []
      }

      // 處理按鈕權限
      if (route.meta.buttonIds) {
        node.children = route.meta.buttonIds.map((button) => ({
          id: button.buttonId,
          label: button.buttonText
        }))
      }

      // 遞歸處理子路由
      if (route.children) {
        const childNodes = transformRoutesToTree(route.children)
        if (childNodes.length > 0) {
          node.children = [...node.children, ...childNodes]
        }
      }

      return node
    })
}

// 暴露方法給父組件
defineExpose({
  getCheckedKeys: () => treeRef.value?.getCheckedKeys()
})
</script>
