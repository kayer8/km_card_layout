<script setup lang="ts">
import { computed } from 'vue'
import type { TextElement } from 'km-card-schema'

const props = defineProps<{
  element: TextElement
  mutate: (mutator: (draft: TextElement) => void) => void
}>()

const updateStyleField = (field: string, value: string | number | null) => {
  props.mutate((draft) => {
    draft.style = { ...(draft.style ?? {}) }
    if (value === null || value === undefined || value === '') {
      delete draft.style[field]
    } else {
      draft.style[field] = value
    }
  })
}

const fontSizeValue = computed({
  get: () => {
    const raw = props.element.style?.fontSize
    const parsed =
      typeof raw === 'number' ? raw : Number.parseFloat(raw ? String(raw) : 'NaN')
    return Number.isFinite(parsed) ? parsed : 18
  },
  set: (val: number | null) => updateStyleField('fontSize', val ?? null)
})

const colorValue = computed({
  get: () => (props.element.style?.color ?? '#FFFFFF') as string,
  set: (val: string) => updateStyleField('color', val || null)
})

const textAlignValue = computed({
  get: () => (props.element.style?.textAlign ?? 'left') as 'left' | 'center' | 'right',
  set: (val: 'left' | 'center' | 'right') => updateStyleField('textAlign', val)
})

const isBold = computed(() => {
  const weight = props.element.style?.fontWeight
  if (typeof weight === 'number') return weight >= 600
  return weight === 'bold' || weight === '600' || weight === '700'
})

const isItalic = computed(() => props.element.style?.fontStyle === 'italic')
const isUnderline = computed(() => props.element.style?.textDecoration === 'underline')

const toggleBold = () => {
  updateStyleField('fontWeight', isBold.value ? 'normal' : 'bold')
}

const toggleItalic = () => {
  updateStyleField('fontStyle', isItalic.value ? undefined : 'italic')
}

const toggleUnderline = () => {
  updateStyleField('textDecoration', isUnderline.value ? undefined : 'underline')
}
</script>

<template>
  <t-form-item label="文字样式">
    <div class="text-style-panel">
      <div class="style-row">
        <div class="style-group">
          <span class="style-label">字号</span>
          <t-input-number
            v-model:value="fontSizeValue"
            size="small"
            :min="8"
            :max="120"
            :step="1"
            style="width: 120px"
          />
        </div>

        <div class="style-group">
          <span class="style-label">颜色</span>
          <t-color-picker
            v-model="colorValue"
            size="small"
            :popup-props="{ placement: 'bottom' }"
            :show-primary-color-preview="false"
            clearable
            :color-modes="['monochrome', 'linear-gradient']"
          />
        </div>
      </div>

      <div class="style-row">
        <span class="style-label">样式</span>
        <div class="style-buttons">
          <t-button
            size="small"
            variant="outline"
            :theme="isBold ? 'primary' : 'default'"
            @click="toggleBold"
          >
            B
          </t-button>
          <t-button
            size="small"
            variant="outline"
            :theme="isItalic ? 'primary' : 'default'"
            @click="toggleItalic"
          >
            I
          </t-button>
          <t-button
            size="small"
            variant="outline"
            :theme="isUnderline ? 'primary' : 'default'"
            @click="toggleUnderline"
          >
            U
          </t-button>
        </div>
      </div>

      <div class="style-row align-row">
        <span class="style-label">对齐</span>
        <div class="style-buttons">
          <t-button
            size="small"
            variant="outline"
            :theme="textAlignValue === 'left' ? 'primary' : 'default'"
            @click="textAlignValue = 'left'"
          >
           左
          </t-button>
          <t-button
            size="small"
            variant="outline"
            :theme="textAlignValue === 'center' ? 'primary' : 'default'"
            @click="textAlignValue = 'center'"
          >
            居中
          </t-button>
          <t-button
            size="small"
            variant="outline"
            :theme="textAlignValue === 'right' ? 'primary' : 'default'"
            @click="textAlignValue = 'right'"
          >
            右
          </t-button>
        </div>
      </div>
    </div>
  </t-form-item>
</template>

<style scoped>
.text-style-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.style-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.style-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.style-label {
  font-size: 0.9rem;
  color: #4a5568;
}

.style-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.align-row .style-label {
  width: 36px;
}
</style>
