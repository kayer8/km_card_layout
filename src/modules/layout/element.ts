import type { CardElement, CardLayoutSchema } from 'km-card-schema'

// 元素控制器：封装对单个元素的几何/属性修改
const round = (value: number) => Math.round(value)

export const createElementController = (cardSchema: CardLayoutSchema) => {
  // 通用 mutate，确保只有存在的元素被修改
  const mutateElement = (id: string, mutator: (element: CardElement) => void) => {
    const target = cardSchema.elements.find((element: CardElement) => element.id === id)
    if (!target) return
    mutator(target)
  }

  // 拖拽结束后写回最新坐标
  const handleDragEnd = ({ id, x, y }: { id: string; x: number; y: number }) => {
    mutateElement(id, (draft) => {
      draft.x = round(x)
      draft.y = round(y)
    })
  }

  // 缩放结束后同步坐标与尺寸
  const handleResizeEnd = ({
    id,
    x,
    y,
    w,
    h
  }: {
    id: string
    x: number
    y: number
    w: number
    h: number
  }) => {
    mutateElement(id, (draft) => {
      draft.x = round(x)
      draft.y = round(y)
      draft.width = round(w)
      draft.height = round(h)
    })
  }

  return {
    mutateElement,
    handleDragEnd,
    handleResizeEnd
  }
}

export type ElementController = ReturnType<typeof createElementController>
