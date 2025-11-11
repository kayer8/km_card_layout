export type CardElementType = 'text' | 'image' | 'icon';

export type BindingPath = string;

export type CardElementStyle = Record<string, string | number>;

export interface CardElementBase {
  id: string;
  type: CardElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  zIndex?: number;
  binding?: BindingPath;
  content?: string;
  style?: CardElementStyle;
}

export interface TextElement extends CardElementBase {
  type: 'text';
  align?: 'left' | 'center' | 'right';
  multiline?: boolean;
}

export interface ImageElement extends CardElementBase {
  type: 'image';
  width: number;
  height: number;
  alt?: string;
  fit?: 'cover' | 'contain';
}

export interface IconElement extends CardElementBase {
  type: 'icon';
  name: string;
  size?: number;
}

export type CardElement = TextElement | ImageElement | IconElement;

export interface CardLayoutSchema {
  id: string;
  width: number;
  height: number;
  background: string;
  borderRadius?: number;
  padding?: number;
  elements: CardElement[];
  metadata?: Record<string, unknown>;
}

export interface BindingContext {
  [key: string]: string | number | boolean | null | BindingContext;
}

export const schemaVersion: '0.1.0';
