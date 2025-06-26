<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :draggable="draggable"
    class="custom-dialog"
  >
    <el-scrollbar>
      <slot />
    </el-scrollbar>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">
          {{ cancelButtonText || $t('dialogCom.cancelButtonText') }}
        </el-button>
        <el-button type="primary" @click="handleConfirm">
          {{ confirmButtonText || $t('dialogCom.confirmButtonText') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const visible = defineModel('visible', { type: Boolean, default: false })

const props = defineProps({
  title: String,
  width: { type: String, default: '50%' },
  draggable: { type: Boolean, default: true },
  cancelButtonText: { type: String, default: '' },
  confirmButtonText: { type: String, default: '' }
})

const emit = defineEmits(['handleConfirm'])

function handleConfirm() {
  emit('handleConfirm')
}
</script>

<style lang="scss">
.custom-dialog {
  .el-dialog__header {
    padding-bottom: 16px;
    border-bottom: 1px solid #f5f5f5;
  }

  .el-dialog__body {
    height: 60vh;
    padding-top: 0;
    padding-bottom: 0;
  }

  .el-dialog__footer {
    padding: 10px 20px;
    box-shadow:
      0px 12px 32px 4px rgba(0, 0, 0, 0.04),
      0px 8px 20px rgba(0, 0, 0, 0.08);
  }
}
</style>