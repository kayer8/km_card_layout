<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CardElement, LayoutPanelElement } from 'km-card-schema'
import IconInspector from './element-inspector/IconInspector.vue'
import TextInspector from './element-inspector/TextInspector.vue'
import ImageInspector from './element-inspector/ImageInspector.vue'
import LayoutPanelInspector from './element-inspector/LayoutPanelInspector.vue'

const props = defineProps<{
  element?: CardElement
  cardWidth: number
  cardHeight: number
  mutateElement: (id: string, mutator: (draft: any) => void) => void
}>()

const mutateCurrent = (mutator: (draft: any) => void) => {
  if (!props.element) return
  props.mutateElement(props.element.id, mutator)
}

const updateRect = (field: 'x' | 'y' | 'width' | 'height', value: string | number | null) => {
  const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
  mutateCurrent((draft) => {
    // fall back to 0 when input is invalid
    ;(draft as any)[field] = Number.isNaN(numericValue) ? 0 : numericValue
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
    get: () => (props.element ? (props.element as any)[field] ?? 0 : 0),
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
const widthModel = rectProxy('width')
const heightModel = rectProxy('height')

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

      <t-form-item label="绑定字段">
        <t-input v-model="bindingValue" placeholder="user.name" clearable readonly disabled />
      </t-form-item>

      <t-form-item label="显示">
        <t-switch v-model="visibleValue" />
      </t-form-item>

      <t-form-item label="位置">
        <t-space>
          <t-input-number v-model:value="xModel" size="small" :min="0" :max="props.cardWidth" />
          <t-input-number v-model:value="yModel" size="small" :min="0" :max="props.cardHeight" />
        </t-space>

      </t-form-item>

      <t-form-item label="尺寸">
        <t-space>
          <t-input-number v-model:value="widthModel" size="small" :min="0" :max="props.cardWidth" />
          <t-input-number v-model:value="heightModel" size="small" :min="0" :max="props.cardHeight" />
        </t-space>
      </t-form-item>

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

      <!-- <t-form-item label="Style JSON">
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
      </t-form-item> -->
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
</style>
