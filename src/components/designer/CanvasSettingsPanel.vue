<script setup lang="ts">
const props = defineProps<{
  backgroundType: 'color' | 'image'
  background: string
  backgroundImage?: string
}>()

const emit = defineEmits<{
  (e: 'update:type', type: 'color' | 'image'): void
  (e: 'update:background', value: string): void
  (e: 'update:image', value: string): void
}>()

const handleTypeChange = (value: string | number) => {
  emit('update:type', value as 'color' | 'image')
}

const handleBackgroundChange = (value: string | number) => {
  emit('update:background', String(value ?? ''))
}

const handleImageChange = (value: string | number) => {
  emit('update:image', String(value ?? ''))
}
</script>

<template>
  <section class="panel-block">
    <div class="panel-title">
      <div>
        <h3>画布设置</h3>
        <p>控制背景颜色或背景图</p>
      </div>
    </div>

    <div class="settings-group">
      <t-form label-width="96">
        <t-form-item label="背景类型">
          <t-radio-group :value="props.backgroundType" variant="outline" size="small" @change="handleTypeChange">
            <t-radio-button value="color">纯色</t-radio-button>
            <t-radio-button value="image">图片</t-radio-button>
          </t-radio-group>
        </t-form-item>

        <t-form-item v-if="props.backgroundType === 'color'" label="颜色">
          <t-input :value="props.background" placeholder="#111111" clearable @change="handleBackgroundChange" />
        </t-form-item>

        <t-form-item v-else label="图片地址">
          <t-input
            :value="props.backgroundImage"
            placeholder="https://example.com/bg.png"
            clearable
            @change="handleImageChange"
          />
        </t-form-item>
      </t-form>
    </div>
  </section>
</template>

<style scoped>
.settings-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:global(.settings-group .t-radio-button) {
  color: #e9ecf9;
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
}

:global(.settings-group .t-radio-button.t-is-checked) {
  background: #f5c271;
  color: #111;
  border-color: #f5c271;
}

:global(.settings-group .t-radio-button.t-is-checked .t-radio-button__content) {
  color: #111;
}
</style>
