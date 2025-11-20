<script setup lang="ts">
import { computed } from 'vue'
import type { CustomElement } from 'km-card-schema'
import { createElementStyleFormatter } from '../../modules/layout/rendering'

const props = defineProps<{
  element: CustomElement
  value: string
}>()

const formatStyle = createElementStyleFormatter()
const customStyle = computed(() => formatStyle(props.element.style))
</script>

<template>
  <div class="card-element card-element--custom" :style="customStyle">
  </div>
</template>

<style scoped>
.card-element {
  display: flex; 
   width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.card-element--custom {
}

</style>
