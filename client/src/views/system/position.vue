<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="search"
        placeholder="輸入崗位名稱進行搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-button
        type="primary"
        size="small"
        @click="handleAdd"
        v-if="checkPermission(['position_create'])"
      >
        <el-icon><Plus /></el-icon> 新增
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="filteredData"
      style="width: 100%; margin-top: 10px"
      highlight-current-row
      row-key="id"
      stripe
      border
      v-el-height-adaptive-table="{ bottomOffset: 50 }"
    >
      <el-table-column type="index" width="50" />
      <el-table-column label="崗位名稱">
        <template #default="{ row }">{{ row.name }}</template>
      </el-table-column>
      <el-table-column label="創建日期">
        <template #default="{ row }">{{ row.create_time }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            :disabled="!checkPermission(['position_update'])"
            @click="handleEdit(row)"
          >
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button
            type="danger"
            size="small"
            :disabled="!checkPermission(['position_delete'])"
            @click="handleDelete(row)"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form
        ref="Form"
        :model="position"
        :rules="rules"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="名稱" prop="name">
          <el-input v-model="position.name" placeholder="名稱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">確認</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, getCurrentInstance, onMounted } from 'vue'
import { getPositionAll, createPosition, updatePosition, deletePosition } from '@/api/position'
import { genTree, deepClone } from '@/utils'
import checkPermission from '@/utils/permission'

const defaultForm = { id: '', name: '' }

const search = ref('')
const listLoading = ref(true)
const dialogVisible = ref(false)
const dialogType = ref('new')
const tableData = ref([])
const positionList = ref([])
const position = reactive({ ...defaultForm })

const { proxy } = getCurrentInstance()

const Form = ref()
const rules = {
  name: [{ required: true, message: '請輸入名稱', trigger: 'blur' }]
}

const dialogTitle = computed(() =>
  dialogType.value === 'edit' ? '編輯崗位' : '新增崗位'
)

const filteredData = computed(() => {
  const keyword = search.value.toLowerCase().trim()
  return keyword
    ? tableData.value.filter(d => d.name.toLowerCase().includes(keyword))
    : tableData.value
})

function getList() {
  listLoading.value = true
  getPositionAll().then(res => {
    tableData.value = res.data
    positionList.value = res.data
    listLoading.value = false
  })
}

function handleFilter() {
  const keyword = search.value.trim().toLowerCase()
  const filtered = positionList.value.filter(item =>
    item.name.toLowerCase().includes(keyword)
  )
  tableData.value = genTree(filtered)
}

function handleAdd() {
  Object.assign(position, defaultForm)
  dialogType.value = 'new'
  dialogVisible.value = true
  nextTick(() => proxy.$refs['Form']?.clearValidate())
}

function handleEdit(row) {
  Object.assign(position, deepClone(row))
  dialogType.value = 'edit'
  dialogVisible.value = true
  nextTick(() => proxy.$refs['Form']?.clearValidate())
}

function handleDelete(row) {
  proxy.$confirm('確認刪除?', '警告', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'error'
  }).then(async () => {
    await deletePosition(row.id)
    getList()
    proxy.$message.success('成功刪除!')
  }).catch(err => {
    if (err !== 'cancel') console.error(err)
  })
}

function confirm() {
  proxy.$refs['Form'].validate(valid => {
    if (!valid) return

    const isEdit = dialogType.value === 'edit'
    const api = isEdit
      ? updatePosition(position.id, position)
      : createPosition(position)

    api.then(() => {
      getList()
      dialogVisible.value = false
      proxy.$message.success(isEdit ? '編輯成功' : '新增成功')
    })
  })
}

onMounted(getList)
</script>