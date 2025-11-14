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
    id: 'el-1',
    name: '默认头像',
    description: '占位头像 320x320',
    owner: 'Cici',
    updatedAt: '2025-11-09 11:45',
    status: 'published'
  },
  {
    id: 'el-2',
    name: '企业徽标',
    description: 'SVG 标准版本',
    owner: 'Cici',
    updatedAt: '2025-11-04 08:52',
    status: 'published'
  },
  {
    id: 'el-3',
    name: '客服二维码',
    description: '微信客服入口',
    owner: 'Ivy',
    updatedAt: '2025-11-03 17:36',
    status: 'draft'
  }
]

const columns = computed(() => [
  { colKey: 'name', title: '名称', width: 200 },
  { colKey: 'description', title: '元素说明', ellipsis: true },
  { colKey: 'owner', title: '维护人', width: 120 },
  { colKey: 'updatedAt', title: '更新时间', width: 180 },
  { colKey: 'status', title: '状态', width: 120, align: 'center' }
])

const resolveStatus = (status: Status) => statusMap[status]
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>内置元素管理</h1>
      <t-button theme="primary">新增元素</t-button>
    </header>

    <div class="card">
      <header class="card__header">
        <div>
          <h3>素材列表</h3>
          <p>{{ tableData.length }} 个素材 · 支持批量同步</p>
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
