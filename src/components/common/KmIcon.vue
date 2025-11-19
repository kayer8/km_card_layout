<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'KmIcon' })

const props = withDefaults(
  defineProps<{
    /**
     * 图标名称（可带/不带 icon- 前缀）
     */
    name: string
    /**
     * 文字大小，数字会自动追加 px
     */
    size?: number | string
    /**
     * 字体颜色
     */
    color?: string
    /**
     * 自定义渲染标签，默认为 i
     */
    tag?: string
  }>(),
  {
    tag: 'i'
  }
)

const normalizedName = computed(() => {
  if (!props.name) return ''
  return props.name.startsWith('icon-') ? props.name : `icon-${props.name}`
})

const normalizeSize = (value?: number | string) => {
  if (value === undefined || value === null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

const iconStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.color) style.color = props.color
  const size = normalizeSize(props.size)
  if (size) style.fontSize = size
  return style
})
</script>

<template>
  <component
    :is="props.tag"
    class="km-icon icon"
    :class="normalizedName"
    :style="iconStyle"
    aria-hidden="true"
  />
</template>

<style scoped>
.km-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'km-icon' !important;
  font-style: normal;
  font-variant: normal;
  font-weight: normal;
  line-height: 1;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
