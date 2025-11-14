<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

type Status = 'published' | 'draft' | 'pending'

interface TableRow {
  id: string
  name: string
  description: string
  owner: string
  updatedAt: string
  status: Status
}

const statusMap: Record<Status, { label: string; theme: 'success' | 'warning' | 'default' }> = {
  published: { label: '已发布', theme: 'success' },
  draft: { label: '草稿', theme: 'default' },
  pending: { label: '待发布', theme: 'warning' }
}

const tableData: TableRow[] = [
  {
    id: 'style-1',
    name: '企业蓝名片',
    description: '品牌主色 + 默认文案排布',
    owner: '张小北',
    updatedAt: '2025-11-10 18:32',
    status: 'published'
  },
  {
    id: 'style-2',
    name: '科技暗夜',
    description: '深色渐变 + 霓虹细节',
    owner: '王语',
    updatedAt: '2025-11-09 09:21',
    status: 'draft'
  },
  {
    id: 'style-3',
    name: '活动快闪',
    description: '明亮配色 + 活动二维码',
    owner: 'Winnie',
    updatedAt: '2025-11-05 14:08',
    status: 'pending'
  }
]

const columns = computed(() => [
  { colKey: 'name', title: '名称', width: 220, ellipsis: true },
  { colKey: 'description', title: '描述', ellipsis: true },
  { colKey: 'owner', title: '维护人', width: 120 },
  { colKey: 'updatedAt', title: '更新时间', width: 180 },
  { colKey: 'status', title: '状态', width: 120, align: 'center' }
])

const router = useRouter()
const toDesigner = () => {
  router.push({ name: 'style-designer' })
}
const resolveStatus = (status: Status) => statusMap[status]
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>样式管理</h1>
      <t-button theme="primary">新建样式</t-button>
    </header>

    <div class="card">
      <header class="card__header">
        <div>
          <h3>当前样式</h3>
          <p>{{ tableData.length }} 个样式 · 最近更新实时同步</p>
        </div>
      </header>

      <t-table
        row-key="id"
        :data="tableData"
        :columns="columns"
        hover
        table-layout="auto"
      >
        <template #name="{ row }">
          <t-link theme="primary" @click="toDesigner">
            {{ row.name }}
          </t-link>
        </template>

        <template #status="{ row }">
          <t-tag :theme="resolveStatus(row.status).theme" variant="light">
            {{ resolveStatus(row.status).label }}
          </t-tag>
        </template>
      </t-table>
    </div>
  </section>
</template>

<style scoped>
  .page {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .page__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  h1 {
    margin: 0;
  }

  .card {
    background: #fff;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 18px 40px rgba(90, 107, 255, 0.12);
    border: 1px solid rgba(90, 107, 255, 0.08);
  }

  .card__header {
    margin-bottom: 16px;
  }

  .card__header h3 {
    margin: 0;
  }

  .card__header p {
    margin: 6px 0 0;
    color: #64748b;
  }

  @media (max-width: 768px) {
    .page__header {
      flex-direction: column;
    }

    .card {
      padding: 20px;
    }
  }
</style>
