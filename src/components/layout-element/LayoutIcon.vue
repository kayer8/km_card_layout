<script setup lang="ts">
import { computed } from 'vue'
import type { IconElement } from 'km-card-schema'
import KmIcon from '../common/KmIcon.vue'
import { createElementStyleFormatter } from '../../modules/layout/rendering'

const props = defineProps<{
  element: IconElement
  value: string
}>()

const formatStyle = createElementStyleFormatter()
const iconStyle = computed(() => {
  const style = formatStyle(props.element.style)
  if (props.element.color && !style.color) style.color = props.element.color
  if (props.element.fontSize && !style.fontSize) style.fontSize = `${props.element.fontSize}px`
  return style
})
</script>

<template>
  <div class="card-element card-element--icon">
    <KmIcon
      :name="props.element.name"
      :style="iconStyle"
      :aria-label="props.value || props.element.name"
    />
  </div>
</template>

<style scoped>
.card-element {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
