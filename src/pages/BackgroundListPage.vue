<script setup lang="ts">
import { computed } from 'vue'

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
    id: 'bg-1',
    name: 'Cobalt 渐变',
    description: '蓝紫渐变，适合科技/咨询',
    owner: 'Leo',
    updatedAt: '2025-11-08 16:20',
    status: 'published'
  },
  {
    id: 'bg-2',
    name: 'Grid Pattern',
    description: '浅色栅格纹理，适配金融行业',
    owner: 'July',
    updatedAt: '2025-11-06 10:11',
    status: 'draft'
  },
  {
    id: 'bg-3',
    name: 'Signature Photo',
    description: '客户提供的实景图',
    owner: 'Emma',
    updatedAt: '2025-11-01 19:02',
    status: 'pending'
  }
]

const columns = computed(() => [
  { colKey: 'name', title: '名称', width: 200 },
  { colKey: 'description', title: '适用场景', ellipsis: true },
  { colKey: 'owner', title: '维护人', width: 120 },
  { colKey: 'updatedAt', title: '更新时间', width: 180 },
  { colKey: 'status', title: '状态', width: 120, align: 'center' }
])

const resolveStatus = (status: Status) => statusMap[status]
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>背景管理</h1>
      <t-button theme="primary">上传背景</t-button>
    </header>

    <div class="card">
      <header class="card__header">
        <div>
          <h3>背景素材列表</h3>
          <p>{{ tableData.length }} 条记录 · 支持预览与替换</p>
        </div>
      </header>

      <t-table
        row-key="id"
        :data="tableData"
        :columns="columns"
        hover
        table-layout="auto"
      >
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
