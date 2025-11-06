<template>
  <div class="layers">
    <div class="layers__title">图层</div>
    <div class="layers__list">
      <div
        v-for="layer in layers"
        :key="layer.id"
        class="layers__item"
        :class="{ 'layers__item--active': layer.id === store.selectedElementId }"
        @click="store.selectElement(layer.id)"
      >
        <div class="layers__item-left">
          <span class="layers__item-name">{{ layer.name }}</span>
          <span class="layers__item-type">{{ layer.type }}</span>
        </div>
        <div class="layers__item-actions">
          <t-button size="small" shape="square" variant="text" @click.stop="store.bringToFront(layer.id)">
            置顶
          </t-button>
          <t-button size="small" shape="square" variant="text" @click.stop="store.bringForward(layer.id)">
            上移
          </t-button>
          <t-button size="small" shape="square" variant="text" @click.stop="store.sendBackward(layer.id)">
            下移
          </t-button>
          <t-button size="small" shape="square" variant="text" @click.stop="store.sendToBack(layer.id)">
            置底
          </t-button>
          <t-button
            size="small"
            shape="square"
            variant="text"
            theme="danger"
            @click.stop="store.removeElement(layer.id)"
          >
            删除
          </t-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLayoutStore } from '@/stores/layoutStore';

const store = useLayoutStore();
const layers = computed(() =>
  store.elements
    .slice()
    .sort((a, b) => b.layout.zIndex - a.layout.zIndex)
);
</script>

<style scoped>
.layers {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.layers__title {
  font-size: 16px;
  font-weight: 600;
}

.layers__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 280px;
  overflow-y: auto;
}

.layers__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e7e7e7;
  cursor: pointer;
  transition: background 0.2s ease;
}

.layers__item:hover {
  background: rgba(38, 175, 255, 0.08);
}

.layers__item--active {
  border-color: rgba(38, 175, 255, 0.6);
  background: rgba(38, 175, 255, 0.12);
}

.layers__item-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.layers__item-name {
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
}

.layers__item-type {
  font-size: 12px;
  color: #86909c;
}

.layers__item-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
