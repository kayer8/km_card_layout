<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CardElement } from '@km/card-schema'

const props = defineProps<{
  element?: CardElement
  cardWidth: number
  cardHeight: number
  mutateElement: (id: string, mutator: (draft: CardElement) => void) => void
}>()

const isTextElement = computed(() => props.element?.type === 'text')

const mutate = (mutator: (draft: CardElement) => void) => {
  if (!props.element) return
  props.mutateElement(props.element.id, mutator)
}

const updateRect = (field: 'x' | 'y' | 'width' | 'height', value: string | number | null) => {
  const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
  mutate((draft) => {
    ;(draft as any)[field] = Number.isNaN(numericValue) ? 0 : numericValue
  })
}

const updateBinding = (value: string) => {
  mutate((draft) => {
    draft.binding = value || undefined
  })
}

const updateContent = (value: string) => {
  mutate((draft) => {
    draft.content = value
  })
}

const updateStyleField = (field: string, value: string | number | null) => {
  mutate((draft) => {
    draft.style = { ...(draft.style ?? {}) }
    if (value === null || value === undefined || value === '') {
      delete draft.style[field]
    } else {
      draft.style[field] = value
    }
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

const contentValue = computed({
  get: () => props.element?.content ?? '',
  set: (value: string) => updateContent(value)
})

const styleProxy = (field: string, fallback: string | number) =>
  computed({
    get: () => (props.element?.style?.[field] ?? fallback) as string | number,
    set: (value: string | number | null) => updateStyleField(field, value)
  })

const xModel = rectProxy('x')
const yModel = rectProxy('y')
const widthModel = rectProxy('width')
const heightModel = rectProxy('height')

const fontSizeValue = styleProxy('fontSize', 18)
const colorValue = styleProxy('color', '#FFFFFF')
const fontWeightValue = styleProxy('fontWeight', 'bold')

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
    mutate((draft) => {
      draft.style = undefined
    })
    styleError.value = ''
    return
  }
  try {
    const parsed = JSON.parse(trimmed)
    mutate((draft) => {
      draft.style = parsed
    })
    styleError.value = ''
  } catch (error) {
    styleError.value = 'Style JSON 解析失败，请检查格式'
  }
}
</script>

<template>
  <section v-if="props.element" class="panel-block">
    <div class="panel-title">
      <div>
        <h3>元素属性</h3>
        <p>ID：{{ props.element.id }}</p>
      </div>
    </div>

    <t-form label-width="88">
      <t-form-item label="类型">
        <t-tag theme="default" variant="outline">{{ props.element.type }}</t-tag>
      </t-form-item>

      <t-form-item label="绑定字段">
        <t-input v-model="bindingValue" placeholder="user.name" clearable />
      </t-form-item>

      <t-form-item label="内容兜底">
        <t-input v-model="contentValue" placeholder="没有绑定时展示" />
      </t-form-item>

      <t-form-item label="坐标">
        <t-space>
          <t-input-number v-model:value="xModel" size="small" :min="0" :max="props.cardWidth" />
          <t-input-number v-model:value="yModel" size="small" :min="0" :max="props.cardHeight" />
        </t-space>
      </t-form-item>

      <t-form-item label="尺寸">
        <t-space>
          <t-input-number v-model:value="widthModel" size="small" :min="10" :max="props.cardWidth" />
          <t-input-number v-model:value="heightModel" size="small" :min="10" :max="props.cardHeight" />
        </t-space>
      </t-form-item>

      <template v-if="isTextElement">
        <t-form-item label="字号">
          <t-input-number v-model:value="fontSizeValue" size="small" :min="12" :max="64" />
        </t-form-item>
        <t-form-item label="颜色">
          <t-input v-model="colorValue" placeholder="#FFFFFF" />
        </t-form-item>
        <t-form-item label="字重">
          <t-input v-model="fontWeightValue" placeholder="bold / 600" />
        </t-form-item>
      </template>

      <t-form-item label="Style JSON">
        <div class="style-editor">
          <t-textarea v-model="styleText" placeholder='{"color":"#fff","fontSize":20}' autosize @blur="applyStyleText" />
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
</style>
