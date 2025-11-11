<script setup lang="ts">
const props = defineProps<{
  serializedSchema: string
  copyState: 'idle' | 'copied'
}>()

const emit = defineEmits<{
  (e: 'copy'): void
}>()
</script>

<template>
  <div class="schema-preview">
    <div class="preview-header">
      <div>
        <h3>布局 JSON</h3>
        <p>复制即可接入其他项目</p>
      </div>
      <t-button size="small" variant="outline" @click="emit('copy')">
        {{ props.copyState === 'copied' ? '已复制' : '复制' }}
      </t-button>
    </div>
    <pre>{{ props.serializedSchema }}</pre>
  </div>
</template>

<style scoped>
.schema-preview {
  margin-top: 24px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.25);
  padding: 16px;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.preview-header h3 {
  margin: 0;
}

.preview-header p {
  margin: 4px 0 0;
  color: #9ba2bc;
  font-size: 0.9rem;
}

pre {
  margin: 0;
  max-height: 300px;
  overflow: auto;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.25);
  padding: 12px;
  border-radius: 12px;
}
</style>
