import { ref } from 'vue';
import type {
  CardElement,
  CardElementType,
  CardLayoutSchema,
} from 'km-card-schema';

const createElementId = (type: CardElementType) =>
  `${type}-${Math.random().toString(36).slice(2, 7)}`;

type ElementBuilderContext = { id: string; baseX: number; cardWidth: number };

const elementBuilders: Record<
  CardElementType,
  (ctx: ElementBuilderContext) => CardElement
> = {
  text: ({ id, baseX }) => ({
    id,
    type: 'text',
    binding: 'user.name',
    visible: true,
    layout: {
      mode: 'absolute',
      x: baseX,
      y: 300,
      width: 260,
      height: 36,
    },
    style: {
      fontSize: 18,
      color: '#1A202C',
      lineHeight: 1.3,
    },
  }),

  custom: ({ id, baseX }) => ({
    id,
    type: 'custom',
    visible: true,
    layout: {
      mode: 'absolute',
      x: baseX,
      y: 300,
      width: 260,
      height: 36,
    },
    style: {
      fontSize: 18,
      color: '#1A202C',
      lineHeight: 1.3,
    },
  }),

  image: ({ id, cardWidth }) => ({
    id,
    type: 'image',
    binding: 'user.avatar',
    visible: true,
    layout: {
      mode: 'absolute',
      x: cardWidth - 200,
      y: 80,
      width: 120,
      height: 120,
    },
    style: {
      borderRadius: '16px',
      border: '4px solid rgba(255, 255, 255, 0.12)',
    },
  }),

  icon: ({ id, baseX }) => ({
    id,
    type: 'icon',
    name: 'dot',
    visible: true,
    layout: {
      mode: 'absolute',
      x: baseX,
      y: 320,
      width: 14,
      height: 14,
    },
    style: {
      backgroundColor: '#2B6CB0',
      borderRadius: '50%',
    },
  }),

  'layout-panel': ({ id, baseX, cardWidth }) => ({
    id,
    type: 'layout-panel',
    visible: false,
    layout: {
      mode: 'absolute',
      x: baseX,
      y: 40,
      width: cardWidth * 0.6,
      height: 160,
    },
    style: {
      border: '1px dashed #a0aec0',
      backgroundColor: 'rgba(160, 174, 192, 0.08)',
      borderRadius: 12,
    },
    container: {
      mode: 'absolute', // 关键点：layout-panel 必须声明容器模式
    },
    children: [],
  }),
};

// 元素列表控制器：负责当前激活项及增删逻辑
export const createElementListController = (cardSchema: CardLayoutSchema) => {
  const activeElementId = ref(cardSchema.children[0]?.id ?? '');

  const setActiveElement = (id: string) => {
    activeElementId.value = id;
  };

  const addElement = (type: CardElementType) => {
    const id = createElementId(type);
    const baseX = 40 + cardSchema.children.length * 4;
    const builder = elementBuilders[type];
    const element = builder({ id, baseX, cardWidth: cardSchema.width });

    cardSchema.children.push(element);
    setActiveElement(id);
    return element;
  };

  // 删除当前激活元素，并自动选择邻近元素
  const removeActiveElement = () => {
    if (!activeElementId.value) return;
    const index = cardSchema.children.findIndex(
      (element: CardElement) => element.id === activeElementId.value
    );
    if (index === -1) return;
    cardSchema.children.splice(index, 1);
    const fallback =
      cardSchema.children[index - 1] ??
      cardSchema.children[index] ??
      cardSchema.children[0];
    setActiveElement(fallback?.id ?? '');
  };

  const setElementVisibility = (id: string, visible: boolean) => {
    const target = cardSchema.children.find(element => element.id === id);
    if (!target) return;
    target.visible = visible;
    if (!visible && activeElementId.value === id) {
      const next = cardSchema.children.find(
        el => el.visible !== false && el.id !== id
      );
      setActiveElement(next?.id ?? '');
    }
  };

  // 外部替换 schema 时需要重新同步激活项
  const syncActiveElement = () => {
    setActiveElement(cardSchema.children[0]?.id ?? '');
  };

  return {
    activeElementId,
    setActiveElement,
    addElement,
    removeActiveElement,
    setElementVisibility,
    syncActiveElement,
  };
};

export type ElementListController = ReturnType<
  typeof createElementListController
>;
