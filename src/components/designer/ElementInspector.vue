<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CardElement, FlexItemLayoutDefinition, FlexItemOptions, LayoutPanelElement } from 'km-card-schema'
import IconInspector from './element-inspector/IconInspector.vue'
import TextInspector from './element-inspector/TextInspector.vue'
import ImageInspector from './element-inspector/ImageInspector.vue'
import LayoutPanelInspector from './element-inspector/LayoutPanelInspector.vue'
import { findElementLocation } from '../../modules/layout/tree-utils'

const props = defineProps<{
  element?: CardElement
  cardWidth: number
  cardHeight: number
  mutateElement: (id: string, mutator: (draft: any) => void) => void
  elements: CardElement[]
}>()

const mutateCurrent = (mutator: (draft: any) => void) => {
  if (!props.element) return
  props.mutateElement(props.element.id, mutator)
}

const updateRect = (field: 'x' | 'y' | 'width' | 'height', value: string | number | null) => {
  const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
  mutateCurrent((draft) => {
    if (!draft.layout) {
      draft.layout = { mode: 'absolute', x: 0, y: 0 }
    }
    const layout = draft.layout
    if (!Object.prototype.hasOwnProperty.call(layout, field)) {
      layout[field] = 0
    }
    layout[field] = Number.isNaN(numericValue) ? 0 : numericValue
  })
}

const updateBinding = (value: string) => {
  mutateCurrent((draft) => {
    draft.binding = value || undefined
  })
}

type RectField = 'x' | 'y' | 'width' | 'height'

const rectProxy = (field: RectField) =>
  computed({
    get: () => (props.element && props.element.layout ? (props.element.layout as any)[field] ?? 0 : 0),
    set: (value: number | null) => updateRect(field, value)
  })

const bindingValue = computed({
  get: () => props.element?.binding ?? '',
  set: (value: string) => updateBinding(value)
})

const visibleValue = computed({
  get: () => (props.element ? props.element.visible !== false : true),
  set: (value: boolean) =>
    mutateCurrent((draft) => {
      draft.visible = value
    })
})

const xModel = rectProxy('x')
const yModel = rectProxy('y')
const isFlexChild = computed(() => props.element?.layout.mode === 'flex')
const widthModel = rectProxy('width')
const heightModel = rectProxy('height')
const location = computed(() => (props.element ? findElementLocation(props.elements, props.element.id) : null))
const isParentFlex = computed(() => location.value?.parent?.container?.mode === 'flex')

const ensureItem = (draft: any) => {
  if (!draft.layout) {
    draft.layout = { mode: 'absolute' }
  }
  if (draft.layout.mode !== 'flex') {
    draft.layout.mode = 'flex'
  }
  if (!('item' in draft.layout) || !draft.layout.item) {
    ;(draft.layout as FlexItemLayoutDefinition).item = {}
  }
  return (draft.layout as FlexItemLayoutDefinition).item!
}

const updateFlexItem = (field: keyof FlexItemOptions, value: unknown | null) => {
  mutateCurrent((draft) => {
    const item = ensureItem(draft)
    if (value === null || value === undefined || value === '') {
      delete item[field]
    } else {
      ;(item as any)[field] = value
    }
  })
}

const numberModel = (field: keyof FlexItemOptions, defaultValue = 0) =>
  computed({
    get: () => {
      const value = (props.element?.layout as FlexItemLayoutDefinition | undefined)?.item?.[field]
      return typeof value === 'number' ? value : defaultValue
    },
    set: (value: number | null) => updateFlexItem(field, value ?? defaultValue)
  })

const flexGrowModel = numberModel('flexGrow', 0)
const flexShrinkModel = numberModel('flexShrink', 1)
const flexOrderModel = numberModel('order', 0)

const flexBasisModel = computed({
  get: () => (props.element?.layout as FlexItemLayoutDefinition | undefined)?.item?.flexBasis ?? '',
  set: (value: string | null) => updateFlexItem('flexBasis', value)
})

const alignSelfModel = computed({
  get: () => (props.element?.layout as FlexItemLayoutDefinition | undefined)?.item?.alignSelf ?? 'stretch',
  set: (value: FlexItemOptions['alignSelf'] | null) => updateFlexItem('alignSelf', value ?? undefined)
})

const alignSelfOptions: { label: string; value: FlexItemOptions['alignSelf'] }[] = [
  { label: '继承（stretch）', value: 'stretch' },
  { label: '顶端（flex-start）', value: 'flex-start' },
  { label: '底端（flex-end）', value: 'flex-end' },
  { label: '居中（center）', value: 'center' },
  { label: 'baseline', value: 'baseline' }
]

