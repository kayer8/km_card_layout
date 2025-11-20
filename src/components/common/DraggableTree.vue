<script setup lang="ts">
import { reactive, toRefs, watch } from 'vue'

export interface DraggableTreeNode {
  value: string | number
  label: string
  children?: DraggableTreeNode[]
  disableChild?: boolean
  [key: string]: unknown
}

const props = withDefaults(
  defineProps<{
    data: DraggableTreeNode[]
    disableChildKey?: string
    draggable?: boolean
    expandAll?: boolean
  }>(),
  {
    data: () => [],
    disableChildKey: 'disableChild',
    draggable: true,
    expandAll: true
  }
)

const emit = defineEmits<{
  (e: 'update:data', payload: DraggableTreeNode[]): void
  (e: 'node-drop', payload: { dragValue: string | number; dropValue: string | number; dropPosition: number }): void
  (e: 'node-click', value: string | number, context: Record<string, unknown>): void
}>()

const cloneNodes = (nodes: DraggableTreeNode[]): DraggableTreeNode[] =>
  nodes.map(node => ({
    ...node,
    children: node.children ? cloneNodes(node.children) : undefined
  }))

const state = reactive({
  treeData: cloneNodes(props.data)
})

watch(
  () => props.data,
  next => {
    state.treeData = cloneNodes(next)
  },
  { deep: true }
)

const findNode = (
  nodes: DraggableTreeNode[],
  value: string | number,
  parent: DraggableTreeNode | null = null
): { node: DraggableTreeNode; parent: DraggableTreeNode | null; siblings: DraggableTreeNode[] } | null => {
  for (const current of nodes) {
    if (current.value === value) {
      return {
        node: current,
        parent,
        siblings: parent ? parent.children ?? [] : nodes
      }
    }
    if (current.children) {
      const match = findNode(current.children, value, current)
      if (match) return match
    }
  }
  return null
}

const removeNode = (nodes: DraggableTreeNode[], value: string | number): DraggableTreeNode | null => {
  for (let i = 0; i < nodes.length; i += 1) {
    const current = nodes[i]!
    if (current.value === value) {
      nodes.splice(i, 1)
      return current
    }

    if (current.children) {
      const removedChild = removeNode(current.children, value)
      if (removedChild) {
        if (!current.children.length) {
          delete current.children
        }
        return removedChild
      }
    }
  }
  return null
}

const allowDrop = (context: any) => {
  if (!props.draggable) return false
  if (!context.dropNode) return true

  if (context.dropPosition === 0) {
    const nodeData = context.dropNode.data as DraggableTreeNode
    return !nodeData[props.disableChildKey]
  }
  return true
}

const handleDrop = (context: any) => {
  const dragValue: string | number = context.dragNode.value
  const dropValue: string | number = context.dropNode?.value
  const dropPosition: number = context.dropPosition

  if (dropValue === undefined) return

  const draggedNode = removeNode(state.treeData, dragValue)
  if (!draggedNode) return

  const dropInfo = findNode(state.treeData, dropValue)
  const targetSiblings = dropInfo?.siblings ?? state.treeData

  if (dropPosition === 0) {
    const parentNode = dropInfo?.node
    if (!parentNode) return
    if (!parentNode.children) parentNode.children = []
    parentNode.children.push(draggedNode)
  } else {
    const insertIndex = targetSiblings.findIndex(node => node.value === dropValue) + (dropPosition === 1 ? 1 : 0)
    targetSiblings.splice(insertIndex, 0, draggedNode)
  }

  emit('update:data', cloneNodes(state.treeData))
  emit('node-drop', { dragValue, dropValue, dropPosition })
}

const handleNodeClick = (context: any) => {
  emit('node-click', context.node.value, context)
}

const disableChildKey = props.disableChildKey
const { treeData } = toRefs(state)
</script>

<template>
  <t-tree
    :data="treeData"
    :draggable="draggable"
    hover
    :expand-on-click-node="false"
    :default-expanded="expandAll ? treeData.map(node => node.value) : undefined"
    :allow-drop="allowDrop"
    @drop="handleDrop"
    @click="handleNodeClick"
  >
    <template #label="{ node }">
      <span>{{ node.label }}</span>
      <t-tag v-if="node.data?.[disableChildKey]" size="small" variant="light-outline" theme="warning" style="margin-left: 6px">
        叶子
      </t-tag>
    </template>
  </t-tree>
</template>
