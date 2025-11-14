<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ResourceSelectDialog from '../components/common/ResourceSelectDialog.vue'

interface AssetItem {
  id: string
  name: string
  description: string
  type: string
  binding?: string
}

interface StyleResource {
  name: string
  backgrounds: AssetItem[]
  elements: AssetItem[]
}

const initialResources: Record<string, StyleResource> = {
  'style-1': {
    name: '企业蓝名片',
    backgrounds: [
      { id: 'bg-1', name: 'Cobalt 渐变', description: '蓝紫渐变，适配科技咨询行业', type: '渐变' },
      { id: 'bg-2', name: 'Signature Photo', description: '客户签名照片背景', type: '图像' }
    ],
    elements: [
      { id: 'el-1', name: '默认头像', description: '320×320 占位头像', type: '内置', binding: 'user.avatar' },
      { id: 'el-2', name: '企业徽标', description: 'SVG 标准版', type: '内置', binding: 'brand.logo' }
    ]
  },
  'style-2': {
    name: '科技暗夜',
    backgrounds: [{ id: 'bg-3', name: 'Neon 夜空', description: '深色渐变 + 霓虹光效', type: '渐变' }],
    elements: [
      { id: 'el-3', name: '霓虹点缀', description: '夜间氛围光效果', type: '特殊' },
      { id: 'el-4', name: '客服二维码', description: '客服中心二维码', type: '内置', binding: 'brand.qr' }
    ]
  },
  'style-3': {
    name: '活动快闪',
    backgrounds: [{ id: 'bg-4', name: '活力橙', description: '橙紫对撞渐变', type: '渐变' }],
    elements: [{ id: 'el-5', name: '活动倒计时', description: '自动同步活动时间', type: '特殊', binding: 'event.countdown' }]
  }
}

const resourcesState = reactive<Record<string, StyleResource>>(
  Object.fromEntries(
    Object.entries(initialResources).map(([id, resource]) => [
      id,
      {
        name: resource.name,
        backgrounds: resource.backgrounds.map((item) => ({ ...item })),
        elements: resource.elements.map((item) => ({ ...item }))
      }
    ])
  )
)

const route = useRoute()
const router = useRouter()

const currentStyleId = computed(() => {
  const raw = route.params.id
  if (Array.isArray(raw)) return raw[0] || 'style-1'
  return (raw as string) || 'style-1'
})

const currentResource = computed<StyleResource>(() => {
  const key = currentStyleId.value as keyof typeof resourcesState
  return (resourcesState[key] ?? resourcesState['style-1']) as StyleResource
})

const backgroundColumns = [
  { colKey: 'name', title: '名称', width: 200 },
  { colKey: 'type', title: '类型', width: 120 },
  { colKey: 'description', title: '描述', ellipsis: true },
  { colKey: 'actions', title: '操作', width: 120, align: 'center' }
]

