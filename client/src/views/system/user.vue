<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :md="6">
        <el-card>
          <template #header>
            <span>部門</span>
          </template>

        <el-input v-model="filterOrgText" placeholder="輸入部門名進行過濾" />

        <el-tree
          ref="treeRef"
          v-loading="treeLoading"
          class="filter-tree"
          :data="orgData"
          node-key="id" 
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          style="margin-top:6px;"
          @node-click="handleOrgClick"
        />
        </el-card>
      </el-col>
      <el-col :md="18">
        <el-card>
          <template #header>
            <span>用戶</span>
          </template>
          <div>
            <el-select
              v-model="listQuery.is_active"
              placeholder="狀態"
              clearable
              style="width: 90px"
              class="filter-item"
              @change="handleFilter"
            >
              <el-option
                v-for="item in enabledOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
            <el-input
              v-model="listQuery.name"
              placeholder="姓名"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter="handleFilter"
            />
            <el-button
              class="filter-item"
              type="primary"
              @click="handleFilter"
              size="small"
            ><el-icon><Search /></el-icon>搜索</el-button>
            <el-button
              class="filter-item"
              type="primary"
              @click="resetFilter"
              size="small"
            ><el-icon><RefreshLeft /></el-icon>重置</el-button>
          </div>
          <div style="margin-top:6px">
            <el-button
              v-if="checkPermission(['user_create'])"
              type="primary"
              size="small"
              @click="handleAddUser"
            ><el-icon><Plus /></el-icon>新增</el-button>
          </div>
          <el-table
            v-loading="listLoading"
            :data="userList.results"
            style="width: 100%;margin-top:6px;"
            highlight-current-row
            row-key="id"
            stripe
            border
            v-el-height-adaptive-table="{bottomOffset: 50}"
          >
            <el-table-column type="index" width="50" />
            <el-table-column align="center" label="姓名">
              <template #default="{ row }">{{ row.name }}</template>
            </el-table-column>
            <el-table-column align="center" label="賬戶">
              <template #default="{ row }">{{ row.username }}</template>
            </el-table-column>
            <el-table-column align="center" label="部門">
              <template #default="{ row }">
                <span v-if="row.dept_name">{{ row.dept_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="創建日期">
              <template #default="{ row }">{{ row.date_joined }}</template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template #default="{ row, $index }">
                <el-button
                  v-if="!row.is_superuser"
                  :disabled="!checkPermission(['user_update'])"
                  type="primary"
                  size="small"
                  @click="handleEdit(row)"
                ><el-icon><Edit /></el-icon></el-button>
                <el-button
                  v-if="!row.is_superuser"
                  :disabled="!checkPermission(['user_delete'])"
                  type="danger"
                  size="small"
                  @click="handleDelete(row, $index)"
                ><el-icon><Delete /></el-icon></el-button>
              </template>
            </el-table-column>
          </el-table>

          <Pagination
            v-show="userList.count > 0"
            :total="userList.count"
            v-model:page="listQuery.page"
            v-model:limit="listQuery.page_size"
            @pagination="getList"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'edit' ? '編輯用戶' : '新增用戶'"
      :append-to-body="true"
    >
      <el-form
        ref="formRef"
        :model="user"
        label-width="80px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" placeholder="姓名" />
        </el-form-item>

        <el-form-item label="賬戶" prop="username">
          <el-input v-model="user.username" placeholder="賬戶" />
        </el-form-item>

        <el-form-item label="密碼" prop="password">
          <el-input v-model="user.password" placeholder="密碼" type="password" />
        </el-form-item>

        <el-form-item label="所屬部門" prop="dept">
          <el-tree-select
            v-model="user.dept"
            :data="orgData"
            :props="{ value: 'id', label: 'label', children: 'children' }"
            check-strictly
            clearable
            filterable
            default-expand-all
            placeholder="所屬部門"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item label="角色" prop="roles">
          <el-select
            v-model="user.roles"
            multiple
            placeholder="請選擇"
            style="width: 100%"
          >
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="頭像">
          <el-upload
            class="avatar-uploader"
            :action="upUrlRef"
            :headers="upHeadersRef"
            accept="image/jpeg,image/png,image/gif,image/bmp"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="user.avatar" :src="url + user.avatar" class="avatar" />
            <el-icon class="avatar-uploader-icon" v-else><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm()">確認</el-button>
      </template>
    </el-dialog>
  </div>
  
</template>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { getUserList, createUser, deleteUser, updateUser } from "@/api/user";
import { getOrgAll as fetchOrgAll } from '@/api/org'
import { getRoleAll as fetchRoleAll } from '@/api/role'
import { genTree } from "@/utils"
import checkPermission from "@/utils/permission"
import { upUrl, upHeaders } from "@/api/file"
import Pagination from "@/components/Pagination" // secondary package based on el-pagination
// import Treeselect from "vue3-treeselect"
// import "vue3-treeselect/dist/vue3-treeselect.css"
const url = import.meta.env.VITE_APP_BASE_API.replace(/api/, '')
// 預設使用者欄位
const defaultUser = {
  id: '',
  name: '',
  username: '',
  dept: null,
  avatar: '/media/default/avatar.png',
  password: '',
  roles: []
}
// 狀態定義
const user = reactive({ ...defaultUser })
const upUrlRef = ref(upUrl())
const upHeadersRef = ref(upHeaders())
const userList = reactive({ count: 0, results: [] })
const roles = ref([])
const listLoading = ref(true)
const listQuery = reactive({ page: 1, page_size: 20 })
const enabledOptions = [
  { key: 'true', display_name: '激活' },
  { key: 'false', display_name: '禁用' }
]
const dialogVisible = ref(false)
const dialogType = ref('new')
const rules = reactive({
  name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
  username: [{ required: true, message: '請輸入賬號', trigger: 'change' }]
})

const filterOrgText = ref('')
const orgData = ref([])
const treeLoading = ref(false)

// refs
const formRef = ref()
const treeRef = ref()
import { ElMessage, ElMessageBox } from 'element-plus'


// 頭像上傳成功
function handleAvatarSuccess(res) {
  user.avatar = res.data.path
}

// 上傳限制檢查
function beforeAvatarUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('上傳頭像圖片大小不能超過 2MB!')
  }
  return isLt2M
}

