import { reactive, ref } from 'vue'
import type { CardElement, CardLayoutSchema } from 'km-card-schema'
import type { CardTemplate } from '../../templates/cardTemplates'
import { builtinTemplates } from '../../templates/cardTemplates'

export type FontColorPayload = string | { value: string; syncChildren?: boolean }

export interface LayoutManagerOptions {
  initialTemplates?: CardTemplate[]
  onSchemaChange?: () => void
}

// 深拷贝 schema，避免直接篡改模板原始定义
const cloneSchema = (schema: CardLayoutSchema): CardLayoutSchema =>
  JSON.parse(JSON.stringify(schema)) as CardLayoutSchema

// 布局管理器负责管理模板集合与画布 schema 的核心属性
export const createLayoutManager = (options: LayoutManagerOptions = {}) => {
  const { initialTemplates = builtinTemplates, onSchemaChange } = options

  // 模板列表存储用户可选卡片模板
  const templateStore = reactive<CardTemplate[]>(
    initialTemplates.map((template) => ({ ...template, schema: cloneSchema(template.schema) }))
  )

  if (!templateStore.length) {
    throw new Error('至少需要一个卡片模版')
  }

  const initialTemplate = templateStore[0]
  if (!initialTemplate) {
    throw new Error('未找到默认模版')
  }

  const selectedTemplateId = ref(initialTemplate.id)
  // cardSchema 是画布上的实时 schema
  const cardSchema = reactive<CardLayoutSchema>(cloneSchema(initialTemplate.schema))
  if (!cardSchema.fontColor) {
    cardSchema.fontColor = '#ffffff'
  }

  // 对外暴露的变更通知，供其它子模块同步状态
  const notifySchemaChange = () => {
    onSchemaChange?.()
  }

  // 应用新的 schema，并触发同步回调
  const applySchema = (schema: CardLayoutSchema) => {
    const next = cloneSchema(schema)
    cardSchema.id = next.id
    cardSchema.width = next.width
    cardSchema.height = next.height
    cardSchema.background = next.background
    cardSchema.backgroundType = next.backgroundType
    cardSchema.backgroundImage = next.backgroundImage
    cardSchema.fontColor = next.fontColor || '#ffffff'
    cardSchema.borderRadius = next.borderRadius
    cardSchema.metadata = next.metadata
    cardSchema.elements.splice(
      0,
      cardSchema.elements.length,
      ...next.elements.map((element: CardElement) => ({ ...element }))
    )
    notifySchemaChange()
  }

  const selectTemplate = (templateId: string) => {
    const template = templateStore.find((item) => item.id === templateId)
    if (!template) return null
    selectedTemplateId.value = templateId
    applySchema(template.schema)
    return template
  }

  const resetSchema = () => {
    const template = templateStore.find((item) => item.id === selectedTemplateId.value)
    if (!template) return null
    applySchema(template.schema)
    return template
  }

  const createTemplate = (name: string): CardTemplate | null => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return null
    }
    const id = `template-${Date.now().toString(36)}`
    const newTemplate: CardTemplate = {
      id,
      name: trimmedName,
      description: '自定义模版',
      schema: cloneSchema(cardSchema)
    }
    templateStore.push(newTemplate)
    selectedTemplateId.value = id
    return newTemplate
  }

  // 同步 canvas 背景模式（纯色/图片）
  const setBackgroundType = (type: 'color' | 'image') => {
    cardSchema.backgroundType = type
    if (type !== 'image') {
      cardSchema.backgroundImage = undefined
    } else if (!cardSchema.backgroundImage) {
      cardSchema.backgroundImage = ''
    }
  }

  const setBackgroundValue = (value: string) => {
    cardSchema.background = value || '#111111'
    cardSchema.backgroundType = 'color'
  }

  const setBackgroundImage = (value: string) => {
    const trimmed = value?.trim()
    cardSchema.backgroundImage = trimmed || undefined
    cardSchema.backgroundType = trimmed ? 'image' : 'color'
  }

  const setFontColor = (payload: FontColorPayload) => {
    // 支持同步子元素颜色，保持整体视觉一致
    const rawValue = typeof payload === 'string' ? payload : payload?.value
    const shouldSync = typeof payload === 'string' ? true : payload?.syncChildren !== false
    const previousColor = cardSchema.fontColor ?? '#ffffff'
    const nextColor = (rawValue ?? '').toString() || '#ffffff'
    cardSchema.fontColor = nextColor

    if (nextColor === previousColor) {
      return
    }

    if (shouldSync) {
      cardSchema.elements.forEach((element: CardElement) => {
        const elementColor =
          typeof element.style?.color === 'string' ? element.style.color : undefined
        if (elementColor && elementColor === previousColor) {
          if (!element.style) {
            element.style = {}
          }
          element.style.color = nextColor
        }
      })
    }
  }

  return {
    templateStore,
    cardSchema,
    selectedTemplateId,
    applySchema,
    selectTemplate,
    resetSchema,
    createTemplate,
    setBackgroundType,
    setBackgroundValue,
    setBackgroundImage,
    setFontColor
  }
}

export type LayoutManager = ReturnType<typeof createLayoutManager>
export { cloneSchema }
