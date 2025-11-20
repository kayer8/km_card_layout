<template>
  <div
    class="zoom-wrapper"
    @wheel="onWheel"
  >
    <div
      class="zoom-content"
      :style="contentStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  /* 双向绑定用，比如 v-model="scale" */
  modelValue: {
    type: Number,
    default: 1
  },
  /* 最小缩放 */
  minScale: {
    type: Number,
    default: 0.3
  },
  /* 最大缩放 */
  maxScale: {
    type: Number,
    default: 3
  },
  /* 每次滚轮缩放步长 */
  step: {
    type: Number,
    default: 0.1
  },
  /* 是否必须按住 Ctrl 才缩放，避免影响页面滚动 */
  requireCtrl: {
    type: Boolean,
    default: false
  },
  /* 缩放基点，默认左上角，你也可以传 'center center' 等 */
  transformOrigin: {
    type: String,
    default: 'top left'
  }
})

const emit = defineEmits(['update:modelValue', 'scale-change'])

const scale = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    if (val !== scale.value) {
      scale.value = val
    }
  }
)

const contentStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: props.transformOrigin,
  willChange: 'transform'
}))

const onWheel = (e) => {
  // 如果需要按住 Ctrl 才缩放
  if (props.requireCtrl && !e.ctrlKey) return

  e.preventDefault()

  const delta = e.deltaY > 0 ? -props.step : props.step
  let next = scale.value + delta
  next = Math.min(props.maxScale, Math.max(props.minScale, next))

  scale.value = next
  emit('update:modelValue', next)
  emit('scale-change', next)
}
</script>

<style scoped>
.zoom-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  /* 你也可以这里用 flex 居中 slot 内容 */
  /* display: flex;
  align-items: center;
  justify-content: center; */
}

.zoom-content {
  /* 内容本身的宽高由 slot 里控制，组件不管 */
  transform-origin: top left;
}
</style>
