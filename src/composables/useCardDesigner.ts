import { computed, reactive, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { CardElement, CardElementStyle, CardElementType, CardLayoutSchema } from '@km/card-schema'

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

const createDefaultSchema = (): CardLayoutSchema => {
  const elements: CardElement[] = [
    {
      id: 'company',
      type: 'text',
      x: 40,
      y: 32,
      width: 360,
      height: 32,
      binding: 'user.company',
      style: {
        fontSize: 18,
        color: '#E2B96F',
        letterSpacing: 1,
        fontWeight: 500
      }
    },
    {
      id: 'name',
      type: 'text',
      x: 40,
      y: 86,
      width: 280,
      height: 60,
      binding: 'user.name',
      style: {
        fontSize: 36,
        color: '#FFFFFF',
        fontWeight: 700
      }
    },
    {
      id: 'title',
      type: 'text',
      x: 40,
      y: 148,
      width: 220,
      height: 32,
      binding: 'user.title',
      style: {
        fontSize: 20,
        color: '#CFD5EF',
        fontWeight: 500
      }
    },
    {
      id: 'phone-dot',
      type: 'icon',
      name: 'dot',
      x: 40,
      y: 206,
      width: 12,
      height: 12,
      style: {
        backgroundColor: '#E2B96F',
        borderRadius: '50%'
      }
    },
    {
      id: 'phone',
      type: 'text',
      x: 60,
      y: 192,
      width: 300,
      height: 32,
      binding: 'user.phone',
      style: {
        fontSize: 18,
        color: '#FFFFFF'
      }
    },
    {
      id: 'email-dot',
      type: 'icon',
      name: 'dot',
      x: 40,
      y: 244,
      width: 12,
      height: 12,
      style: {
        backgroundColor: '#E2B96F',
        borderRadius: '50%'
      }
    },
    {
      id: 'email',
      type: 'text',
      x: 60,
      y: 230,
      width: 320,
      height: 32,
      binding: 'user.email',
      style: {
        fontSize: 18,
        color: '#FFFFFF'
      }
    },
    {
      id: 'address-dot',
      type: 'icon',
      name: 'dot',
      x: 40,
      y: 282,
      width: 12,
      height: 12,
      style: {
        backgroundColor: '#E2B96F',
        borderRadius: '50%'
      }
    },
    {
      id: 'address',
      type: 'text',
      x: 60,
      y: 268,
      width: 420,
      height: 40,
      binding: 'user.address',
      style: {
        fontSize: 16,
        color: '#CFD5EF',
        lineHeight: 24
      }
    },
    {
      id: 'avatar',
      type: 'image',
      x: 480,
      y: 80,
      width: 150,
      height: 150,
      binding: 'user.avatar',
      style: {
        borderRadius: '50%',
        border: '6px solid rgba(0, 0, 0, 0.35)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)'
      }
    }
  ]

  return {
    id: 'kuanmai-black-gold',
    width: 686,
    height: 360,
    borderRadius: 32,
    background: 'radial-gradient(circle at 20% 20%, #1e1a21, #080809 80%)',
    backgroundType: 'color',
    padding: 40,
    metadata: {
      template: 'black-gold',
      version: '1.0.0'
    },
    elements
  }
}

export const useCardDesigner = () => {
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

  const cardSchema = reactive<CardLayoutSchema>(createDefaultSchema())
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

  const resetSchema = () => {
    const next = createDefaultSchema()
    cardSchema.id = next.id
    cardSchema.width = next.width
    cardSchema.height = next.height
    cardSchema.background = next.background
    cardSchema.borderRadius = next.borderRadius
    cardSchema.metadata = next.metadata
    cardSchema.elements.splice(0, cardSchema.elements.length, ...next.elements.map((element) => ({ ...element })))
    activeElementId.value = cardSchema.elements[0]?.id ?? ''
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

  return {
    bindingContext,
    bindingEntries,
    cardSchema,
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
    copySchema,
    setBackgroundType,
    setBackgroundValue,
    setBackgroundImage
  }
}

export type UseCardDesignerReturn = ReturnType<typeof useCardDesigner>
