<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import type { CardElement, CardElementStyle, CardLayoutSchema } from 'km-card-schema'
import { useGuides, type DragPayload } from './useGuides'

type ResizePayload = { x: number; y: number; w: number; h: number }

const props = withDefaults(
  defineProps<{
    schema: CardLayoutSchema
    activeElementId: string
    elementStyle: (style?: CardElementStyle) => Record<string, string | number>
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

// 对齐/辅助线与吸附计算独立封装，减少组件内耦合
const { guideLines, clearGuides, computeGuides, applySnap } = useGuides({ schema: props.schema })
const snapKeyPressed = ref(false)

const createDragHandler =
  (elementId: string) =>
  (payload: DragPayload) => {
    emit('drag-end', { id: elementId, x: payload.x, y: payload.y })
  }

const createResizeHandler =
  (elementId: string) =>
  (payload: ResizePayload) => {
    emit('resize-end', {
      id: elementId,
      x: payload.x,
      y: payload.y,
      w: payload.w,
      h: payload.h
    })
  }

const handleDragging = (elementId: string, payload: DragPayload) => {
  const element = props.schema.elements.find((item) => item.id === elementId)
  if (!element) return
  // 拖动中仅更新辅助线，不做吸附
  computeGuides(element, payload)
}

const handleDragEnd = (elementId: string, payload: DragPayload) => {
  const element = props.schema.elements.find((item) => item.id === elementId)
  if (element) {
    // 释放时刷新一次辅助线，便于立即可视化对齐点
    computeGuides(element, payload)
  }
  const shouldSnap = element && props.enableSnap && (props.snapOnRelease || snapKeyPressed.value)

  if (element && shouldSnap) {
    const snapped = applySnap(element, payload)
    element.x = snapped.x
    element.y = snapped.y
    createDragHandler(elementId)(snapped)
  } else {
    createDragHandler(elementId)(payload)
  }

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
</script>

<template>
  <div class="card-stage">
    <div
      class="card-stage__inner"
      :style="{
        width: props.schema.width + 'px',
        height: props.schema.height + 'px',
        borderRadius: (props.schema.borderRadius ?? 24) + 'px',
        background:
          props.schema.backgroundType === 'image'
            ? props.schema.background || '#000000'
            : props.schema.background,
        backgroundImage:
          props.schema.backgroundType === 'image' && props.schema.backgroundImage ? `url(${props.schema.backgroundImage})` : undefined,
        backgroundSize: props.schema.backgroundType === 'image' ? 'cover' : undefined,
        backgroundRepeat: props.schema.backgroundType === 'image' ? 'no-repeat' : undefined,
        backgroundPosition: props.schema.backgroundType === 'image' ? 'center' : undefined,
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

      <Vue3DraggableResizable
        v-for="element in props.schema.elements"
        :key="element.id"
        :initW="element.width"
        :initH="element.height"
        v-model:x="element.x"
        v-model:y="element.y"
        v-model:w="element.width"
        v-model:h="element.height"
        :parent="true"
        :lock-aspect-ratio="element.type === 'image'"
        :resizable="element.type !== 'icon'"
        :draggable="true"
        :active="props.activeElementId === element.id"
        :class="['draggable-node', { 'is-active': props.activeElementId === element.id }]"
        @drag-start="clearGuides"
        @dragging="handleDragging(element.id, $event)"
        @activated="emit('activate-element', element.id)"
        @drag-end="handleDragEnd(element.id, $event)"
        @resize-end="createResizeHandler(element.id)"
      >
        <template v-if="element.type === 'text'">
          <div class="card-element card-element--text" :style="props.elementStyle(element.style)">
            {{ props.getElementPreview(element) }}
          </div>
        </template>
        <template v-else-if="element.type === 'image'">
          <div class="card-element card-element--image">
            <img :src="props.getElementPreview(element)" :alt="element.id" :style="props.elementStyle(element.style)" />
          </div>
        </template>
        <template v-else>
          <div class="card-element card-element--icon">
            <template v-if="element.src">
              <img class="icon-image" :src="element.src" :alt="element.id" />
            </template>
            <span v-else class="icon-dot" :style="props.elementStyle(element.style)" />
          </div>
        </template>
      </Vue3DraggableResizable>
    </div>
  </div>
</template>

<style scoped>
.card-stage {
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(66, 153, 225, 0.15);
  background: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(233, 239, 247, 0.6);
}

.card-stage__inner {
  position: relative;
  margin: 0 auto;
  box-shadow: 0 12px 32px rgba(43, 108, 176, 0.15);
  border-radius: inherit;
  overflow: hidden;
}

.draggable-node {
  color: inherit;
}

.draggable-node.is-active {
  z-index: 3;
}

.card-element {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Segoe UI', 'PingFang SC', sans-serif;
}

.card-element--text {
  font-weight: 500;
}

.card-element--image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-element--icon {
  align-items: center;
  justify-content: center;
}

.icon-dot {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
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
