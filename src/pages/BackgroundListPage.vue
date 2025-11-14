<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

interface TableRow {
  id: string
  name: string
  description: string
  fontColor?: string
  image?: string
}

const tableData = reactive<TableRow[]>([
  {
    id: 'bg-1',
    name: 'Cobalt 渐变',
    description: '蓝紫渐变，适合科技/咨询',
    fontColor: '#ffffff'
  },
  {
    id: 'bg-2',
    name: 'Grid Pattern',
    description: '浅色栅格纹理，适配金融行业',
    fontColor: '#1a202c'
  },
  {
    id: 'bg-3',
    name: 'Signature Photo',
    description: '客户提供的实景图',
    fontColor: '#ffffff'
  }
])

const previewDialogVisible = ref(false)
const previewImage = ref<string | undefined>()

const columns = computed(() => [
  { colKey: 'name', title: '名称', width: 220 },
  { colKey: 'fontColor', title: '字体颜色', width: 200, align: 'center' },
  { colKey: 'preview', title: '背景预览', width: 200, align: 'center' }
])

const dialogVisible = ref(false)
const uploadFiles = ref<any[]>([])
const newBackground = reactive<{ name: string; image?: string; fontColor: string }>({
  name: '',
  image: undefined,
  fontColor: '#ffffff'
})

const resetDialog = () => {
  newBackground.name = ''
  newBackground.image = undefined
  newBackground.fontColor = '#ffffff'
  uploadFiles.value = []
}

const createId = () => `bg-${Math.random().toString(36).slice(2, 8)}`

const handleUploadChange = (files: any) => {
  uploadFiles.value = files
  const file = files?.[0]?.raw
  if (!file) {
    newBackground.image = undefined
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    newBackground.image = reader.result as string
  }
  reader.readAsDataURL(file as File)
}

const submitBackground = () => {
  if (!newBackground.image || !newBackground.name.trim()) {
    return
  }
  tableData.push({
    id: createId(),
    name: newBackground.name.trim(),
    description: `字体颜色 ${newBackground.fontColor}`,
    fontColor: newBackground.fontColor,
    image: newBackground.image
  })
  dialogVisible.value = false
  resetDialog()
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>背景管理</h1>
      <t-button theme="primary" @click="dialogVisible = true">新建背景</t-button>
    </header>

    <div class="card">
      <header class="card__header">
        <div>
          <h3>背景素材列表</h3>
          <p>{{ tableData.length }} 条记录 · 支持预览与替换</p>
        </div>
      </header>

      <t-table
        row-key="id"
        :data="tableData"
        :columns="columns"
        hover
        table-layout="auto"
      >
        <template #fontColor="{ row }">
          <div class="color-chip">
            <span class="color-chip__preview" :style="{ backgroundColor: row.fontColor || '#ffffff' }" />
            <span>{{ row.fontColor }}</span>
          </div>
        </template>
        <template #preview="{ row }">
          <button
            class="preview-trigger"
            :disabled="!row.image"
            type="button"
            @click="() => { previewImage = row.image; previewDialogVisible = true }"
          >
            <div
              class="preview-trigger__image"
              :style="{
                backgroundImage: row.image ? `url(${row.image})` : undefined,
                backgroundColor: row.image ? undefined : '#e5e9f2'
              }"
            />
          </button>
        </template>
      </t-table>
    </div>

    <t-dialog
      v-model:visible="dialogVisible"
      header="新建背景"
      width="520px"
      @closed="resetDialog"
    >
      <div class="dialog-form">
        <label>名称</label>
        <t-input v-model="newBackground.name" placeholder="例如：品牌蓝渐变" />

        <label>背景图</label>
        <t-upload
          theme="image"
          accept="image/*"
          :auto-upload="false"
          :files="uploadFiles"
          @change="handleUploadChange"
        />

        <label>字体颜色</label>
        <t-color-picker
          class="color-picker"
          :color-modes="['monochrome']"
          :swatch-colors="['#ffffff', '#1a202c', '#2b6cb0', '#f4f4f5']"
          v-model="newBackground.fontColor"
        />
      </div>

      <template #footer>
        <t-button variant="outline" @click="dialogVisible = false">取消</t-button>
        <t-button
          theme="primary"
          :disabled="!newBackground.image || !newBackground.name.trim()"
          @click="submitBackground"
        >
          确认创建
        </t-button>
      </template>
    </t-dialog>

    <t-dialog v-model:visible="previewDialogVisible" header="背景预览" width="640px">
      <div class="preview-dialog">
        <img v-if="previewImage" :src="previewImage" alt="背景预览" />
        <p v-else>暂无背景图片</p>
      </div>
    </t-dialog>
  </section>
</template>

<style scoped>
  .page {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .page__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  h1 {
    margin: 0;
  }

  .card {
    background: #fff;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 18px 40px rgba(90, 107, 255, 0.12);
    border: 1px solid rgba(90, 107, 255, 0.08);
  }

  .card__header {
    margin-bottom: 16px;
  }

  .card__header h3 {
    margin: 0;
  }

  .card__header p {
    margin: 6px 0 0;
    color: #64748b;
  }

  .dialog-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .dialog-form label {
    font-size: 0.9rem;
    color: #4a5568;
  }

  .color-picker {
    width: 220px;
  }

  .color-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: #1a202c;
  }

  .color-chip__preview {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .preview-trigger {
    border: none;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }

  .preview-trigger:disabled {
    cursor: not-allowed;
  }

  .preview-trigger__image {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background-size: cover;
    background-position: center;
  }

  .preview-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  .preview-dialog img {
    max-width: 100%;
    border-radius: 12px;
  }

  @media (max-width: 768px) {
    .page__header {
      flex-direction: column;
    }

    .card {
      padding: 20px;
    }
  }
</style>
