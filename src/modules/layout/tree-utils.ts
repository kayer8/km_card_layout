import type { CardElement, LayoutPanelElement } from 'km-card-schema'

export interface ElementLocation {
  element: CardElement
  parent: LayoutPanelElement | null
  parentChildren: CardElement[]
}

type WalkCallback = (
  element: CardElement,
  context: {
    parent: LayoutPanelElement | null
    parentChildren: CardElement[]
  }
) => boolean | void

const walkElements = (
  elements: CardElement[],
  callback: WalkCallback,
  parent: LayoutPanelElement | null = null
): boolean => {
  for (const element of elements) {
    const stopped = callback(element, {
      parent,
      parentChildren: elements
    })
    if (stopped) {
      return true
    }
    if (element.type === 'layout-panel' && element.children?.length) {
      if (walkElements(element.children, callback, element)) {
        return true
      }
    }
  }
  return false
}

export const findElementLocation = (
  elements: CardElement[],
  id: string
): ElementLocation | null => {
  let found: ElementLocation | null = null
  walkElements(elements, (element, context) => {
    if (element.id === id) {
      found = {
        element,
        parent: context.parent,
        parentChildren: context.parentChildren
      }
      return true
    }
    return false
  })
  return found
}

export const findElementById = (
  elements: CardElement[],
  id: string
): CardElement | undefined => {
  const location = findElementLocation(elements, id)
  return location?.element
}

export const collectElements = (
  elements: CardElement[],
  predicate?: (element: CardElement) => boolean,
  acc: CardElement[] = []
): CardElement[] => {
  walkElements(elements, (element) => {
    if (!predicate || predicate(element)) {
      acc.push(element)
    }
  })
  return acc
}
