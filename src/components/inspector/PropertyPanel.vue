<template>
  <div class="property-panel">
    <div class="property-panel__title">属性面板</div>
    <template v-if="!element">
      <t-empty description="请选择画布中的元素" />
    </template>
    <template v-else>
      <t-form layout="vertical" label-align="left">
        <t-form-item label="显示名称">
          <t-input v-model="elementName" size="small" />
        </t-form-item>
        <t-form-item label="绑定字段">
          <t-select
            v-model="elementBinding"
            clearable
            placeholder="选择要绑定的数据字段"
            :options="bindingOptions"
            size="small"
          />
        </t-form-item>
        <t-form-item v-if="element.type === 'text'" label="默认内容">
          <t-textarea
            v-model="elementContent"
            placeholder="可填写静态内容"
            :maxcharacter="120"
            rows="3"
          />
        </t-form-item>

        <t-divider content="布局" />
        <div class="property-grid">
          <div class="property-grid__item">
            <label>X</label>
            <t-input-number
              :value="element.layout.x"
              :step="1"
              :min="0"
              size="small"
              @change="value => updateLayoutField('x', value)"
            />
          </div>
          <div class="property-grid__item">
            <label>Y</label>
            <t-input-number
              :value="element.layout.y"
              :step="1"
              :min="0"
              size="small"
              @change="value => updateLayoutField('y', value)"
            />
          </div>
          <div class="property-grid__item">
            <label>宽度</label>
            <t-input-number
              :value="element.layout.width"
              :step="10"
              :min="40"
              size="small"
              @change="value => updateLayoutField('width', value)"
            />
          </div>
          <div class="property-grid__item">
            <label>高度</label>
            <t-input-number
              :value="element.layout.height"
              :step="10"
              :min="40"
              size="small"
              @change="value => updateLayoutField('height', value)"
            />
          </div>
        </div>

        <template v-if="element.type === 'text'">
          <t-divider content="文本样式" />
          <t-form-item label="字体">
            <t-select
              v-model="fontFamily"
              :options="fontOptions"
              size="small"
              placeholder="选择字体"
            />
          </t-form-item>
          <div class="property-grid">
            <div class="property-grid__item">
              <label>字号</label>
              <t-input-number
                :value="element.style.fontSize ?? 16"
                :min="10"
                :max="72"
                size="small"
                @change="value => updateStyle({ fontSize: Number(value) })"
              />
            </div>
            <div class="property-grid__item">
              <label>行高</label>
              <t-input-number
                :value="element.style.lineHeight ?? 1.4"
                :step="0.1"
                :min="1"
                :max="3"
                size="small"
                @change="value => updateStyle({ lineHeight: Number(value) })"
              />
            </div>
          </div>
          <t-form-item label="颜色">
            <t-color-picker
              v-model="fontColor"
              size="small"
              color-mode="monochrome"
              @change="value => updateStyle({ color: value })"
            />
          </t-form-item>
          <t-form-item label="对齐方式">
            <t-radio-group
              :value="element.style.align ?? 'left'"
              variant="outline"
              size="small"
              @change="value => updateStyle({ align: value as 'left' | 'center' | 'right' })"
            >
              <t-radio-button value="left">左对齐</t-radio-button>
              <t-radio-button value="center">居中</t-radio-button>
              <t-radio-button value="right">右对齐</t-radio-button>
            </t-radio-group>
          </t-form-item>
        </template>

        <t-divider content="间距" />
        <t-form-item label="内边距">
          <t-slider
            :value="element.style.padding ?? 0"
            :max="60"
            :step="2"
            @change="value => updateStyle({ padding: Number(value) })"
          />
        </t-form-item>
      </t-form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BindingField } from '@/types/layout';
import { useLayoutStore } from '@/stores/layoutStore';

const store = useLayoutStore();

const element = computed(() => store.selectedElement);

const elementName = computed({
  get: () => element.value?.name ?? '',
  set: value => {
    if (element.value) {
      store.updateElementName(element.value.id, value.trim());
    }
  }
});

const elementBinding = computed<BindingField | null>({
  get: () => element.value?.binding?.field ?? null,
  set: value => {
    if (element.value) {
      store.updateElementBinding(element.value.id, value);
    }
  }
});

const elementContent = computed({
  get: () => element.value?.content ?? '',
  set: value => {
    if (element.value) {
      store.updateElementContent(element.value.id, value);
    }
  }
});

const fontColor = computed({
  get: () => element.value?.style.color ?? '#1d2129',
  set: value => {
    if (element.value) {
      store.updateElementStyle(element.value.id, { color: value as string });
    }
  }
});

const fontFamily = computed({
  get: () => element.value?.style.fontFamily ?? 'PingFang SC',
  set: value => {
    if (element.value) {
      store.updateElementStyle(element.value.id, { fontFamily: value as string });
    }
  }
});

const bindingOptions = [
  { label: '姓名', value: 'name' },
  { label: '职位', value: 'title' },
  { label: '公司', value: 'company' },
  { label: '邮箱', value: 'email' },
  { label: '电话', value: 'phone' },
  { label: '地址', value: 'address' },
  { label: '网址', value: 'website' },
  { label: '微信', value: 'wechat' },
  { label: '自定义', value: 'custom' }
];

const fontOptions = [
  { label: '苹方', value: 'PingFang SC' },
  { label: 'HarmonyOS Sans', value: 'HarmonyOS Sans' },
  { label: '思源黑体', value: 'Source Han Sans SC' },
  { label: 'Helvetica Neue', value: 'Helvetica Neue' },
  { label: 'Arial', value: 'Arial' }
];

const updateLayoutField = (key: 'x' | 'y' | 'width' | 'height', value: number | undefined) => {
  if (!element.value || value === undefined || Number.isNaN(Number(value))) return;
  store.updateElementLayout(element.value.id, { [key]: Number(value) }, { recordHistory: true });
};

const updateStyle = (style: Record<string, unknown>) => {
  if (!element.value) return;
  store.updateElementStyle(element.value.id, style);
};
</script>

<style scoped>
.property-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.property-panel__title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
}

.property-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.property-grid__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #4e5969;
}
</style>
