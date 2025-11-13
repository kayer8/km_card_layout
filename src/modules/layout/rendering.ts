import type { CardElement, CardElementStyle } from 'km-card-schema'

const FALLBACK_AVATAR = 'https://i.pravatar.cc/240?u=km-card'

const defaultPxStyleFields = new Set([
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

export const createElementStyleFormatter =
  (pxStyleFields: Set<string> = defaultPxStyleFields) =>
  (style?: CardElementStyle): Record<string, string | number> => {
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

export const createElementPreviewResolver =
  (
    bindingResolver: (binding?: string) => string | number | undefined,
    fallback: string = FALLBACK_AVATAR
  ) =>
  (element: CardElement): string => {
    const boundValue = bindingResolver(element.binding)
    if (boundValue === undefined || boundValue === null || boundValue === '') {
      if (element.type === 'image') {
        return element.content || fallback
      }
      return element.content ?? ''
    }
    return String(boundValue)
  }

export const getFallbackAvatar = () => FALLBACK_AVATAR
