<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface TableRow {
  id: string
  name: string
  description: string
}

const tableData: TableRow[] = [
  {
    id: 'style-1',
    name: '企业蓝名片',
    description: '品牌主色 + 默认文案排布'
  },
  {
    id: 'style-2',
    name: '科技暗夜',
    description: '深色渐变 + 霓虹细节'
  },
  {
    id: 'style-3',
    name: '活动快闪',
    description: '明亮配色 + 活动二维码'
  }
]

const columns = computed(() => [
  { colKey: 'name', title: '名称', width: 240, ellipsis: true },
  { colKey: 'description', title: '描述', ellipsis: true },
  { colKey: 'actions', title: '操作', width: 200, align: 'center' }
])

const router = useRouter()
const pushWithFallback = (name: string, row?: TableRow) => {
  const target = row ?? tableData[0]
  if (!target) return
  router.push({ name, params: { id: target.id } })
}

const toDesigner = (row?: TableRow) => pushWithFallback('style-designer', row)
const toManage = (row?: TableRow) => pushWithFallback('style-manage', row)
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>样式管理</h1>
      <div class="header-actions">
        <t-button variant="outline" @click="toManage()">管理</t-button>
        <t-button theme="primary">新建样式</t-button>
      </div>
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
          <t-link theme="primary" @click="toDesigner(row)">
            {{ row.name }}
          </t-link>
        </template>

        <template #actions="{ row }">
          <div class="table-actions">
            <t-button size="small" variant="outline" @click="toDesigner(row)">设计</t-button>
            <t-button size="small" theme="primary" @click="toManage(row)">管理</t-button>
          </div>
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

  .header-actions {
    display: flex;
    gap: 8px;
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

  .table-actions {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  @media (max-width: 768px) {
    .page__header {
      flex-direction: column;
      align-items: flex-start;
    }

    .card {
      padding: 20px;
    }
  }
</style>
