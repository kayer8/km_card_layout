<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

interface TableRow {
  id: string
  name: string
  binding: string
  type: '内置' | '特殊'
}

const tableData = reactive<TableRow[]>([
  {
    id: 'el-1',
    name: '默认头像',
    binding: 'user.avatar',
    type: '内置'
  },
  {
    id: 'el-2',
    name: '企业徽标',
    binding: 'brand.logo',
    type: '内置'
  },
  {
    id: 'el-3',
    name: '客服二维码',
    binding: 'brand.qr',
    type: '特殊'
  }
])

const columns = computed(() => [
  { colKey: 'name', title: '名称', width: 200 },
  { colKey: 'binding', title: '绑定属性', ellipsis: true },
  { colKey: 'type', title: '类型', width: 120, align: 'center' }
])

const dialogVisible = ref(false)
const newElement = reactive<{ name: string; binding: string; type: '内置' | '特殊' }>({
  name: '',
  binding: '',
  type: '内置'
})

const resetDialog = () => {
  newElement.name = ''
  newElement.binding = ''
  newElement.type = '内置'
}

const createId = () => `el-${Math.random().toString(36).slice(2, 8)}`
const showDialog = () => {
  resetDialog()
  dialogVisible.value = true
}

const submitElement = () => {
  if (!newElement.name.trim() || !newElement.binding.trim()) return
  tableData.push({
    id: createId(),
    name: newElement.name.trim(),
    binding: newElement.binding.trim(),
    type: newElement.type
  })
  dialogVisible.value = false
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>内置元素管理</h1>
      <t-button theme="primary" @click="showDialog">新增元素</t-button>
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
        <template #binding="{ row }">
          <code class="binding">{{ row.binding }}</code>
        </template>
        <template #type="{ row }">
          <t-tag :theme="row.type === '内置' ? 'primary' : 'warning'" variant="light">
            {{ row.type }}
          </t-tag>
        </template>
      </t-table>
    </div>

    <t-dialog v-model:visible="dialogVisible" header="新增内置元素" width="480px" @closed="resetDialog">
      <div class="dialog-form">
        <label>名称</label>
        <t-input v-model="newElement.name" placeholder="例如：职位、电话" />

        <label>绑定属性</label>
        <t-input v-model="newElement.binding" placeholder="例如：user.title" />

        <label>类型</label>
        <t-radio-group v-model="newElement.type">
          <t-radio value="内置">内置</t-radio>
          <t-radio value="特殊">特殊</t-radio>
        </t-radio-group>
      </div>

      <template #footer>
        <t-button variant="outline" @click="dialogVisible = false">取消</t-button>
        <t-button theme="primary" :disabled="!newElement.name || !newElement.binding" @click="submitElement">
          确认创建
        </t-button>
      </template>
    </t-dialog>
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

  .binding {
    background: rgba(90, 107, 255, 0.08);
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 0.88rem;
  }

  .dialog-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .dialog-form label {
    font-size: 0.9rem;
    color: #4a5568;
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
