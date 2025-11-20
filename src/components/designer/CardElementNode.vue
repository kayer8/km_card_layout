<script setup lang="ts">
import { computed } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import type {
  CardElement,
  LayoutPanelElement,
} from 'km-card-schema'
import LayoutText from '../layout-element/LayoutText.vue'
import LayoutImage from '../layout-element/LayoutImage.vue'
import LayoutIcon from '../layout-element/LayoutIcon.vue'
import LayoutCustom from '../layout-element/LayoutCustom.vue'
import LayoutPanel from '../layout-element/LayoutPanel.vue'
import type { DragPayload } from './useGuides'

defineOptions({
  name: 'CardElementNode'
})

type ResizePayload = DragPayload & { w: number; h: number }

const props = defineProps<{
  element: CardElement
  activeElementId: string
  getElementPreview: (element: CardElement) => string
  onActivate: (id: string) => void
  onDragStart: () => void
  onDragging: (id: string, payload: DragPayload) => void
  onDragEnd: (id: string, payload: DragPayload) => void
  onResizeStart: () => void
  onResizing: (id: string, payload: ResizePayload) => void
  onResizeEnd: (id: string, payload: ResizePayload) => void
}>()

const isActive = computed(() => props.activeElementId === props.element.id)
const isDraggable = computed(() => props.element.layout.mode === 'absolute')
const lockAspectRatio = computed(() => props.element.type === 'image')
const previewText = computed(() => props.getElementPreview(props.element))
const panelChildren = computed(() =>
  props.element.type === 'layout-panel'
    ? (props.element as LayoutPanelElement).children ?? []
    : []
)

const handleActivate = () => props.onActivate(props.element.id)
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
      :parent="true"
      :lock-aspect-ratio="lockAspectRatio"
      :resizable="props.element.type !== 'icon'"
      :draggable="true"
      :active="isActive"
      :class="['draggable-node', { 'is-active': isActive }]"
      @drag-start="props.onDragStart"
      @dragging="(payload) => props.onDragging(props.element.id, payload)"
      @resize-start="props.onResizeStart"
      @resizing="(payload) => props.onResizing(props.element.id, payload)"
      @activated="handleActivate"
      @drag-end="(payload) => props.onDragEnd(props.element.id, payload)"
      @resize-end="(payload) => props.onResizeEnd(props.element.id, payload)"
    >
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
            :on-resize-end="props.onResizeEnd"
          />
        </LayoutPanel>
      </template>
      <template v-else>
        <LayoutText
          v-if="props.element.type === 'text'"
          :element="props.element"
          :value="previewText"
        />
        <LayoutImage
          v-else-if="props.element.type === 'image'"
          :element="props.element"
          :value="previewText"
        />
        <LayoutIcon
          v-else-if="props.element.type === 'icon'"
          :element="props.element"
          :value="previewText"
        />
        <LayoutCustom
          v-else
          :element="props.element"
          :value="previewText"
        />
      </template>
    </Vue3DraggableResizable>

    <div
      v-else
      class="flex-child"
      :class="{ 'is-active': isActive }"
      @click.stop="handleActivate"
    >
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
            :on-resize-end="props.onResizeEnd"
          />
        </LayoutPanel>
      </template>
      <template v-else>
        <LayoutText
          v-if="props.element.type === 'text'"
          :element="props.element"
          :value="previewText"
        />
        <LayoutImage
          v-else-if="props.element.type === 'image'"
          :element="props.element"
          :value="previewText"
        />
        <LayoutIcon
          v-else-if="props.element.type === 'icon'"
          :element="props.element"
          :value="previewText"
        />
        <LayoutCustom
          v-else
          :element="props.element"
          :value="previewText"
        />
      </template>
    </div>
  </template>
</template>

<style scoped>
.flex-child {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.flex-child.is-active {
  outline: 2px solid rgba(59, 130, 246, 0.4);
  outline-offset: -2px;
}
</style>
