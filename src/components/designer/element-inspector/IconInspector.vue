<script setup lang="ts">
import { computed } from 'vue'
import type { IconElement } from 'km-card-schema'

const props = defineProps<{
  element: IconElement
  mutate: (mutator: (draft: IconElement) => void) => void
}>()

const nameValue = computed({
  get: () => props.element.name ?? '',
  set: (val: string) =>
    props.mutate((draft) => {
      draft.name = val || undefined
    })
})

const colorValue = computed({
  get: () => props.element.color ?? props.element.style?.color ?? '',
  set: (val: string) =>
    props.mutate((draft) => {
      draft.color = val || undefined
      draft.style = { ...(draft.style ?? {}) }
      if (val) {
        draft.style.color = val
      } else {
        delete draft.style.color
      }
    })
})

const fontSizeValue = computed({
  get: () => props.element.fontSize ?? 20,
  set: (val: number | null) =>
    props.mutate((draft) => {
      draft.fontSize = val ?? undefined
    })
})
</script>

<template>
  <t-form-item label="图标名称">
    <t-input v-model="nameValue" placeholder="icon-buy-vip-13" clearable />
  </t-form-item>

  <t-form-item label="图标颜色">
    <t-color-picker
      v-model="colorValue"
      size="small"
      :popup-props="{ placement: 'bottom' }"
      :show-primary-color-preview="false"
      clearable
    />
  </t-form-item>

  <t-form-item label="图标字号">
    <t-input-number v-model:value="fontSizeValue" size="small" :min="0" />
  </t-form-item>
</template>
