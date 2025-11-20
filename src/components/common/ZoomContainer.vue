<template>
  <div class="zoom-container">
    <div
      class="zoom-content-wrapper"
      ref="wrapperRef"
      @wheel.prevent="onWheel"
    >
      <div
        ref="contentRef"
        class="zoom-content"
        :style="{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }"
      >
        <slot></slot>
      </div>
    </div>

    <!-- Footer -->
    <div class="zoom-footer">
      <input
        class="zoom-input"
        type="text"
        :value="Math.round(scale * 100) + '%'"
        readonly
      />

      <button class="zoom-btn" @click="resetScale">100%</button>
      <button class="zoom-btn" @click="fitWidth">适应宽度</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

type Props = {
  initialScale?: number;
  minScale?: number;
  step?: number;
};

const props = defineProps<Props>();

const scale = ref(props.initialScale ?? 1);
const minScale = props.minScale ?? 0.5;
const step = props.step ?? 0.1;

const wrapperRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);

const onWheel = (e: WheelEvent) => {
  const delta = e.deltaY < 0 ? step : -step;
  scale.value = Math.min(props.initialScale ??1, Math.max(minScale, scale.value + delta));
};

const resetScale = () => {
  scale.value = 1;
};

const fitWidth = () => {
  if (!wrapperRef.value || !contentRef.value) return;
  const containerWidth = wrapperRef.value.clientWidth;
  const contentWidth = contentRef.value.scrollWidth;
  const newScale = containerWidth / contentWidth;
  // 适应宽度 = 最大比例
  scale.value = Math.min(props.initialScale ??1, newScale);
};

watch(
  () => props.initialScale,
  (value) => {
    if (typeof value === 'number' && !Number.isNaN(value)) {
      scale.value = Math.min(props.initialScale ??1, Math.max(minScale, value));
    }
  }
);
</script>

<style scoped>
.zoom-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
}

.zoom-content-wrapper {
  flex: 1;
  overflow: auto;
  padding: 12px;
  background: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zoom-content {
  width: fit-content;
}

.zoom-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid #ddd;
  background: white;
}

.zoom-input {
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f8f8f8;
}

.zoom-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}
.zoom-btn:hover {
  background: #f0f0f0;
}
</style>
