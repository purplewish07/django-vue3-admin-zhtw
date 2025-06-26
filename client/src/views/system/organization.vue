<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="search"
        placeholder="輸入部門名稱進行搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter="getList"
      />
      <el-button
        type="primary"
        @click="handleAdd"
        v-if="checkPermission(['org_create'])"
        size="small"
        ><el-icon><Plus /></el-icon>新增</el-button
      >
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
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="name" label="組織名稱" />
      <el-table-column label="創建日期" v-slot="{ row }">
        <span>{{ row.create_time }}</span>
      </el-table-column>
      <el-table-column align="center" label="操作" v-slot="{ row }">
        <el-button
          type="primary"
          size="small"
          :disabled="!checkPermission(['org_update'])"
          @click="handleEdit(row)"
        ><el-icon><Edit /></el-icon></el-button>
        <el-button
          type="danger"
          size="small"
          :disabled="!checkPermission(['org_delete'])"
          @click="handleDelete(row)"
        ><el-icon><Delete /></el-icon></el-button>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form ref="formRef" :model="org" label-width="80px" label-position="right" :rules="rules">
        <el-form-item label="名稱" prop="name">
          <el-input v-model="org.name" placeholder="名稱" />
        </el-form-item>
        <el-form-item label="類型" prop="type">
          <el-select
            v-model="org.type"
            placeholder="請選擇"
            style="width: 100%"
          >
            <el-option label="部門" value="部門" />
            <el-option label="公司" value="公司" />
          </el-select>
        </el-form-item>
        <el-form-item label="隸屬" prop="parent">
          <el-tree-select
            v-model="org.parent"
            :data="tableData"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            check-strictly
            clearable
            filterable
            default-expand-all
            placeholder="父級"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" type="danger">取消</el-button>
        <el-button @click="confirmOrg" type="primary">確認</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick, onMounted } from 'vue'
import { getOrgAll, createOrg, deleteOrg, updateOrg } from '@/api/org'
import { genTree } from '@/utils'
import checkPermission from '@/utils/permission'
import { ElMessage, ElMessageBox } from 'element-plus'

const search = ref('')
const listLoading = ref(true)

const defaultOrg = { id: null, name: '', parent: null }
const org = reactive({ ...defaultOrg })

const tableData = ref([])
const orgList = ref([])
const dialogVisible = ref(false)
const dialogType = ref('new')
const formRef = ref()

const rules = {
  name: [{ required: true, message: '請輸入名稱', trigger: 'blur' }],
  type: [{ required: true, message: '請選擇類型', trigger: 'change' }],
  parent: [{ required: true, message: '請選擇上級', trigger: 'change' }]
}

const dialogTitle = computed(() =>
  dialogType.value === 'edit' ? '編輯部門' : '新增部門'
)

const filteredData = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  const list = keyword
    ? orgList.value.filter(item =>
        item.name.toLowerCase().includes(keyword)
      )
    : orgList.value
  return genTree(list)
})

function getList() {
  listLoading.value = true
  getOrgAll().then(res => {
    orgList.value = res.data
    tableData.value = genTree(res.data)
    listLoading.value = false
  })
}

function handleAdd() {
  Object.assign(org, defaultOrg)
  dialogType.value = 'new'
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

function handleEdit(row) {
  Object.assign(org, row)
  dialogType.value = 'edit'
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

function handleDelete(row) {
  ElMessageBox.confirm('確認刪除?', '警告', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'error'
  })
    .then(async () => {
      await deleteOrg(row.id)
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

function confirmOrg() {
  formRef.value.validate(valid => {
    if (!valid) return

    const isEdit = dialogType.value === 'edit'
    const action = isEdit
      ? updateOrg(org.id, org)
      : createOrg(org)

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
