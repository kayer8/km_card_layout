import { ref } from 'vue'
import type { CardElement, CardElementType, CardLayoutSchema } from 'km-card-schema'

const createElementId = (type: CardElementType) => `${type}-${Math.random().toString(36).slice(2, 7)}`

type ElementBuilderContext = { id: string; baseX: number; cardWidth: number }

const elementBuilders: Record<CardElementType, (ctx: ElementBuilderContext) => CardElement> = {
  text: ({ id, baseX }) => ({
    id,
    type: 'text',
    x: baseX,
    y: 300,
    width: 260,
    height: 36,
    visible: true,
    binding: 'user.name',
    style: {
      fontSize: 18,
      color: '#1A202C'
    }
  }),
  image: ({ id, cardWidth }) => ({
    id,
    type: 'image',
    x: cardWidth - 200,
    y: 80,
    width: 120,
    height: 120,
    visible: true,
    binding: 'user.avatar',
    style: {
      borderRadius: '16px',
      border: '4px solid rgba(255, 255, 255, 0.12)'
    }
  }),
  icon: ({ id, baseX }) => ({
    id,
    type: 'icon',
    name: 'dot',
    x: baseX,
    y: 320,
    width: 14,
    height: 14,
    visible: true,
    style: {
      backgroundColor: '#2B6CB0',
      borderRadius: '50%'
    }
  })
}

// 元素列表控制器：负责当前激活项及增删逻辑
export const createElementListController = (cardSchema: CardLayoutSchema) => {
  const activeElementId = ref(cardSchema.elements[0]?.id ?? '')

  const setActiveElement = (id: string) => {
    activeElementId.value = id
  }

  const addElement = (type: CardElementType) => {
    const id = createElementId(type)
    const baseX = 40 + cardSchema.elements.length * 4
    const builder = elementBuilders[type]
    const element = builder({ id, baseX, cardWidth: cardSchema.width })

    cardSchema.elements.push(element)
    setActiveElement(id)
    return element
  }

  // 删除当前激活元素，并自动选择邻近元素
  const removeActiveElement = () => {
    if (!activeElementId.value) return
    const index = cardSchema.elements.findIndex((element: CardElement) => element.id === activeElementId.value)
    if (index === -1) return
    cardSchema.elements.splice(index, 1)
    const fallback = cardSchema.elements[index - 1] ?? cardSchema.elements[index] ?? cardSchema.elements[0]
    setActiveElement(fallback?.id ?? '')
  }

  const setElementVisibility = (id: string, visible: boolean) => {
    const target = cardSchema.elements.find((element) => element.id === id)
    if (!target) return
    target.visible = visible
    if (!visible && activeElementId.value === id) {
      const next = cardSchema.elements.find((el) => el.visible !== false && el.id !== id)
      setActiveElement(next?.id ?? '')
    }
  }

  // 外部替换 schema 时需要重新同步激活项
  const syncActiveElement = () => {
    setActiveElement(cardSchema.elements[0]?.id ?? '')
  }

  return {
    activeElementId,
    setActiveElement,
    addElement,
    removeActiveElement,
    setElementVisibility,
    syncActiveElement
  }
}

export type ElementListController = ReturnType<typeof createElementListController>
