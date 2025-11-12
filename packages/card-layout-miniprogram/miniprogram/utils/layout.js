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

const scaleCardLayout = (schema, options = {}) => {
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
    fontColor: schema.fontColor,
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

const toCssValue = (value, referenceWidth) => {
  if (value === undefined || value === null) {
    return undefined
  }
  return typeof value === 'number' ? pxToRpx(value, referenceWidth) : value
}

const resolveBinding = (binding, source) => {
  if (!binding || !source) return undefined
  return binding.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object') {
      return acc[key]
    }
    return undefined
  }, source)
}

const pxToRpx = (value, reference) => {
  if (typeof value !== 'number') {
    return value
  }
  if (!reference || reference <= 0) {
    return `${value}px`
  }
  const ratio = (value / reference) * 750
  return `${ratio}rpx`
}

const mergeElementStyle = (element, dataSource, referenceWidth) => {
  const styleParts = [
    `left:${pxToRpx(element.x, referenceWidth)}`,
    `top:${pxToRpx(element.y, referenceWidth)}`
  ]

  if (typeof element.width !== 'undefined') styleParts.push(`width:${pxToRpx(element.width, referenceWidth)}`)
  if (typeof element.height !== 'undefined') styleParts.push(`height:${pxToRpx(element.height, referenceWidth)}`)
  if (typeof element.rotation === 'number') styleParts.push(`transform:rotate(${element.rotation}deg)`)
  if (typeof element.zIndex === 'number') styleParts.push(`z-index:${element.zIndex}`)

  if (element.style) {
    Object.entries(element.style).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      styleParts.push(`${key}:${typeof value === 'number' ? pxToRpx(value, referenceWidth) : value}`)
    })
  }

  const boundValue = resolveBinding(element.binding, dataSource)
  const content =
    typeof boundValue === 'string' || typeof boundValue === 'number'
      ? String(boundValue)
      : element.content ?? ''

  return {
    id: element.id,
    type: element.type,
    style: styleParts.join(';'),
    content,
    src:
      element.type === 'image'
        ? (typeof boundValue === 'string' && boundValue) ||
          (typeof element.content === 'string' ? element.content : '')
        : ''
  }
}

const composeCardStyle = (layout, referenceWidth) => {
  const styles = [
    `width:${pxToRpx(layout.width, referenceWidth)}`,
    `height:${pxToRpx(layout.height, referenceWidth)}`,
    `background:${layout.background || '#111'}`,
    `color:${layout.fontColor || '#fff'}`
  ]

  const borderRadius = toCssValue(layout.borderRadius, referenceWidth)
  if (borderRadius) styles.push(`border-radius:${borderRadius}`)

  const padding = toCssValue(layout.padding, referenceWidth)
  if (padding) styles.push(`padding:${padding}`)

  if (layout.backgroundType === 'image' && layout.backgroundImage) {
    styles.push(`background-image:url(${layout.backgroundImage})`)
    styles.push('background-size:cover')
    styles.push('background-repeat:no-repeat')
  }

  return styles.join(';')
}

const normalizeLayout = (schema, dataSource = {}, targetWidth, referenceWidth = targetWidth) => {
  if (!schema || !targetWidth) {
    return {
      styleText: '',
      elements: []
    }
  }

  const scaled = scaleCardLayout(schema, { targetWidth })

  return {
    styleText: composeCardStyle(scaled, referenceWidth),
    elements: (scaled.elements || []).map((element) => mergeElementStyle(element, dataSource, referenceWidth))
  }
}

module.exports = {
  normalizeLayout
}
