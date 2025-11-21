<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

type FontColorEntry = {
  field: string
  color: string
}

interface TableRow {
  id: string
  image: string
  mainFontColor: string
  fontColors: FontColorEntry[]
}

const createFontColorEntry = (field = '默认文本', color = '#ffffff'): FontColorEntry => ({
  field,
  color
})

const tableData = reactive<TableRow[]>([
  {
    id: 'bg-1',
    mainFontColor: '#ffffff',
    image:'',
    fontColors: [createFontColorEntry('默认文本', '#ffffff')]
  },
  {
    id: 'bg-2',
    image:'',
    mainFontColor: '#1a202c',
    fontColors: [createFontColorEntry('默认文本', '#1a202c')]
  },
  {
    id: 'bg-3',
    image:'',
    mainFontColor: '#ffffff',
    fontColors: [createFontColorEntry('默认文本', '#ffffff')]
  }
])

const previewDialogVisible = ref(false)
const previewImage = ref<string | undefined>()

const columns = computed(() => [
  { colKey: 'preview', title: '背景预览', width: 220, align: 'center' },
  { colKey: 'mainFontColor', title: '主字体色', width: 240, align: 'center' }
])

const dialogVisible = ref(false)
const uploadFiles = ref<any[]>([])
const newBackground = reactive<{
  image?: string
  fontColors: FontColorEntry[]
  mainFontColor: string
}>({
  image: undefined,
  fontColors: [createFontColorEntry()],
  mainFontColor: '#ffffff'
})

const resetDialog = () => {
  newBackground.image = undefined
  newBackground.fontColors.splice(0, newBackground.fontColors.length, createFontColorEntry())
  newBackground.mainFontColor = '#ffffff'
  uploadFiles.value = []
}

const addFontColorEntry = () => {
  newBackground.fontColors.push(createFontColorEntry('', '#ffffff'))
}

const removeFontColorEntry = (index: number) => {
  if (newBackground.fontColors.length <= 1) {
    return
  }
  newBackground.fontColors.splice(index, 1)
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
  if (!newBackground.image) {
    return
  }

  tableData.push({
    id: createId(),
    mainFontColor: newBackground.mainFontColor,
    fontColors: newBackground.fontColors.map((entry) => ({ ...entry })),
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
          <p>{{ tableData.length }} 条记录 </p>
        </div>
      </header>

    <t-table
      row-key="id"
      :data="tableData"
      :columns="columns"
      hover
      table-layout="auto"
    >
      <template #mainFontColor="{ row }">
        <div class="color-chip">
          <span
            class="color-chip__preview"
            :style="{ backgroundColor: row.mainFontColor || '#ffffff' }"
          />
          <span>{{ row.mainFontColor || '—' }}</span>
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
        <label>背景图</label>
        <t-upload
          theme="image"
          accept="image/*"
          :auto-upload="false"
          :files="uploadFiles"
          @change="handleUploadChange"
        />

        <label>主字体色</label>
        <t-color-picker
          class="main-color-picker"
          v-model="newBackground.mainFontColor"
          :color-modes="['monochrome']"
          :swatch-colors="['#ffffff', '#1a202c', '#2b6cb0', '#f4f4f5']"
        />

        <label>字段颜色</label>
        <div class="font-color-inputs">
          <div
            class="font-color-input"
            v-for="(entry, index) in newBackground.fontColors"
            :key="`field-color-${index}`"
          >
            <t-input
              class="field-input"
              v-model="entry.field"
              placeholder="字段名称"
              size="small"
            />
            <t-color-picker
              class="field-color-picker"
              v-model="entry.color"
              size="small"
              :color-modes="['monochrome']"
              :swatch-colors="['#ffffff', '#1a202c', '#2b6cb0', '#f4f4f5']"
            />
            <t-button
              size="small"
              variant="outline"
              theme="danger"
              :disabled="newBackground.fontColors.length === 1"
              @click="removeFontColorEntry(index)"
            >
              移除
            </t-button>
          </div>
          <t-button
            size="small"
            theme="primary"
            variant="outline"
            class="add-field-button"
            @click="addFontColorEntry"
          >
            添加字段颜色
          </t-button>
        </div>
      </div>

      <template #footer>
        <t-button variant="outline" @click="dialogVisible = false">取消</t-button>
        <t-button
          theme="primary"
          :disabled="!newBackground.image"
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
    height: 100%;
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
    flex-grow: 1;
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

  .font-color-inputs {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
  }

  .font-color-input {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .field-input {
    flex: 1;
    min-width: 120px;
  }

  .field-color-picker {
    width: 160px;
  }

  .add-field-button {
    align-self: flex-start;
  }

  .main-color-picker {
    width: 220px;
    margin-bottom: -8px;
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
