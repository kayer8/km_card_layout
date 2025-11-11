<script setup lang="ts">
const props = defineProps<{
  entries: Array<[string, string | number | boolean]>
}>()
</script>

<template>
  <section class="panel-block">
    <div class="panel-title">
      <div>
        <h3>绑定数据</h3>
        <p>示例数据可直接替换</p>
      </div>
    </div>
    <div class="binding-grid">
      <div class="binding-row" v-for="[key, value] in props.entries" :key="key">
        <span class="binding-label">user.{{ key }}</span>
        <strong class="binding-value">{{ value }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.binding-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.binding-row {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.binding-label {
  font-size: 0.75rem;
  color: #9ba2bc;
}

.binding-value {
  font-size: 0.95rem;
  word-break: break-word;
}
</style>