const elementColumns = [
  { colKey: 'name', title: '名称', width: 200 },
  { colKey: 'type', title: '类型', width: 120 },
  { colKey: 'description', title: '绑定属性', ellipsis: true },
  { colKey: 'actions', title: '操作', width: 140, align: 'center' }
]

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`

const backgroundOptionMap = computed(() => {
  const map = new Map<string, AssetItem>()
  Object.values(resourcesState).forEach((resource) => {
    resource.backgrounds.forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item)
      }
    })
  })
  return map
})

const backgroundOptions = computed(() =>
  Array.from(backgroundOptionMap.value.values()).map((item) => ({
    value: item.id,
    label: item.name,
    description: item.description,
    tag: item.type
  }))
)

const elementOptionMap = computed(() => {
  const map = new Map<string, AssetItem>()
  Object.values(resourcesState).forEach((resource) => {
    resource.elements.forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item)
      }
    })
  })
  return map
})

const elementOptions = computed(() =>
  Array.from(elementOptionMap.value.values()).map((item) => ({
    value: item.id,
    label: item.name,
    description: item.binding ?? item.description,
    tag: item.type
  }))
)

const backgroundDialogVisible = ref(false)
const elementDialogVisible = ref(false)

const openBackgroundPicker = () => {
  backgroundDialogVisible.value = true
}

const openElementPicker = () => {
  elementDialogVisible.value = true
}

const handleBackgroundSelect = (ids: string[]) => {
  ids.forEach((id) => {
    const option = backgroundOptionMap.value.get(id)
    if (option) {
      currentResource.value.backgrounds.push({
        id: createId('bg'),
        name: option.name,
        description: option.description,
        type: option.type
      })
    }
  })
}

const handleElementSelect = (ids: string[]) => {
  ids.forEach((id) => {
    const option = elementOptionMap.value.get(id)
    if (option) {
      currentResource.value.elements.push({
        id: createId('el'),
        name: option.name,
        description: option.binding ?? option.description,
        type: option.type as '内置' | '特殊',
        binding: option.binding
      })
    }
  })
}

const removeBackground = (id: string) => {
  const index = currentResource.value.backgrounds.findIndex((item) => item.id === id)
  if (index !== -1) currentResource.value.backgrounds.splice(index, 1)
}

const removeElement = (id: string) => {
  const index = currentResource.value.elements.findIndex((item) => item.id === id)
  if (index !== -1) currentResource.value.elements.splice(index, 1)
}

const backToStyles = () => {
  router.push('/styles')
}
</script>

<template>
  <section class="style-screen">
    <div class="style-hero">
      <div>
        <p class="hero-label">样式资源</p>
        <h1>{{ currentResource.name }} · 资源管理</h1>
        <p class="hero-desc">查看该样式所关联的背景与内置元素，确保素材一致性。</p>
      </div>
      <t-button variant="outline" @click="backToStyles">返回样式列表</t-button>
    </div>

    <div class="style-shell">
      <div class="resource-grid">
        <div class="resource-card">
          <header>
            <h3>背景资源</h3>
            <span>{{ currentResource.backgrounds.length }} 个</span>
          </header>

          <t-table
            row-key="id"
            :columns="backgroundColumns"
            :data="currentResource.backgrounds"
            hover
            table-layout="auto"
          >
            <template #actions="{ row }">
              <t-button size="small" theme="danger" variant="text" @click="removeBackground(row.id)">删除</t-button>
            </template>
          </t-table>

          <div class="card-actions">
            <t-button size="small" variant="outline" @click="openBackgroundPicker">新建背景</t-button>
          </div>
        </div>

        <div class="resource-card">
          <header>
            <h3>内置元素</h3>
            <span>{{ currentResource.elements.length }} 个</span>
          </header>

          <t-table
            row-key="id"
            :columns="elementColumns"
            :data="currentResource.elements"
            hover
            table-layout="auto"
          >
            <template #description="{ row }">
              <code class="binding">{{ row.binding ?? row.description }}</code>
            </template>
            <template #actions="{ row }">
              <t-button size="small" theme="danger" variant="text" @click="removeElement(row.id)">删除</t-button>
            </template>
          </t-table>

          <div class="card-actions">
            <t-button size="small" variant="outline" @click="openElementPicker">新建元素</t-button>
          </div>
        </div>
      </div>

<ResourceSelectDialog
  v-model:visible="backgroundDialogVisible"
  title="选择背景"
  :options="backgroundOptions"
  multiple
  @confirm="handleBackgroundSelect"
/>

<ResourceSelectDialog
  v-model:visible="elementDialogVisible"
  title="选择内置元素"
  :options="elementOptions"
  multiple
  @confirm="handleElementSelect"
/>
    </div>
  </section>
</template>

<style scoped>
  .style-screen {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: #f3f6fb;
    padding: 24px 28px 32px;
    color: #1a2235;
  }

  .style-hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .hero-label {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #7d8aa9;
    font-size: 0.82rem;
  }

  h1 {
    margin: 10px 0 6px;
    font-size: 1.8rem;
    color: #111a3a;
  }

  .hero-desc {
    margin: 0;
    color: #4a5876;
  }

  .style-shell {
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(20, 44, 99, 0.12);
    border: 1px solid rgba(90, 107, 255, 0.08);
    padding: 24px;
  }

  .resource-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }

  .resource-card {
    background: #f8faff;
    border-radius: 20px;
    padding: 20px;
    box-shadow: inset 0 0 0 1px rgba(90, 107, 255, 0.08);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .resource-card header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .resource-card span {
    color: #64748b;
    font-size: 0.92rem;
  }

  .card-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }

  .binding {
    background: rgba(90, 107, 255, 0.12);
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 0.86rem;
  }
</style>
