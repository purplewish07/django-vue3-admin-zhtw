<template>
  <div class="app-container">
    <!-- 搜尋與新增 -->
    <div>
      <el-input
        class="filter-item"
        v-model="search"
        placeholder="輸入角色名稱進行搜索"
        style="width: 200px"
        @keyup.enter="getRoleList"
      />
      <el-button
        class="filter-item"
        type="primary"
        @click="handleAdd"
        v-if="checkPermission(['role_create'])"
        size="small"
      ><el-icon><Plus /></el-icon>新增</el-button>
    </div>

    <!-- 角色表格 -->
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
      <el-table-column prop="name" label="角色名稱" align="center" width="220" />
      <el-table-column prop="description" label="角色描述" align="center" />
      <el-table-column label="操作" align="center" v-slot="{ row, $index }">
        <el-button
          type="primary"
          size="small"
          :disabled="!checkPermission(['role_update'])"
          @click="handleEdit(row)"
        ><el-icon><Edit /></el-icon></el-button>
        <el-button
          type="danger"
          size="small"
          :disabled="!checkPermission(['role_delete'])"
          @click="handleDelete({ row, $index })"
        ><el-icon><Delete /></el-icon></el-button>
      </el-table-column>
    </el-table>

    <!-- 新增 / 編輯角色對話框 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'edit' ? '編輯角色' : '新增角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="名稱">
          <el-input v-model="role.name" placeholder="角色名稱" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="角色描述"
          />
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="數據權限">
              <el-select v-model="role.datas" placeholder="請選擇" style="width: 100%">
                <el-option
                  v-for="item in dataOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="權限範圍" v-show="role.datas === '自定義'">
              <el-tree
                ref="deptsTree"
                v-model:checked-keys="role.depts"
                :data="orgData"
                show-checkbox
                node-key="id"
                default-expand-all
                highlight-current
                :expand-on-click-node="false"
                class="filter-tree"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="功能權限">
              <el-tree
                ref="permissionTree"
                v-model:checked-keys="role.perms"
                :data="routes"
                show-checkbox
                node-key="id"
                :check-strictly="checkStrictly"
                class="permission-tree"
                @check="handleCheck"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false" type="danger">取消</el-button>
        <el-button @click="confirmRole" type="primary">確認</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { genTree, deepClone } from '@/utils'
import checkPermission from '@/utils/permission'
import {
  getRoutes,
  getRoleAll,
  createRole,
  deleteRole,
  updateRole
} from '@/api/role'
import { getOrgAll } from '@/api/org'
import { ElMessage, ElMessageBox } from 'element-plus'

const search = ref('')
const listLoading = ref(true)
const dialogVisible = ref(false)
const dialogType = ref('new')
const checkStrictly = ref(true)

const tableData = ref([])
const rolesList = ref([])
const routes = ref([])
const orgData = ref([])

const permissionTree = ref()
const deptsTree = ref()

const defaultRole = {
  id: '',
  name: '',
  description: '',
  perms: [],
  datas: '本級及以下',
  depts: []
}

const role = reactive({ ...defaultRole })

const dataOptions = [
  { value: '全部', label: '全部' },
  { value: '自定義', label: '自定義' },
  { value: '同級及以下', label: '同級及以下' },
  { value: '本級及以下', label: '本級及以下' },
  { value: '本級', label: '本級' },
  { value: '僅本人', label: '僅本人' }
]

// 篩選資料
const filteredData = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  const list = keyword
    ? rolesList.value.filter(item =>
        item.name.toLowerCase().includes(keyword)
      )
    : rolesList.value
  return list
})

function getRoutesList() {
  getRoutes().then(res => {
    routes.value = genTree(res.data)
  })
}

function getOrgData() {
  getOrgAll().then(res => {
    orgData.value = genTree(res.data)
  })
}

function getRoleList() {
  listLoading.value = true
  getRoleAll().then(res => {
    tableData.value = res.data
    rolesList.value = res.data
    listLoading.value = false
  })
}

function handleAdd() {
  Object.assign(role, defaultRole)
  dialogType.value = 'new'
  dialogVisible.value = true
  nextTick(() => {
    permissionTree.value?.setCheckedKeys([])
    deptsTree.value?.setCheckedKeys([])
  })
}

function handleEdit(row) {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(role, deepClone(row))

  console.log('role', role)
  nextTick(() => {
    permissionTree.value?.setCheckedKeys(role.perms)
    deptsTree.value?.setCheckedKeys(role.depts)
  })
}

function handleDelete({ $index, row }) {
  ElMessageBox.confirm('確認刪除?', '警告', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteRole(row.id)
    tableData.value.splice($index, 1)
    ElMessage.success('成功')
  }).catch(err => {
    if (err !== 'cancel') {
      console.error(err)
      ElMessage.error('刪除失敗')
    }
    // 若是 cancel，就靜默忽略
  })
}

function handleCheck(node, { checkedKeys }) {
  const isChecked = checkedKeys.includes(node.id)
  checkAllChildren(node, isChecked)
}

function checkAllChildren(node, checked) {
  permissionTree.value.setChecked(node.id, checked)
  node.children?.forEach(child => checkAllChildren(child, checked))
}

async function confirmRole() {
  role.perms = permissionTree.value?.getCheckedKeys() || []
  role.depts = role.datas === '自定義'
    ? deptsTree.value?.getCheckedKeys() || []
    : []

  const payload = { ...role }
  if (dialogType.value === 'edit') {
    await updateRole(payload.id, payload)
    const i = tableData.value.findIndex(r => r.id === payload.id)
    if (i !== -1) tableData.value.splice(i, 1, deepClone(payload))
  } else {
    await createRole(payload)
    getRoleList()
  }

  dialogVisible.value = false
  ElMessage.success('成功')
}

onMounted(() => {
  getRoutesList()
  getOrgData()
  getRoleList()
})
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
