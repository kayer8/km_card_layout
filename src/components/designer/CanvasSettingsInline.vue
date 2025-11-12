<script setup lang="ts">
const props = defineProps<{
  backgroundType: 'color' | 'image'
  background: string
  backgroundImage?: string
  fontColor?: string
}>()

const emit = defineEmits<{
  (e: 'update:type', type: 'color' | 'image'): void
  (e: 'update:background', value: string): void
  (e: 'update:image', value: string): void
  (e: 'update:fontColor', value: string): void
}>()

const handleTypeChange = (value: string | number) => {
  emit('update:type', value as 'color' | 'image')
}

const handleBackgroundChange = (value: string | number) => {
  emit('update:background', String(value ?? ''))
}

const handleImageChange = (value: string | number) => {
  emit('update:image', String(value ?? ''))
}

const handleFontColorChange = (value: string | number) => {
  emit('update:fontColor', String(value ?? ''))
}
</script>

<template>
  <div class="canvas-settings-inline">
    <span class="label">背景</span>
    <t-radio-group
      :value="props.backgroundType"
      size="small"
      variant="outline"
      @change="handleTypeChange"
    >
      <t-radio-button value="color">纯色</t-radio-button>
      <t-radio-button value="image">图片</t-radio-button>
    </t-radio-group>

    <t-input
      v-if="props.backgroundType === 'color'"
      :value="props.background"
      placeholder="#111111"
      size="small"
      class="settings-input"
      @change="handleBackgroundChange"
    />
    <t-input
      v-else
      :value="props.backgroundImage"
      placeholder="https://example.com/bg.png"
      size="small"
      class="settings-input"
      @change="handleImageChange"
    />
  </div>

  <div class="color-settings">
    <span class="label">根字体颜色</span>
    <t-input
      :value="props.fontColor"
      placeholder="#FFFFFF"
      size="small"
      class="settings-input"
      @change="handleFontColorChange"
    />
  </div>
</template>

<style scoped>
.canvas-settings-inline {
  display: flex;
  align-items: center;
  gap: 16px;
}

.label {
  font-size: 0.9rem;
  color: #c7cad6;
}

.settings-input {
  min-width: 180px;
}

.color-settings {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
