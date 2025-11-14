import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import StylesListPage from '../pages/StylesListPage.vue'
import BackgroundListPage from '../pages/BackgroundListPage.vue'
import ElementsListPage from '../pages/ElementsListPage.vue'
import StyleDesignerPage from '../pages/StyleDesignerPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: '',
          redirect: '/styles'
        },
        {
          path: '/styles',
          name: 'styles-list',
          component: StylesListPage,
          meta: {
            menuKey: 'styles'
          }
        },
        {
          path: '/background',
          name: 'background',
          component: BackgroundListPage,
          meta: {
            menuKey: 'background'
          }
        },
        {
          path: '/elements',
          name: 'elements',
          component: ElementsListPage,
          meta: {
            menuKey: 'elements'
          }
        }
      ]
    },
    {
      path: '/style-designer',
      name: 'style-designer',
      component: StyleDesignerPage
    }
  ]
})

export default router
