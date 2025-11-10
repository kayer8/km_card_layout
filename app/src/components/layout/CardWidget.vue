<script setup lang="ts">
import { computed } from 'vue'
import type { WidgetInstance } from '@/stores/layoutStore'
import { useLayoutStore } from '@/stores/layoutStore'

const props = defineProps<{
  widget: WidgetInstance
}>()

const layoutStore = useLayoutStore()
const fieldMap = computed(() => layoutStore.fieldMap)

const displayText = computed(() => {
  const binding = props.widget.binding
  if (binding?.fieldKey) {
    const field = fieldMap.value[binding.fieldKey]
    return field?.defaultValue ?? binding.fallbackText ?? 'Bound field'
  }
  if (binding?.fallbackText) {
    return binding.fallbackText
  }
  return 'Unbound content'
})

const bindingLabel = computed(() => {
  const binding = props.widget.binding
  if (binding?.fieldKey) return binding.fieldKey
  return null
})

const textStyle = computed(() => ({
  fontFamily: props.widget.style.fontFamily ?? 'Inter, "PingFang SC", sans-serif',
  fontSize: props.widget.style.fontSize ? `${props.widget.style.fontSize}px` : '16px',
  fontWeight: props.widget.style.fontWeight ?? 400,
  lineHeight: props.widget.style.lineHeight ? `${props.widget.style.lineHeight}` : '1.4',
  letterSpacing: props.widget.style.letterSpacing ? `${props.widget.style.letterSpacing}px` : undefined,
  color: props.widget.style.color ?? '#1D2129',
  textAlign: props.widget.style.textAlign ?? 'left',
}))
</script>

<template>
  <div class="card-widget">
    <div class="card-widget__badge">
      <span class="card-widget__badge-title">{{ widget.title }}</span>
      <span v-if="bindingLabel" class="card-widget__badge-tag">
        {{ bindingLabel }}
      </span>
    </div>

    <template v-if="widget.type === 'text'">
      <div class="card-widget__text" :style="textStyle">
        {{ displayText }}
      </div>
    </template>

    <template v-else-if="widget.type === 'qrcode'">
      <div class="card-widget__qrcode">
        <span>QR Code</span>
      </div>
    </template>

    <template v-else>
      <div class="card-widget__placeholder">
        {{ widget.title }} (coming soon)
      </div>
    </template>
  </div>
</template>

<style scoped>
.card-widget {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 28px;
}

.card-widget__badge {
  position: absolute;
  top: 8px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(17, 18, 32, 0.08);
  color: var(--td-text-color-primary);
  font-size: 11px;
  font-weight: 600;
  pointer-events: none;
}

.card-widget__badge-tag {
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(43, 75, 253, 0.12);
  color: #2b4bfd;
  font-weight: 500;
}

.card-widget__text {
  width: 100%;
  word-break: break-word;
  white-space: pre-wrap;
}

.card-widget__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--td-text-color-tertiary);
  background: rgba(43, 75, 253, 0.06);
  border: 1px dashed rgba(43, 75, 253, 0.3);
  border-radius: 6px;
}

.card-widget__qrcode {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(43, 75, 253, 0.12), rgba(18, 194, 233, 0.12));
  color: var(--td-text-color-secondary);
  font-size: 12px;
  border-radius: 12px;
  border: 1px dashed rgba(43, 75, 253, 0.3);
}
</style>
