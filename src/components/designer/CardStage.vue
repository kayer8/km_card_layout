<script setup lang="ts">
import { watch } from 'vue';
import type {
  CardElement,
  CardLayoutSchema,
  TextElement,
} from 'km-card-schema';
import CardElementNode from './CardElementNode.vue';
import { type DragPayload } from './useGuides';
import { collectElements } from '../../modules/layout/tree-utils';
import { DraggableContainer } from 'vue3-draggable-resizable';

type ResizePayload = DragPayload & { w: number; h: number };

const props = defineProps<{
  schema: CardLayoutSchema;
  activeElementId: string;
  getElementPreview: (element: CardElement) => string;
}>();

const emit = defineEmits<{
  (e: 'activate-element', id: string): void;
  (e: 'drag-end', payload: { id: string; x: number; y: number }): void;
  (
    e: 'resize-end',
    payload: { id: string; x: number; y: number; w: number; h: number }
  ): void;
}>();

const handleDragStart = () => {};

const handleResizeStart = () => {};

const handleDragging = (elementId: string, payload: DragPayload) => {
  emit('drag-end', { id: elementId, x: payload.x, y: payload.y });
};

const handleDragEnd = (elementId: string, payload: DragPayload) => {
  emit('drag-end', { id: elementId, x: payload.x, y: payload.y });
};

const handleResizing = () => {};

const handleResizeEnd = (elementId: string, payload: ResizePayload) => {
  emit('resize-end', {
    id: elementId,
    x: payload.x,
    y: payload.y,
    w: payload.w,
    h: payload.h,
  });
};

const ensureTextMinHeights = () => {
  collectElements(
    props.schema.children,
    element => element.type === 'text'
  ).forEach(element => {
    const textElement = element as TextElement;
    const rawFontSize = textElement.style?.fontSize;
    const fontSize =
      typeof rawFontSize === 'number'
        ? rawFontSize
        : Number.parseFloat(String(rawFontSize ?? ''));
    if (!Number.isFinite(fontSize)) return;
    const minHeight = fontSize * 1.3;
    if (
      typeof textElement.layout.height !== 'number' ||
      textElement.layout.height < minHeight
    ) {
      textElement.layout.height = minHeight;
    }
  });
};

watch(
  () =>
    collectElements(
      props.schema.children,
      element => element.type === 'text'
    ).map(element => ({
      id: element.id,
      fontSize: element.style?.fontSize,
      height: element.layout.height,
    })),
  ensureTextMinHeights,
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="card-stage">
    <div
      class="card-stage__inner"
      :style="{
        width: props.schema.width + 'px',
        height: props.schema.height + 'px',
        borderRadius: (props.schema.borderRadius ?? 24) + 'px',
        background: '#000000',
        backgroundImage: props.schema.backgroundImage
          ? `url(${props.schema.backgroundImage})`
          : undefined,
        backgroundSize: props.schema.backgroundImage ? 'cover' : undefined,
        backgroundRepeat: props.schema.backgroundImage
          ? 'no-repeat'
          : undefined,
        backgroundPosition: props.schema.backgroundImage ? 'center' : undefined,
        color: props.schema.fontColor || '#fff',
      }">
      <DraggableContainer>
        <CardElementNode
          v-for="element in props.schema.children"
          :key="element.id"
          :element="element"
          :active-element-id="props.activeElementId"
          :get-element-preview="props.getElementPreview"
          :on-activate="id => emit('activate-element', id)"
          :on-drag-start="handleDragStart"
          :on-dragging="handleDragging"
          :on-drag-end="handleDragEnd"
          :on-resize-start="handleResizeStart"
          :on-resizing="handleResizing"
          :on-resize-end="handleResizeEnd" />
      </DraggableContainer>
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

.draggable-node.is-active.active {
  box-shadow: 0 0 4px #1da9ff;
  border-color: transparent;
}
</style>
