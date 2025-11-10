<script setup lang="ts">
import { computed } from 'vue'
import { SystemComponentsIcon, UserIcon } from 'tdesign-icons-vue-next'
import { useLayoutStore } from '@/stores/layoutStore'

const layoutStore = useLayoutStore()

const usedFieldKeys = computed(() => {
  const set = new Set<string>()
  layoutStore.widgets.forEach((widget) => {
    if (widget.binding?.fieldKey) {
      set.add(widget.binding.fieldKey)
    }
  })
  return set
})

const fieldWidgets = computed(() =>
  layoutStore.widgetTemplates.filter(
    (item) =>
      item.category === 'field' &&
      (!item.defaultBinding?.fieldKey || !usedFieldKeys.value.has(item.defaultBinding.fieldKey)),
  ),
)

const basicWidgets = computed(() =>
  layoutStore.widgetTemplates.filter((item) => item.category === 'basic'),
)

const handleDragStart = (event: DragEvent, templateKey: string) => {
  event.dataTransfer?.setData('application/json', JSON.stringify({ templateKey }))
  event.dataTransfer?.setDragImage(createDragPreview(templateKey), 20, 20)
}

const handleDragEnd = (event: DragEvent) => {
  if (!event.dataTransfer) return
  event.dataTransfer.clearData()
}

const createDragPreview = (templateKey: string) => {
  const template = layoutStore.widgetTemplates.find((item) => item.key === templateKey)
  const preview = document.createElement('div')
  preview.textContent = template?.label ?? 'Widget'
  preview.style.padding = '6px 12px'
  preview.style.background = '#2B4BFD'
  preview.style.color = '#fff'
  preview.style.borderRadius = '12px'
  preview.style.fontSize = '12px'
  preview.style.fontWeight = '600'
  preview.style.pointerEvents = 'none'
  document.body.appendChild(preview)
  setTimeout(() => {
    if (preview.parentNode) {
      preview.parentNode.removeChild(preview)
    }
  }, 100)
  return preview
}
</script>

<template>
  <div class="widget-library">
    <header class="widget-library__header">
      <h2>Component Library</h2>
      <p class="widget-library__desc">
        Drag components into the layout canvas. Field widgets can be placed only once.
      </p>
    </header>

    <section class="widget-library__section">
      <div class="widget-library__section-title">
        <UserIcon />
        <span>Field Widgets</span>
      </div>
      <div v-if="fieldWidgets.length" class="widget-library__list">
        <t-card
          v-for="item in fieldWidgets"
          :key="item.key"
          theme="poster1"
          class="widget-library__item widget-library__item--draggable"
          hover-shadow
          draggable="true"
          @dragstart="(event) => handleDragStart(event, item.key)"
          @dragend="handleDragEnd"
        >
          <div class="widget-library__item-content">
            <div class="widget-library__item-title">
              {{ item.label }}
            </div>
            <div class="widget-library__item-desc">
              Binds <span class="widget-library__tag">{{ item.defaultBinding?.fieldKey }}</span>
            </div>
          </div>
        </t-card>
      </div>
      <p v-else class="widget-library__empty">
        All field widgets have been placed on the canvas.
      </p>
    </section>

    <section class="widget-library__section">
      <div class="widget-library__section-title">
        <SystemComponentsIcon />
        <span>Basic Widgets</span>
      </div>
      <div class="widget-library__list">
        <t-card
          v-for="item in basicWidgets"
          :key="item.key"
          class="widget-library__item widget-library__item--draggable"
          theme="poster2"
          hover-shadow
          draggable="true"
          @dragstart="(event) => handleDragStart(event, item.key)"
          @dragend="handleDragEnd"
        >
          <div class="widget-library__item-content">
            <div class="widget-library__item-title">
              {{ item.label }}
            </div>
            <div class="widget-library__item-desc">
              {{ item.description ?? 'Drag onto the layout to create a new widget.' }}
            </div>
          </div>
        </t-card>
      </div>
    </section>
  </div>
</template>

<style scoped>
.widget-library {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
}

.widget-library__header h2 {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.widget-library__desc {
  margin: 0;
  font-size: 13px;
  color: var(--td-text-color-secondary);
}

.widget-library__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.widget-library__section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.widget-library__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.widget-library__item {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.widget-library__item--draggable {
  cursor: grab;
}

.widget-library__item--draggable:active {
  cursor: grabbing;
}

.widget-library__item:hover {
  transform: translateY(-2px);
}

.widget-library__item-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.widget-library__item-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.widget-library__item-desc {
  font-size: 12px;
  color: var(--td-text-color-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.widget-library__tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(43, 75, 253, 0.12);
  color: #2b4bfd;
  font-size: 11px;
  font-weight: 500;
}

.widget-library__empty {
  margin: 0;
  font-size: 12px;
  color: var(--td-text-color-secondary);
}
</style>
