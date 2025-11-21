<script setup lang="ts">
import { computed, inject } from 'vue';
import Vue3DraggableResizable from 'km-vue3-draggable-resizable';
import type { CardElement, LayoutPanelElement } from 'km-card-schema';
import LayoutText from '../layout-element/LayoutText.vue';
import LayoutImage from '../layout-element/LayoutImage.vue';
import LayoutIcon from '../layout-element/LayoutIcon.vue';
import LayoutCustom from '../layout-element/LayoutCustom.vue';
import LayoutPanel from '../layout-element/LayoutPanel.vue';
import type { DragPayload } from './useGuides';

defineOptions({
  name: 'CardElementNode',
});

type ResizePayload = DragPayload & { w: number; h: number };

const props = defineProps<{
  element: CardElement;
  activeElementId: string;
  getElementPreview: (element: CardElement) => string;
  onActivate: (id: string) => void;
  onDragStart: () => void;
  onDragging: (id: string, payload: DragPayload) => void;
  onDragEnd: (id: string, payload: DragPayload) => void;
  onResizeStart: () => void;
  onResizing: (id: string, payload: ResizePayload) => void;
  onResizeEnd: (id: string, payload: ResizePayload) => void;
}>();

const isActive = computed(() => props.activeElementId === props.element.id);
const isDraggable = computed(() => props.element.layout.mode === 'absolute');
const lockAspectRatio = computed(() => props.element.type === 'image');
const previewText = computed(() => props.getElementPreview(props.element));
const panelChildren = computed(() =>
  props.element.type === 'layout-panel'
    ? (props.element as LayoutPanelElement).children ?? []
    : []
);

const handleActivate = () => props.onActivate(props.element.id);

const formatSize = (value?: number | string) => {
  if (value === undefined || value === null) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
};

const injectedScaleX = inject<{ value: number } | null>('parentScaleX', null);
const injectedScaleY = inject<{ value: number } | null>('parentScaleY', null);
const parentScaleX = computed(() => injectedScaleX?.value ?? 1);
const parentScaleY = computed(() => injectedScaleY?.value ?? 1);

const calcFlexStyle = (
  element: CardElement
): Record<string, string | number> => {
  if (element.layout.mode !== 'flex') return {};

  const style: Record<string, string | number> = {};
  const width = formatSize(element.layout.width);
  const height = formatSize(element.layout.height);

  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  const item = element.layout.item;
  if (item) {
    if (item.flexGrow !== undefined) style.flexGrow = item.flexGrow;
    if (item.flexShrink !== undefined) style.flexShrink = item.flexShrink;
    const basis = formatSize(item.flexBasis);
    if (basis !== undefined) style.flexBasis = basis;
    if (item.order !== undefined) style.order = item.order;
    if (item.alignSelf !== undefined) style.alignSelf = item.alignSelf;
  }

  return style;
};
</script>

<template>
  <template v-if="props.element.visible !== false">
    <Vue3DraggableResizable
      v-if="isDraggable"
      :initW="props.element.layout.width ?? 0"
      :initH="props.element.layout.height ?? 0"
      v-model:x="props.element.layout.x"
      v-model:y="props.element.layout.y"
      v-model:w="props.element.layout.width"
      v-model:h="props.element.layout.height"
      :min-h="0"
      :min-w="0"
      :parentScaleX="parentScaleX"
      :parentScaleY="parentScaleY"
      :parent="true"
      :lock-aspect-ratio="lockAspectRatio"
      :resizable="props.element.type !== 'icon'"
      :draggable="true"
      :active="isActive"
      :class="['draggable-node', { 'is-active': isActive }]"
      @drag-start="props.onDragStart"
      @dragging="(payload:any) => props.onDragging(props.element.id, payload)"
      @resize-start="props.onResizeStart"
      @resizing="(payload:any) => props.onResizing(props.element.id, payload)"
      @activated="handleActivate"
      @drag-end="(payload:any) => props.onDragEnd(props.element.id, payload)"
      @resize-end="(payload:any) => props.onResizeEnd(props.element.id, payload)">
      <template v-if="props.element.type === 'layout-panel'">
        <LayoutPanel :element="props.element as LayoutPanelElement">
          <CardElementNode
            v-for="child in panelChildren"
            :key="child.id"
            :element="child"
            :active-element-id="props.activeElementId"
            :get-element-preview="props.getElementPreview"
            :on-activate="props.onActivate"
            :on-drag-start="props.onDragStart"
            :on-dragging="props.onDragging"
            :on-drag-end="props.onDragEnd"
            :on-resize-start="props.onResizeStart"
            :on-resizing="props.onResizing"
            :on-resize-end="props.onResizeEnd" />
        </LayoutPanel>
      </template>
      <template v-else>
        <LayoutText
          v-if="props.element.type === 'text'"
          :element="props.element"
          :value="previewText" />
        <LayoutImage
          v-else-if="props.element.type === 'image'"
          :element="props.element"
          :value="previewText" />
        <LayoutIcon
          v-else-if="props.element.type === 'icon'"
          :element="props.element"
          :value="previewText" />
        <LayoutCustom v-else :element="props.element" :value="previewText" />
      </template>
    </Vue3DraggableResizable>
    <template v-else>
      <template v-if="props.element.type === 'layout-panel'">
        <LayoutPanel :style="calcFlexStyle(props.element)" :element="props.element as LayoutPanelElement" >
          <CardElementNode
            v-for="child in panelChildren"
            :key="child.id"
            :element="child"
            :active-element-id="props.activeElementId"
            :get-element-preview="props.getElementPreview"
            :on-activate="props.onActivate"
            :on-drag-start="props.onDragStart"
            :on-dragging="props.onDragging"
            :on-drag-end="props.onDragEnd"
            :on-resize-start="props.onResizeStart"
            :on-resizing="props.onResizing"
            :on-resize-end="props.onResizeEnd" />
        </LayoutPanel>
      </template>
      <template v-else>
        <LayoutText
          v-if="props.element.type === 'text'"
          :element="props.element"
          :value="previewText"
          :style="calcFlexStyle(props.element)" />
        <LayoutImage
          v-else-if="props.element.type === 'image'"
          :element="props.element"
          :value="previewText"
          :style="calcFlexStyle(props.element)" />
        <LayoutIcon
          v-else-if="props.element.type === 'icon'"
          :element="props.element"
          :value="previewText"
          :style="calcFlexStyle(props.element)" />
        <LayoutCustom
          v-else
          :element="props.element"
          :value="previewText"
          :style="calcFlexStyle(props.element)" />
      </template>
    </template>
  </template>
</template>

<style scoped>
.flex-child {
  cursor: pointer;
}

.flex-child.is-active {
  outline: 2px solid rgba(59, 130, 246, 0.4);
  outline-offset: -2px;
}
</style>
