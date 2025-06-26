<template>
  <div class="user-container">
    <el-dropdown trigger="click">
      <div class="user-wrapper">
        <img
          :src="avatar+'?imageView2/1/w/80/h/80'"
          class="user-avatar"
        />
        <div class="user-name">{{ name }}</div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <router-link to="/changepassword">
            <el-dropdown-item>
              修改密碼
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click="logout">Log Out</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const name = computed(() => userStore.name)
const url= import.meta.env.VITE_APP_BASE_API.replace(/api/, '')
const avatar = computed(() => url + userStore.avatar)

const logout = async () => {
  await userStore.logout()
  permissionStore.addRoutes = []
  router.push(`/login?redirect=${route.fullPath}`)
}
</script>

<style lang="scss" scoped>
.user-container {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  transition: background 0.3s;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }

  .user-wrapper {
    display: flex;
    align-items: center;

    .user-avatar {
      width: 25px;
      height: 25px;
      border-radius: 5px;
    }

    .user-name {
      padding-left: 5px;
      white-space: nowrap;
    }
  }
}
</style>
