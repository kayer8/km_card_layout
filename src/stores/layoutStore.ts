import { defineStore } from 'pinia';
import type {
  BindingField,
  CardElement,
  CardLayout,
  CardMeta,
  HistoryState,
  LayoutMetrics,
  TextStyle,
  CanvasGrid
} from '@/types/layout';

export type ElementPreset = 'name' | 'title' | 'company' | 'email' | 'phone' | 'custom' | 'qrcode' | 'logo';

interface LayoutState {
  layout: CardLayout;
  selectedElementId: string | null;
  history: HistoryState;
  previewData: Record<string, string>;
}

const createId = () => Math.random().toString(36).slice(2, 10);

const nowIso = () => new Date().toISOString();

const defaultGrid: CanvasGrid = {
  snap: true,
  size: {
    x: 40,
    y: 40
  }
};

const normalizeGrid = (grid?: Partial<CanvasGrid>): CanvasGrid => ({
  snap: grid?.snap ?? true,
  size: {
    x: sanitizeGridSize(grid?.size?.x ?? defaultGrid.size.x, defaultGrid.size.x),
    y: sanitizeGridSize(grid?.size?.y ?? defaultGrid.size.y, defaultGrid.size.y)
  }
});

const sanitizeGridSize = (value: number, fallback: number) => {
  const num = Number.isFinite(value) ? Math.abs(Math.round(value)) : fallback;
  return num > 0 ? num : fallback;
};

const snapToStep = (value: number, step: number) => {
  if (!step || step <= 0) return value;
  return Math.round(value / step) * step;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const snapLayoutToCanvas = (layout: LayoutMetrics, canvas: CardMeta['canvas']): LayoutMetrics => {
  const grid = normalizeGrid(canvas.grid);
  const stepX = grid.size.x;
  const stepY = grid.size.y;
  const next: LayoutMetrics = { ...layout };

  const enforceBounds = () => {
    next.width = Math.max(1, Math.min(next.width, canvas.width));
    next.height = Math.max(1, Math.min(next.height, canvas.height));
    next.x = clamp(next.x, 0, Math.max(0, canvas.width - next.width));
    next.y = clamp(next.y, 0, Math.max(0, canvas.height - next.height));
  };

  enforceBounds();

  if (grid.snap) {
    if (stepX > 0) {
      next.width = Math.max(stepX, snapToStep(next.width, stepX));
      next.x = clamp(snapToStep(next.x, stepX), 0, Math.max(0, canvas.width - stepX));
      const maxWidthCandidate = snapToStep(canvas.width - next.x, stepX);
      const maxWidth = Math.max(stepX, maxWidthCandidate || stepX);
      next.width = clamp(next.width, stepX, maxWidth);
    }

    if (stepY > 0) {
      next.height = Math.max(stepY, snapToStep(next.height, stepY));
      next.y = clamp(snapToStep(next.y, stepY), 0, Math.max(0, canvas.height - stepY));
      const maxHeightCandidate = snapToStep(canvas.height - next.y, stepY);
      const maxHeight = Math.max(stepY, maxHeightCandidate || stepY);
      next.height = clamp(next.height, stepY, maxHeight);
    }
  }

  enforceBounds();

  return next;
};

const defaultCardLayout = (): CardLayout => {
  const layout: CardLayout = {
    schemaVersion: '1.0',
    meta: {
      title: '默认名片布局',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      canvas: {
        width: 1000,
        height: 600,
        background: {
          type: 'color',
          value: '#ffffff'
        },
        grid: normalizeGrid(defaultGrid)
      }
    },
    dataBindings: {
      name: '张三',
      title: '产品经理',
      company: '腾讯科技',
      email: 'name@example.com',
      phone: '138-0000-0000',
      address: '深圳市南山区',
      website: 'www.example.com'
    },
    elements: [
      {
        id: createId(),
        type: 'text',
        name: '姓名',
        layout: { x: 80, y: 120, width: 200, height: 80, zIndex: 1 },
        binding: { field: 'name' },
        style: {
          fontFamily: 'PingFang SC',
          fontSize: 32,
          fontWeight: 'bold',
          color: '#1d2129',
          lineHeight: 1.2
        }
      },
      {
        id: createId(),
        type: 'text',
        name: '职位',
        layout: { x: 80, y: 200, width: 320, height: 80, zIndex: 1 },
        binding: { field: 'title' },
        style: {
          fontFamily: 'PingFang SC',
          fontSize: 20,
          color: '#4e5969',
          lineHeight: 1.2
        }
      }
    ]
  };

  layout.elements = layout.elements.map(element => ({
    ...element,
    layout: snapLayoutToCanvas(element.layout, layout.meta.canvas)
  }));

  return layout;
};

const presetMap: Record<ElementPreset, Partial<CardElement>> = {
  name: {
    type: 'text',
    name: '姓名',
    binding: { field: 'name' },
    style: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#1d2129',
      lineHeight: 1.2
    }
  },
  title: {
    type: 'text',
    name: '职位',
    binding: { field: 'title' },
    style: {
      fontSize: 20,
      color: '#4e5969',
      lineHeight: 1.2
    }
  },
  company: {
    type: 'text',
    name: '公司',
    binding: { field: 'company' },
    style: {
      fontSize: 18,
      color: '#1c6eff',
      lineHeight: 1.2
    }
  },
  email: {
    type: 'text',
    name: '邮箱',
    binding: { field: 'email' },
    style: {
      fontSize: 16,
      color: '#4e5969'
    }
  },
  phone: {
    type: 'text',
    name: '电话',
    binding: { field: 'phone' },
    style: {
      fontSize: 16,
      color: '#4e5969'
    }
  },
  custom: {
    type: 'text',
    name: '自定义文本',
    style: {
      fontSize: 16,
      color: '#1d2129',
      lineHeight: 1.4
    },
    content: '请输入内容'
  },
  qrcode: {
    type: 'qrcode',
    name: '二维码',
    binding: { field: 'website' },
    style: {
      backgroundColor: '#ffffff'
    },
    extras: {
      size: 140
    }
  },
  logo: {
    type: 'image',
    name: 'Logo',
    style: {
      backgroundColor: '#ffffff'
    },
    extras: {
      source: ''
    }
  }
};

