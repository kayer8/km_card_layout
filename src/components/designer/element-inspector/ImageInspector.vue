<script setup lang="ts">
import { computed } from 'vue'
import type { ImageElement } from 'km-card-schema'

const props = defineProps<{
  element: ImageElement
  mutate: (mutator: (draft: ImageElement) => void) => void
}>()

const altValue = computed({
  get: () => props.element.alt ?? '',
  set: (val: string) =>
    props.mutate((draft) => {
      draft.alt = val || undefined
    })
})

const fitValue = computed({
  get: () => props.element.fit ?? 'cover',
  set: (val: 'cover' | 'contain') =>
    props.mutate((draft) => {
      draft.fit = val || undefined
    })
})
</script>

<template>
  <t-form-item label="填充模式">
    <t-radio-group v-model="fitValue" size="small">
      <t-radio-button value="cover">cover</t-radio-button>
      <t-radio-button value="contain">contain</t-radio-button>
    </t-radio-group>
  </t-form-item>

  <t-form-item label="替代文本">
    <t-input v-model="altValue" placeholder="用于无障碍与加载失败兜底" clearable />
  </t-form-item>
</template>
