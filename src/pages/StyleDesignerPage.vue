<script setup lang="ts">
import { useRouter } from 'vue-router'
import DesignerPage from './DesignerPage.vue'

const router = useRouter()
const goBack = () => {
  router.push('/styles')
}
</script>

<template>
  <section class="designer-screen">
    <div class="designer-hero">
      <h1>样式设计</h1>
      <t-button variant="outline" @click="goBack">返回样式列表</t-button>
    </div>

    <div class="designer-shell">
      <DesignerPage />
    </div>
  </section>
</template>

<style scoped>
  .designer-screen {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: #f3f6fb;
    padding: 24px 28px 32px;
    color: #1a2235;
  }

  .designer-hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    color: #111a3a;
  }

  .designer-shell {
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(20, 44, 99, 0.12);
    border: 1px solid rgba(90, 107, 255, 0.08);
    overflow: hidden;
  }

  @media (max-width: 900px) {
    .designer-screen {
      padding: 24px;
    }

    .designer-hero {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
