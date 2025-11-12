<template>
  <div class="card-layout-wrapper" ref="wrapperRef">
    <div class="card-layout" :style="cardStyle">
      <template v-for="element in renderedElements" :key="element.id">
        <img
          v-if="element.type === 'image'"
          class="card-element card-element--image"
          :style="element.style"
          :src="element.src"
          :alt="element.alt || ''"
        />
        <div
          v-else-if="element.type === 'icon'"
          class="card-element card-element--icon"
          :style="element.style"
        ></div>
        <div
          v-else
          class="card-element card-element--text"
          :style="element.style"
        >
          {{ element.content }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { CSSProperties } from 'vue'
import {
  scaleCardLayout,
  type CardLayoutSchema,
  type CardElement
} from 'km-card-schema'

type LayoutProp = CardLayoutSchema

type LayoutData = Record<string, any>

const props = defineProps<{ layout: LayoutProp; data: LayoutData }>()

const wrapperRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)

const updateMeasuredWidth = () => {
  if (!wrapperRef.value) return
  const width = wrapperRef.value.clientWidth
  if (width !== containerWidth.value && width > 0) {
    containerWidth.value = width
  }
}

let resizeObserver: ResizeObserver | null = null

const cleanupObserver = () => {
  resizeObserver?.disconnect()
  resizeObserver = null
}

const initObserver = () => {
  if (typeof window === 'undefined') {
    containerWidth.value = props.layout.width
    return
  }

  updateMeasuredWidth()

  if (!wrapperRef.value) return

  resizeObserver = new ResizeObserver(() => updateMeasuredWidth())
  resizeObserver.observe(wrapperRef.value)
}

onMounted(async () => {
  await nextTick()
  initObserver()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateMeasuredWidth)
  }
})

onBeforeUnmount(() => {
  cleanupObserver()
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateMeasuredWidth)
  }
})

const effectiveWidth = computed(() => {
  return containerWidth.value > 0 ? containerWidth.value : props.layout.width
})

const normalizedLayout = computed(() =>
  scaleCardLayout(props.layout, {
    targetWidth: effectiveWidth.value
  })
)

const cardStyle = computed<CSSProperties>(() => {
  const layout = normalizedLayout.value
  const style: CSSProperties = {
    width: `${layout.width}px`,
    height: `${layout.height}px`,
    background: layout.background || '#111',
    borderRadius: layout.borderRadius ? `${layout.borderRadius}px` : undefined,
    padding: layout.padding ? `${layout.padding}px` : undefined,
    boxSizing: 'border-box',
    color: '#fff'
  }

  if (layout.backgroundType === 'image' && layout.backgroundImage) {
    style.backgroundImage = `url(${layout.backgroundImage})`
    style.backgroundSize = 'cover'
    style.backgroundRepeat = 'no-repeat'
  }

  return style
})

const toCssValue = (value: string | number | undefined): string | undefined => {
  if (value === undefined || value === null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

const resolveBinding = (binding: string | undefined): unknown => {
  if (!binding) return undefined
  return binding.split('.').reduce<any>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return acc[key]
    }
    return undefined
  }, props.data)
}

interface RenderedElement {
  id: string
  type: CardElement['type']
  style: CSSProperties
  content: string
  src: string
  alt?: string
}

const renderedElements = computed<RenderedElement[]>(() => {
  const layout = normalizedLayout.value
  return (layout.elements || []).map((element: CardElement) => {
    const style: CSSProperties = {
      left: toCssValue(element.x),
      top: toCssValue(element.y),
      width: toCssValue(element.width),
      height: toCssValue(element.height),
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      zIndex: element.zIndex
    }

    if (element.style) {
      Object.entries(element.style).forEach(([key, value]) => {
        ;(style as Record<string, string | number | undefined>)[key] =
          typeof value === 'number' ? `${value}px` : value ?? undefined
      })
    }

    const boundValue = resolveBinding(element.binding)
    const textContent =
      typeof boundValue === 'string' || typeof boundValue === 'number'
        ? String(boundValue)
        : element.content ?? ''

    return {
      id: element.id,
      type: element.type,
      style,
      content: textContent,
      src:
        element.type === 'image'
          ? (typeof boundValue === 'string' && boundValue) ||
            (typeof element.content === 'string' ? element.content : '')
          : '',
      alt: 'alt' in element ? element.alt : undefined
    }
  })
})
</script>

<style scoped>
.card-layout-wrapper {
  width: 100%;
  /* padding: 16px; */
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.card-layout {
  position: relative;
  overflow: hidden;
  transition: width 0.2s ease, height 0.2s ease;
}

.card-element {
  position: absolute;
  box-sizing: border-box;
  color: inherit;
  white-space: pre-line;
  display: flex;
  align-items: center;
}

.card-element--image {
  object-fit: cover;
}

.card-element--text {
  line-height: 1.2;
}

.card-element--icon {
  justify-content: center;
}
</style>
