<template>
  <div class="app-container">
    <!-- 搜尋與新增按鈕 -->
    <div>
      <el-input
        class="filter-item"
        v-model="search"
        placeholder="輸入權限名稱進行搜索"
        style="width: 200px"
        @keyup.enter="getList"
      />
      <el-button
        type="primary"
        @click="handleAdd"
        v-if="checkPermission(['perm_create'])"
        size="small"
      ><el-icon ><Plus /></el-icon>新增</el-button>
    </div>

    <!-- 權限表格 -->
    <el-table
      v-loading="listLoading"
      :data="filteredData"
      style="width: 100%; margin-top: 10px"
      highlight-current-row
      row-key="id"
      stripe
      border
      v-el-height-adaptive-table="{ bottomOffset: 50 }"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="菜單名稱" />
      <el-table-column prop="type" label="類型" />
      <el-table-column prop="method" label="代號" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column label="操作" align="center" v-slot="{ row, $index }">
        <el-button
          type="primary"
          size="small"
          :disabled="!checkPermission(['perm_update'])"
          @click="handleEdit(row)"
        ><el-icon><Edit /></el-icon></el-button>
        <el-button
          type="danger"
          size="small"
          :disabled="!checkPermission(['perm_delete'])"
          @click="handleDelete({ row, $index })"
        ><el-icon><Delete /></el-icon></el-button>
      </el-table-column>
    </el-table>

    <!-- 新增 / 編輯權限對話框 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'edit' ? '編輯' : '新增'">
      <el-form
        ref="formRef"
        :model="perm"
        label-width="80px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item label="類型">
          <el-radio-group v-model="perm.type">
            <el-radio :value="'目錄'">目錄</el-radio>
            <el-radio :value="'菜單'">菜單</el-radio>
            <el-radio :value="'接口'">接口</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="名稱" prop="name">
          <el-input v-model="perm.name" placeholder="名稱" />
        </el-form-item>

        <el-form-item label="代號" prop="method">
          <el-input v-model="perm.method" placeholder="代號" />
        </el-form-item>

        <el-form-item label="父級" prop="parent">
          <el-tree-select
            v-model="perm.parent"
            :data="tableData"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="父級"
            check-strictly
            clearable
            filterable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="perm.sort" :min="1" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPerm">確認</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { getPermAll, createPerm, deletePerm, updatePerm } from '@/api/perm'
import { genTree } from '@/utils'
import checkPermission from '@/utils/permission'
import { ElMessage, ElMessageBox } from 'element-plus'

const search = ref('')
const listLoading = ref(true)
const dialogVisible = ref(false)
const dialogType = ref('new')

const defaultPerm = {
  id: null,
  name: '',
  type: '目錄',
  method: '',
  sort: 1,
  parent: null
}

const perm = reactive({ ...defaultPerm })
const rules = {
  name: [{ required: true, message: '請輸入名稱', trigger: 'blur' }],
  method: [{ required: true, message: '請輸入代號', trigger: 'blur' }]
}

const tableData = ref([])
const permList = ref([])
const formRef = ref()

const filteredData = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return tableData.value
  const filtered = permList.value.filter(item =>
    item.name.toLowerCase().includes(keyword)
  )
  return genTree(filtered)
})

function getList() {
  listLoading.value = true
  getPermAll().then(res => {
    permList.value = res.data
    tableData.value = genTree(res.data)
    listLoading.value = false
  })
}

function handleAdd() {
  Object.assign(perm, defaultPerm)
  dialogType.value = 'new'
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

function handleEdit(row) {
  Object.assign(perm, row)
  dialogType.value = 'edit'
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

function handleDelete({ row }) {
  ElMessageBox.confirm('確認刪除?', '警告', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'error'
  })
    .then(async () => {
      await deletePerm(row.id)
      getList()
      ElMessage.success('成功刪除!')
    })
    .catch(err => {
      if (err !== 'cancel') {
        console.error(err)
        ElMessage.error('刪除失敗')
      }
      // 若是 cancel，就靜默忽略
    })
}

function confirmPerm() {
  formRef.value.validate(valid => {
    if (!valid) return
    const isEdit = dialogType.value === 'edit'
    const action = isEdit
      ? updatePerm(perm.id, perm)
      : createPerm(perm)

    action.then(() => {
      getList()
      dialogVisible.value = false
      ElMessage.success(isEdit ? '編輯成功' : '新增成功')
    })
  })
}

onMounted(() => {
  getList()
})
</script>