// el-tree 過濾邏輯
function filterNode(value, data) {
  if (!value) return true
  return data.label.includes(value)
}

// 點選部門節點
function handleOrgClick(node) {
  listQuery.page = 1
  listQuery.dept = node.id
  getList()
}

// 取得用戶列表
function getList() {
  listLoading.value = true
  getUserList(listQuery).then(res => {
    if (res.data) {
      // console.log(res.data)
      userList.count = res.data.count
      userList.results = res.data.results
    }
    listLoading.value = false
  })
}

// 取得部門資料
function getOrgAll() {
  treeLoading.value = true
  fetchOrgAll().then(res => {
    orgData.value = genTree(res.data)
    treeLoading.value = false
  })
}

// 取得角色資料
function getRoleAll() {
  fetchRoleAll().then(res => {
    roles.value = genTree(res.data)
  })
}

// 重置篩選器
function resetFilter() {
  Object.assign(listQuery, {
    page: 1,
    page_size: 20,
    name: '',
    is_active: '',
    dept: undefined
  })
  // 重置 el-tree 的目前高亮節點
  treeRef.value?.setCurrentKey(null)
  filterOrgText.value = ''
  getList()
}

// 執行篩選
function handleFilter() {
  listQuery.page = 1
  getList()
}

// 新增使用者
function handleAddUser() {
  Object.assign(user, defaultUser)
  dialogType.value = 'new'
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 編輯使用者
function handleEdit(row) {
  Object.assign(user, row)
  console.log(user)
  dialogType.value = 'edit'
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

// 刪除使用者
function handleDelete(row, index) {
  ElMessageBox.confirm('確認刪除?', '警告', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteUser(row.id)
    userList.results.splice(index, 1)
    ElMessage.success('成功刪除!')
  }).catch(err => {
      if (err !== 'cancel') {
        console.error(err)
        ElMessage.error('刪除失敗')
      }
      // 若是 cancel，就靜默忽略
    })
}

// 新增／更新使用者確認
function confirm() {
  formRef.value.validate(valid => {
    if (!valid) return

    const isEdit = dialogType.value === 'edit'
    const data = { ...user }
    if (isEdit && !data.password) delete data.password

    const action = isEdit
      ? updateUser(data.id, data)
      : createUser(data)

    action.then(() => {
      dialogVisible.value = false
      ElMessage.success(isEdit ? '編輯成功' : '新增成功')
      getList()
    })
  })
}

watch(filterOrgText, val => {
  treeRef.value?.filter(val)
})

// watch(dialogVisible, (val) => {
//   console.log('dialogVisible is now', val)
// })


// 初始執行
onMounted(() => {
  getList()
  getOrgAll()
  getRoleAll()
})
</script>
