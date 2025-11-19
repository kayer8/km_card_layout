<script setup lang="ts">
import { computed } from 'vue'
import type { TextElement } from 'km-card-schema'
import { createElementStyleFormatter } from '../../modules/layout/rendering'

const props = defineProps<{
  element: TextElement
  value: string
}>()

const formatStyle = createElementStyleFormatter()
const textStyle = computed(() => formatStyle(props.element.style))
</script>

<template>
  <div class="card-element card-element--text" :style="textStyle">
    {{ props.value }}
  </div>
</template>

<style scoped>
.card-element {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-family: 'Segoe UI', 'PingFang SC', sans-serif;
}

.card-element--text {
  display: block;
  width: 100%;
  height: 100%;
  font-weight: 500;
  user-select: none;
  line-height: 1.3;
  overflow: hidden;
  white-space: pre-line;
}
</style>
