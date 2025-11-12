const DEVICE_WIDTH = wx.getSystemInfoSync().windowWidth

interface LayoutSchema {
  width: number
  height: number
  background?: string
  backgroundType?: 'color' | 'image'
  backgroundImage?: string
  elements: Array<CardElement>
}

interface CardElement {
  id: string
  type: 'text' | 'image' | 'icon'
  x: number
  y: number
  width?: number
  height?: number
  binding?: string
  content?: string
  style?: Record<string, string | number>
}

interface RenderElement {
  id: string
  type: 'text' | 'image' | 'icon'
  style: string
  content?: string
  src?: string
}

const px = (value: number, scale: number) => `${Math.round(value * scale * 100) / 100}px`

const formatStyleValue = (value: string | number, scale: number) =>
  typeof value === 'number' ? px(value, scale) : value

const resolveBinding = (binding: string | undefined, data: Record<string, any>) => {
  if (!binding) return undefined
  return binding.split('.').reduce<any>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return acc[key]
    }
    return undefined
  }, data)
}

Component({
  properties: {
    layout: {
      type: Object,
      value: null
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
  lifetimes: {
    attached() {
      this.rebuild()
    }
  },
  observers: {
    layout() {
      this.rebuild()
    },
    data() {
      this.rebuild()
    }
  },
  methods: {
    rebuild() {
      const layout = this.data.layout as LayoutSchema | null
      if (!layout || !layout.width) {
        return
      }
      const scale = DEVICE_WIDTH / layout.width
      const baseStyle: string[] = [
        `width:${px(layout.width, scale)}`,
        `height:${px(layout.height, scale)}`,
        `background:${layout.background || '#111'}`
      ]
      if (layout.backgroundType === 'image' && layout.backgroundImage) {
        baseStyle.push(`background-image:url(${layout.backgroundImage})`, 'background-size:cover', 'background-repeat:no-repeat')
      }
      this.setData({ containerStyle: baseStyle.join(';') })

      const rendered: RenderElement[] = (layout.elements || []).map((element) => {
        const left = px(element.x, scale)
        const top = px(element.y, scale)
        const width = element.width ? px(element.width, scale) : 'auto'
        const height = element.height ? px(element.height, scale) : 'auto'
        const styleParts = [`left:${left}`, `top:${top}`, `width:${width}`, `height:${height}`]
        if (element.style) {
          Object.entries(element.style).forEach(([key, value]) => {
            styleParts.push(`${key}:${formatStyleValue(value, scale)}`)
          })
        }
        const bound = resolveBinding(element.binding, this.data.data)
        return {
          id: element.id,
          type: element.type,
          style: styleParts.join(';'),
          content: (bound ?? element.content ?? '') as string,
          src: element.type === 'image' ? ((bound ?? element.content) as string | undefined) : undefined
        }
      })
      this.setData({ elements: rendered })
    }
  }
})
