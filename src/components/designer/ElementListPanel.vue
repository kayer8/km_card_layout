<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CardElement } from 'km-card-schema'
import type { TreeNodeModel, TreeNodeValue } from 'tdesign-vue-next'
import { ensurePanelChildModes } from '../../modules/layout/tree-utils'

type AnyElement = CardElement & { children?: AnyElement[] }

interface ElementTreeNode {
  value: string
  label: string
  element?: AnyElement
  children?: ElementTreeNode[]
}

const props = defineProps<{
  elements: CardElement[]
  activeElementId: string
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'toggle-visible', payload: { id: string; visible: boolean }): void
  (e: 'create-panel'): void
}>()

const buildTree = (list: AnyElement[]): ElementTreeNode[] =>
  list.map((el) => ({
    value: el.id,
    label: el.id,
    element: el,
    children: el.children ? buildTree(el.children) : undefined
  }))

const treeData = ref<ElementTreeNode[]>([])
const expanded = ref<TreeNodeValue[]>([])
const actived = ref<TreeNodeValue[]>([])

const collectValues = (nodes: ElementTreeNode[], acc: string[] = []): string[] => {
  nodes.forEach((node) => {
    acc.push(node.value)
    if (node.children?.length) collectValues(node.children, acc)
  })
  return acc
}

const rebuildTree = () => {
  treeData.value = [
    {
      value: 'root',
      label: '容器',
      element: {
        id: 'root',
        type: 'layout',
        x: 0,
        y: 0,
        width: 0,
        height: 0
      } as unknown as AnyElement,
      children: buildTree(props.elements as AnyElement[])
    }
  ]
  expanded.value = collectValues(treeData.value)
}

watch(
  () => props.elements,
  () => rebuildTree(),
  { deep: true, immediate: true }
)

watch(
  () => props.activeElementId,
  (id) => {
    actived.value = id ? [id] : []
  },
  { immediate: true }
)

const handleActive = (_vals: TreeNodeValue[], context: { node?: TreeNodeModel }) => {
  const element = context.node?.data?.element as AnyElement | undefined
  if (element && element.id !== 'root') {
    emit('select', element.id)
  }
}

const handleToggleVisible = (element: AnyElement, next: boolean) => {
  emit('toggle-visible', { id: element.id, visible: next })
}

const isContainerNode = (node?: ElementTreeNode | null) => {
  if (!node) return false
  if (node.value === 'root') return true
  return node.element?.type === 'layout-panel'
}

const allowDrop = (context: { dropNode?: TreeNodeModel; dropPosition: number }) => {
  const { dropNode, dropPosition } = context
  if (!dropNode) return false
  if (dropNode.value === 'root' && dropPosition !== 0) return false
  if (dropPosition === 0) {
    return isContainerNode(dropNode.data as ElementTreeNode)
  }
  return true
}

const removeNode = (nodes: ElementTreeNode[], value: string): ElementTreeNode | null => {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i]
    if (node.value === value) {
      nodes.splice(i, 1)
      return node
    }
    if (node.children) {
      const removed = removeNode(node.children, value)
      if (removed) return removed
    }
  }
  return null
}

const insertNode = (
  nodes: ElementTreeNode[],
  targetValue: string,
  position: number,
  nodeToInsert: ElementTreeNode
): boolean => {
  for (let i = 0; i < nodes.length; i += 1) {
    const current = nodes[i]
    if (current.value === targetValue) {
      if (position === 0) {
        if (!current.children) current.children = []
        current.children.push(nodeToInsert)
        return true
      }
      const insertIndex = i + (position === 1 ? 1 : 0)
      nodes.splice(insertIndex, 0, nodeToInsert)
      return true
    }
    if (current.children && insertNode(current.children, targetValue, position, nodeToInsert)) {
      return true
    }
  }
  return false
}

const syncSchemaFromTree = () => {
  const toElements = (nodes: ElementTreeNode[]): AnyElement[] =>
    nodes.map((node) => {
      const el = node.element as AnyElement
      el.children = node.children ? toElements(node.children) : undefined
      return el
    })
  const root = treeData.value[0]
  if (!root?.children) return
  const next = toElements(root.children)
  ensurePanelChildModes(next)
  props.elements.splice(0, props.elements.length, ...next)
}

const handleDrop = (context: { dragNode: TreeNodeModel; dropNode: TreeNodeModel; dropPosition: number }) => {
  const { dragNode, dropNode, dropPosition } = context
  const dragValue = dragNode.value as string
  const dropValue = dropNode.value as string
  const moved = removeNode(treeData.value, dragValue)
  if (!moved) return
  insertNode(treeData.value, dropValue, dropPosition, moved)
  expanded.value = collectValues(treeData.value)
  syncSchemaFromTree()
}
</script>

<template>
  <section class="panel-block">
    <div class="panel-title">
      <div>
        <h3>元素列表</h3>
        <p>当前 {{ props.elements.length }} 个元素</p>
      </div>
      <t-button size="small" variant="outline" @click="emit('create-panel')">新建布局面板</t-button>
    </div>

    <t-tree
      class="element-tree"
      :data="treeData"
      draggable
      hover
      activable
      :actived="actived"
      :expanded="expanded"
      expand-on-click-node
      :allow-drop="allowDrop"
      @drop="handleDrop"
      @active="handleActive"
    >
      <template #label="{ node }">
        <div class="tree-node">
          <div class="node-title">
            <span class="node-id">
              {{ node?.value === 'root' ? '容器' : node?.data?.element?.id || node.label }}
            </span>
            <span class="node-type">
              {{ node?.value === 'root' ? 'container' : node?.data?.element?.type }}
            </span>
          </div>
          <t-switch
            v-if="node?.data?.element && node?.value !== 'root'"
            size="small"
            :value="node.data.element.visible !== false"
            @click.stop
            @change="(val) => handleToggleVisible(node.data.element, Boolean(val))"
          />
        </div>
      </template>
    </t-tree>
  </section>
</template>

<style scoped>
.element-tree {
  --t-tree-line-color: rgba(148, 163, 184, 0.4);
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 10px;
}

.node-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-id {
  font-weight: 600;
}

.node-type {
  font-size: 12px;
  color: #718096;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(113, 128, 150, 0.12);
}
</style>
