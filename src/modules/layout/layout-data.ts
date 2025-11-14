import { computed, reactive } from 'vue'

export interface UserProfile {
  company: string
  name: string
  title: string
  phone: string
  email: string
  address: string
  avatar: string
}

export interface LayoutBindingContext {
  user: UserProfile
}

// 默认用户信息，用于初始展示以及绑定示例
const createDefaultProfile = (): UserProfile => ({
  company: '合肥魅客网络有限公司',
  name: '名片示例',
  title: '高级产品经理',
  phone: '189****4399',
  email: 'km@kuanmai.com',
  address: '上海市浦东新区世纪大道210号企业中心15F',
  avatar: 'https://i.pravatar.cc/240?img=68'
})

// 负责维护绑定上下文（例如 user.*）并提供解析能力
export const createLayoutData = () => {
  const bindingContext = reactive<LayoutBindingContext>({
    user: createDefaultProfile()
  })

  // 将对象转成数组，方便在列表里直接渲染
  const bindingEntries = computed(() => Object.entries(bindingContext.user))

  // 通过 user.xxx 的链式路径读取绑定值
  const resolveBinding = (binding?: string): string | number | undefined => {
    if (!binding) return undefined
    return binding.split('.').reduce<any>((acc, key) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[key]
      }
      return undefined
    }, bindingContext) as string | number | undefined
  }

  return {
    bindingContext,
    bindingEntries,
    resolveBinding
  }
}

export type LayoutData = ReturnType<typeof createLayoutData>
