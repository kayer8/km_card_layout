import { reactive } from 'vue';
import type { CardElement, CardLayoutSchema } from 'km-card-schema';
import { collectElements } from '../../modules/layout/tree-utils';

export type DragPayload = { x: number; y: number; w?: number; h?: number };
export type SpacingLine = { start: number; end: number; pos: number };
export type GuidesState = {
  vertical: number[];
  horizontal: number[];
  spacingV: SpacingLine[];
  spacingH: SpacingLine[];
};

export interface GuidesOptions {
  schema: CardLayoutSchema;
  snapThreshold?: number;
  spacingThreshold?: number;
}

export const useGuides = ({
  schema,
  snapThreshold = 6,
  spacingThreshold = 3,
}: GuidesOptions) => {
  const guideLines = reactive<GuidesState>({
    vertical: [],
    horizontal: [],
    spacingV: [],
    spacingH: [],
  });
  const getVisibleElements = () =>
    collectElements(
      schema.children,
      element => element.visible !== false && element.layout.mode === 'absolute'
    );
  const normalize = (value: number) => Math.round(value); // 保持与组件内部取整一致，避免 1-2px 偏移

  const clearGuides = () => {
    guideLines.vertical.splice(0, guideLines.vertical.length);
    guideLines.horizontal.splice(0, guideLines.horizontal.length);
    guideLines.spacingV.splice(0, guideLines.spacingV.length);
    guideLines.spacingH.splice(0, guideLines.spacingH.length);
  };

  const getAlignmentTargets = (elementId: string) => {
    const vertical = [0, schema.width / 2, schema.width];
    const horizontal = [0, schema.height / 2, schema.height];
    getVisibleElements().forEach(element => {
      if (element.id === elementId) return;
      const width = element.layout.width ?? 0;
      const height = element.layout.height ?? 0;
      vertical.push(
        element.layout.x,
        element.layout.x + width / 2,
        element.layout.x + width
      );
      horizontal.push(
        element.layout.y,
        element.layout.y + height / 2,
        element.layout.y + height
      );
    });
    return { vertical, horizontal };
  };

  const snapLine = (value: number, targets: number[]) => {
    let matched: number | null = null;
    let minDiff = Number.POSITIVE_INFINITY;
    targets.forEach(target => {
      const diff = Math.abs(target - value);
      if (diff <= snapThreshold && diff < minDiff) {
        matched = target;
        minDiff = diff;
      }
    });
    return matched;
  };

  const overlapsY = (a: CardElement, b: CardElement) =>
    Math.min(
      a.layout.y + (a.layout.height ?? 0),
      b.layout.y + (b.layout.height ?? 0)
    ) -
      Math.max(a.layout.y, b.layout.y) >
    0;
  const overlapsX = (a: CardElement, b: CardElement) =>
    Math.min(
      a.layout.x + (a.layout.width ?? 0),
      b.layout.x + (b.layout.width ?? 0)
    ) -
      Math.max(a.layout.x, b.layout.x) >
    0;

  // 只计算辅助线（不做吸附），并写入 guideLines
  const computeGuides = (element: CardElement, payload: DragPayload) => {
    const targets = getAlignmentTargets(element.id);
    const verticalMatches: number[] = [];
    const horizontalMatches: number[] = [];

    guideLines.spacingV.splice(0, guideLines.spacingV.length);
    guideLines.spacingH.splice(0, guideLines.spacingH.length);
    guideLines.vertical.splice(0, guideLines.vertical.length);
    guideLines.horizontal.splice(0, guideLines.horizontal.length);

    const width = payload.w ?? element.layout.width ?? 0;
    const height = payload.h ?? element.layout.height ?? 0;
    const currentElement: CardElement = {
      ...element,
      layout: { x: payload.x, y: payload.y, mode: 'absolute',width,height, },
    };

    const left = currentElement.layout.x;
    const centerX = currentElement.layout.x + width / 2;
    const right = currentElement.layout.x + width;

    const top = currentElement.layout.y;
    const middleY = currentElement.layout.y + height / 2;
    const bottom = currentElement.layout.y + height;

    const snapCenterX = snapLine(centerX, targets.vertical);
    const snapLeft = snapLine(left, targets.vertical);
    const snapRight = snapLine(right, targets.vertical);

    if (snapCenterX !== null) verticalMatches.push(normalize(snapCenterX));
    else if (snapLeft !== null) verticalMatches.push(normalize(snapLeft));
    else if (snapRight !== null) verticalMatches.push(normalize(snapRight));

    const snapMiddleY = snapLine(middleY, targets.horizontal);
    const snapTop = snapLine(top, targets.horizontal);
    const snapBottom = snapLine(bottom, targets.horizontal);

    if (snapMiddleY !== null) horizontalMatches.push(normalize(snapMiddleY));
    else if (snapTop !== null) horizontalMatches.push(normalize(snapTop));
    else if (snapBottom !== null) horizontalMatches.push(normalize(snapBottom));

    guideLines.vertical.push(...verticalMatches);
    guideLines.horizontal.push(...horizontalMatches);

    // 等距提示
    const leftNeighbor = getVisibleElements()
      .filter(
        el =>
          el.id !== element.id &&
          overlapsY(el, currentElement) &&
          el.layout.x + (el.layout.width ?? 0) <= left
      )
      .sort((a, b) => b.layout.x + (b.layout.width ?? 0) - (a.layout.x + (a.layout.width ?? 0)))[0];
    const rightNeighbor = getVisibleElements()
      .filter(
        el =>
          el.id !== element.id && overlapsY(el, currentElement) && el.layout.x >= right
      )
      .sort((a, b) => a.layout.x - b.layout.x)[0];

    if (leftNeighbor && rightNeighbor) {
      const gapL = left - (leftNeighbor.layout.x + (leftNeighbor.layout.width ?? 0));
      const gapR = rightNeighbor.layout.x - right;
      if (Math.abs(gapL - gapR) <= spacingThreshold) {
        const yMid = currentElement.layout.y + height / 2;
        guideLines.spacingH.push({
          start: leftNeighbor.layout.x + (leftNeighbor.layout.width ?? 0),
          end: left,
          pos: yMid,
        });
        guideLines.spacingH.push({
          start: right,
          end: rightNeighbor.layout.x,
          pos: yMid,
        });
      }
    }

    const topNeighbor = getVisibleElements()
      .filter(
        el =>
          el.id !== element.id &&
          overlapsX(el, currentElement) &&
          el.layout.y + (el.layout.height ?? 0) <= top
      )
      .sort((a, b) => b.layout.y + (b.layout.height ?? 0) - (a.layout.y + (a.layout.height ?? 0)))[0];
    const bottomNeighbor = getVisibleElements()
      .filter(
        el =>
          el.id !== element.id &&
          overlapsX(el, currentElement) &&
          el.layout.y >= bottom
      )
      .sort((a, b) => a.layout.y - b.layout.y)[0];

    if (topNeighbor && bottomNeighbor) {
      const gapT = top - (topNeighbor.layout.y + (topNeighbor.layout.height ?? 0));
      const gapB = bottomNeighbor.layout.y - bottom;
      if (Math.abs(gapT - gapB) <= spacingThreshold) {
        const xMid = currentElement.layout.x + width / 2;
        guideLines.spacingV.push({
          start: topNeighbor.layout.y + (topNeighbor.layout.height ?? 0),
          end: top,
          pos: xMid,
        });
        guideLines.spacingV.push({
          start: bottom,
          end: bottomNeighbor.layout.y,
          pos: xMid,
        });
      }
    }
  };

  // 计算吸附后的目标坐标
  const applySnap = (element: CardElement, payload: DragPayload) => {
    const targets = getAlignmentTargets(element.id);
    const width = payload.w ?? element.layout.width ?? 0;
    const height = payload.h ?? element.layout.height ?? 0;
    const left = payload.x;
    const centerX = payload.x + width / 2;
    const right = payload.x + width;
    const top = payload.y;
    const middleY = payload.y + height / 2;
    const bottom = payload.y + height;

    const snapCenterX = snapLine(centerX, targets.vertical);
    const snapLeft = snapLine(left, targets.vertical);
    const snapRight = snapLine(right, targets.vertical);
    const snapMiddleY = snapLine(middleY, targets.horizontal);
    const snapTop = snapLine(top, targets.horizontal);
    const snapBottom = snapLine(bottom, targets.horizontal);

    let nextX = payload.x;
    let nextY = payload.y;

    if (snapCenterX !== null) nextX = snapCenterX - width / 2;
    else if (snapLeft !== null) nextX = snapLeft;
    else if (snapRight !== null) nextX = snapRight - width;

    if (snapMiddleY !== null) nextY = snapMiddleY - height / 2;
    else if (snapTop !== null) nextY = snapTop;
    else if (snapBottom !== null) nextY = snapBottom - height;

    return { x: normalize(nextX), y: normalize(nextY) };
  };

  return {
    guideLines,
    clearGuides,
    computeGuides,
    applySnap,
  };
};
