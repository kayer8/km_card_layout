/** 卡片元素支持的类型 */
export type CardElementType = 'text' | 'image' | 'icon' | 'custom' | 'layout-panel';

/** 数据绑定路径表达式 */
export type BindingPath = string;

/** 样式键值对集合 */
export type CardElementStyle = Record<string, string | number>;

/** 布局方式，同 absolute 与 flex */
export type LayoutMode = 'absolute' | 'flex';

/** Flex 子项属性配置 */
export interface FlexItemOptions {
  /** item 在剩余空间中的放大比例 */
  flexGrow?: number;
  /** item 允许被压缩的比例 */
  flexShrink?: number;
  /** item 的基础尺寸，可为数字或长度字符串 */
  flexBasis?: number | string;
  /** item 在主轴中的排序顺序 */
  order?: number;
  /** item 在交叉轴上的对齐方式 */
  alignSelf?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
}

/** Flex 容器属性配置 */
export interface FlexContainerOptions {
  /** 主轴方向 */
  direction?: 'row' | 'column';
  /** 是否换行 */
  wrap?: 'nowrap' | 'wrap';
  /** 主轴上的对齐方式 */
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  /** 交叉轴上的对齐方式 */
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  /** 行列间距，支持统一数值或行列对象 */
  gap?: number | { row: number; column: number };
  /** 容器的内边距，可为单值、双值或四值数组 */
  padding?: number | [number, number] | [number, number, number, number];
}

/** 绝对定位布局定义 */
export interface AbsoluteLayoutDefinition {
  /** 布局模式，固定为 absolute */
  mode: 'absolute';
  /** 相对于父容器的 X 坐标 */
  x: number;
  /** 相对于父容器的 Y 坐标 */
  y: number;
  /** 元素宽度 */
  width?: number;
  /** 元素高度 */
  height?: number;
  /** 叠放顺序 */
  zIndex?: number;
}

/** Flex 布局定义 */
export interface FlexLayoutDefinition {
  /** 布局模式，固定为 flex */
  mode: 'flex';
  /** 元素宽度 */
  width?: number;
  /** 元素高度 */
  height?: number;
  /** 作为 flex 容器时的设置 */
  container?: FlexContainerOptions;
  /** 作为 flex 子项时的设置 */
  item?: FlexItemOptions;
}

/** 元素的统一布局描述 */
export type ElementLayout = AbsoluteLayoutDefinition | FlexLayoutDefinition;

/** 卡片元素通用基础字段 */
export interface CardElementBase {
  /** 元素唯一标识 */
  id: string;
  /** 元素类型 */
  type: CardElementType;
  /** 布局信息 */
  layout: ElementLayout;
  /** 元素是否可见，默认 true */
  visible?: boolean;
  /** 数据绑定路径 */
  binding?: BindingPath;
  /** 样式配置 */
  style?: CardElementStyle;
}

/** 文本元素定义 */
export interface TextElement extends CardElementBase {
  /** 固定值：text */
  type: 'text';
  /** 文本对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 是否为多行文本 */
  multiline?: boolean;
}

/** 图片元素定义 */
export interface ImageElement extends CardElementBase {
  /** 固定值：image */
  type: 'image';
  /** 图片宽度 */
  width: number;
  /** 图片高度 */
  height: number;
  /** 图片替代文本 */
  alt?: string;
  /** 图片缩放方式 */
  fit?: 'cover' | 'contain';
}

/** 图标元素定义 */
export interface IconElement extends CardElementBase {
  /** 固定值：icon */
  type: 'icon';
  /** iconfont 名称，例如 icon-buy-vip-13 */
  name: string;
  /** 图标颜色，缺省时使用 style.color */
  color?: string;
  /** 图标字体大小（px），可由高度/宽度推导 */
  fontSize?: number;
}

/** 自定义元素定义 */
export interface CustomElement extends CardElementBase {
  /** 固定值：custom */
  type: 'custom';
}

/** 可嵌套子元素的布局面板 */
export interface LayoutPanelElement extends CardElementBase {
  /** 固定值：layout-panel */
  type: 'layout-panel';
  /** 子元素集合 */
  children: CardElement[];
}

/** 叶子和布局元素的统一联合类型 */
export type CardElement = TextElement | ImageElement | IconElement | CustomElement | LayoutPanelElement;

/** 卡片布局 Schema，顶级布局面板 */
export interface CardLayoutSchema extends LayoutPanelElement {
  /** 带有画布尺寸的根布局信息 */
  layout: ElementLayout & { width: number; height: number };
  /** 背景图片地址 */
  backgroundImage?: string;
  /** 全局字体颜色 */
  fontColor?: string;
  /** 卡片圆角 */
  borderRadius?: number;
  /** 卡片内边距 */
  padding?: number;
  /** 额外元信息 */
  metadata?: Record<string, unknown>;
}

/** 数据绑定上下文结构 */
export interface BindingContext {
  /** 递归的数据绑定字典 */
  [key: string]: string | number | boolean | null | BindingContext;
}


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
export function scaleCardLayout(schema: CardLayoutSchema, options: ScaleCardLayoutOptions): CardLayoutSchema;
