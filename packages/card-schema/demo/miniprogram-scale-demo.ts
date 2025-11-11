import type { CardLayoutSchema } from '@km/card-schema'
import { scaleCardLayout } from '@km/card-schema'

// 假设这是从设计器导出的布局 JSON（只保留关键字段示例）
const designerSchema: CardLayoutSchema = {
  id: 'kuanmai-black-gold-mini',
  width: 343,
  height: 210,
  background: '#111',
  borderRadius: 20,
  padding: 20,
  elements: [
    {
      id: 'company',
      type: 'text',
      x: 20,
      y: 16,
      width: 280,
      height: 28,
      binding: 'user.company',
      style: {
        fontSize: 16,
        color: '#E2B96F'
      }
    }
  ]
}

// 小程序端：根据设备宽度计算展示宽度，并获得缩放后的 Schema
function renderInMiniProgram(schema: CardLayoutSchema, windowWidth: number) {
  const horizontalPadding = 32 // 自定义左右留白（rpx/px 均可）
  const targetWidth = Math.max(windowWidth - horizontalPadding, 200)

  const scaledSchema = scaleCardLayout(schema, {
    targetWidth,
    // 如果高度也有硬性要求可传 targetHeight，否则按等比缩放高度
  })

  console.log('[demo] scaled card width:', scaledSchema.width)
  console.log('[demo] first element x:', scaledSchema.elements[0].x)
  return scaledSchema
}

// 模拟调用，375 设计稿下预留 32px 内边距
renderInMiniProgram(designerSchema, 375)
