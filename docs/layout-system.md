# Card Layout System Design

## Goals
- Enable users to freely drag and position card elements on a canvas while keeping layout data platform agnostic.
- Offer configurable properties for text, media, backgrounds, and layout grids with real-time preview.
- Provide a consistent JSON schema that downstream renderers (mini program, H5, etc.) can consume to recreate the same layout.

## Core Concepts

### Element Types

| Type        | Description                                  | Bindable Fields                                  | Core Style Props                          |
| ----------- | -------------------------------------------- | ------------------------------------------------ | ----------------------------------------- |
| `text`      | Dynamic rich text area                       | `name`, `title`, `company`, `email`, `phone`, etc.| font family, size, weight, color, spacing |
| `image`     | Static or uploaded asset (e.g. logo, avatar) | `logo`, `avatar`                                 | width, height, border radius              |
| `shape`     | Decorative rectangle/line                    | —                                                | fill color, stroke, opacity               |
| `qrcode`    | Generated from vCard/contact URL             | `qrcode`                                         | size, color                               |

Element props are split into:
- **Layout**: position (`x`, `y`), dimensions (`width`, `height`), rotation, z-index.
- **Binding**: `field` key or inline `content`.
- **Style**: font, colors, alignment, spacing, border, background.

### Canvas & Units
- Coordinate system operates in absolute pixel units relative to the chosen card `size` (`standard`, `square`, custom).
- Snap grid can be toggled to help align elements. Grid size (cell width/height) stored per layout to support non-square grids such as `12 × 50`, and when snapping is启用每个元素的边界都会锁定在网格线上。
- Canvas background supports solid color, gradient, or image.
- Grid settings include independent horizontal/vertical cell size (e.g. 12 × 50) and a `snap` flag; when snapping is enabled element bounds (x/y/width/height) are rounded to the nearest grid lines.

### State Management
- **Global store (Pinia)** keeps the layout tree, selected element id, clipboard, zoom level, and undo/redo stacks.
- Snapshot-based history captures mutations to enable undo/redo.
- Derived getters compute selected element props, available bindings, and validation state.

### Panels
- **Element palette**: list of preset elements & templates (text blocks, info blocks).
- **Canvas**: drag-drop, selection, resize handles, multi-select (Shift), keyboard shortcuts.
- **Properties panel**: grouped sections (Content, Typography, Layout, Background, Effects). Fields vary by element type.
- **Layers panel**: display stack order, allow renaming & locking.

## JSON Schema

```ts
type CardLayout = {
  schemaVersion: '1.0';
  meta: {
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    canvas: {
      width: number;
      height: number;
      background: {
        type: 'color' | 'gradient' | 'image';
        value: string;
      };
      grid: {
        snap: boolean;
        size: { x: number; y: number };
      };
    };
  };
  dataBindings: Record<string, string>; // eg { name: '张三', phone: '123' }
  elements: CardElement[];
};

type CardElement = {
  id: string;
  type: 'text' | 'image' | 'shape' | 'qrcode';
  name: string;
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    zIndex: number;
  };
  binding?: {
    field: 'name' | 'title' | 'company' | 'email' | 'phone' | 'address' | 'website';
    fallback?: string;
  };
  content?: string;
  style: {
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
  };
  extras?: Record<string, unknown>;
};
```

The JSON output is generated each time the layout state changes and can be exported/imported to persist work.

## Workflows

1. **Add element** from palette → store append with default props → mark as selected.
2. **Drag/resize** updates layout metrics (with snapping as needed).
3. **Bind field** toggles `binding` to chosen preset (name, title, etc.). Preview fetches data from `dataBindings`.
4. **Style edit** writes to element `style`.
5. **JSON export** triggered via button; downloads serialized store state.

## Extensibility
- New element types extend the base `CardElement` with type-specific props.
- Property panel uses schema-driven configuration to render form controls (field definitions map to component meta).
- Theme tokens allow customizing TDesign palette per brand.
- Server sync can persist layouts and field definitions for organizations.

## Tech Stack Highlights
- Vue 3 + `<script setup>` + TypeScript for component ergonomics.
- TDesign Vue Next for UI controls, modals, dropdowns.
- `vue-draggable-plus` or custom pointer handlers for drag & resize.
- `@dnd-kit` alternative if requiring grid snapping & multi-select.
- `pinia-plugin-persistedstate` to autosave to LocalStorage.

## Milestones
1. **MVP**: canvas + palette + property panel; supports text elements with binding & style; JSON export/import.
2. **Styling upgrade**: advanced typography, shapes, backgrounds, layering.
3. **Templates**: prebuilt card templates & quick apply.
4. **Collaboration**: user accounts, remote sync, team templates.
