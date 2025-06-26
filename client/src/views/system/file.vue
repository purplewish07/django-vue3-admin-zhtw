<template>
  <div class="app-container">
    <div>
      <el-select
        v-model="listQuery.type"
        placeholder="文件類型"
        clearable
        style="width: 200px"
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
        v-model="listQuery.search"
        placeholder="文件名"
        style="width: 300px"
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
        v-if="checkPermission(['file_create'])"
        type="primary"
        size="small"
        @click="handleAdd"
      ><el-icon><Plus /></el-icon>新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="fileList.results"
      style="width: 100%;margin-top:10px;"
      highlight-current-row
      row-key="id"
      stripe
      border
      v-el-height-adaptive-table="{bottomOffset: 50}"
    >
      <el-table-column type="index" width="50" />
      <el-table-column align="center" label="名稱">
        <template #default="{ row }">
          <el-link type="primary" :href="row.file" target="_blank">
            {{ row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="類型" align="center" />
      <el-table-column prop="mime" label="格式" align="center" />
      <el-table-column prop="size" label="大小(B)" align="center" />
      <el-table-column prop="path" label="地址" align="center" />
      <el-table-column prop="create_time" label="上傳日期" />
      <el-table-column  label="操作" v-slot="{ row }" align="center">
        <!-- <el-button
          type="primary"
          size="small"
          :disabled="!checkPermission(['file_update'])"
          @click="handleEdit(row)"
        ><el-icon><Edit /></el-icon></el-button> -->
        <el-button
          type="danger"
          size="small"
          :disabled="!checkPermission(['file_delete'])"
          @click="handleDelete(row)"
        ><el-icon><Delete /></el-icon></el-button>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="fileList.count > 0"
      :total="fileList.count"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.page_size"
      @pagination="getList"
    />

    <el-dialog v-model="dialogVisible" 
      :title="dialogTitle"
    >
      <el-form
        ref="formRef"
        :model="file" label-width="80px"
      >
        <el-form-item :label="dialogTitle">
          <el-upload
            class="file-uploader"
            :action="upUrlRef"
            :headers="upHeadersRef"
            accept="image/jpeg,image/png,image/gif,image/bmp,application/pdf"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
          >
            <el-icon class="file-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-text style="margin-left: 5px;">檔案大小不能超過 5MB</el-text>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" type="danger">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<style>
.file-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.file-uploader .el-upload:hover {
  border-color: #409eff;
}
.file-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.file {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
<script setup>
import { ref, computed, reactive, nextTick, onMounted } from 'vue'
import { upUrl, upHeaders, getFileList, deletefile } from "@/api/file"
import Pagination from "@/components/Pagination"
import checkPermission from "@/utils/permission"
const listLoading = ref(false)

const listQuery = reactive({
  page: 1,
  page_size: 20,
  type: '',
  search: ''
})

const fileList = ref({ count: 0, results: [] })

const enabledOptions = [
  { key: '文檔', display_name: '文檔' },
  { key: '圖片', display_name: '圖片' },
  { key: '音頻', display_name: '音頻' },
  { key: '視頻', display_name: '視頻' },
  { key: '其它', display_name: '其它' }
]

const defaultFile =  {
  id: null,
  name: '',
  type: '',
  mime: '',
  path: '',
  size: 0,
}
const file = reactive({ ...defaultFile })
const upUrlRef = ref(upUrl())
const upHeadersRef = ref(upHeaders())
const dialogVisible = ref(false)
const dialogType = ref('new')
const formRef = ref()

const dialogTitle = computed(() =>
  dialogType.value === 'edit' ? '更新檔案' : '新增檔案'
)

function getList() {
  listLoading.value = true
  getFileList({ ...listQuery }).then(res => {
    if (res.data) {
      fileList.value = res.data
    }
    listLoading.value = false
  })
}

function beforeUpload(file) {
  const isAllowedType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isAllowedType) {
    ElMessage.error('只允許上傳 pdf/jpg/png 檔案')
  }
  if (!isLt5M) {
    ElMessage.error('檔案大小不能超過 5MB')
  }
  return isAllowedType && isLt5M
}

function handleSuccess(res) {
  if (res?.data) {
    ElMessage.success('上傳成功')
    dialogVisible.value = false
    getList() // 重新刷新列表
  } else {
    ElMessage.warning('伺服器未回傳資料')
  }
}


function resetFilter() {
  listQuery.page = 1
  listQuery.page_size = 20
  listQuery.type = ''
  listQuery.search = ''
  getList()
}

function handleFilter() {
  listQuery.page = 1
  getList()
}


function handleAdd() {
  // Object.assign(org, defaultOrg)
  dialogType.value = 'new'
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

function handleEdit(row) {
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
      await deletefile(row.id)
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

onMounted(() => {
  getList()
})
</script>

