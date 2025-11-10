<script setup lang="ts">
import { computed, ref } from 'vue'
import CardCanvas from '@/components/layout/CardCanvas.vue'
import WidgetLibrary from '@/components/layout/WidgetLibrary.vue'
import InspectorPanel from '@/components/layout/InspectorPanel.vue'
import { useLayoutStore } from '@/stores/layoutStore'

const layoutStore = useLayoutStore()

const showGrid = ref(true)
const showSafeArea = ref(true)
const currentSize = ref('business-card')

const canvasSizeOptions = [
  { label: 'Business Card (90 × 54mm)', value: 'business-card' },
  { label: 'EU Business Card (85 × 55mm)', value: 'europe' },
  { label: 'Square (64 × 64mm)', value: 'square' },
]

const safeAreaValue = computed({
  get: () => layoutStore.canvas.safeArea,
  set: (value: number) => layoutStore.setSafeArea(value ?? 0),
})

const safeAreaMax = computed(() => Math.floor(Math.min(layoutStore.canvas.width, layoutStore.canvas.height) / 2))

const gridColumnsValue = computed({
  get: () => layoutStore.grid.columns,
  set: (value: number) => layoutStore.setGridColumns(value ?? 1),
})

const gridRowsValue = computed({
  get: () => layoutStore.grid.rows,
  set: (value: number) => layoutStore.setGridRows(value ?? 1),
})
</script>

<template>
  <div class="designer-view">
    <section class="designer-view__panel designer-view__panel--library">
      <WidgetLibrary />
    </section>

    <section class="designer-view__workspace">
      <header class="designer-view__toolbar">
        <div class="designer-view__toolbar-group">
          <t-select
            v-model="currentSize"
            :options="canvasSizeOptions"
            size="small"
            placeholder="Select canvas size"
          />
        </div>
        <div class="designer-view__toolbar-group designer-view__toolbar-group--safe-area">
          <t-switch
            size="large"
            v-model="showSafeArea"
            label="Safe Area"
          />
          <t-input-number
            v-model="safeAreaValue"
            size="small"
            :min="0"
            :max="safeAreaMax"
            theme="column"
            class="designer-view__number-input"
          />
        </div>
        <div class="designer-view__toolbar-group designer-view__toolbar-group--grid">
          <span class="designer-view__toolbar-label">Grid</span>
          <t-input-number
            v-model="gridColumnsValue"
            size="small"
            :min="1"
            :max="48"
            theme="column"
            class="designer-view__number-input"
          />
          <span class="designer-view__toolbar-divider">×</span>
          <t-input-number
            v-model="gridRowsValue"
            size="small"
            :min="1"
            :max="48"
            theme="column"
            class="designer-view__number-input"
          />
          <t-switch
            size="large"
            v-model="showGrid"
            label="Grid"
          />
        </div>
      </header>

      <main class="designer-view__canvas-wrapper">
        <CardCanvas
          :show-grid="showGrid"
          :show-safe-area="showSafeArea"
        />
      </main>
    </section>

    <section class="designer-view__panel designer-view__panel--inspector">
      <InspectorPanel />
    </section>
  </div>
</template>

<style scoped>
.designer-view {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  grid-template-rows: 1fr;
  gap: 16px;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background: var(--td-bg-color);
}

.designer-view__panel {
  background: var(--td-bg-color-container);
  border: 1px solid var(--td-border-level-1-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.designer-view__workspace {
  display: flex;
  flex-direction: column;
  background: var(--td-bg-color-container);
  border: 1px solid var(--td-border-level-1-color);
  border-radius: 12px;
  overflow: hidden;
}

.designer-view__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--td-border-level-1-color);
  background: var(--td-bg-color-container-hover);
}

.designer-view__toolbar-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.designer-view__toolbar-group--safe-area,
.designer-view__toolbar-group--grid {
  gap: 8px;
}

.designer-view__toolbar-label {
  font-size: 12px;
  color: var(--td-text-color-secondary);
}

.designer-view__toolbar-divider {
  font-size: 12px;
  color: var(--td-text-color-secondary);
  opacity: 0.7;
}

.designer-view__number-input {
  width: 88px;
}

.designer-view__canvas-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: repeating-conic-gradient(
    var(--td-bg-color-container) 0% 25%,
    var(--td-bg-color-container-hover) 0% 50%
  );
  background-size: 24px 24px;
}

.designer-view__panel--library,
.designer-view__panel--inspector {
  min-width: 0;
}
</style>
