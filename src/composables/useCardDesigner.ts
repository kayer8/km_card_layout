import { computed, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import type { CardTemplate } from '../templates/cardTemplates';
import {
  createLayoutStore,
  type FontColorPayload,
} from '../modules/layout/store';
import {
  createElementPreviewResolver,
} from '../modules/layout/rendering';
import { findElementById } from '../modules/layout/tree-utils';

export const useCardDesigner = () => {
  const layoutStore = createLayoutStore();
  const {
    bindingContext,
    bindingEntries,
    cardSchema,
    templates,
    selectedTemplateId,
    activeElementId,
    setActiveElement,
    mutateElement,
    handleDragEnd,
    handleResizeEnd,
    addElement,
    removeActiveElement,
    resetSchema,
    selectTemplate,
    createTemplate: rawCreateTemplate,
    resolveBinding,
    setBackgroundImage,
    setFontColor,
    setElementVisibility,
  } = layoutStore;

  const copyState = ref<'idle' | 'copied'>('idle');
  const serializedSchema = computed(() => JSON.stringify(cardSchema, null, 2));
  const activeElement = computed(() =>
    findElementById(cardSchema.children, activeElementId.value)
  );
  const getElementPreview = createElementPreviewResolver(resolveBinding);

  const copySchema = async () => {
    try {
      await navigator.clipboard.writeText(serializedSchema.value);
      copyState.value = 'copied';
      MessagePlugin.success('布局 JSON 已复制');
      window.setTimeout(() => {
        copyState.value = 'idle';
      }, 1600);
    } catch (error) {
      MessagePlugin.error('复制失败，请手动复制');
    }
  };

  const createTemplate = (name: string): CardTemplate | null => {
    const template = rawCreateTemplate(name);
    if (!template) {
      MessagePlugin.warning('模板名称不能为空');
      return null;
    }
    MessagePlugin.success('模板已保存');
    return template;
  };

  const setFontColorWithSync = (payload: FontColorPayload) => {
    setFontColor(payload);
  };

  return {
    bindingContext,
    bindingEntries,
    cardSchema,
    templates,
    selectedTemplateId,
    copyState,
    activeElementId,
    activeElement,
    serializedSchema,
    getElementPreview,
    setActiveElement,
    mutateElement,
    handleDragEnd,
    handleResizeEnd,
    addElement,
    removeActiveElement,
    resetSchema,
    selectTemplate,
    createTemplate,
    copySchema,
    setBackgroundImage,
    setFontColor: setFontColorWithSync,
    setElementVisibility,
  };
};

export type UseCardDesignerReturn = ReturnType<typeof useCardDesigner>;
