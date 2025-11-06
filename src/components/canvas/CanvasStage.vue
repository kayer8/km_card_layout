<template>
  <div class="canvas-wrapper">
    <div class="canvas-toolbar">
      <div class="toolbar-group">
        <div class="toolbar-control">
          <span class="toolbar-control__label">缩放</span>
          <t-radio-group v-model="zoomRatio" variant="outline" size="small" :options="zoomOptions" />
        </div>
        <div class="toolbar-control">
          <span class="toolbar-control__label">网格</span>
          <t-switch v-model="showGrid" size="small" />
        </div>
        <div class="toolbar-control">
          <span class="toolbar-control__label">吸附</span>
          <t-switch v-model="snapEnabled" size="small" />
        </div>
        <div class="toolbar-control">
          <span class="toolbar-control__label">格宽</span>
          <t-input-number
            class="toolbar-input"
            :value="gridX"
            :min="4"
            :max="400"
            size="small"
            @change="value => handleGridChange('x', value)"
          />
        </div>
        <div class="toolbar-control">
          <span class="toolbar-control__label">格高</span>
          <t-input-number
            class="toolbar-input"
            :value="gridY"
            :min="4"
            :max="400"
            size="small"
            @change="value => handleGridChange('y', value)"
          />
        </div>
      </div>
      <div class="toolbar-group">
        <div class="toolbar-control">
          <span class="toolbar-control__label">画布宽</span>
          <t-input-number
            class="toolbar-input"
            v-model="width"
            :min="300"
            :max="2000"
            size="small"
            @change="updateCanvasSize"
          />
        </div>
        <div class="toolbar-control">
          <span class="toolbar-control__label">画布高</span>
          <t-input-number
            class="toolbar-input"
            v-model="height"
            :min="180"
            :max="1200"
            size="small"
            @change="updateCanvasSize"
          />
        </div>
      </div>
    </div>
    <div class="canvas-shell" :style="shellStyle">
      <div
        class="canvas"
        :class="{ 'canvas--grid': showGrid }"
        :style="canvasStyle"
        @pointerdown.self="store.selectElement(null)"
      >
        <div v-if="showGrid" class="canvas-center-lines">
          <div class="canvas-center-lines__line canvas-center-lines__line--vertical" />
          <div class="canvas-center-lines__line canvas-center-lines__line--horizontal" />
        </div>
        <CanvasElement v-for="element in elements" :key="element.id" :element="element" :zoom="zoomRatio" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import CanvasElement from '@/components/canvas/CanvasElement.vue';
import { useLayoutStore } from '@/stores/layoutStore';

const store = useLayoutStore();
const zoomOptions = [
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: '100%', value: 1 },
  { label: '125%', value: 1.25 },
  { label: '150%', value: 1.5 }
];

const showGrid = ref(true);
const zoomRatio = ref(1);
const width = ref(store.canvasMeta.width);
const height = ref(store.canvasMeta.height);
const gridX = ref(store.canvasGrid.size.x);
const gridY = ref(store.canvasGrid.size.y);

const snapEnabled = computed({
  get: () => store.gridSnapEnabled,
  set: value => store.toggleGridSnap(value)
});

const elements = computed(() => store.elements.slice().sort((a, b) => a.layout.zIndex - b.layout.zIndex));
const canvasStyle = computed(() => {
  const base: Record<string, string> = {
    width: `${store.canvasMeta.width}px`,
    height: `${store.canvasMeta.height}px`
  };
  const background = store.canvasMeta.background;
  if (background.type === 'color') {
    base.backgroundColor = background.value;
  } else {
    base.background = background.value;
  }

  if (showGrid.value) {
    const sizeX = Math.max(1, store.canvasGrid.size.x);
    const sizeY = Math.max(1, store.canvasGrid.size.y);
    const horizontalLine = Math.max(sizeY - 1, 0);
    const verticalLine = Math.max(sizeX - 1, 0);
    base.backgroundImage = `linear-gradient(0deg, transparent ${horizontalLine}px, rgba(0, 0, 0, 0.08) ${sizeY}px), linear-gradient(90deg, transparent ${verticalLine}px, rgba(0, 0, 0, 0.08) ${sizeX}px)`;
    base.backgroundSize = `${sizeX}px ${sizeY}px`;
  } else {
    base.backgroundImage = 'none';
    base.backgroundSize = 'auto';
  }

  return base;
});

const shellStyle = computed(() => ({
  width: `${store.canvasMeta.width}px`,
  height: `${store.canvasMeta.height}px`,
  transform: `scale(${zoomRatio.value})`,
  transformOrigin: 'top left'
}));

const updateCanvasSize = () => {
  store.updateCanvasSize(width.value, height.value);
};

const handleGridChange = (axis: 'x' | 'y', value: number | string | null) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return;
  const sanitized = Math.max(1, Math.round(numeric));
  if (axis === 'x') {
    gridX.value = sanitized;
  } else {
    gridY.value = sanitized;
  }
  store.updateGridSize({ x: gridX.value, y: gridY.value });
};

watch(
  () => store.canvasMeta,
  meta => {
    width.value = meta.width;
    height.value = meta.height;
  },
  { deep: true }
);

watch(
  () => store.canvasGrid.size,
  size => {
    gridX.value = size.x;
    gridY.value = size.y;
  },
  { deep: true }
);
</script>

<style scoped>
.canvas-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.canvas-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 820px;
  gap: 16px;
  flex-wrap: wrap;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(6px);
  border-radius: 10px;
  box-shadow: 0 5px 16px rgba(15, 23, 42, 0.12);
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-control {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.toolbar-control__label {
  font-size: 12px;
  color: #4e5969;
}

.toolbar-input {
  width: 110px;
}

.canvas {
  position: relative;
  border-radius: 8px;
  box-shadow: 0 8px 40px rgba(15, 23, 42, 0.18);
  overflow: hidden;
}

.canvas-shell {
  position: relative;
  transform-origin: top left;
}

.canvas--grid {
  background-blend-mode: normal;
}

.canvas-center-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.canvas-center-lines__line {
  position: absolute;
  background: rgba(38, 175, 255, 0.35);
}

.canvas-center-lines__line--vertical {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-0.5px);
}

.canvas-center-lines__line--horizontal {
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  transform: translateY(-0.5px);
}
</style>
