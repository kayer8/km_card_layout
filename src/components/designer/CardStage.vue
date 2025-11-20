<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CardElement, CardLayoutSchema, TextElement } from 'km-card-schema'
import CardElementNode from './CardElementNode.vue'
import { useGuides, type DragPayload } from './useGuides'
import { collectElements, findElementById } from '../../modules/layout/tree-utils'

type ResizePayload = DragPayload & { w: number; h: number }

const props = withDefaults(
  defineProps<{
    schema: CardLayoutSchema
    activeElementId: string
    getElementPreview: (element: CardElement) => string
    enableSnap?: boolean
    snapHotkey?: string
    snapOnRelease?: boolean
  }>(),
  {
    enableSnap: true,
    snapHotkey: 'Shift',
    snapOnRelease: true
  }
)

const emit = defineEmits<{
  (e: 'activate-element', id: string): void
  (e: 'drag-end', payload: { id: string; x: number; y: number }): void
  (e: 'resize-end', payload: { id: string; x: number; y: number; w: number; h: number }): void
}>()

const snapEnabled = ref(props.enableSnap !== false)
const toggleSnap = () => {
  snapEnabled.value = !snapEnabled.value
}

const { guideLines, clearGuides, computeGuides, applySnap } = useGuides({
  schema: props.schema
})
const snapKeyPressed = ref(false)

const handleDragStart = () => {
  clearGuides()
}

const handleResizeStart = () => {
  clearGuides()
}

const createDragHandler =
  (elementId: string) =>
  (payload: DragPayload) => {
    emit('drag-end', { id: elementId, x: payload.x, y: payload.y })
  }

const handleDragging = (elementId: string, payload: DragPayload) => {
  const element = findElementById(props.schema.children, elementId)
  if (!element) return
  computeGuides(element, payload)
}

const handleDragEnd = (elementId: string, payload: DragPayload) => {
  const element = findElementById(props.schema.children, elementId)
  if (element) {
    computeGuides(element, payload)
  }
  const shouldSnap =
    element &&
    props.enableSnap &&
    snapEnabled.value &&
    (props.snapOnRelease || snapKeyPressed.value)

  if (element && shouldSnap) {
    const snapped = applySnap(element, payload)
    element.layout.x = snapped.x
    element.layout.y = snapped.y
    createDragHandler(elementId)(snapped)
  } else {
    createDragHandler(elementId)(payload)
  }

  clearGuides()
}

const handleResizing = (elementId: string, payload: ResizePayload) => {
  const element = findElementById(props.schema.children, elementId)
  if (!element) return
  computeGuides(element, payload)
}

const handleResizeEnd = (elementId: string, payload: ResizePayload) => {
  emit('resize-end', {
    id: elementId,
    x: payload.x,
    y: payload.y,
    w: payload.w,
    h: payload.h
  })
  clearGuides()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key.toLowerCase() === (props.snapHotkey || '').toLowerCase()) {
    snapKeyPressed.value = true
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key.toLowerCase() === (props.snapHotkey || '').toLowerCase()) {
    snapKeyPressed.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})

const ensureTextMinHeights = () => {
  collectElements(
    props.schema.children,
    (element) => element.type === 'text'
  ).forEach((element) => {
    const textElement = element as TextElement
    const rawFontSize = textElement.style?.fontSize
    const fontSize =
      typeof rawFontSize === 'number' ? rawFontSize : Number.parseFloat(String(rawFontSize ?? ''))
    if (!Number.isFinite(fontSize)) return
    const minHeight = fontSize * 1.3
    if (typeof textElement.layout.height !== 'number' || textElement.layout.height < minHeight) {
      textElement.layout.height = minHeight
    }
  })
}

watch(
  () =>
    collectElements(
      props.schema.children,
      (element) => element.type === 'text'
    ).map((element) => ({
      id: element.id,
      fontSize: element.style?.fontSize,
      height: element.layout.height
    })),
  ensureTextMinHeights,
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="card-stage">
    <div class="snap-toggle">
      <t-button size="small" variant="outline" :theme="snapEnabled ? 'primary' : 'default'" @click="toggleSnap">
        吸附：{{ snapEnabled ? '开' : '关' }}
      </t-button>
    </div>
    <div
      class="card-stage__inner"
      :style="{
        width: props.schema.width + 'px',
        height: props.schema.height + 'px',
        borderRadius: (props.schema.borderRadius ?? 24) + 'px',
        background: '#000000',
        backgroundImage: props.schema.backgroundImage ? `url(${props.schema.backgroundImage})` : undefined,
        backgroundSize: props.schema.backgroundImage ? 'cover' : undefined,
        backgroundRepeat: props.schema.backgroundImage ? 'no-repeat' : undefined,
        backgroundPosition: props.schema.backgroundImage ? 'center' : undefined,
        color: props.schema.fontColor || '#fff'
      }"
    >
      <span
        v-for="line in guideLines.vertical"
        :key="'vertical-' + line"
        class="guide-line guide-line--vertical"
        :style="{ left: line + 'px' }"
      />
      <span
        v-for="line in guideLines.horizontal"
        :key="'horizontal-' + line"
        class="guide-line guide-line--horizontal"
        :style="{ top: line + 'px' }"
      />
      <span
        v-for="(line, idx) in guideLines.spacingV"
        :key="'spacing-v-' + idx"
        class="guide-line guide-line--vertical guide-line--spacing"
        :style="{ left: line.pos + 'px', top: line.start + 'px', height: line.end - line.start + 'px' }"
      />
      <span
        v-for="(line, idx) in guideLines.spacingH"
        :key="'spacing-h-' + idx"
        class="guide-line guide-line--horizontal guide-line--spacing"
        :style="{ top: line.pos + 'px', left: line.start + 'px', width: line.end - line.start + 'px' }"
      />

      <CardElementNode
        v-for="element in props.schema.children"
        :key="element.id"
        :element="element"
        :active-element-id="props.activeElementId"
        :get-element-preview="props.getElementPreview"
        :on-activate="(id) => emit('activate-element', id)"
        :on-drag-start="handleDragStart"
        :on-dragging="handleDragging"
        :on-drag-end="handleDragEnd"
        :on-resize-start="handleResizeStart"
        :on-resizing="handleResizing"
        :on-resize-end="handleResizeEnd"
      />
    </div>
  </div>
</template>

<style>
.card-stage {
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(66, 153, 225, 0.15);
  background: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(233, 239, 247, 0.6);
  position: relative;
}

.snap-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
}

.card-stage__inner {
  position: relative;
  margin: 0 auto;
  box-shadow: 0 12px 32px rgba(43, 108, 176, 0.15);
  border-radius: inherit;
  overflow: hidden;
  cursor: pointer;
}

.draggable-node {
  color: inherit;
}

.draggable-node.is-active {
  z-index: 3;
}

.draggable-node.is-active.active{
  box-shadow: 0 0 4px #1da9ff;
  border-color: transparent;
}

.guide-line {
  position: absolute;
  background: rgba(90, 107, 255, 0.8);
  pointer-events: none;
  z-index: 10;
}

.guide-line--vertical {
  top: 0;
  bottom: 0;
  width: 1px;
}

.guide-line--horizontal {
  left: 0;
  right: 0;
  height: 1px;
}

.guide-line--spacing {
  background: rgba(245, 108, 108, 0.9);
}
</style>
