import { defineStore } from 'pinia'

export type FieldType = 'text' | 'phone' | 'email' | 'address' | 'url'
export type WidgetType = 'text' | 'image' | 'shape' | 'qrcode'

export interface FieldDefinition {
  key: string
  label: string
  type: FieldType
  defaultValue?: string
}

export interface WidgetLayout {
  x: number
  y: number
  w: number
  h: number
}

export interface WidgetBinding {
  fieldKey?: string
  fallbackText?: string
}

export interface WidgetStyle {
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  fontStyle?: 'normal' | 'italic'
  textAlign?: 'left' | 'center' | 'right'
  lineHeight?: number
  letterSpacing?: number
  color?: string
  backgroundColor?: string
  borderRadius?: number
}

export interface WidgetInstance {
  id: string
  type: WidgetType
  title: string
  layout: WidgetLayout
  binding?: WidgetBinding
  style: WidgetStyle
  zIndex: number
}

export interface WidgetTemplate {
  key: string
  label: string
  type: WidgetType
  description?: string
  icon?: string
  category: 'field' | 'basic'
  defaultLayout: Omit<WidgetLayout, 'x' | 'y'>
  defaultStyle: WidgetStyle
  defaultBinding?: WidgetBinding
}

export interface CanvasSetting {
  width: number
  height: number
  background: {
    type: 'color' | 'image' | 'gradient'
    value: string
    opacity: number
  }
  safeArea: number
  bleed: number
}

export interface GridSetting {
  columns: number
  rows: number
}

