<script setup lang="ts">
import { ref } from 'vue'
import DesignerHeader from './components/designer/DesignerHeader.vue'
import CardStage from './components/designer/CardStage.vue'
import SchemaPreview from './components/designer/SchemaPreview.vue'
import CanvasSettingsInline from './components/designer/CanvasSettingsInline.vue'
import ElementListPanel from './components/designer/ElementListPanel.vue'
import ElementInspector from './components/designer/ElementInspector.vue'
import BindingDataPanel from './components/designer/BindingDataPanel.vue'
import { useCardDesigner } from './composables/useCardDesigner'

const schemaExpanded = ref(false)
const {
  cardSchema,
  templates,
  selectedTemplateId,
  copyState,
  serializedSchema,
  activeElementId,
  activeElement,
  elementStyle,
  getElementPreview,
  setActiveElement,
  handleDragEnd,
  handleResizeEnd,
  addElement,
  removeActiveElement,
  resetSchema,
  selectTemplate,
  createTemplate,
  copySchema,
  bindingEntries,
  mutateElement,
  setBackgroundType,
  setBackgroundValue,
  setBackgroundImage,
  setFontColor
} = useCardDesigner()
</script>

<template>
  <div class="designer-page">
    <DesignerHeader
      :copy-state="copyState"
      :templates="templates"
      :selected-template-id="selectedTemplateId"
      @copy="copySchema"
      @select-template="selectTemplate"
      @create-template="createTemplate"
      @reset-template="resetSchema"
    />

    <main class="designer-body">
      <aside class="sidebar sidebar--left">
        <ElementListPanel
          :elements="cardSchema.elements"
          :active-element-id="activeElementId"
          :has-active="Boolean(activeElement)"
          @select="setActiveElement"
          @add="addElement"
          @remove="removeActiveElement"
        />
      </aside>

      <section class="canvas-panel">
        <div class="panel-title">
          <div>
            <h2>画布区域</h2>
            <p>使用鼠标拖动即可调整坐标与尺寸</p>
          </div>
          <CanvasSettingsInline
            :background-type="cardSchema.backgroundType ?? 'color'"
            :background="cardSchema.background"
            :background-image="cardSchema.backgroundImage"
            :font-color="cardSchema.fontColor"
            @update:type="setBackgroundType"
            @update:background="setBackgroundValue"
            @update:image="setBackgroundImage"
            @update:font-color="setFontColor"
          />
        </div>

        <div class="card-stage-wrapper">
          <CardStage
            :schema="cardSchema"
            :active-element-id="activeElementId"
            :element-style="elementStyle"
            :get-element-preview="getElementPreview"
            @activate-element="setActiveElement"
            @drag-end="handleDragEnd"
            @resize-end="handleResizeEnd"
          />

          <div class="schema-toggle">
            <t-button size="small" variant="outline" @click="schemaExpanded = !schemaExpanded">
              {{ schemaExpanded ? '收起布局 JSON' : '展开布局 JSON' }}
            </t-button>
          </div>
          <SchemaPreview
            v-if="schemaExpanded"
            :serialized-schema="serializedSchema"
            :copy-state="copyState"
            @copy="copySchema"
          />
        </div>
      </section>

      <aside class="sidebar sidebar--right">
        <ElementInspector
          :element="activeElement"
          :card-width="cardSchema.width"
          :card-height="cardSchema.height"
          :mutate-element="mutateElement"
        />

        <BindingDataPanel :entries="bindingEntries" />
      </aside>
    </main>
  </div>
</template>

<style scoped>
  .designer-page {
    min-height: 100vh;
    padding: 32px;
    background: radial-gradient(circle at top, #1a1b20, #050506 70%);
    color: #f6f7fb;
  }

  .designer-body {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr) 360px;
    gap: 24px;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .canvas-panel {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    padding: 24px;
    backdrop-filter: blur(12px);
  }

  .panel-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .panel-title h2,
  .panel-title h3 {
    margin: 0;
    color: #f6f7fb;
  }

  .panel-title p {
    margin: 4px 0 0;
    color: #9ba2bc;
    font-size: 0.9rem;
  }

  .panel-block :deep(.t-form__label) {
    color: #dfe3f4;
  }

  .panel-block :deep(.t-tag) {
    color: #f6f7fb;
  }

  .panel-block :deep(.t-input),
  .panel-block :deep(.t-input-number) {
    color: #121212;
  }

  .panel-block {
    padding: 20px;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(12px);
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
      padding: 16px;
    }
  }
</style>
