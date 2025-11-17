<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface TableRow {
  id: string
  name: string
  description: string
  preview: string
}

const tableData: TableRow[] = [
  {
    id: 'style-1',
    name: '企业蓝名片',
    description: '品牌主色 + 默认文案排布',
    preview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%235A6BFF"/><stop offset="100%" stop-color="%238FD3FE"/></linearGradient></defs><rect width="240" height="140" rx="16" fill="url(%23g1)"/><rect x="28" y="28" width="60" height="12" rx="6" fill="white" opacity="0.9"/><rect x="28" y="48" width="120" height="10" rx="5" fill="white" opacity="0.85"/><rect x="28" y="66" width="140" height="10" rx="5" fill="white" opacity="0.8"/><rect x="28" y="88" width="110" height="10" rx="5" fill="white" opacity="0.75"/></svg>'
  },
  {
    id: 'style-2',
    name: '科技暗夜',
    description: '深色渐变 + 霓虹细节',
    preview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%2309142f"/><stop offset="100%" stop-color="%231c3b73"/></linearGradient></defs><rect width="240" height="140" rx="16" fill="url(%23g2)"/><circle cx="200" cy="36" r="20" fill="%2329e3ff" opacity="0.24"/><rect x="24" y="28" width="80" height="12" rx="6" fill="%2385ffe7" opacity="0.9"/><rect x="24" y="48" width="150" height="10" rx="5" fill="%23d6e4ff" opacity="0.85"/><rect x="24" y="68" width="110" height="10" rx="5" fill="%2385ffe7" opacity="0.75"/><rect x="24" y="88" width="140" height="10" rx="5" fill="%23d6e4ff" opacity="0.7"/></svg>'
  },
  {
    id: 'style-3',
    name: '活动快闪',
    description: '明亮配色 + 活动二维感',
    preview:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23ff8a00"/><stop offset="100%" stop-color="%23ff415b"/></linearGradient></defs><rect width="240" height="140" rx="16" fill="url(%23g3)"/><rect x="20" y="20" width="120" height="60" rx="12" fill="white" opacity="0.92"/><rect x="30" y="32" width="70" height="10" rx="5" fill="%23ff8a00" opacity="0.9"/><rect x="30" y="50" width="90" height="10" rx="5" fill="%23ff415b" opacity="0.85"/><rect x="150" y="32" width="60" height="60" rx="10" fill="white" opacity="0.92"/><rect x="158" y="42" width="44" height="8" rx="4" fill="%23ff8a00" opacity="0.85"/><rect x="158" y="58" width="44" height="8" rx="4" fill="%23ff415b" opacity="0.8"/></svg>'
  }
]

const columns = computed(() => [
  { colKey: 'preview', title: '预览图', width: 200, align: 'center' },
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
        <t-button theme="primary">新建样式</t-button>
      </div>
    </header>

    <div class="card">
      <header class="card__header">
        <div>
          <h3>当前样式</h3>
          <p>{{ tableData.length }} 个样式</p>
        </div>
      </header>

      <t-table
        row-key="id"
        :data="tableData"
        :columns="columns"
        hover
        table-layout="auto"
      >
        <template #preview="{ row }">
          <div class="preview-box">
            <img :src="row.preview" alt="preview" />
          </div>
        </template>

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

  .preview-box {
    width: 160px;
    height: 90px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
    border: 1px solid rgba(100, 116, 139, 0.12);
    background: #f8fafc;
    margin: 0 auto;
  }

  .preview-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
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
