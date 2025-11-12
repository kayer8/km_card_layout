<script setup lang="ts">
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import type { CardElement, CardElementStyle, CardLayoutSchema } from '@km/card-schema'

type DragPayload = { x: number; y: number }
type ResizePayload = { x: number; y: number; w: number; h: number }

const props = defineProps<{
  schema: CardLayoutSchema
  activeElementId: string
  elementStyle: (style?: CardElementStyle) => Record<string, string | number>
  getElementPreview: (element: CardElement) => string
}>()

const emit = defineEmits<{
  (e: 'activate-element', id: string): void
  (e: 'drag-end', payload: { id: string; x: number; y: number }): void
  (
    e: 'resize-end',
    payload: { id: string; x: number; y: number; w: number; h: number }
  ): void
}>()

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
      <Vue3DraggableResizable
        v-for="element in props.schema.elements"
        :key="element.id"
        v-model:x="element.x"
        v-model:y="element.y"
        v-model:w="element.width"
        v-model:h="element.height"
        :parent="true"
        :lock-aspect-ratio="element.type === 'image'"
        :resizable="element.type !== 'icon'"
        :draggable="true"
        :min-w="element.type === 'icon' ? 8 : 40"
        :min-h="element.type === 'icon' ? 8 : 24"
        :active="props.activeElementId === element.id"
        :class="['draggable-node', { 'is-active': props.activeElementId === element.id }]"
        @activated="emit('activate-element', element.id)"
        @drag-end="createDragHandler(element.id)"
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
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.01);
}

.card-stage__inner {
  position: relative;
  margin: 0 auto;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
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
</style>
