<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutStore } from '@/stores/layoutStore'

const layoutStore = useLayoutStore()

const activeWidget = computed(() =>
  layoutStore.widgets.find((item) => item.id === layoutStore.selection.activeId) ?? null,
)

const canEditText = computed(() => activeWidget.value?.type === 'text')

const fallbackText = computed({
  get: () => activeWidget.value?.binding?.fallbackText ?? '',
  set: (value: string) => {
    if (!activeWidget.value) return
    layoutStore.updateWidgetBinding(activeWidget.value.id, { fallbackText: value })
  },
})

const fontSize = computed({
  get: () => activeWidget.value?.style.fontSize ?? 16,
  set: (value: number) => {
    if (!activeWidget.value) return
    layoutStore.updateWidgetStyle(activeWidget.value.id, { fontSize: value })
  },
})

const fontColor = computed({
  get: () => activeWidget.value?.style.color ?? '#1D2129',
  set: (value: string) => {
    if (!activeWidget.value) return
    layoutStore.updateWidgetStyle(activeWidget.value.id, { color: value })
  },
})

const lineHeight = computed({
  get: () => activeWidget.value?.style.lineHeight ?? 1.4,
  set: (value: number) => {
    if (!activeWidget.value) return
    layoutStore.updateWidgetStyle(activeWidget.value.id, { lineHeight: value })
  },
})

const textAlign = computed({
  get: () => activeWidget.value?.style.textAlign ?? 'left',
  set: (value: 'left' | 'center' | 'right') => {
    if (!activeWidget.value) return
    layoutStore.updateWidgetStyle(activeWidget.value.id, { textAlign: value })
  },
})
</script>

<template>
  <div class="inspector-panel">
    <header class="inspector-panel__header">
      <h3>Properties</h3>
      <p v-if="activeWidget" class="inspector-panel__subtitle">
        Selected: {{ activeWidget.title }}
      </p>
      <p v-else class="inspector-panel__subtitle">
        Select a component on the canvas to edit its settings.
      </p>
    </header>

    <t-tabs value="content" size="large">
      <t-tab-panel value="content" label="Content">
        <t-form
          v-if="activeWidget"
          label-width="96"
          class="inspector-panel__form"
        >
          <t-form-item label="Binding">
            <span>
              {{ activeWidget.binding?.fieldKey ?? 'Not bound' }}
            </span>
          </t-form-item>

          <t-form-item
            v-if="canEditText"
            label="Fallback Text"
          >
            <t-textarea
              v-model="fallbackText"
              placeholder="Default text when data is unavailable."
              auto-size
              clearable
            />
          </t-form-item>
        </t-form>
        <p v-else class="inspector-panel__empty">
          Select a widget to edit its content.
        </p>
      </t-tab-panel>

      <t-tab-panel value="style" label="Style">
        <t-form
          v-if="activeWidget"
          label-width="96"
          class="inspector-panel__form"
        >
          <t-form-item label="Font Size">
            <t-input-number v-model="fontSize" :min="10" :max="64" />
          </t-form-item>

          <t-form-item label="Line Height">
            <t-slider v-model="lineHeight" :min="1" :max="2" :step="0.1" />
          </t-form-item>

          <t-form-item label="Alignment">
            <t-radio-group v-model="textAlign" variant="filled" size="small">
              <t-radio-button value="left">
                Left
              </t-radio-button>
              <t-radio-button value="center">
                Center
              </t-radio-button>
              <t-radio-button value="right">
                Right
              </t-radio-button>
            </t-radio-group>
          </t-form-item>

          <t-form-item label="Font Color">
            <t-color-picker v-model="fontColor" />
          </t-form-item>
        </t-form>
        <p v-else class="inspector-panel__empty">
          Select a widget to adjust its style.
        </p>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<style scoped>
.inspector-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  gap: 16px;
  overflow: hidden;
}

.inspector-panel__header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.inspector-panel__subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--td-text-color-secondary);
}

.inspector-panel__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.inspector-panel__empty {
  margin: 12px 0;
  color: var(--td-text-color-secondary);
  font-size: 13px;
}
</style>
