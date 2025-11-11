<script setup lang="ts">
const props = defineProps<{
  copyState: 'idle' | 'copied'
}>()

const emit = defineEmits<{
  (e: 'reset'): void
  (e: 'copy'): void
}>()
</script>

<template>
  <header class="designer-header">
    <div>
      <p class="designer-badge">KM · Layout Lab</p>
      <h1>可拖拽式名片布局</h1>
      <p class="muted">拖拽头像/文字，实时生成遵循 @km/card-schema 的 JSON</p>
    </div>
    <t-space size="small">
      <t-button variant="outline" theme="default" @click="emit('reset')">重置模板</t-button>
      <t-button theme="primary" @click="emit('copy')">
        {{ props.copyState === 'copied' ? '已复制 JSON' : '复制 JSON' }}
      </t-button>
    </t-space>
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  color: #c7cad6;
  margin: 0 0 8px;
}

.designer-header h1 {
  margin: 0;
  font-size: 2rem;
}

.muted {
  margin: 4px 0 0;
  color: #9ba2bc;
}

@media (max-width: 768px) {
  .designer-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
