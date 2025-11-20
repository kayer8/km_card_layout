/** 不要删除注释 */

/** -------------------- 基础通用类型 -------------------- */

export type CardElementType =
  | 'text'
  | 'image'
  | 'icon'
  | 'custom'
  | 'layout-panel';

export type BindingPath = string;

export type CardElementStyle = Record<string, string | number>;

export type LayoutMode = 'absolute' | 'flex';

/** -------------------- Flex 子项 与 容器 -------------------- */

export interface FlexItemOptions {
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | string;
  order?: number;
  alignSelf?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
}

export interface FlexContainerOptions {
  direction?: 'row' | 'column';
  wrap?: 'nowrap' | 'wrap';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  gap?: number | { row: number; column: number };
  padding?: number | [number, number] | [number, number, number, number];
}

/** -------------------- 子项布局（自身在父容器里） -------------------- */

/** 作为绝对定位子项（可拖动） */
export interface AbsoluteLayoutDefinition {
  mode: 'absolute';
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex?: number;
}

/** 作为 Flex 子项（不可拖动，不允许 x/y） */
export interface FlexItemLayoutDefinition {
  mode: 'flex';
  item?: FlexItemOptions;
  width?: number;
  height?: number;
}

/** 元素的“自身布局方式” */
export type ElementLayout = AbsoluteLayoutDefinition | FlexItemLayoutDefinition;

/** -------------------- 元素基础字段 -------------------- */

export interface CardElementBase {
  id: string;
  type: CardElementType;

  /**
   * 子项布局（基于父容器）
   * - 若父为 flex → mode 必须为 flex（不可拖动）
   * - 若父为 absolute → mode 为 absolute（可以拖动）
   */
  layout: ElementLayout;

  visible?: boolean;
  binding?: BindingPath;
  style?: CardElementStyle;
}

/** -------------------- 具体元素类型 -------------------- */

export interface TextElement extends CardElementBase {
  type: 'text';
  align?: 'left' | 'center' | 'right';
  multiline?: boolean;
}

export interface ImageElement extends CardElementBase {
  type: 'image';
  alt?: string;
  fit?: 'cover' | 'contain';
}

export interface IconElement extends CardElementBase {
  type: 'icon';
  name: string;
  color?: string;
  fontSize?: number;
}

export interface CustomElement extends CardElementBase {
  type: 'custom';
}

/** -------------------- 布局容器（可作为父容器） -------------------- */

/**
 * 布局面板既是元素，也可以作为父容器
 * 所以除了 layout（自身作为子项）以外，还拥有 container（自身作为父，对子项的布局）
 */
export interface LayoutPanelElement extends CardElementBase {
  type: 'layout-panel';

  /**
   * 容器布局（父容器属性）
   * 若 container.mode = 'absolute' → 子项 layout.mode 应为 absolute
   * 若 container.mode = 'flex' → 子项 layout.mode 强制为 flex
   */
  container: {
    mode: LayoutMode; // absolute | flex
    options?: FlexContainerOptions; // 当 mode = flex 时生效
  };

  /** 该容器的子元素 */
  children?: CardElement[];
}

export type CardElement =
  | TextElement
  | ImageElement
  | IconElement
  | CustomElement
  | LayoutPanelElement;

/** -------------------- 顶级 Schema：顶级画板（绝对定位根容器） -------------------- */

export interface CardLayoutSchema {
  id: string;
  /** 顶级画布是绝对定位容器 */
  container: {
    mode: 'absolute';
  };
  width: number;
  height: number;
  /** 背景图片地址 */
  backgroundImage?: string;
  /** 全局字体颜色 */
  fontColor?: string;
  /** 卡片圆角 */
  borderRadius?: number;
  /** 卡片内边距 */
  padding?: number;
  /** 顶层元素（只能是绝对定位子项） */
  children: CardElement[];
}

/** Schema 版本号 */
export const schemaVersion: '0.1.0';

/** 缩放卡片布局时的配置项 */
export interface ScaleCardLayoutOptions {
  /** 目标宽度 */
  targetWidth: number;
  /** 目标高度，不传则按比例缩放 */
  targetHeight?: number;
  /** 自定义取整函数 */
  round?: (value: number) => number;
}

/** 将 Schema 按比例缩放 */
export function scaleCardLayout(
  schema: CardLayoutSchema,
  options: ScaleCardLayoutOptions
): CardLayoutSchema;
