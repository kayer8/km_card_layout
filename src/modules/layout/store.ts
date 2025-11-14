import type { CardTemplate } from '../../templates/cardTemplates'
import { builtinTemplates } from '../../templates/cardTemplates'
import { createElementController } from './element'
import { createElementListController, type ElementListController } from './element-list'
import { createLayoutManager } from './layout'
import { createLayoutData } from './layout-data'

// 组合各个子模块，对外暴露完整的布局 store API
export const createLayoutStore = (initialTemplates: CardTemplate[] = builtinTemplates) => {
  let elementListController: ElementListController | null = null

  // 核心布局管理器，处理模板与画布 schema
  const layoutManager = createLayoutManager({
    initialTemplates,
    onSchemaChange: () => {
      // schema 被整体替换时，需要刷新激活元素
      elementListController?.syncActiveElement()
    }
  })

  // 元素列表 & 单元素控制器依赖同一个 schema 引用
  const elementList = createElementListController(layoutManager.cardSchema)
  elementListController = elementList
  const elementController = createElementController(layoutManager.cardSchema)
  const layoutData = createLayoutData()

  // 包装模板切换，保持激活元素同步
  const selectTemplate = (templateId: string) => {
    layoutManager.selectTemplate(templateId)
  }

  const resetSchema = () => {
    layoutManager.resetSchema()
  }

  return {
    templates: layoutManager.templateStore,
    bindingContext: layoutData.bindingContext,
    bindingEntries: layoutData.bindingEntries,
    cardSchema: layoutManager.cardSchema,
    selectedTemplateId: layoutManager.selectedTemplateId,
    activeElementId: elementList.activeElementId,
    setActiveElement: elementList.setActiveElement,
    mutateElement: elementController.mutateElement,
    handleDragEnd: elementController.handleDragEnd,
    handleResizeEnd: elementController.handleResizeEnd,
    addElement: elementList.addElement,
    removeActiveElement: elementList.removeActiveElement,
    selectTemplate,
    resetSchema,
    createTemplate: layoutManager.createTemplate,
    resolveBinding: layoutData.resolveBinding,
    setBackgroundType: layoutManager.setBackgroundType,
    setBackgroundValue: layoutManager.setBackgroundValue,
    setBackgroundImage: layoutManager.setBackgroundImage,
    setFontColor: layoutManager.setFontColor
  }
}

export type LayoutStore = ReturnType<typeof createLayoutStore>
export type { FontColorPayload } from './layout'
export type { UserProfile, LayoutBindingContext } from './layout-data'
