<script setup lang="ts">
import type { CardElement, CardElementType } from '@km/card-schema'

const props = defineProps<{
  elements: CardElement[]
  activeElementId: string
  hasActive: boolean
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'add', type: CardElementType): void
  (e: 'remove'): void
}>()
</script>

<template>
  <section class="panel-block">
    <div class="panel-title">
      <div>
        <h3>元素列表</h3>
        <p>当前共 {{ props.elements.length }} 个元素</p>
      </div>
    </div>
    <div class="element-list">
      <button
        v-for="element in props.elements"
        :key="`chip-${element.id}`"
        type="button"
        class="element-chip"
        :class="{ active: props.activeElementId === element.id }"
        @click="emit('select', element.id)"
      >
        <strong>{{ element.id }}</strong>
        <span>{{ element.type }}</span>
      </button>
    </div>
    <div class="panel-actions">
      <t-button size="small" variant="outline" @click="emit('add', 'text')">新增文本</t-button>
      <t-button size="small" variant="outline" @click="emit('add', 'icon')">新增图标</t-button>
      <t-button size="small" variant="outline" @click="emit('add', 'image')">新增图片</t-button>
      <t-button size="small" theme="danger" variant="outline" :disabled="!props.hasActive" @click="emit('remove')">
        删除选中
      </t-button>
    </div>
  </section>
</template>

<style scoped>
.element-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.element-chip {
  flex: 1 1 calc(50% - 8px);
  border-radius: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition: border 0.2s, background 0.2s;
}

.element-chip.active {
  border-color: #f5c271;
  background: rgba(245, 194, 113, 0.1);
}

.element-chip strong {
  display: block;
  font-size: 0.95rem;
}

.element-chip span {
  font-size: 0.75rem;
  color: #9ba2bc;
}

.panel-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
</style>
