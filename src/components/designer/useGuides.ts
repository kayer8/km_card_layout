import { reactive } from 'vue'
import type { CardElement, CardLayoutSchema } from 'km-card-schema'

export type DragPayload = { x: number; y: number }
export type SpacingLine = { start: number; end: number; pos: number }
export type GuidesState = { vertical: number[]; horizontal: number[]; spacingV: SpacingLine[]; spacingH: SpacingLine[] }

export interface GuidesOptions {
  schema: CardLayoutSchema
  snapThreshold?: number
  spacingThreshold?: number
}

export const useGuides = ({ schema, snapThreshold = 6, spacingThreshold = 3 }: GuidesOptions) => {
  const guideLines = reactive<GuidesState>({ vertical: [], horizontal: [], spacingV: [], spacingH: [] })

  const clearGuides = () => {
    guideLines.vertical.splice(0, guideLines.vertical.length)
    guideLines.horizontal.splice(0, guideLines.horizontal.length)
    guideLines.spacingV.splice(0, guideLines.spacingV.length)
    guideLines.spacingH.splice(0, guideLines.spacingH.length)
  }

  const getAlignmentTargets = (elementId: string) => {
    const vertical = [0, schema.width / 2, schema.width]
    const horizontal = [0, schema.height / 2, schema.height]
    schema.elements.forEach((element) => {
      if (element.id === elementId) return
      const width = element.width ?? 0
      const height = element.height ?? 0
      vertical.push(element.x, element.x + width / 2, element.x + width)
      horizontal.push(element.y, element.y + height / 2, element.y + height)
    })
    return { vertical, horizontal }
  }

  const snapLine = (value: number, targets: number[]) => {
    let matched: number | null = null
    let minDiff = Number.POSITIVE_INFINITY
    targets.forEach((target) => {
      const diff = Math.abs(target - value)
      if (diff <= snapThreshold && diff < minDiff) {
        matched = target
        minDiff = diff
      }
    })
    return matched
  }

  const overlapsY = (a: CardElement, b: CardElement) =>
    Math.min(a.y + (a.height ?? 0), b.y + (b.height ?? 0)) - Math.max(a.y, b.y) > 0
  const overlapsX = (a: CardElement, b: CardElement) =>
    Math.min(a.x + (a.width ?? 0), b.x + (b.width ?? 0)) - Math.max(a.x, b.x) > 0

  // 只计算辅助线（不做吸附），并写入 guideLines
  const computeGuides = (element: CardElement, payload: DragPayload) => {
    const targets = getAlignmentTargets(element.id)
    const verticalMatches: number[] = []
    const horizontalMatches: number[] = []

    guideLines.spacingV.splice(0, guideLines.spacingV.length)
    guideLines.spacingH.splice(0, guideLines.spacingH.length)
    guideLines.vertical.splice(0, guideLines.vertical.length)
    guideLines.horizontal.splice(0, guideLines.horizontal.length)

    const width = element.width ?? 0
    const height = element.height ?? 0

    const left = payload.x
    const centerX = payload.x + width / 2
    const right = payload.x + width

    const top = payload.y
    const middleY = payload.y + height / 2
    const bottom = payload.y + height

    const snapCenterX = snapLine(centerX, targets.vertical)
    const snapLeft = snapLine(left, targets.vertical)
    const snapRight = snapLine(right, targets.vertical)

    if (snapCenterX !== null) verticalMatches.push(snapCenterX)
    else if (snapLeft !== null) verticalMatches.push(snapLeft)
    else if (snapRight !== null) verticalMatches.push(snapRight)

    const snapMiddleY = snapLine(middleY, targets.horizontal)
    const snapTop = snapLine(top, targets.horizontal)
    const snapBottom = snapLine(bottom, targets.horizontal)

    if (snapMiddleY !== null) horizontalMatches.push(snapMiddleY)
    else if (snapTop !== null) horizontalMatches.push(snapTop)
    else if (snapBottom !== null) horizontalMatches.push(snapBottom)

    guideLines.vertical.push(...verticalMatches)
    guideLines.horizontal.push(...horizontalMatches)

    // 等距提示
    const leftNeighbor = schema.elements
      .filter((el) => el.id !== element.id && overlapsY(el, element) && (el.x + (el.width ?? 0)) <= left)
      .sort((a, b) => (b.x + (b.width ?? 0)) - (a.x + (a.width ?? 0)))[0]
    const rightNeighbor = schema.elements
      .filter((el) => el.id !== element.id && overlapsY(el, element) && el.x >= right)
      .sort((a, b) => a.x - b.x)[0]

    if (leftNeighbor && rightNeighbor) {
      const gapL = left - (leftNeighbor.x + (leftNeighbor.width ?? 0))
      const gapR = rightNeighbor.x - right
      if (Math.abs(gapL - gapR) <= spacingThreshold) {
        const yMid = payload.y + height / 2
        guideLines.spacingH.push({ start: leftNeighbor.x + (leftNeighbor.width ?? 0), end: left, pos: yMid })
        guideLines.spacingH.push({ start: right, end: rightNeighbor.x, pos: yMid })
      }
    }

    const topNeighbor = schema.elements
      .filter((el) => el.id !== element.id && overlapsX(el, element) && (el.y + (el.height ?? 0)) <= top)
      .sort((a, b) => (b.y + (b.height ?? 0)) - (a.y + (a.height ?? 0)))[0]
    const bottomNeighbor = schema.elements
      .filter((el) => el.id !== element.id && overlapsX(el, element) && el.y >= bottom)
      .sort((a, b) => a.y - b.y)[0]

    if (topNeighbor && bottomNeighbor) {
      const gapT = top - (topNeighbor.y + (topNeighbor.height ?? 0))
      const gapB = bottomNeighbor.y - bottom
      if (Math.abs(gapT - gapB) <= spacingThreshold) {
        const xMid = payload.x + width / 2
        guideLines.spacingV.push({ start: topNeighbor.y + (topNeighbor.height ?? 0), end: top, pos: xMid })
        guideLines.spacingV.push({ start: bottom, end: bottomNeighbor.y, pos: xMid })
      }
    }
  }

  // 计算吸附后的目标坐标
  const applySnap = (element: CardElement, payload: DragPayload) => {
    const targets = getAlignmentTargets(element.id)
    const width = element.width ?? 0
    const height = element.height ?? 0
    const left = payload.x
    const centerX = payload.x + width / 2
    const right = payload.x + width
    const top = payload.y
    const middleY = payload.y + height / 2
    const bottom = payload.y + height

    const snapCenterX = snapLine(centerX, targets.vertical)
    const snapLeft = snapLine(left, targets.vertical)
    const snapRight = snapLine(right, targets.vertical)
    const snapMiddleY = snapLine(middleY, targets.horizontal)
    const snapTop = snapLine(top, targets.horizontal)
    const snapBottom = snapLine(bottom, targets.horizontal)

    let nextX = payload.x
    let nextY = payload.y

    if (snapCenterX !== null) nextX = snapCenterX - width / 2
    else if (snapLeft !== null) nextX = snapLeft
    else if (snapRight !== null) nextX = snapRight - width

    if (snapMiddleY !== null) nextY = snapMiddleY - height / 2
    else if (snapTop !== null) nextY = snapTop
    else if (snapBottom !== null) nextY = snapBottom - height

    return { x: nextX, y: nextY }
  }

  return {
    guideLines,
    clearGuides,
    computeGuides,
    applySnap
  }
}
