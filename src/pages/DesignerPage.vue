<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import DesignerHeader from '../components/designer/DesignerHeader.vue';
import CardStage from '../components/designer/CardStage.vue';
import SchemaPreview from '../components/designer/SchemaPreview.vue';
import ElementListPanel from '../components/designer/ElementListPanel.vue';
import ElementInspector from '../components/designer/ElementInspector.vue';
import BindingDataPanel from '../components/designer/BindingDataPanel.vue';
import ZoomContainer from '../components/common/ZoomContainer.vue';
import { useCardDesigner } from '../composables/useCardDesigner';

const backgroundOptions = [
  {
    label: '星空紫',
    fontColor: '#ffffff',
    value:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=60',
  },
  {
    label: '渐变蓝',
    fontColor: '#ffffff',
    value:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60',
  },
  {
    label: '商务黑',
    fontColor: '#666',
    value:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=60',
  },
  {
    label: '雪山',
    fontColor: '#1a1a1a',
    value:
      'https://images.unsplash.com/photo-1508264165352-258859e62245?auto=format&fit=crop&w=900&q=60',
  },
];

const schemaExpanded = ref(false);
const {
  cardSchema,
  templates,
  selectedTemplateId,
  copyState,
  serializedSchema,
  activeElementId,
  activeElement,
  getElementPreview,
  setActiveElement,
  handleDragEnd,
  handleResizeEnd,
  resetSchema,
  selectTemplate,
  createTemplate,
  copySchema,
  bindingEntries,
  mutateElement,
  setBackgroundImage,
  setFontColor,
  setElementVisibility,
  addElement,
} = useCardDesigner();

const handleBackgroundChange = (value: string) => {
  const option = backgroundOptions.find(item => item.value === value);
  setBackgroundImage(value);
  if (option?.fontColor) {
    setFontColor({ value: option.fontColor, syncChildren: true });
  }
};

const handleToggleElement = (payload: { id: string; visible: boolean }) => {
  setElementVisibility(payload.id, payload.visible);
};

const wrapperRef = ref<HTMLDivElement | null>(null);
const wrapperWidth = ref(0);
const wrapperHeight = ref(0);
let resizeObserver: ResizeObserver | null = null;

const updateWrapperSize = (rect: DOMRectReadOnly) => {
  wrapperWidth.value = rect.width;
  wrapperHeight.value = rect.height;
};

onMounted(() => {
  if (wrapperRef.value) {
    updateWrapperSize(wrapperRef.value.getBoundingClientRect());
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          updateWrapperSize(entry.contentRect);
        }
      });
      resizeObserver.observe(wrapperRef.value);
    }
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

const fitScale = computed(() => {
  const stageWidth = cardSchema.width || 1;
  if (!wrapperWidth.value) {
    return 1;
  }
  const sideGap = 200; // provide padding on both sides when fitting
  const availableWidth = Math.max(wrapperWidth.value - sideGap, 0);
  const ratio = availableWidth / stageWidth;
  return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
});

const maxScale = computed(() => Math.max(5, fitScale.value * 5));

const handleCreateLayoutPanel = () => {
  const created = addElement('layout-panel');
  if (created) {
    setActiveElement(created.id);
  }
};

onMounted(() => {
  if (!cardSchema.backgroundImage && backgroundOptions.length) {
    const first = backgroundOptions[0];
    handleBackgroundChange(first!.value);
  }
});
</script>

<template>
  <div class="designer-page">
    <DesignerHeader
      :copy-state="copyState"
      :templates="templates"
      :selected-template-id="selectedTemplateId"
      :background-options="backgroundOptions"
      :selected-background="cardSchema.backgroundImage || ''"
      @copy="copySchema"
      @select-template="selectTemplate"
      @create-template="createTemplate"
      @reset-template="resetSchema"
      @select-background="handleBackgroundChange" />

    <main class="designer-body">
      <aside class="sidebar sidebar--left">
        <ElementListPanel
          :elements="cardSchema.children"
          :active-element-id="activeElementId"
          @select="setActiveElement"
          @toggle-visible="handleToggleElement"
          @create-panel="handleCreateLayoutPanel" />
      </aside>

      <section class="canvas-panel">
        <div class="panel-title">
          <div>
            <h2>卡片画布</h2>
            <p>使用拖拽与缩放快速完成布局与尺寸调整</p>
          </div>
        </div>

        <div class="card-stage-wrapper" ref="wrapperRef">
          <ZoomContainer :initial-scale="fitScale" :max-scale="maxScale">
            <CardStage
              :schema="cardSchema"
              :active-element-id="activeElementId"
              :get-element-preview="getElementPreview"
              @activate-element="setActiveElement"
              @drag-end="handleDragEnd"
              @resize-end="handleResizeEnd" />
          </ZoomContainer>

          <div class="schema-toggle">
            <t-button
              size="small"
              variant="outline"
              @click="schemaExpanded = !schemaExpanded">
              {{ schemaExpanded ? '收起布局 JSON' : '展开布局 JSON' }}
            </t-button>
          </div>
          <SchemaPreview
            v-if="schemaExpanded"
            :serialized-schema="serializedSchema"
            :copy-state="copyState"
            @copy="copySchema" />
        </div>
      </section>

      <aside class="sidebar sidebar--right">
        <ElementInspector
          :element="activeElement"
          :card-width="cardSchema.width"
          :card-height="cardSchema.height"
          :elements="cardSchema.children"
          :mutate-element="mutateElement" />

        <BindingDataPanel :entries="bindingEntries" />
      </aside>
    </main>
  </div>
</template>

<style scoped>
.designer-page {
  min-height: 100vh;
  padding: 48px;
  background: linear-gradient(135deg, #e9eff7 0%, #f7fafc 100%);
  font-family: 'Noto Sans', 'PingFang SC', 'Helvetica Neue', sans-serif;
  color: #1a202c;
}

.designer-body {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 360px;
  gap: 28px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar,
.canvas-panel {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(43, 108, 176, 0.1);
  border: 1px solid rgba(66, 153, 225, 0.08);
  display: flex;
  flex-direction: column;
}

.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.panel-title h2,
.panel-title h3 {
  margin: 0;
  color: #1a202c;
}

.panel-title p {
  margin: 4px 0 0;
  color: #4a5568;
  font-size: 0.92rem;
}

.panel-block :deep(.t-form__label) {
  color: #2f3a4f;
}

.panel-block :deep(.t-tag) {
  color: #2b6cb0;
}

.panel-block :deep(.t-input),
.panel-block :deep(.t-input-number) {
  color: #1a202c;
}

.panel-block {
  padding: 20px;
  border-radius: 18px;
  border: 1px solid rgba(66, 153, 225, 0.12);
  background: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(233, 239, 247, 0.6);
}

.schema-toggle {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.card-stage-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* flex-grow: 1; */
  min-height: 0;
  flex-shrink: 0;
  height: calc(100vh - 128px);
}

@media (max-width: 1200px) {
  .designer-body {
    grid-template-columns: 1fr;
  }

  .canvas-panel {
    order: 1;
  }

  .sidebar.sidebar--left {
    order: 2;
  }

  .sidebar.sidebar--right {
    order: 3;
  }
}

@media (max-width: 768px) {
  .designer-page {
    padding: 24px;
  }
}
</style>