const styleText = ref('')
const styleError = ref('')

watch(
  () => props.element,
  (next) => {
    if (next) {
      styleText.value = JSON.stringify(next.style ?? {}, null, 2)
    } else {
      styleText.value = ''
    }
    styleError.value = ''
  },
  { immediate: true }
)

const applyStyleText = () => {
  if (!props.element) return
  const trimmed = styleText.value.trim()
  if (!trimmed) {
    mutateCurrent((draft) => {
      draft.style = undefined
    })
    styleError.value = ''
    return
  }

  try {
    const parsed = JSON.parse(trimmed)
    mutateCurrent((draft) => {
      draft.style = parsed
    })
    styleError.value = ''
  } catch (error) {
    styleError.value = 'Style JSON parse failed. Please check format.'
  }
}
</script>

<template>
  <section v-if="props.element" class="panel-block">
    <div class="panel-title">
      <div>
        <h3>Element Properties</h3>
        <p>ID: {{ props.element.id }}</p>
      </div>
    </div>

    <t-form label-width="88">
      <t-form-item label="类型">
        <t-tag theme="default" variant="outline">{{ props.element.type }}</t-tag>
      </t-form-item>

      <t-form-item label="绑定字段" v-if="props.element.binding">
        <t-input v-model="bindingValue" placeholder="" clearable readonly disabled />
      </t-form-item>

      <t-form-item label="显示">
        <t-switch v-model="visibleValue" />
      </t-form-item>

      <t-form-item label="位置">
        <t-space>
          <t-input-number
            v-model:value="xModel"
            size="small"
            :min="0"
            :max="props.cardWidth"
            :disabled="isFlexChild"
          />
          <t-input-number
            v-model:value="yModel"
            size="small"
            :min="0"
            :max="props.cardHeight"
            :disabled="isFlexChild"
          />
        </t-space>
      </t-form-item>

      <t-form-item label="尺寸">
        <t-space>
          <t-input-number v-model:value="widthModel" size="small" :min="0" :max="props.cardWidth" />
          <t-input-number v-model:value="heightModel" size="small" :min="0" :max="props.cardHeight" />
        </t-space>
      </t-form-item>

      <template v-if="isParentFlex">
        <t-form-item label="flex-grow">
          <t-input-number v-model:value="flexGrowModel" size="small" :min="0" />
        </t-form-item>
        <t-form-item label="flex-shrink">
          <t-input-number v-model:value="flexShrinkModel" size="small" :min="0" />
        </t-form-item>
        <t-form-item label="flex-basis">
          <t-input v-model="flexBasisModel" size="small" placeholder="auto / 100px" />
        </t-form-item>
        <t-form-item label="order">
          <t-input-number v-model:value="flexOrderModel" size="small" :step="1" />
        </t-form-item>
        <t-form-item label="align-self">
          <t-select v-model="alignSelfModel" size="small" :options="alignSelfOptions" />
        </t-form-item>
      </template>

      <TextInspector
        v-if="props.element?.type === 'text'"
        :element="props.element"
        :mutate="mutateCurrent"
      />
      <ImageInspector
        v-else-if="props.element?.type === 'image'"
        :element="props.element"
        :mutate="mutateCurrent"
      />
      <IconInspector
        v-else-if="props.element?.type === 'icon'"
        :element="props.element"
        :mutate="mutateCurrent"
      />

      <LayoutPanelInspector
        v-else-if="props.element?.type === 'layout-panel'"
        :element="props.element as LayoutPanelElement"
        :mutate="mutateCurrent"
      />

       <t-form-item label="Style JSON">
        <div class="style-editor">
          <t-textarea
            v-model="styleText"
            placeholder='{"color":"#fff","fontSize":20}'
            autosize
            @blur="applyStyleText"
          />
          <div class="style-editor__actions">
            <t-button size="small" variant="outline" @click="applyStyleText">应用</t-button>
            <span v-if="styleError" class="style-error">{{ styleError }}</span>
          </div>
        </div>
      </t-form-item>
    </t-form>
  </section>
</template>

<style scoped>
:global(.t-form__item) {
  margin-bottom: 12px;
}

.style-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.style-editor__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.style-error {
  font-size: 0.8rem;
  color: #ff8a8a;
}
.helper-text {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #8590a6;
}
</style>
