<script setup lang="ts">
import { computed } from 'vue'
import type { ImageElement } from 'km-card-schema'
import { createElementStyleFormatter } from '../../modules/layout/rendering'

const props = defineProps<{
  element: ImageElement
  value: string
}>()

const formatStyle = createElementStyleFormatter()
const imageStyle = computed(() => {
  const style = formatStyle(props.element.style)
  const fit =
    props.element.fit ??
    (style.objectFit as string | undefined) ??
    (style['object-fit'] as string | undefined) ??
    'cover'
  style.objectFit = fit
  return style
})
</script>

<template>
  <div class="card-element card-element--image">
    <img :src="props.value" :alt="props.element.alt ?? props.element.id" :style="imageStyle" />
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

.card-element--image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
