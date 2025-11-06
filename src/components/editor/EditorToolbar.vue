<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <t-input
        v-model="title"
        placeholder="布局名称"
        size="large"
        @blur="updateTitle"
        style="width: 220px"
      />
      <t-space>
        <t-button size="large" variant="text" @click="store.undo" :disabled="!canUndo">
          撤销
        </t-button>
        <t-button size="large" variant="text" @click="store.redo" :disabled="!canRedo">
          重做
        </t-button>
      </t-space>
    </div>
    <div class="toolbar-right">
      <t-space size="small">
        <t-button theme="default" variant="base" @click="store.reset">重置布局</t-button>
        <t-button theme="default" variant="outline" @click="triggerImport">导入JSON</t-button>
        <input
          ref="fileInput"
          type="file"
          accept="application/json"
          class="toolbar-upload"
          @change="handleImport"
        />
        <t-button theme="primary" @click="handleExport">导出JSON</t-button>
      </t-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLayoutStore } from '@/stores/layoutStore';

const store = useLayoutStore();
const fileInput = ref<HTMLInputElement | null>(null);
const title = ref(store.layout.meta.title);

const canUndo = computed(() => !!store.history.past.length);
const canRedo = computed(() => !!store.history.future.length);

const updateTitle = () => {
  store.layout.meta.title = title.value;
  store.touch();
};

const handleExport = () => {
  const json = store.exportLayout();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${store.layout.meta.title || 'card-layout'}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

const triggerImport = () => {
  fileInput.value?.click();
};

const handleImport = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;
  const file = target.files[0];
  const text = await file.text();
  try {
    const layout = JSON.parse(text);
    store.importLayout(layout);
  } catch (error) {
    console.error('导入失败', error);
  } finally {
    target.value = '';
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 64px;
  gap: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.toolbar-upload {
  display: none;
}
</style>
