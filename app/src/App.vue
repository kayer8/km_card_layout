<script setup lang="ts">
import DesignerView from '@/views/DesignerView.vue'
</script>

<template>
  <t-config-provider>
    <t-layout class="app-layout">
      <t-header class="app-header">
        <div class="app-header__title">
          KM Card Layout Designer
        </div>
        <div class="app-header__actions">
          <t-button variant="text" theme="primary">
            Import Layout
          </t-button>
          <t-button theme="primary">
            Export JSON
          </t-button>
        </div>
      </t-header>

      <t-layout class="app-body">
        <DesignerView />
      </t-layout>
    </t-layout>
  </t-config-provider>
</template>

<style scoped>
.app-layout {
  height: 100vh;
  background: var(--td-bg-color);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--td-border-level-1-color);
  background: var(--td-bg-color-container);
}

.app-header__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.app-header__actions {
  display: flex;
  gap: 12px;
}

.app-body {
  height: calc(100vh - 64px);
  background: var(--td-bg-color);
}
</style>
