<script setup lang="ts">
import { computed } from 'vue'
import type { LayoutPanelElement } from 'km-card-schema'
import { createElementStyleFormatter } from '../../modules/layout/rendering'

const props = defineProps<{
  element: LayoutPanelElement
}>()

const formatStyle = createElementStyleFormatter()
const elementStyle = computed(() => formatStyle(props.element.style))

const containerMode = computed(() => props.element.container.mode)
const containerOptions = computed(() => props.element.container.options)

const paddingValue = (value: number | [number, number] | [number, number, number, number]) => {
  if (typeof value === 'number') {
    return `${value}px`
  }
  if (Array.isArray(value)) {
    return value.map((item) => `${item}px`).join(' ')
  }
  return undefined
}

const containerStyle = computed<Record<string, string | number>>(() => {
  const style: Record<string, string | number> = {
    position: containerMode.value === 'absolute' ? 'relative' : 'relative'
  }

  if (containerMode.value === 'flex') {
    style.display = 'flex'
    style.flexDirection = containerOptions.value?.direction ?? 'row'
    style.flexWrap = containerOptions.value?.wrap ?? 'nowrap'
    style.justifyContent = containerOptions.value?.justifyContent ?? 'flex-start'
    style.alignItems = containerOptions.value?.alignItems ?? 'stretch'

    const gap = containerOptions.value?.gap
    if (typeof gap === 'number') {
      style.gap = `${gap}px`
    } else if (gap && typeof gap === 'object') {
      style.rowGap = `${gap.row}px`
      style.columnGap = `${gap.column}px`
    }
  }

  const padding = containerOptions.value?.padding
  if (padding !== undefined) {
    const formatted = paddingValue(padding)
    if (formatted) {
      style.padding = formatted
    }
  }

  return style
})

const panelStyle = computed(() => ({
  ...elementStyle.value,
  ...containerStyle.value,
  width: '100%',
  height: '100%',
  boxSizing: 'border-box'
}))
</script>

<template>
  <div class="layout-panel" :class="[`layout-panel--${containerMode}`]" :style="panelStyle">
    <slot />
  </div>
</template>

<style scoped>
.layout-panel {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: block;
}

.layout-panel--flex {
  width: 100%;
  height: 100%;
}
</style>
