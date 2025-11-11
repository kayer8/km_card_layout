export const schemaVersion = "0.1.0";

const HEIGHT_STYLE_KEYS = new Set(['lineHeight', 'top', 'bottom', 'height'])

const cloneStyle = (style) => {
  if (!style) return undefined
  return { ...style }
}

const roundValue = (value, round) => round(Number.isFinite(value) ? value : 0)

const scaleStyle = (style, widthScale, heightScale, round) => {
  if (!style) return undefined
  const nextStyle = {}
  Object.entries(style).forEach(([key, value]) => {
    if (typeof value !== 'number') {
      nextStyle[key] = value
      return
    }
    const scale = HEIGHT_STYLE_KEYS.has(key) ? heightScale : widthScale
    nextStyle[key] = roundValue(value * scale, round)
  })
  return nextStyle
}

const cloneElement = (element) => ({
  ...element,
  style: cloneStyle(element.style)
})

const scaleElement = (element, widthScale, heightScale, round) => {
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

/**
 * Scale a card layout schema to a specific width/height while keeping relative positions.
 * @param {import('./index.d.ts').CardLayoutSchema} schema
 * @param {{ targetWidth: number, targetHeight?: number, round?: (value: number) => number }} options
 * @returns {import('./index.d.ts').CardLayoutSchema}
 */
export const scaleCardLayout = (schema, options = {}) => {
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

  const scaledSchema = {
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

  return scaledSchema
}
