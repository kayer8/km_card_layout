<script setup lang="ts">
import { ref } from 'vue'
import type { CardTemplate } from '../../templates/cardTemplates'

const props = defineProps<{
  copyState: 'idle' | 'copied'
  templates: CardTemplate[]
  selectedTemplateId: string
}>()

const emit = defineEmits<{
  (e: 'copy'): void
  (e: 'select-template', id: string): void
  (e: 'create-template', name: string): void
  (e: 'reset-template'): void
}>()

const createDialogVisible = ref(false)
const templateName = ref('')

const openCreateDialog = () => {
  templateName.value = ''
  createDialogVisible.value = true
}

const handleConfirmCreate = () => {
  if (!templateName.value.trim()) return
  emit('create-template', templateName.value.trim())
  createDialogVisible.value = false
}

const handleTemplateChange = (value: string | number) => {
  emit('select-template', String(value))
}
</script>

<template>
  <header class="designer-header">
    <div>
      <p class="designer-badge">KM · Layout Lab</p>
      <h1>可拖拽式名片布局</h1>
      <p class="muted">拖拽头像/文字，实时生成遵循 @km/card-schema 的 JSON</p>
    </div>
    <t-space size="small" align="center">
      <t-select
        :value="props.selectedTemplateId"
        placeholder="选择模板"
        style="width: 200px"
        @change="handleTemplateChange"
      >
        <t-option
          v-for="template in props.templates"
          :key="template.id"
          :label="template.name"
          :value="template.id"
        >
          {{ template.name }}
          <small v-if="template.description" class="template-desc">�� {{ template.description }}</small>
        </t-option>
      </t-select>
      <t-button class="header-btn create-btn" size="medium" variant="outline" @click="openCreateDialog">
        保存模板
      </t-button>
      <t-button class="header-btn reset-btn" size="medium" variant="outline" @click="emit('reset-template')">
        重置模板
      </t-button>
      <t-button class="header-btn copy-btn" size="medium" theme="primary" @click="emit('copy')">
        {{ props.copyState === 'copied' ? '已复制 JSON' : '复制 JSON' }}
      </t-button>
    </t-space>

    <t-dialog v-model:visible="createDialogVisible" header="保存为模板" theme="default" :footer="false" width="420px">
      <p style="margin-bottom: 12px">输入模板名称，方便后续复用。</p>
      <t-input v-model="templateName" placeholder="例如：客户B方案" />
      <div class="dialog-footer">
        <t-button variant="text" @click="createDialogVisible = false">取消</t-button>
        <t-button theme="primary" :disabled="!templateName.trim()" @click="handleConfirmCreate">保存</t-button>
      </div>
    </t-dialog>
  </header>
</template>

<style scoped>
.designer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 24px;
}

.designer-badge {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid rgba(43, 108, 176, 0.2);
  font-size: 0.85rem;
  color: #2B6CB0;
  background: rgba(43, 108, 176, 0.08);
  margin: 0 0 8px;
}

.designer-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #1A202C;
}

.muted {
  margin: 4px 0 0;
  color: #4A5568;
}

.template-desc {
  color: #4A5568;
  font-size: 0.75rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 8px;
}

.header-btn {
  min-width: 110px;
  font-weight: 500;
}

.create-btn {
  border-color: rgba(43, 108, 176, 0.35);
  color: #2B6CB0;
}

.create-btn:hover {
  border-color: #2B6CB0;
}

.reset-btn {
  border-color: rgba(74, 85, 104, 0.35);
  color: #4A5568;
}

.reset-btn:hover {
  border-color: #4A5568;
  color: #2D3748;
}

.copy-btn {
  background: linear-gradient(120deg, #3B82F6, #2B6CB0);
  border: none;
}

.copy-btn.t-button--primary:hover {
  background: linear-gradient(120deg, #63A4FF, #2C5282);
}

@media (max-width: 768px) {
  .designer-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
