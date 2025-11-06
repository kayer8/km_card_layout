<template>
  <div class="palette">
    <div class="palette__title">元素库</div>
    <t-space direction="vertical" size="small" fill>
      <t-button
        v-for="item in presets"
        :key="item.key"
        block
        variant="outline"
        size="large"
        class="palette__button"
        @click="() => handleAdd(item.key)"
      >
        <div class="palette__item">
          <div class="palette__item-title">{{ item.label }}</div>
          <div class="palette__item-desc">{{ item.desc }}</div>
        </div>
      </t-button>
    </t-space>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore, type ElementPreset } from '@/stores/layoutStore';

const store = useLayoutStore();

const presets: Array<{ key: ElementPreset; label: string; desc: string }> = [
  { key: 'name', label: '姓名', desc: '绑定姓名字段的大标题' },
  { key: 'title', label: '职位', desc: '绑定职位字段' },
  { key: 'company', label: '公司', desc: '公司名称' },
  { key: 'phone', label: '联系方式', desc: '绑定电话字段' },
  { key: 'email', label: '邮箱', desc: '绑定邮箱字段' },
  { key: 'custom', label: '自定义文本', desc: '静态文本或绑定任意字段' },
  { key: 'qrcode', label: '二维码', desc: '自动生成分享二维码' },
  { key: 'logo', label: '公司 Logo', desc: '上传图片显示品牌' }
];

const handleAdd = (key: ElementPreset) => {
  store.addElement(key);
};
</script>

<style scoped>
.palette {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.palette__title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
}

.palette__item {
  text-align: left;
  width: 100%;
}

.palette__item-title {
  font-size: 14px;
  font-weight: 500;
  color: #1d2129;
}

.palette__item-desc {
  font-size: 12px;
  color: #86909c;
  margin-top: 4px;
}

.palette__button {
  justify-content: flex-start;
  padding: 12px;
  height: auto;
}

.palette__button :deep(.t-button__content) {
  justify-content: flex-start;
  width: 100%;
  white-space: normal;
}

.palette__button :deep(.t-button__text) {
  width: 100%;
}
</style>
