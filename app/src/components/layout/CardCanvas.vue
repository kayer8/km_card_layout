<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { GridStack, type GridStackNode } from 'gridstack'
import { useLayoutStore } from '@/stores/layoutStore'
import CardWidget from './CardWidget.vue'

const props = defineProps<{
  showGrid: boolean
  showSafeArea: boolean
}>()

const layoutStore = useLayoutStore()

const boardElement = ref<HTMLDivElement | null>(null)
const gridElement = ref<HTMLDivElement | null>(null)
const gridInstance = ref<GridStack | null>(null)
const initializedIds = new Set<string>()
const isDragActive = ref(false)

const widgets = computed(() => layoutStore.widgetsSorted)
const activeId = computed(() => layoutStore.selection.activeId)

const columns = computed(() => Math.max(1, layoutStore.grid.columns))
const rows = computed(() => Math.max(1, layoutStore.grid.rows))

const columnWidth = computed(() => layoutStore.canvas.width / columns.value)
const rowHeight = computed(() => layoutStore.canvas.height / rows.value)

const canvasStyle = computed(() => ({
  width: `${layoutStore.canvas.width}px`,
  height: `${layoutStore.canvas.height}px`,
  background: layoutStore.canvas.background.value,
  '--grid-cell-width': `${columnWidth.value}px`,
  '--grid-cell-height': `${rowHeight.value}px`,
}))

const safeAreaStyle = computed(() => {
  const inset = layoutStore.canvas.safeArea
  return {
    top: `${inset}px`,
    right: `${inset}px`,
    bottom: `${inset}px`,
    left: `${inset}px`,
  }
})

const initGrid = () => {
  if (!gridElement.value) return

  const instance = GridStack.init(
    {
      column: columns.value,
      cellHeight: rowHeight.value,
      margin: 0,
      float: true,
      disableOneColumnMode: true,
      resizable: { handles: 'e, se, s, sw, w, ne, n, nw' },
      draggable: { handle: '.grid-stack-item-content' },
    },
    gridElement.value,
  )

  gridInstance.value = instance

  instance.on('change', (_event, nodes: GridStackNode[] | undefined) => {
    if (!nodes) return
    nodes.forEach((node) => {
      const id = String(node.id ?? node.el?.getAttribute('gs-id') ?? '')
      if (!id) return
      layoutStore.updateWidgetLayout(id, {
        x: node.x ?? 0,
        y: node.y ?? 0,
        w: node.w ?? 1,
        h: node.h ?? 1,
      })
    })
  })
  instance.on('dragstop', () => layoutStore.pushHistory())
  instance.on('resizestop', () => layoutStore.pushHistory())
}

const ensureWidgetsInitialized = async () => {
  await nextTick()
  if (!gridElement.value || !gridInstance.value) return
  const items = Array.from(gridElement.value.querySelectorAll<HTMLElement>('.grid-stack-item'))
  items.forEach((el) => {
    const id = el.getAttribute('gs-id')
    if (!id || initializedIds.has(id)) return
    gridInstance.value?.makeWidget(el)
    initializedIds.add(id)
  })
}

const cleanupRemovedWidgets = (validIds: string[]) => {
  if (!gridElement.value || !gridInstance.value) return
  const toRemove: string[] = []
  initializedIds.forEach((id) => {
    if (!validIds.includes(id)) {
      toRemove.push(id)
    }
  })
  toRemove.forEach((id) => {
    const target = gridElement.value?.querySelector<HTMLElement>(`.grid-stack-item[gs-id="${id}"]`)
    if (target) {
      gridInstance.value?.removeWidget(target, false)
    }
    initializedIds.delete(id)
  })
}

const reconfigureGrid = () => {
  const instance = gridInstance.value
  if (!instance) return
  instance.column(columns.value)
  instance.cellHeight(rowHeight.value)
  ensureWidgetsInitialized()
}

onMounted(async () => {
  initGrid()
  await ensureWidgetsInitialized()
})

onBeforeUnmount(() => {
  gridInstance.value?.destroy(false)
  gridInstance.value = null
  initializedIds.clear()
})

watch(
  () => widgets.value.map((item) => item.id),
  async (ids, prevIds = []) => {
    if (prevIds.length > ids.length) {
      cleanupRemovedWidgets(ids)
    }
    await ensureWidgetsInitialized()
  },
)

