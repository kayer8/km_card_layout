<script setup lang="ts">
import { computed } from 'vue'
import type { LayoutPanelElement, LayoutMode, FlexContainerOptions } from 'km-card-schema'
import { applyContainerLayoutMode } from '../../../modules/layout/tree-utils'

const props = defineProps<{
  element: LayoutPanelElement
  mutate: (mutator: (draft: LayoutPanelElement) => void) => void
}>()

const ensureContainer = (draft: LayoutPanelElement) => {
  if (!draft.container) {
    draft.container = { mode: 'flex' }
  }
  if (!draft.container.options) {
    draft.container.options = {}
  }
  return draft.container
}

const patchOptions = (updater: (options: FlexContainerOptions) => void) => {
  props.mutate((draft) => {
    const container = ensureContainer(draft)
    updater(container.options!)
  })
}

const modeValue = computed({
  get: () => props.element.container.mode,
  set: (value: LayoutMode) => {
    props.mutate((draft) => {
      if (!draft.container) {
        draft.container = { mode: value }
      } else {
        draft.container.mode = value
      }
      if (value === 'flex') {
        if (!draft.container.options) {
          draft.container.options = {}
        }
      } else {
        delete draft.container.options
      }
      applyContainerLayoutMode(draft, value)
    })
  }
})

const directionValue = computed({
  get: () => props.element.container.options?.direction ?? 'row',
  set: (value: FlexContainerOptions['direction']) => {
    patchOptions((options) => {
      options.direction = value
    })
  }
})

const wrapValue = computed({
  get: () => props.element.container.options?.wrap ?? 'nowrap',
  set: (value: FlexContainerOptions['wrap']) => {
    patchOptions((options) => {
      options.wrap = value
    })
  }
})

const justifyValue = computed({
  get: () => props.element.container.options?.justifyContent ?? 'flex-start',
  set: (value: FlexContainerOptions['justifyContent']) => {
    patchOptions((options) => {
      options.justifyContent = value
    })
  }
})

const alignValue = computed({
  get: () => props.element.container.options?.alignItems ?? 'stretch',
  set: (value: FlexContainerOptions['alignItems']) => {
    patchOptions((options) => {
      options.alignItems = value
    })
  }
})

const gapValue = computed({
  get: () => {
    const gap = props.element.container.options?.gap
    if (typeof gap === 'number') {
      return gap
    }
    if (gap && typeof gap === 'object') {
      return gap.row ?? gap.column ?? 0
    }
    return 0
  },
  set: (value: number | null) => {
    patchOptions((options) => {
      if (value === null || value === undefined) {
        delete options.gap
        return
      }
      options.gap = value
    })
  }
})

const paddingValue = computed({
  get: () => {
    const padding = props.element.container.options?.padding
    if (typeof padding === 'number') {
      return padding
    }
    if (Array.isArray(padding)) {
      return padding[0] ?? 0
    }
    return 0
  },
  set: (value: number | null) => {
    patchOptions((options) => {
      if (value === null || value === undefined) {
        delete options.padding
        return
      }
      options.padding = value
    })
  }
})

const modeOptions = [
  { label: '绝对定位', value: 'absolute' },
  { label: 'Flex 布局', value: 'flex' }
]

const directionOptions = [
  { label: '横向 (row)', value: 'row' },
  { label: '纵向 (column)', value: 'column' }
]

const wrapOptions = [
  { label: '不换行 (nowrap)', value: 'nowrap' },
  { label: '换行 (wrap)', value: 'wrap' }
]

const justifyOptions = [
  { label: '前置 (flex-start)', value: 'flex-start' },
  { label: '末端 (flex-end)', value: 'flex-end' },
  { label: '居中 (center)', value: 'center' },
  { label: '两端 (space-between)', value: 'space-between' },
  { label: '等间距 (space-around)', value: 'space-around' },
  { label: '平均 (space-evenly)', value: 'space-evenly' }
]

const alignOptions = [
  { label: '顶部 (flex-start)', value: 'flex-start' },
  { label: '底部 (flex-end)', value: 'flex-end' },
  { label: '居中 (center)', value: 'center' },
  { label: '拉伸 (stretch)', value: 'stretch' },
  { label: '基线 (baseline)', value: 'baseline' }
]
</script>

<template>
  <section class="panel-block">
    <div class="panel-title">
      <div>
        <h3>面板布局配置</h3>
        <p>使用 schema 中的 container 配置定义布局行为</p>
      </div>
    </div>

    <t-form label-width="120">
      <t-form-item label="容器模式">
        <t-select v-model="modeValue" size="small" :options="modeOptions" />
      </t-form-item>

      <template v-if="modeValue === 'flex'">
        <t-form-item label="方向">
          <t-select v-model="directionValue" size="small" :options="directionOptions" />
        </t-form-item>
        <t-form-item label="是否换行">
          <t-select v-model="wrapValue" size="small" :options="wrapOptions" />
        </t-form-item>
        <t-form-item label="主轴对齐">
          <t-select v-model="justifyValue" size="small" :options="justifyOptions" />
        </t-form-item>
        <t-form-item label="交叉轴对齐">
          <t-select v-model="alignValue" size="small" :options="alignOptions" />
        </t-form-item>
        <t-form-item label="间距 (gap)">
          <t-input-number v-model:value="gapValue" size="small" :min="0" />
        </t-form-item>
        <t-form-item label="内边距 (padding)">
          <t-input-number v-model:value="paddingValue" size="small" :min="0" />
        </t-form-item>
      </template>
    </t-form>
  </section>
</template>
