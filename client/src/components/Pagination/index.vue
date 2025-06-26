<template>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    :page-sizes="props.pageSizes"
    :layout="props.layout"
    :background="props.background"
    :hide-on-single-page="props.hideOnSinglePage"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  background: {
    type: Boolean,
    default: true
  },
  page: { type: Number, default: 1 },
  limit: { type: Number, default: 1 },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50]
    }
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  hideOnSinglePage: {
    type: Boolean,
    default: true
  }
})


const emit = defineEmits(['update:page', 'update:limit', 'pagination'])

const currentPage = computed({
  get: () => props.page,
  set: val => emit('update:page', val)
})

const pageSize = computed({
  get: () => props.limit,
  set: val => emit('update:limit', val)
})

function handleSizeChange(val) {
  emit('update:page', 1)
  emit('update:limit', val)
  emit('pagination', { page: currentPage.value, limit: val })
}

function handleCurrentChange(val) {
  emit('pagination', { page: val, limit: pageSize.value })
}
</script>

<style lang="scss"></style>