export interface LayoutSnapshot {
  canvas: CanvasSetting
  widgets: WidgetInstance[]
  grid: GridSetting
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const generateId = () => `w_${Math.random().toString(36).slice(2, 9)}`
const snapshotOf = (canvas: CanvasSetting, widgets: WidgetInstance[], grid: GridSetting): LayoutSnapshot => ({
  canvas: JSON.parse(JSON.stringify(canvas)) as CanvasSetting,
  widgets: JSON.parse(JSON.stringify(widgets)) as WidgetInstance[],
  grid: JSON.parse(JSON.stringify(grid)) as GridSetting,
})

const fieldDefinitions: FieldDefinition[] = [
  { key: 'name', label: 'Name', type: 'text', defaultValue: 'John Doe' },
  { key: 'title', label: 'Title', type: 'text', defaultValue: 'Product Manager' },
  { key: 'company', label: 'Company', type: 'text', defaultValue: 'Future Tech Inc.' },
  { key: 'mobile', label: 'Mobile', type: 'phone', defaultValue: '+86 138 0000 0000' },
  { key: 'email', label: 'Email', type: 'email', defaultValue: 'hello@example.com' },
  { key: 'address', label: 'Address', type: 'address', defaultValue: '100 Innovation Road, Shanghai' },
  { key: 'website', label: 'Website', type: 'url', defaultValue: 'https://example.com' },
]

const widgetTemplates: WidgetTemplate[] = [
  {
    key: 'field-name',
    label: 'Name',
    type: 'text',
    category: 'field',
    defaultLayout: { w: 6, h: 2 },
    defaultStyle: {
      fontSize: 28,
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#1D2129',
    },
    defaultBinding: {
      fieldKey: 'name',
      fallbackText: 'John Doe',
    },
  },
  {
    key: 'field-title',
    label: 'Title',
    type: 'text',
    category: 'field',
    defaultLayout: { w: 6, h: 2 },
    defaultStyle: {
      fontSize: 18,
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#2B4BFD',
    },
    defaultBinding: {
      fieldKey: 'title',
      fallbackText: 'Product Manager',
    },
  },
  {
    key: 'field-company',
    label: 'Company',
    type: 'text',
    category: 'field',
    defaultLayout: { w: 8, h: 2 },
    defaultStyle: {
      fontSize: 16,
      lineHeight: 1.4,
      color: '#4E5969',
    },
    defaultBinding: {
      fieldKey: 'company',
      fallbackText: 'Future Tech Inc.',
    },
  },
  {
    key: 'field-contact',
    label: 'Contact',
    type: 'text',
    category: 'field',
    defaultLayout: { w: 8, h: 3 },
    defaultStyle: {
      fontSize: 14,
      lineHeight: 1.6,
      color: '#4E5969',
    },
    defaultBinding: {
      fieldKey: 'mobile',
      fallbackText: '+86 138 0000 0000',
    },
  },
  {
    key: 'basic-text',
    label: 'Text',
    type: 'text',
    category: 'basic',
    defaultLayout: { w: 6, h: 3 },
    defaultStyle: {
      fontSize: 16,
      lineHeight: 1.6,
      color: '#1D2129',
    },
    defaultBinding: {
      fallbackText: 'Enter text here',
    },
  },
  {
    key: 'basic-qrcode',
    label: 'QR Code',
    type: 'qrcode',
    category: 'basic',
    defaultLayout: { w: 4, h: 4 },
    defaultStyle: {
      backgroundColor: '#FFFFFF',
    },
  },
]

const defaultCanvas: CanvasSetting = {
  width: 960,
  height: 576,
  background: {
    type: 'color',
    value: '#FFFFFF',
    opacity: 1,
  },
  safeArea: 24,
  bleed: 6,
}

const defaultGrid: GridSetting = {
  columns: 12,
  rows: 12,
}

const defaultWidgets: WidgetInstance[] = [
  {
    id: 'w_name',
    type: 'text',
    title: 'Name',
    layout: { x: 1, y: 1, w: 6, h: 2 },
    binding: {
      fieldKey: 'name',
      fallbackText: 'John Doe',
    },
    style: {
      fontSize: 28,
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#1D2129',
    },
    zIndex: 10,
  },
  {
    id: 'w_title',
    type: 'text',
    title: 'Title',
    layout: { x: 1, y: 3, w: 6, h: 2 },
    binding: {
      fieldKey: 'title',
      fallbackText: 'Product Manager',
    },
    style: {
      fontSize: 18,
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#2B4BFD',
    },
    zIndex: 9,
  },
]

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    canvas: JSON.parse(JSON.stringify(defaultCanvas)) as CanvasSetting,
    grid: JSON.parse(JSON.stringify(defaultGrid)) as GridSetting,
    fields: JSON.parse(JSON.stringify(fieldDefinitions)) as FieldDefinition[],
    widgetTemplates: JSON.parse(JSON.stringify(widgetTemplates)) as WidgetTemplate[],
    widgets: JSON.parse(JSON.stringify(defaultWidgets)) as WidgetInstance[],
    selection: {
      activeId: defaultWidgets[0]?.id ?? null,
    } as { activeId: string | null },
    history: {
      past: [] as LayoutSnapshot[],
      future: [] as LayoutSnapshot[],
    },
  }),
  getters: {
    widgetsSorted: (state) => [...state.widgets].sort((a, b) => a.zIndex - b.zIndex),
    exportPayload: (state) => ({
      version: '1.0.0',
      canvas: state.canvas,
      grid: state.grid,
      fields: state.fields,
      widgets: state.widgets,
    }),
    fieldMap: (state) =>
      state.fields.reduce<Record<string, FieldDefinition>>((acc, field) => {
        acc[field.key] = field
        return acc
      }, {}),
  },
  actions: {
    selectWidget(id: string | null) {
      this.selection.activeId = id
    },
    updateWidgetLayout(id: string, layout: Partial<WidgetLayout>) {
      const target = this.widgets.find((item) => item.id === id)
      if (!target) return
      target.layout = { ...target.layout, ...layout }
    },
    updateWidgetStyle(id: string, style: Partial<WidgetStyle>) {
      const target = this.widgets.find((item) => item.id === id)
      if (!target) return
      target.style = { ...target.style, ...style }
    },
    updateWidgetBinding(id: string, binding: Partial<WidgetBinding>) {
      const target = this.widgets.find((item) => item.id === id)
      if (!target) return
      target.binding = { ...(target.binding ?? {}), ...binding }
    },
    addWidgetFromTemplate(
      templateKey: string,
      options?: {
        position?: { x: number; y: number }
      },
    ) {
      const template = this.widgetTemplates.find((item) => item.key === templateKey)
      if (!template) return

      const columns = Math.max(1, this.grid.columns)
      const rows = Math.max(1, this.grid.rows)

      const width = clamp(template.defaultLayout.w, 1, columns)
      const height = clamp(template.defaultLayout.h, 1, rows)
      const defaultY = this.widgets.length * 2

      const positionX = clamp(options?.position?.x ?? 1, 0, Math.max(columns - width, 0))
      const positionY = clamp(options?.position?.y ?? defaultY, 0, Math.max(rows - height, 0))

      const id = generateId()
      this.widgets.push({
        id,
        type: template.type,
        title: template.label,
        layout: {
          x: positionX,
          y: positionY,
          w: width,
          h: height,
        },
        binding: template.defaultBinding ? { ...template.defaultBinding } : undefined,
        style: { ...template.defaultStyle },
        zIndex: Math.max(0, ...this.widgets.map((item) => item.zIndex)) + 1,
      })

      this.selectWidget(id)
    },
    removeWidget(id: string) {
      this.widgets = this.widgets.filter((item) => item.id !== id)
      if (this.selection.activeId === id) {
        this.selection.activeId = this.widgets.at(-1)?.id ?? null
      }
    },
    pushHistory() {
      this.history.past.push(snapshotOf(this.canvas, this.widgets, this.grid))
      this.history.future = []
    },
    undo() {
      const previous = this.history.past.pop()
      if (!previous) return
      this.history.future.push(snapshotOf(this.canvas, this.widgets, this.grid))
      this.canvas = JSON.parse(JSON.stringify(previous.canvas)) as CanvasSetting
      this.widgets = JSON.parse(JSON.stringify(previous.widgets)) as WidgetInstance[]
      this.grid = JSON.parse(JSON.stringify(previous.grid)) as GridSetting
    },
    redo() {
      const next = this.history.future.pop()
      if (!next) return
      this.history.past.push(snapshotOf(this.canvas, this.widgets, this.grid))
      this.canvas = JSON.parse(JSON.stringify(next.canvas)) as CanvasSetting
      this.widgets = JSON.parse(JSON.stringify(next.widgets)) as WidgetInstance[]
      this.grid = JSON.parse(JSON.stringify(next.grid)) as GridSetting
    },
    setGridColumns(columns: number) {
      const next = clamp(Math.round(columns) || 1, 1, 48)
      if (next === this.grid.columns) return
      this.grid.columns = next
      this.widgets.forEach((widget) => {
        widget.layout.w = clamp(widget.layout.w, 1, next)
        widget.layout.x = clamp(widget.layout.x, 0, Math.max(next - widget.layout.w, 0))
      })
    },
    setGridRows(rows: number) {
      const next = clamp(Math.round(rows) || 1, 1, 48)
      if (next === this.grid.rows) return
      this.grid.rows = next
      this.widgets.forEach((widget) => {
        widget.layout.h = clamp(widget.layout.h, 1, next)
        widget.layout.y = clamp(widget.layout.y, 0, Math.max(next - widget.layout.h, 0))
      })
    },
    setSafeArea(size: number) {
      const value = clamp(Math.round(size) || 0, 0, Math.min(this.canvas.width, this.canvas.height) / 2)
      this.canvas.safeArea = value
    },
  },
})
