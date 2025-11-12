import { computed, reactive, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { CardElement, CardElementStyle, CardElementType, CardLayoutSchema } from 'km-card-schema'
import type { CardTemplate } from '../templates/cardTemplates'
import { builtinTemplates } from '../templates/cardTemplates'

export interface UserProfile {
  company: string
  name: string
  title: string
  phone: string
  email: string
  address: string
  avatar: string
}

const FALLBACK_AVATAR = 'https://i.pravatar.cc/240?u=km-card'

const pxStyleFields = new Set([
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'borderRadius',
  'padding',
  'margin',
  'top',
  'left',
  'right',
  'bottom',
  'gap',
  'width',
  'height'
])

const cloneSchema = (schema: CardLayoutSchema): CardLayoutSchema =>
  JSON.parse(JSON.stringify(schema)) as CardLayoutSchema

export const useCardDesigner = () => {
  const templateStore = reactive<CardTemplate[]>(builtinTemplates.map((template) => ({ ...template, schema: cloneSchema(template.schema) })))
  const selectedTemplateId = ref(templateStore[0]?.id ?? '')

  const bindingContext = reactive<{ user: UserProfile }>({
    user: {
      company: '合肥魅客网络有限公司',
      name: '名片君',
      title: '销售经理',
      phone: '189****4399',
      email: 'km@kuanmai.com',
      address: '上海市静安区天目西路企业中心第一座15F',
      avatar: 'https://i.pravatar.cc/240?img=68'
    }
  })

  const initialSchema = templateStore[0]!.schema;
  
  console.log(initialSchema,'initialSchemainitialSchema');
  
  const cardSchema = reactive<CardLayoutSchema>(cloneSchema(initialSchema))
  const activeElementId = ref(cardSchema.elements[0]?.id ?? '')
  const copyState = ref<'idle' | 'copied'>('idle')
  
  const activeElement = computed(() => cardSchema.elements.find((element) => element.id === activeElementId.value))
  const serializedSchema = computed(() => JSON.stringify(cardSchema, null, 2))
  const bindingEntries = computed(() => Object.entries(bindingContext.user))

  const elementStyle = (style?: CardElementStyle): Record<string, string | number> => {
    if (!style) return {}
    const normalized: Record<string, string | number> = {}
    Object.entries(style).forEach(([key, value]) => {
      if (typeof value === 'number' && pxStyleFields.has(key)) {
        normalized[key] = `${value}px`
      } else {
        normalized[key] = value
      }
    })
    return normalized
  }

  const resolveBinding = (binding?: string): string | number | undefined => {
    if (!binding) return undefined
    return binding.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[key]
      }
      return undefined
    }, bindingContext) as string | number | undefined
  }

  const getElementPreview = (element: CardElement): string => {
    const boundValue = resolveBinding(element.binding)
    if (boundValue === undefined || boundValue === null || boundValue === '') {
      if (element.type === 'image') {
        return element.content || FALLBACK_AVATAR
      }
      return element.content ?? ''
    }
    return String(boundValue)
  }

  const setActiveElement = (id: string) => {
    activeElementId.value = id
  }

  const mutateElement = (id: string, mutator: (element: CardElement) => void) => {
    const target = cardSchema.elements.find((element) => element.id === id)
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
        content: '新增文本',
        style: {
          fontSize: 18,
          color: '#F4F6FB'
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
          backgroundColor: '#F5C271',
          borderRadius: '50%'
        }
      }
    }

    cardSchema.elements.push(element)
    activeElementId.value = id
  }

  const removeActiveElement = () => {
    if (!activeElement.value) return
    const index = cardSchema.elements.findIndex((element) => element.id === activeElement.value?.id)
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
    cardSchema.borderRadius = next.borderRadius
    cardSchema.metadata = next.metadata
    cardSchema.elements.splice(0, cardSchema.elements.length, ...next.elements.map((element) => ({ ...element })))
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

  const copySchema = async () => {
    try {
      await navigator.clipboard.writeText(serializedSchema.value)
      copyState.value = 'copied'
      MessagePlugin.success('布局 JSON 已复制')
      window.setTimeout(() => {
        copyState.value = 'idle'
      }, 1600)
    } catch (error) {
      MessagePlugin.error('复制失败，请手动复制')
    }
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

  const createTemplate = (name: string) => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      MessagePlugin.warning('模板名称不能为空')
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
    MessagePlugin.success('模板已保存')
    return newTemplate
  }

  return {
    bindingContext,
    bindingEntries,
    cardSchema,
    templates: templateStore,
    selectedTemplateId,
    copyState,
    activeElementId,
    activeElement,
    serializedSchema,
    elementStyle,
    getElementPreview,
    setActiveElement,
    mutateElement,
    handleDragEnd,
    handleResizeEnd,
    addElement,
    removeActiveElement,
    resetSchema,
    selectTemplate,
    createTemplate,
    copySchema,
    setBackgroundType,
    setBackgroundValue,
    setBackgroundImage
  }
}

export type UseCardDesignerReturn = ReturnType<typeof useCardDesigner>
