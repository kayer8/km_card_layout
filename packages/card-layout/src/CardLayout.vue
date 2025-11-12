<template>
  <div class="km-card-layout__wrapper" ref="wrapperRef">
    <div class="km-card-layout" :style="cardStyle">
      <template v-for="element in renderedElements" :key="element.id">
        <img
          v-if="element.type === 'image'"
          class="km-card-element km-card-element--image"
          :style="element.style"
          :src="element.src"
          :alt="element.alt || ''"
        />
        <div
          v-else-if="element.type === 'icon'"
          class="km-card-element km-card-element--icon"
          :style="element.style"
        ></div>
        <div
          v-else
          class="km-card-element km-card-element--text"
          :style="element.style"
        >
          {{ element.content }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue"
import type { CSSProperties } from "vue"
import {
  scaleCardLayout,
  type CardLayoutSchema,
  type CardElement
} from "km-card-schema"

defineOptions({ name: "CardLayout" })

type LayoutData = Record<string, any>

const props = defineProps<{ layout: CardLayoutSchema; data?: LayoutData }>()

const wrapperRef = ref<HTMLElement | null>(null)
const containerWidth = ref(props.layout.width)

const updateMeasuredWidth = () => {
  if (!wrapperRef.value) return
  const { clientWidth } = wrapperRef.value
  if (clientWidth > 0 && clientWidth !== containerWidth.value) {
    containerWidth.value = clientWidth
  }
}

let resizeObserver: ResizeObserver | null = null
let windowListenerAttached = false

const detachWindowListener = () => {
  if (typeof window === "undefined" || !windowListenerAttached) return
  window.removeEventListener("resize", updateMeasuredWidth)
  windowListenerAttached = false
}

const attachWindowListener = () => {
  if (typeof window === "undefined" || windowListenerAttached) return
  window.addEventListener("resize", updateMeasuredWidth)
  windowListenerAttached = true
}

const cleanupObserver = () => {
  resizeObserver?.disconnect()
  resizeObserver = null
}

const initObserver = () => {
  if (typeof window === "undefined") {
    containerWidth.value = props.layout.width
    return
  }

  updateMeasuredWidth()

  if (typeof ResizeObserver === "undefined" || !wrapperRef.value) {
    attachWindowListener()
    return
  }

  cleanupObserver()
  resizeObserver = new ResizeObserver(() => updateMeasuredWidth())
  resizeObserver.observe(wrapperRef.value)
}

onMounted(async () => {
  await nextTick()
  initObserver()
  attachWindowListener()
})

onBeforeUnmount(() => {
  cleanupObserver()
  detachWindowListener()
})

const effectiveWidth = computed(() => {
  return containerWidth.value > 0 ? containerWidth.value : props.layout.width
})

const normalizedLayout = computed(() =>
  scaleCardLayout(props.layout, {
    targetWidth: effectiveWidth.value
  })
)

const createCssValue = (value?: string | number) => {
  if (value === undefined || value === null) return undefined
  return typeof value === "number" ? `${value}px` : value
}

const cardStyle = computed<CSSProperties>(() => {
  const layout = normalizedLayout.value
  const style: CSSProperties = {
    width: `${layout.width}px`,
    height: `${layout.height}px`,
    background: layout.background || "#111",
    borderRadius: createCssValue(layout.borderRadius),
    padding: createCssValue(layout.padding),
    boxSizing: "border-box",
    color: layout.fontColor || "#fff"
  }

  if (layout.backgroundType === "image" && layout.backgroundImage) {
    style.backgroundImage = `url(${layout.backgroundImage})`
    style.backgroundSize = "cover"
    style.backgroundRepeat = "no-repeat"
  }

  return style
})

const resolveBinding = (binding?: string): unknown => {
  if (!binding || !props.data) return undefined
  return binding.split(".").reduce<any>((acc, key) => {
    if (acc && typeof acc === "object") {
      return acc[key]
    }
    return undefined
  }, props.data)
}

interface RenderedElement {
  id: string
  type: CardElement["type"]
  style: CSSProperties
  content: string
  src: string
  alt?: string
}

const renderedElements = computed<RenderedElement[]>(() => {
  const layout = normalizedLayout.value
  return (layout.elements || []).map((element: CardElement) => {
    const style: CSSProperties = {
      left: createCssValue(element.x),
      top: createCssValue(element.y),
      width: createCssValue(element.width),
      height: createCssValue(element.height),
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      zIndex: element.zIndex
    }

    Object.entries(element.style ?? {}).forEach(([key, value]) => {
      ;(style as Record<string, string | number | undefined>)[key] =
        typeof value === "number" ? `${value}px` : value ?? undefined
    })

    const boundValue = resolveBinding(element.binding)
    const content =
      typeof boundValue === "string" || typeof boundValue === "number"
        ? String(boundValue)
        : element.content ?? ""

    return {
      id: element.id,
      type: element.type,
      style,
      content,
      src:
        element.type === "image"
          ? (typeof boundValue === "string" && boundValue) ||
            (typeof element.content === "string" ? element.content : "")
          : "",
      alt: element.type === "image" ? element.alt : undefined
    }
  })
})
</script>

<style scoped>
.km-card-layout__wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.km-card-layout {
  position: relative;
  overflow: hidden;
  transition: width 0.2s ease, height 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.km-card-element {
  position: absolute;
  box-sizing: border-box;
  color: inherit;
  white-space: pre-line;
  display: flex;
  align-items: center;
}

.km-card-element--text {
  line-height: 1.2;
}

.km-card-element--image {
  object-fit: cover;
}

.km-card-element--icon {
  justify-content: center;
}
</style>
