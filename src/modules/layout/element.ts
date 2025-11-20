import type { CardElement, CardLayoutSchema } from 'km-card-schema'
import { findElementById } from './tree-utils'

// 元素控制器：封装对单个元素的几何/属性修改
export const createElementController = (cardSchema: CardLayoutSchema) => {
  // 通用 mutate
  const mutateElement = (id: string, mutator: (element: CardElement) => void) => {
    const target = findElementById(cardSchema.children, id)
    if (!target) return
    mutator(target)
  }

  const handleDragEnd = ({ id, x, y }: { id: string; x: number; y: number }) => {
    mutateElement(id, (draft) => {
      if (draft.layout.mode === 'absolute') {
        draft.layout.x = Math.round(x)
        draft.layout.y = Math.round(y)
      }
    })
  }

  const handleResizeEnd = ({
    id,
    x,
    y,
    w,
    h,
  }: {
    id: string
    x: number
    y: number
    w: number
    h: number
  }) => {
    mutateElement(id, (draft) => {
      if (draft.layout.mode === 'absolute') {
        draft.layout.x = Math.round(x)
        draft.layout.y = Math.round(y)
        draft.layout.width = Math.round(w)
        draft.layout.height = Math.round(h)
      }
    })
  }

  return {
    mutateElement,
    handleDragEnd,
    handleResizeEnd,
  }
}

export type ElementController = ReturnType<typeof createElementController>

