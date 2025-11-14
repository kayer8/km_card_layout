<script setup lang="ts">
import { computed } from 'vue'
import type { MenuValue } from 'tdesign-vue-next'
import { useRoute, useRouter } from 'vue-router'

type MenuKey = 'styles' | 'background' | 'elements'

const route = useRoute()
const router = useRouter()

const defaultMenu: MenuKey = 'styles'
const menuPathMap: Record<MenuKey, string> = {
  styles: '/styles',
  background: '/background',
  elements: '/elements'
}

const activeMenu = computed<MenuKey>(() => (route.meta.menuKey as MenuKey) ?? defaultMenu)

const handleMenuChange = (value: MenuValue) => {
  const key = (value as MenuKey) ?? defaultMenu
  router.push(menuPathMap[key] ?? menuPathMap[defaultMenu])
}
</script>

<template>
  <div class="app-shell">
    <t-layout class="app-layout">
      <t-aside class="app-sider">
        <div class="brand">
          <span class="brand__logo">KM</span>
          <div>
            <p class="brand__name">KM Card Studio</p>
            <p class="brand__desc">名片体验中心</p>
          </div>
        </div>

        <t-menu :value="activeMenu" theme="light" @change="handleMenuChange">
          <t-menu-item value="styles">样式管理</t-menu-item>
          <t-menu-item value="background">背景管理</t-menu-item>
          <t-menu-item value="elements">内置元素管理</t-menu-item>
        </t-menu>
      </t-aside>

      <t-layout class="app-main">
        <t-content class="app-content">
          <router-view />
        </t-content>
      </t-layout>
    </t-layout>
  </div>
</template>

<style scoped>
  .app-shell {
    min-height: 100vh;
    background: linear-gradient(135deg, #f6f8fb 0%, #eef2ff 100%);
    font-family: 'Noto Sans', 'PingFang SC', 'Helvetica Neue', sans-serif;
    color: #1a202c;
  }

  .app-layout {
    min-height: 100vh;
  }

  .app-sider {
    width: 260px;
    padding: 32px 24px;
    background: #ffffff;
    border-right: 1px solid rgba(90, 107, 255, 0.1);
    box-shadow: 12px 0 40px rgba(90, 107, 255, 0.08);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
  }

  .brand__logo {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #5a6bff, #7c9dff);
    color: #fff;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .brand__name {
    margin: 0;
    font-weight: 600;
  }

  .brand__desc {
    margin: 0;
    color: #64748b;
    font-size: 0.88rem;
  }

  .app-main {
    background: transparent;
  }

  .app-content {
    padding: 32px 40px 40px;
    min-height: 100vh;
  }

  @media (max-width: 960px) {
    .app-layout {
      flex-direction: column;
    }

    .app-sider {
      width: 100%;
      box-shadow: none;
      border-right: none;
      border-bottom: 1px solid rgba(90, 107, 255, 0.1);
    }

    .app-content {
      padding: 24px;
    }
  }
</style>