const initialState = (): LayoutState => {
  const layout = defaultCardLayout();
  return {
    layout,
    selectedElementId: layout.elements[0]?.id ?? null,
    history: { past: [], future: [] },
    previewData: layout.dataBindings
  };
};

export const useLayoutStore = defineStore('layout', {
  state: initialState,
  getters: {
    canvasMeta: state => state.layout.meta.canvas,
    canvasGrid: state => state.layout.meta.canvas.grid,
    gridSize: state => state.layout.meta.canvas.grid.size,
    gridSnapEnabled: state => state.layout.meta.canvas.grid.snap,
    elements: state => state.layout.elements,
    selectedElement: state =>
      state.layout.elements.find(element => element.id === state.selectedElementId) ?? null,
    bindings: state => state.layout.dataBindings
  },
  actions: {
    selectElement(id: string | null) {
      this.selectedElementId = id;
    },

    addElement(preset: ElementPreset) {
      const config = presetMap[preset];
      if (!config) return;
      const baseLayout: LayoutMetrics = {
        x: 80,
        y: 80,
        width: preset === 'qrcode' ? 160 : 220,
        height: preset === 'qrcode' ? 160 : 60,
        zIndex: this.layout.elements.length + 1
      };
      const layout = snapLayoutToCanvas(baseLayout, this.layout.meta.canvas);

      const element: CardElement = {
        id: createId(),
        type: config.type ?? 'text',
        name: config.name ?? '新元素',
        layout,
        binding: config.binding,
        content: config.content,
        style: {
          fontFamily: 'PingFang SC',
          fontSize: 18,
          color: '#1d2129',
          lineHeight: 1.3,
          ...(config.style ?? {})
        },
        extras: config.extras ?? {}
      };
      this.pushHistory();
      this.layout.elements.push(element);
      this.selectElement(element.id);
    },

    removeElement(id: string) {
      const index = this.layout.elements.findIndex(item => item.id === id);
      if (index === -1) {
        return;
      }
      this.pushHistory();
      this.layout.elements.splice(index, 1);
      if (this.selectedElementId === id) {
        this.selectedElementId = this.layout.elements.at(-1)?.id ?? null;
      }
    },

    updateElementName(id: string, name: string) {
      const element = this.layout.elements.find(item => item.id === id);
      if (!element) return;
      this.pushHistory();
      element.name = name;
      this.touch();
    },

    updateElementLayout(
      id: string,
      next: Partial<LayoutMetrics>,
      options: { recordHistory?: boolean; touch?: boolean } = {}
    ) {
      const element = this.layout.elements.find(item => item.id === id);
      if (!element) return;
      const { recordHistory = true, touch = true } = options;
      if (recordHistory) {
        this.pushHistory();
      }
      const merged: LayoutMetrics = { ...element.layout, ...next };
      element.layout = snapLayoutToCanvas(merged, this.layout.meta.canvas);
      if (touch) {
        this.touch();
      }
    },

    setElementZIndex(id: string, zIndex: number) {
      const element = this.layout.elements.find(item => item.id === id);
      if (!element) return;
      this.pushHistory();
      element.layout.zIndex = zIndex;
      this.normalizeZIndex();
      this.touch();
    },

    bringForward(id: string) {
      const sorted = this.layout.elements.slice().sort((a, b) => a.layout.zIndex - b.layout.zIndex);
      const index = sorted.findIndex(item => item.id === id);
      if (index === -1 || index === sorted.length - 1) return;
      this.pushHistory();
      const current = sorted[index];
      const next = sorted[index + 1];
      const temp = current.layout.zIndex;
      current.layout.zIndex = next.layout.zIndex;
      next.layout.zIndex = temp;
      this.normalizeZIndex();
      this.touch();
    },

    sendBackward(id: string) {
      const sorted = this.layout.elements.slice().sort((a, b) => a.layout.zIndex - b.layout.zIndex);
      const index = sorted.findIndex(item => item.id === id);
      if (index <= 0) return;
      this.pushHistory();
      const current = sorted[index];
      const prev = sorted[index - 1];
      const temp = current.layout.zIndex;
      current.layout.zIndex = prev.layout.zIndex;
      prev.layout.zIndex = temp;
      this.normalizeZIndex();
      this.touch();
    },

    bringToFront(id: string) {
      const maxZ = this.layout.elements.length;
      const element = this.layout.elements.find(item => item.id === id);
      if (!element) return;
      if (element.layout.zIndex === maxZ) return;
      this.pushHistory();
      element.layout.zIndex = maxZ + 1;
      this.normalizeZIndex();
      this.touch();
    },

    sendToBack(id: string) {
      const element = this.layout.elements.find(item => item.id === id);
      if (!element) return;
      if (element.layout.zIndex === 1) return;
      this.pushHistory();
      element.layout.zIndex = 0;
      this.normalizeZIndex();
      this.touch();
    },

    updateElementStyle(id: string, style: Partial<TextStyle>) {
      const element = this.layout.elements.find(item => item.id === id);
      if (!element) return;
      this.pushHistory();
      element.style = {
        ...element.style,
        ...style
      };
      this.touch();
    },

    updateElementBinding(id: string, binding: BindingField | null) {
      const element = this.layout.elements.find(item => item.id === id);
      if (!element) return;
      this.pushHistory();
      element.binding = binding ? { field: binding } : undefined;
      this.touch();
    },

    updateElementContent(id: string, content: string) {
      const element = this.layout.elements.find(item => item.id === id);
      if (!element) return;
      this.pushHistory();
      element.content = content;
      this.touch();
    },

    updateCanvasBackground(value: { type: 'color' | 'gradient' | 'image'; value: string }) {
      this.pushHistory();
      this.layout.meta.canvas.background = value;
      this.touch();
    },

    updateCanvasSize(width: number, height: number) {
      const nextWidth = Math.max(100, Math.round(width));
      const nextHeight = Math.max(100, Math.round(height));
      if (
        this.layout.meta.canvas.width === nextWidth &&
        this.layout.meta.canvas.height === nextHeight
      ) {
        return;
      }
      this.pushHistory();
      this.layout.meta.canvas.width = nextWidth;
      this.layout.meta.canvas.height = nextHeight;
      this.layout.elements.forEach(element => {
        element.layout = snapLayoutToCanvas(element.layout, this.layout.meta.canvas);
      });
      this.touch();
    },

    updateGridSize(size: { x: number; y: number }) {
      const nextX = sanitizeGridSize(size.x, this.layout.meta.canvas.grid.size.x);
      const nextY = sanitizeGridSize(size.y, this.layout.meta.canvas.grid.size.y);
      if (nextX === this.layout.meta.canvas.grid.size.x && nextY === this.layout.meta.canvas.grid.size.y) {
        return;
      }
      this.pushHistory();
      this.layout.meta.canvas.grid = normalizeGrid({
        ...this.layout.meta.canvas.grid,
        size: { x: nextX, y: nextY }
      });
      this.layout.elements.forEach(element => {
        element.layout = snapLayoutToCanvas(element.layout, this.layout.meta.canvas);
      });
      this.touch();
    },

    toggleGridSnap(enabled: boolean) {
      if (this.layout.meta.canvas.grid.snap === enabled) return;
      this.pushHistory();
      this.layout.meta.canvas.grid.snap = enabled;
      if (enabled) {
        this.layout.elements.forEach(element => {
          element.layout = snapLayoutToCanvas(element.layout, this.layout.meta.canvas);
        });
      }
      this.touch();
    },

    setPreviewData(payload: Record<string, string>) {
      this.previewData = payload;
    },

    exportLayout(): string {
      return JSON.stringify(this.layout, null, 2);
    },

    importLayout(layout: CardLayout) {
      const rawCanvas = layout.meta.canvas as CardMeta['canvas'] & { gridSize?: number };
      const gridFromLegacy =
        rawCanvas.grid ??
        (typeof rawCanvas.gridSize === 'number'
          ? {
              snap: true,
              size: { x: Number(rawCanvas.gridSize), y: Number(rawCanvas.gridSize) }
            }
          : undefined);

      const normalizedCanvas: CardMeta['canvas'] = {
        ...rawCanvas,
        grid: normalizeGrid(gridFromLegacy as Partial<CanvasGrid>)
      };

      const normalizedLayout: CardLayout = {
        ...layout,
        meta: {
          ...layout.meta,
          canvas: normalizedCanvas
        },
        elements: layout.elements.map(element => ({
          ...element,
          layout: snapLayoutToCanvas(element.layout, normalizedCanvas)
        }))
      };

      this.pushHistory();
      this.layout = normalizedLayout;
      this.previewData = normalizedLayout.dataBindings;
      this.selectedElementId = normalizedLayout.elements[0]?.id ?? null;
    },

    pushHistory() {
      this.history.past.push(JSON.parse(JSON.stringify(this.layout)));
      this.history.future = [];
    },

    undo() {
      if (!this.history.past.length) return;
      const prev = this.history.past.pop();
      if (!prev) return;
      this.history.future.push(JSON.parse(JSON.stringify(this.layout)));
      this.layout = prev;
      this.selectedElementId = this.layout.elements[0]?.id ?? null;
    },

    redo() {
      if (!this.history.future.length) return;
      const next = this.history.future.pop();
      if (!next) return;
      this.history.past.push(JSON.parse(JSON.stringify(this.layout)));
      this.layout = next;
      this.selectedElementId = this.layout.elements[0]?.id ?? null;
    },

    reset() {
      this.layout = defaultCardLayout();
      this.history = { past: [], future: [] };
      this.selectedElementId = this.layout.elements[0]?.id ?? null;
      this.previewData = this.layout.dataBindings;
    },

    touch() {
      this.layout.meta.updatedAt = nowIso();
    },

    normalizeZIndex() {
      this.layout.elements
        .sort((a, b) => a.layout.zIndex - b.layout.zIndex)
        .forEach((element, index) => {
          element.layout.zIndex = index + 1;
        });
    }
  }
});
