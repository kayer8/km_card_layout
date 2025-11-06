<template>
  <div
    class="canvas-element"
    :class="{ 'canvas-element--selected': isSelected }"
    :style="elementStyle"
    @pointerdown="handlePointerDown"
    @dblclick.stop="enableContentEditing"
  >
    <component
      :is="componentTag"
      class="canvas-element__content"
      :style="contentStyle"
      :contenteditable="isEditing && props.element.type === 'text'"
      @blur="handleContentBlur"
      @keydown.enter.prevent="handleContentBlur"
    >
      <template v-if="props.element.type === 'text'">
        {{ displayText }}
      </template>
      <template v-else-if="props.element.type === 'image'">
        <div class="image-placeholder">
          <span>请上传 Logo</span>
        </div>
      </template>
      <template v-else-if="props.element.type === 'qrcode'">
        <div class="qrcode-placeholder">
          <span>二维码</span>
        </div>
      </template>
      <template v-else>
        <div class="shape-placeholder" />
      </template>
    </component>

    <div v-if="isSelected" class="canvas-element__handles">
      <div
        v-for="handle in handles"
        :key="handle"
        class="canvas-element__handle"
        :class="`canvas-element__handle--${handle}`"
        @pointerdown.stop.prevent="startResize(handle, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CardElement } from '@/types/layout';
import { useLayoutStore } from '@/stores/layoutStore';

const props = defineProps<{
  element: CardElement;
  zoom: number;
}>();

const store = useLayoutStore();
const isEditing = ref(false);

const handles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

const isSelected = computed(() => store.selectedElement?.id === props.element.id);

const componentTag = computed(() => {
  if (props.element.type === 'text') return 'div';
  return 'div';
});

const displayText = computed(() => {
  const bindingKey = props.element.binding?.field;
  if (bindingKey && store.previewData[bindingKey]) {
    return store.previewData[bindingKey];
  }
  if (props.element.content) {
    return props.element.content;
  }
  return bindingKey ? `{{${bindingKey}}}` : '双击编辑文本';
});

const elementStyle = computed(() => ({
  left: `${props.element.layout.x}px`,
  top: `${props.element.layout.y}px`,
  width: `${props.element.layout.width}px`,
  height: `${props.element.layout.height}px`,
  zIndex: props.element.layout.zIndex
}));

const contentStyle = computed(() => {
  const style = props.element.style ?? {};
  return {
    fontFamily: style.fontFamily ?? 'PingFang SC',
    fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
    fontWeight: style.fontWeight ?? 'normal',
    lineHeight: style.lineHeight ? style.lineHeight.toString() : undefined,
    color: style.color ?? '#1d2129',
    textAlign: style.align ?? 'left',
    letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : undefined,
    backgroundColor: style.backgroundColor ?? 'transparent',
    padding: style.padding ? `${style.padding}px` : undefined,
    opacity: style.opacity ?? 1
  };
});

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const handlePointerDown = (event: PointerEvent) => {
  event.stopPropagation();
  store.selectElement(props.element.id);
  if (isEditing.value) return;
  startDrag(event);
};

const startDrag = (event: PointerEvent) => {
  document.body.classList.add('drag-selecting');
  const start = { x: event.clientX, y: event.clientY };
  const initial = { ...props.element.layout };
  const zoom = props.zoom || 1;
  store.pushHistory();

  const onMove = (moveEvent: PointerEvent) => {
    const deltaX = (moveEvent.clientX - start.x) / zoom;
    const deltaY = (moveEvent.clientY - start.y) / zoom;
    const canvas = store.canvasMeta;
    const newX = clamp(initial.x + deltaX, 0, canvas.width - props.element.layout.width);
    const newY = clamp(initial.y + deltaY, 0, canvas.height - props.element.layout.height);
    store.updateElementLayout(
      props.element.id,
      { x: Math.round(newX), y: Math.round(newY) },
      { recordHistory: false, touch: false }
    );
  };

  const onUp = () => {
    store.touch();
    document.body.classList.remove('drag-selecting');
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  };

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp, { once: true });
};

const startResize = (direction: (typeof handles)[number], event: PointerEvent) => {
  document.body.classList.add('drag-selecting');
  store.selectElement(props.element.id);
  const start = { x: event.clientX, y: event.clientY };
  const initial = { ...props.element.layout };
  const zoom = props.zoom || 1;
  const minSize = 40;
  store.pushHistory();

  const onMove = (moveEvent: PointerEvent) => {
    const deltaX = (moveEvent.clientX - start.x) / zoom;
    const deltaY = (moveEvent.clientY - start.y) / zoom;
    let nextX = initial.x;
    let nextY = initial.y;
    let nextWidth = initial.width;
    let nextHeight = initial.height;

    if (direction.includes('right')) {
      nextWidth = clamp(initial.width + deltaX, minSize, store.canvasMeta.width - initial.x);
    }

    if (direction.includes('left')) {
      const width = clamp(initial.width - deltaX, minSize, initial.width + initial.x);
      nextX = initial.x + (initial.width - width);
      nextWidth = width;
    }

    if (direction.includes('bottom')) {
      nextHeight = clamp(initial.height + deltaY, minSize, store.canvasMeta.height - initial.y);
    }

    if (direction.includes('top')) {
      const height = clamp(initial.height - deltaY, minSize, initial.height + initial.y);
      nextY = initial.y + (initial.height - height);
      nextHeight = height;
    }

    store.updateElementLayout(
      props.element.id,
      {
        x: Math.round(nextX),
        y: Math.round(nextY),
        width: Math.round(nextWidth),
        height: Math.round(nextHeight)
      },
      { recordHistory: false, touch: false }
    );
  };

  const onUp = () => {
    store.touch();
    document.body.classList.remove('drag-selecting');
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  };

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp, { once: true });
};

const enableContentEditing = () => {
  if (props.element.type !== 'text') return;
  isEditing.value = true;
  store.selectElement(props.element.id);
};

const handleContentBlur = (event: Event) => {
  if (!isEditing.value) return;
  const target = event.target as HTMLElement;
  store.updateElementContent(props.element.id, target.innerText.trim());
  isEditing.value = false;
};
</script>

<style scoped>
.canvas-element {
  position: absolute;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-element__content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid transparent;
  padding: 0 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.canvas-element--selected .canvas-element__content {
  border-color: rgba(38, 175, 255, 0.6);
  box-shadow: 0 0 0 1px rgba(38, 175, 255, 0.3);
}

.canvas-element__handles {
  position: absolute;
  inset: -6px;
}

.canvas-element__handle {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #26afff;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1px rgba(38, 175, 255, 0.5);
  cursor: pointer;
}

.canvas-element__handle--top-left {
  top: -6px;
  left: -6px;
  cursor: nwse-resize;
}

.canvas-element__handle--top-right {
  top: -6px;
  right: -6px;
  cursor: nesw-resize;
}

.canvas-element__handle--bottom-left {
  bottom: -6px;
  left: -6px;
  cursor: nesw-resize;
}

.canvas-element__handle--bottom-right {
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
}

.image-placeholder,
.qrcode-placeholder,
.shape-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  border: 1px dashed rgba(16, 24, 40, 0.24);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #86909c;
  background: rgba(240, 244, 255, 0.4);
}

.shape-placeholder {
  background: rgba(38, 175, 255, 0.08);
}
</style>
