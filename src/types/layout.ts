export type BindingField =
  | 'name'
  | 'title'
  | 'company'
  | 'email'
  | 'phone'
  | 'address'
  | 'website'
  | 'wechat'
  | 'custom';

export type ElementType = 'text' | 'image' | 'shape' | 'qrcode';

export interface LayoutMetrics {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
}

export interface ElementBinding {
  field: BindingField;
  fallback?: string;
}

export interface TextStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | 'bold' | 'normal';
  lineHeight?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  backgroundColor?: string;
  border?: { width: number; color: string; radius?: number };
  opacity?: number;
  padding?: number;
}

export interface CardElementBase {
  id: string;
  name: string;
  type: ElementType;
  layout: LayoutMetrics;
  binding?: ElementBinding;
  content?: string;
  style: TextStyle;
  extras?: Record<string, unknown>;
}

export type CardElement = CardElementBase;

export interface CanvasBackground {
  type: 'color' | 'gradient' | 'image';
  value: string;
}

export interface CanvasGrid {
  snap: boolean;
  size: {
    x: number;
    y: number;
  };
}

export interface CardMeta {
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  canvas: {
    width: number;
    height: number;
    background: CanvasBackground;
    grid: CanvasGrid;
  };
}

export interface CardLayout {
  schemaVersion: '1.0';
  meta: CardMeta;
  dataBindings: Record<string, string>;
  elements: CardElement[];
}

export interface HistoryState {
  past: CardLayout[];
  future: CardLayout[];
}