watch(
  () =>
    widgets.value.map((item) => ({
      id: item.id,
      layout: { ...item.layout },
    })),
  async (items) => {
    await nextTick()
    const instance = gridInstance.value
    const element = gridElement.value
    if (!instance || !element) return
    items.forEach(({ id, layout }) => {
      const target = element.querySelector<HTMLElement>(`.grid-stack-item[gs-id="${id}"]`)
      if (!target) return
      instance.update(target, {
        x: layout.x,
        y: layout.y,
        w: layout.w,
        h: layout.h,
      })
    })
  },
  { deep: true },
)

watch(columns, () => reconfigureGrid())
watch(rows, () => reconfigureGrid())
watch(
  () => layoutStore.canvas.height,
  () => reconfigureGrid(),
)
watch(
  () => layoutStore.canvas.width,
  () => reconfigureGrid(),
)

const handleSelect = (id: string) => {
  layoutStore.selectWidget(id)
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
  isDragActive.value = true
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragActive.value = true
}

const handleDragLeave = (event: DragEvent) => {
  if (event.target !== boardElement.value) return
  isDragActive.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragActive.value = false
  const data = event.dataTransfer?.getData('application/json')
  if (!data) return
  let payload: { templateKey?: string } | null = null
  try {
    payload = JSON.parse(data)
  } catch {
    payload = null
  }
  if (!payload?.templateKey) return
  const templateKey = payload.templateKey
  const templateExists = layoutStore.widgetTemplates.some((item) => item.key === templateKey)
  if (!templateExists) return
  const board = boardElement.value
  if (!board) return
  const rect = board.getBoundingClientRect()
  const offsetX = clampNumber(event.clientX - rect.left, 0, rect.width)
  const offsetY = clampNumber(event.clientY - rect.top, 0, rect.height)

  const position = {
    x: Math.floor(offsetX / columnWidth.value),
    y: Math.floor(offsetY / rowHeight.value),
  }

  layoutStore.pushHistory()
  layoutStore.addWidgetFromTemplate(templateKey, { position })
  ensureWidgetsInitialized()
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
</script>

<template>
  <div class="card-canvas">
    <div
      ref="boardElement"
      class="card-canvas__board"
      :class="{
        'card-canvas__board--grid': showGrid,
        'card-canvas__board--dragging': isDragActive,
      }"
      :style="canvasStyle"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div
        v-if="showSafeArea"
        class="card-canvas__safe-area"
        :style="safeAreaStyle"
      />

      <div class="grid-stack" ref="gridElement">
        <div
          v-for="widget in widgets"
          :key="widget.id"
          class="grid-stack-item"
          :gs-id="widget.id"
          :gs-x="widget.layout.x"
          :gs-y="widget.layout.y"
          :gs-w="widget.layout.w"
          :gs-h="widget.layout.h"
          @click.stop="handleSelect(widget.id)"
        >
          <div
            class="grid-stack-item-content"
            :class="{ 'is-active': activeId === widget.id }"
          >
            <CardWidget :widget="widget" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-canvas {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 24px;
  background: var(--td-bg-color-component);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.card-canvas__board {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(17, 18, 32, 0.1);
  background-clip: padding-box;
  transition: box-shadow 0.2s ease;
}

.card-canvas__board--dragging {
  box-shadow: 0 24px 48px rgba(43, 75, 253, 0.2);
}

.card-canvas__board::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  background-image: linear-gradient(to right, rgba(43, 75, 253, 0.12) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(43, 75, 253, 0.12) 1px, transparent 1px);
  background-size: var(--grid-cell-width) var(--grid-cell-height);
  background-position: 0 0;
  z-index: 1;
}

.card-canvas__board--grid::after {
  opacity: 1;
}

.card-canvas__safe-area {
  position: absolute;
  pointer-events: none;
  border: 1px dashed rgba(43, 75, 253, 0.48);
  border-radius: 12px;
  z-index: 2;
}

.grid-stack {
  position: relative;
  height: 100%;
  z-index: 3;
}

.grid-stack-item {
  cursor: move;
}

.grid-stack-item-content {
  width: 100%;
  height: 100%;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  padding: 12px;
  box-sizing: border-box;
}

.grid-stack-item-content.is-active {
  border-color: rgba(43, 75, 253, 0.4);
  box-shadow: 0 0 0 2px rgba(43, 75, 253, 0.24);
  background: rgba(43, 75, 253, 0.04);
}
</style>
