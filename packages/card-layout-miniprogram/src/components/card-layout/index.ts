import type { CardElement, CardLayoutSchema } from '../../utils/card-schema'

type LayoutData = Record<string, any>

interface RenderElement {
  id: string
  type: CardElement['type']
  style: string
  content: string
  src?: string
}

const formatLengthValue = (value: string | number | undefined): string | undefined => {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'number') return `${value}rpx`
  return value
}

const toKebabCase = (key: string) => key.replace(/([A-Z])/g, '-$1').toLowerCase()

const resolveBinding = (binding: string | undefined, data: LayoutData) => {
  if (!binding) return undefined
  return binding.split('.').reduce<any>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return acc[key]
    }
    return undefined
  }, data)
}

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    layout: {
      type: Object,
      value: {}
    },
    data: {
      type: Object,
      value: {}
    }
  },
  data: {
    containerStyle: '',
    elements: [] as RenderElement[]
  },
  observers: {
    layout() {
      this.rebuild()
    },
    data() {
      this.rebuild()
    }
  },
  lifetimes: {
    attached() {
      this.rebuild()
    }
  },
  methods: {
    rebuild() {
      const layout = this.data.layout as CardLayoutSchema | null
      if (!layout || !layout.width) {
        this.setData({ containerStyle: '', elements: [] })
        return
      }

      const baseStyle: string[] = [
        `width:${formatLengthValue(layout.width) || '0rpx'}`,
        `height:${formatLengthValue(layout.height) || '0rpx'}`,
        `background:${layout.background || '#111'}`,
        `border-radius:${formatLengthValue(layout.borderRadius) || '0rpx'}`,
        `box-sizing:border-box`
      ]

      if (layout.backgroundType === 'image' && layout.backgroundImage) {
        baseStyle.push(
          `background-image:url(${layout.backgroundImage})`,
          'background-size:cover',
          'background-repeat:no-repeat'
        )
      }

      const rendered: RenderElement[] = (layout.elements || []).map((element: CardElement) => {
        const styles: string[] = [
          `left:${formatLengthValue(element.x) || '0rpx'}`,
          `top:${formatLengthValue(element.y) || '0rpx'}`
        ]
        if (element.width !== undefined) styles.push(`width:${formatLengthValue(element.width)}`)
        if (element.height !== undefined) styles.push(`height:${formatLengthValue(element.height)}`)
        if (element.rotation) styles.push(`transform:rotate(${element.rotation}deg)`)
        if (element.zIndex !== undefined) styles.push(`z-index:${element.zIndex}`)

        const styleEntries = element.style ? Object.keys(element.style) : []
        for (let i = 0; i < styleEntries.length; i += 1) {
          const key = styleEntries[i]
          const value = (element.style as Record<string, string | number | undefined>)[key]
          const formatted = typeof value === 'number' ? `${value}rpx` : value
          if (formatted !== undefined) {
            styles.push(`${toKebabCase(key)}:${formatted}`)
          }
        }

        const boundValue = resolveBinding(element.binding, this.data.data as LayoutData)
        const textual =
          typeof boundValue === 'string' || typeof boundValue === 'number'
            ? String(boundValue)
            : element.content ?? ''

        return {
          id: element.id,
          type: element.type,
          style: styles.join(';'),
          content: textual,
          src:
            element.type === 'image'
              ? (typeof boundValue === 'string' && boundValue) ||
                (typeof element.content === 'string' ? element.content : '')
              : undefined
        }
      })

      this.setData({
        containerStyle: baseStyle.join(';'),
        elements: rendered
      })
    }
  }
})
