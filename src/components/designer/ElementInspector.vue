<script setup lang="ts">

import { computed, ref, watch } from 'vue'

import type { CardElement } from 'km-card-schema'



const props = defineProps<{

  element?: CardElement

  cardWidth: number

  cardHeight: number

  mutateElement: (id: string, mutator: (draft: CardElement) => void) => void

}>()



const isTextElement = computed(() => props.element?.type === 'text')

const isIconElement = computed(() => props.element?.type === 'icon')



const mutate = (mutator: (draft: CardElement) => void) => {
  
  if (!props.element) return

  props.mutateElement(props.element.id, mutator)

}



const updateRect = (field: 'x' | 'y' | 'width' | 'height', value: string | number | null) => {

  const numericValue = typeof value === 'number' ? value : Number(value ?? 0)

  mutate((draft) => {

    // fall back to 0 when input is invalid

    ;(draft as any)[field] = Number.isNaN(numericValue) ? 0 : numericValue

  })

}



const updateBinding = (value: string) => {

  mutate((draft) => {

    draft.binding = value || undefined

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



const styleProxy = (field: string, fallback: string | number) =>

  computed({

    get: () => (props.element?.style?.[field] ?? fallback) as string | number,

    set: (value: string | number | null) => updateStyleField(field, value)

  })



const visibleValue = computed({

  get: () => (props.element ? props.element.visible !== false : true),

  set: (value: boolean) =>

    mutate((draft) => {

      draft.visible = value

    })

})



const iconSrcValue = computed({

  get: () => '',

  set: () => {}

})

const iconFontSizeValue = computed({

  get: () =>

    props.element?.type === 'icon'

      ? props.element.fontSize ?? 20

      : 0,

  set: (value: number | null) => {

    if (!props.element || props.element.type !== 'icon') return

    const numeric = typeof value === 'number' ? value : 0

    mutate((draft) => {

      if (draft.type === 'icon') {

        const nextSize = numeric || 0
        draft.fontSize = nextSize || undefined
        draft.width = nextSize
        draft.height = nextSize

      }

    })

  }

})



const xModel = rectProxy('x')

const yModel = rectProxy('y')

const widthModel = rectProxy('width')

const heightModel = rectProxy('height')

const fontSizeValue = styleProxy('fontSize', 18)
const colorValue = styleProxy('color', '#FFFFFF')
const textAlignValue = styleProxy('textAlign', 'left')

const isBold = computed(() => {
  const weight = props.element?.style?.fontWeight
  if (typeof weight === 'number') {
    return weight >= 600
  }
  return weight === 'bold' || weight === '600' || weight === '700'
})

const isItalic = computed(() => props.element?.style?.fontStyle === 'italic')
const isUnderline = computed(() => props.element?.style?.textDecoration === 'underline')

const toggleBold = () => {
  updateStyleField('fontWeight', isBold.value ? 'normal' : 'bold')
}

const toggleItalic = () => {
  updateStyleField('fontStyle', isItalic.value ? undefined : 'italic')
}

const toggleUnderline = () => {
  updateStyleField('textDecoration', isUnderline.value ? undefined : 'underline')
}

const setTextAlign = (align: 'left' | 'center' | 'right') => {
  updateStyleField('textAlign', align)
}



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



      <t-form-item v-if="!isIconElement" label="尺寸">

        <t-space>

          <t-input-number v-model:value="widthModel" size="small" :min="0" :max="props.cardWidth" />

          <t-input-number v-model:value="heightModel" size="small" :min="0" :max="props.cardHeight" />

        </t-space>

      </t-form-item>



      <template v-if="isTextElement">
        <t-form-item label="字体样式">
          <div class="text-style-panel">
            <div class="style-row">
              <div class="style-group">
                <span class="style-label">字号</span>
                <t-input-number v-model:value="fontSizeValue" size="small" :min="12" :max="64" />
              </div>
              <div class="style-group">
                <span class="style-label">文字色</span>
                <t-color-picker
                  v-model="colorValue"
                  size="small"
                  :popup-props="{ placement: 'bottom' }"
                  :show-primary-color-preview="false"
                />
              </div>
              <div class="style-buttons">
                <t-button
                  size="small"
                  variant="outline"
                  :theme="isBold ? 'primary' : 'default'"
                  @click="toggleBold"
                >
                  B
                </t-button>
                <t-button
                  size="small"
                  variant="outline"
                  :theme="isItalic ? 'primary' : 'default'"
                  @click="toggleItalic"
                >
                  I
                </t-button>
                <t-button
                  size="small"
                  variant="outline"
                  :theme="isUnderline ? 'primary' : 'default'"
                  @click="toggleUnderline"
                >
                  U
                </t-button>
              </div>
            </div>
            <div class="style-row align-row">
              <span class="style-label">对齐</span>
              <div class="style-buttons">
                <t-button
                  size="small"
                  variant="outline"
                  :theme="textAlignValue === 'left' ? 'primary' : 'default'"
                  @click="setTextAlign('left')"
                >
                  左
                </t-button>
                <t-button
                  size="small"
                  variant="outline"
                  :theme="textAlignValue === 'center' ? 'primary' : 'default'"
                  @click="setTextAlign('center')"
                >
                  中
                </t-button>
                <t-button
                  size="small"
                  variant="outline"
                  :theme="textAlignValue === 'right' ? 'primary' : 'default'"
                  @click="setTextAlign('right')"
                >
                  右
                </t-button>
              </div>
            </div>
          </div>
        </t-form-item>
      </template>



      <template v-if="isIconElement">

        <t-form-item label="图标名称">

          <t-input
            :value="props.element?.name || ''"
            placeholder="icon-buy-vip-13"
            @change="(val) => mutate((draft) => { if (draft.type === 'icon') draft.name = val || undefined })"
            clearable
          />

        </t-form-item>
        <t-form-item label="图标颜色">
          <t-color-picker
            :value="props.element?.color || props.element?.style?.color || ''"
            size="small"
            :popup-props="{ placement: 'bottom' }"
            :show-primary-color-preview="false"
            clearable
            @change="(val) =>
              mutate((draft) => {
                if (draft.type === 'icon') {
                  draft.color = val || undefined
                  draft.style = { ...(draft.style ?? {}), color: val || undefined }
                  if (!draft.style.color) delete draft.style.color
                }
              })"
          />
        </t-form-item>
        <t-form-item label="图标字号">
          <t-input-number
            :value="props.element?.type === 'icon' ? (props.element.fontSize ?? 20) : null"
            size="small"
            :min="0"
            @change="(val) =>
              mutate((draft) => {
                if (draft.type === 'icon') draft.fontSize = val ?? undefined
              })"
          />
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

.text-style-panel {

  display: flex;

  flex-direction: column;

  gap: 12px;

}

.style-row {

  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 12px;

}

.style-group {

  display: flex;

  align-items: center;

  gap: 8px;

}

.style-label {

  font-size: 0.9rem;

  color: #4a5568;

}

.style-buttons {

  display: flex;

  gap: 8px;

  align-items: center;

}

.align-row .style-label {

  width: 36px;

}

</style>

