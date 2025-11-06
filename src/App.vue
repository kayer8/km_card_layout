<template>
  <t-layout class="editor-layout">
    <t-header class="editor-header">
      <EditorToolbar />
    </t-header>
    <t-layout class="editor-main">
      <t-aside class="editor-aside editor-aside--left" width="260px">
        <ElementPalette class="editor-card" />
        <LayersPanel class="editor-card" />
      </t-aside>
      <t-content class="editor-content">
        <CanvasStage />
      </t-content>
      <t-aside class="editor-aside editor-aside--right" width="320px">
        <PropertyPanel class="editor-card" />
      </t-aside>
    </t-layout>
  </t-layout>
</template>

<script setup lang="ts">
import CanvasStage from '@/components/canvas/CanvasStage.vue';
import ElementPalette from '@/components/palette/ElementPalette.vue';
import LayersPanel from '@/components/layers/LayersPanel.vue';
import PropertyPanel from '@/components/inspector/PropertyPanel.vue';
import EditorToolbar from '@/components/editor/EditorToolbar.vue';
</script>

<style scoped>
.editor-layout {
  height: 100%;
  background: #f5f6f8;
}

.editor-header {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #e7e7e7;
  background: #ffffff;
}

.editor-main {
  height: calc(100vh - 64px);
}

.editor-aside {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  overflow: auto;
  background: #f5f6f8;
}

.editor-aside--left {
  border-right: 1px solid #e7e7e7;
}

.editor-aside--right {
  border-left: 1px solid #e7e7e7;
}

.editor-content {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #f5f6f8 25%, transparent 25%) 0 0 / 20px 20px,
    linear-gradient(-45deg, #f5f6f8 25%, transparent 25%) 0 0 / 20px 20px,
    linear-gradient(45deg, transparent 75%, #f5f6f8 75%) 0 0 / 20px 20px,
    linear-gradient(-45deg, transparent 75%, #f5f6f8 75%) 0 0 / 20px 20px;
}

.editor-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}
</style>
