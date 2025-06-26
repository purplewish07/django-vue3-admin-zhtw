<template>
  <div class="app-container">
    <el-form
      ref="fromRef"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="100px"
    >
      <el-form-item label="舊密碼" prop="old_password">
        <el-input
          v-model="formData.old_password"
          placeholder="請輸入舊密碼"
          clearable
          show-password
        />
      </el-form-item>

      <el-form-item label="新密碼" prop="new_password1">
        <el-input
          v-model="formData.new_password1"
          placeholder="請輸入新密碼"
          clearable
          show-password
        />
      </el-form-item>

      <el-form-item label="確認密碼" prop="new_password2">
        <el-input
          v-model="formData.new_password2"
          placeholder="請再次輸入新密碼"
          clearable
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { changePassword } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const fromRef = ref()

const defaultFormData = {
  old_password: '',
  new_password1: '',
  new_password2: ''
}
const formData = reactive({...defaultFormData})

const validateConfirm = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('請再次輸入新密碼'))
  }
  if (value !== formData.new_password1) {
    return callback(new Error('兩次密碼不一致'))
  }
  callback()
}

const rules = {
  old_password: [{ required: true, message: '請輸入舊密碼', trigger: 'blur' }],
  new_password1: [{ required: true, message: '請輸入新密碼', trigger: 'blur' }],
  new_password2: [
    { required: true, validator: validateConfirm, trigger: 'blur' }
  ]
}

function submitForm() {
  fromRef.value.validate(valid => {
    if (!valid) return

    changePassword(formData)
      .then(() => {
        ElMessage.success('密碼修改成功，請重新登入')
        return userStore.logout()
      })
      .then(() => {
        router.push('/login')
      })
      .catch(err => {
        console.error('修改失敗', err)
        ElMessage.error('修改失敗，請確認密碼是否正確')
      })
  })
}


function resetForm() {
  fromRef.value.resetFields()
}
</script>