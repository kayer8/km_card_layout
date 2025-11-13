export type CardElementType = 'text' | 'image' | 'icon'

export type CardElementStyle = Record<string, string | number>

export interface CardElementBase {
  id: string
  type: CardElementType
  x: number
  y: number
  width?: number
  height?: number
  rotation?: number
  zIndex?: number
  binding?: string
  content?: string
  style?: CardElementStyle
}

export interface TextElement extends CardElementBase {
  type: 'text'
}

export interface ImageElement extends CardElementBase {
  type: 'image'
  alt?: string
  fit?: 'cover' | 'contain'
}

export interface IconElement extends CardElementBase {
  type: 'icon'
}

export type CardElement = TextElement | ImageElement | IconElement

export interface CardLayoutSchema {
  id: string
  width: number
  height: number
  background?: string
  backgroundType?: 'color' | 'image'
  backgroundImage?: string
  borderRadius?: number
  padding?: number
  fontColor?: string
  elements: CardElement[]
  metadata?: Record<string, unknown>
}

export const schemaVersion = '0.1.0'

const HEIGHT_STYLE_KEYS = new Set(['lineHeight', 'top', 'bottom', 'height'])

const cloneStyle = (style?: CardElementStyle): CardElementStyle | undefined => {
  if (!style) return undefined
  return { ...style }
}

const roundValue = (value: number, round: (value: number) => number) =>
  round(Number.isFinite(value) ? value : 0)

const scaleStyle = (
  style: CardElementStyle | undefined,
  widthScale: number,
  heightScale: number,
  round: (value: number) => number
): CardElementStyle | undefined => {
  if (!style) return undefined
  const next: CardElementStyle = {}
  Object.keys(style).forEach((key) => {
    const value = style[key]
    if (typeof value !== 'number') {
      next[key] = value
      return
    }
    const scale = HEIGHT_STYLE_KEYS.has(key) ? heightScale : widthScale
    next[key] = roundValue(value * scale, round)
  })
  return next
}

const cloneElement = (element: CardElement): CardElement => ({
  ...element,
  style: cloneStyle(element.style)
})

const scaleElement = (
  element: CardElement,
  widthScale: number,
  heightScale: number,
  round: (value: number) => number
): CardElement => {
  const next = cloneElement(element)
  next.x = roundValue(element.x * widthScale, round)
  next.y = roundValue(element.y * heightScale, round)
  if (typeof element.width === 'number') {
    next.width = roundValue(element.width * widthScale, round)
  }
  if (typeof element.height === 'number') {
    next.height = roundValue(element.height * heightScale, round)
  }
  next.style = scaleStyle(element.style, widthScale, heightScale, round)
  return next
}

export interface ScaleOptions {
  targetWidth: number
  targetHeight?: number
  round?: (value: number) => number
}

export const scaleCardLayout = (schema: CardLayoutSchema, options: ScaleOptions): CardLayoutSchema => {
  if (!schema) {
    throw new Error('scaleCardLayout: schema is required')
  }
  const { targetWidth, targetHeight, round = Math.round } = options
  if (typeof targetWidth !== 'number' || Number.isNaN(targetWidth)) {
    throw new Error('scaleCardLayout: targetWidth must be a valid number')
  }

  const widthScale = targetWidth / schema.width
  const heightScale = targetHeight ? targetHeight / schema.height : widthScale

  const scaledElements = (schema.elements ?? []).map((element) =>
    scaleElement(element, widthScale, heightScale, round)
  )

  return {
    ...schema,
    width: roundValue(targetWidth, round),
    height: roundValue(targetHeight ?? schema.height * heightScale, round),
    borderRadius:
      typeof schema.borderRadius === 'number'
        ? roundValue(schema.borderRadius * widthScale, round)
        : schema.borderRadius,
    padding:
      typeof schema.padding === 'number'
        ? roundValue(schema.padding * widthScale, round)
        : schema.padding,
    metadata: schema.metadata ? { ...schema.metadata } : undefined,
    elements: scaledElements
  }
}
