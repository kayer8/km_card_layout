<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface ResourceOption {
  value: string
  label: string
  description?: string
  tag?: string
}

const props = withDefaults(
  defineProps<{
    visible: boolean
    title: string
    multiple?: boolean
    options: ResourceOption[]
  }>(),
  {
    multiple: false,
    options: () => []
  }
)

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', values: string[]): void
}>()

const internalSelection = ref<string[]>([])

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      internalSelection.value = []
    }
  }
)

const handleCancel = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  if (!internalSelection.value.length) return
  emit('confirm', [...internalSelection.value])
  handleCancel()
}

const selectValue = computed({
  get: () => internalSelection.value,
  set: (val: string[]) => {
    internalSelection.value = Array.isArray(val) ? val : []
  }
})

const handleVisibleChange = (value: boolean) => {
  emit('update:visible', value)
}
</script>

<template>
  <t-dialog
    :visible="visible"
    :header="title"
    width="520px"
    @update:visible="handleVisibleChange"
  >
    <t-select
      v-model="selectValue"
      :multiple="multiple"
      placeholder="请选择资源"
      :min-collapsed-num="3"
      class="select-wrapper"
    >
      <t-option v-for="option in options" :key="option.value" :value="option.value" :label="option.label">
        {{ option.label }}
      </t-option>
    </t-select>

    <template #footer>
      <t-button variant="outline" @click="handleCancel">取消</t-button>
      <t-button theme="primary" :disabled="!internalSelection.length" @click="handleConfirm">确定</t-button>
    </template>
  </t-dialog>
</template>

<style scoped>
  .select-wrapper :deep(.t-select__wrap) {
    width: 100%;
  }

  .select-wrapper :deep(.t-option) {
    font-weight: 500;
    color: #1a2235;
  }
</style>
