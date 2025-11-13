import { computed, reactive, ref } from 'vue'
import type { CardElement, CardElementType, CardLayoutSchema } from 'km-card-schema'
import type { CardTemplate } from '../../templates/cardTemplates'
import { builtinTemplates } from '../../templates/cardTemplates'

export interface UserProfile {
  company: string
  name: string
  title: string
  phone: string
  email: string
  address: string
  avatar: string
}

export interface LayoutBindingContext {
  user: UserProfile
}

export type FontColorPayload = string | { value: string; syncChildren?: boolean }

const cloneSchema = (schema: CardLayoutSchema): CardLayoutSchema =>
  JSON.parse(JSON.stringify(schema)) as CardLayoutSchema

export const createLayoutStore = (initialTemplates: CardTemplate[] = builtinTemplates) => {
  const templateStore = reactive<CardTemplate[]>(
    initialTemplates.map((template) => ({ ...template, schema: cloneSchema(template.schema) }))
  )

  if (!templateStore.length) {
    throw new Error('至少需要一个卡片模板')
  }

  const bindingContext = reactive<LayoutBindingContext>({
    user: {
      company: '合肥魅客网络有限公司',
      name: '名片示例',
      title: '高级产品经理',
      phone: '189****4399',
      email: 'km@kuanmai.com',
      address: '上海市浦东新区世纪大道210号企业中心15F',
      avatar: 'https://i.pravatar.cc/240?img=68'
    }
  })

  const initialTemplate = templateStore[0]
  if (!initialTemplate) {
    throw new Error('未找到默认模板')
  }

  const selectedTemplateId = ref(initialTemplate.id)
  const cardSchema = reactive<CardLayoutSchema>(cloneSchema(initialTemplate.schema))
  if (!cardSchema.fontColor) {
    cardSchema.fontColor = '#ffffff'
  }
  const activeElementId = ref(cardSchema.elements[0]?.id ?? '')

  const bindingEntries = computed(() => Object.entries(bindingContext.user))

  const resolveBinding = (binding?: string): string | number | undefined => {
    if (!binding) return undefined
    return binding.split('.').reduce<any>((acc, key) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[key]
      }
      return undefined
    }, bindingContext) as string | number | undefined
  }

  const setActiveElement = (id: string) => {
    activeElementId.value = id
  }

  const mutateElement = (id: string, mutator: (element: CardElement) => void) => {
    const target = cardSchema.elements.find((element: CardElement) => element.id === id)
    if (!target) return
    mutator(target)
  }

  const handleDragEnd = ({ id, x, y }: { id: string; x: number; y: number }) => {
    mutateElement(id, (draft) => {
      draft.x = Math.round(x)
      draft.y = Math.round(y)
    })
  }

  const handleResizeEnd = ({ id, x, y, w, h }: { id: string; x: number; y: number; w: number; h: number }) => {
    mutateElement(id, (draft) => {
      draft.x = Math.round(x)
      draft.y = Math.round(y)
      draft.width = Math.round(w)
      draft.height = Math.round(h)
    })
  }

  const addElement = (type: CardElementType) => {
    const id = `${type}-${Math.random().toString(36).slice(2, 7)}`
    const baseX = 40 + cardSchema.elements.length * 4

    let element: CardElement
    if (type === 'text') {
      element = {
        id,
        type,
        x: baseX,
        y: 300,
        width: 260,
        height: 36,
        content: '示例文本',
        style: {
          fontSize: 18,
          color: '#1A202C'
        }
      }
    } else if (type === 'image') {
      element = {
        id,
        type,
        x: cardSchema.width - 200,
        y: 80,
        width: 120,
        height: 120,
        binding: 'user.avatar',
        style: {
          borderRadius: '16px',
          border: '4px solid rgba(255, 255, 255, 0.12)'
        }
      }
    } else {
      element = {
        id,
        type,
        name: 'dot',
        x: baseX,
        y: 320,
        width: 14,
        height: 14,
        style: {
          backgroundColor: '#2B6CB0',
          borderRadius: '50%'
        }
      }
    }

    cardSchema.elements.push(element)
    activeElementId.value = id
    return element
  }

  const removeActiveElement = () => {
    if (!activeElementId.value) return
    const index = cardSchema.elements.findIndex(
      (element: CardElement) => element.id === activeElementId.value
    )
    if (index === -1) return
    cardSchema.elements.splice(index, 1)
    const fallback = cardSchema.elements[index - 1] ?? cardSchema.elements[index] ?? cardSchema.elements[0]
    activeElementId.value = fallback?.id ?? ''
  }

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
    activeElementId.value = cardSchema.elements[0]?.id ?? ''
  }

  const selectTemplate = (templateId: string) => {
    const template = templateStore.find((item) => item.id === templateId)
    if (!template) return
    selectedTemplateId.value = templateId
    applySchema(template.schema)
  }

  const resetSchema = () => {
    const template = templateStore.find((item) => item.id === selectedTemplateId.value)
    if (template) {
      applySchema(template.schema)
    }
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
      description: '自定义模板',
      schema: cloneSchema(cardSchema)
    }
    templateStore.push(newTemplate)
    selectedTemplateId.value = id
    return newTemplate
  }

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
    templates: templateStore,
    bindingContext,
    bindingEntries,
    cardSchema,
    selectedTemplateId,
    activeElementId,
    setActiveElement,
    mutateElement,
    handleDragEnd,
    handleResizeEnd,
    addElement,
    removeActiveElement,
    selectTemplate,
    resetSchema,
    createTemplate,
    resolveBinding,
    setBackgroundType,
    setBackgroundValue,
    setBackgroundImage,
    setFontColor
  }
}

export type LayoutStore = ReturnType<typeof createLayoutStore>
