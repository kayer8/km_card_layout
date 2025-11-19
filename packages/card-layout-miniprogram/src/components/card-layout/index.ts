import type { CardElement, CardLayoutSchema } from '../../utils/card-schema'

type LayoutData = Record<string, any>

interface RenderElement {
  id: string
  type: CardElement['type']
  style: string
  text: string
  src?: string
  iconChar?: string
}

const formatLengthValue = (value: string | number | undefined): string | undefined => {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'number') return `${value}rpx`
  return value
}

const toKebabCase = (key: string) => key.replace(/([A-Z])/g, '-$1').toLowerCase()

const LENGTH_STYLE_KEYS = new Set([
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'borderRadius',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'gap',
  'width',
  'height',
  'top',
  'left',
  'right',
  'bottom'
])

const formatStyleEntryValue = (key: string, value: string | number | undefined): string | undefined => {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'number' && LENGTH_STYLE_KEYS.has(key)) {
    return `${value}rpx`
  }
  return typeof value === 'number' ? String(value) : value
}

const resolveBinding = (binding: string | undefined, data: LayoutData) => {
  if (!binding) return undefined
  return binding.split('.').reduce<any>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return acc[key]
    }
    return undefined
  }, data)
}

const ICON_MAP: Record<string, string> = {
  'buy-vip-13': '\ue66a',
  'buy-vip-11': '\ue669',
  'buy-vip-12': '\ue668',
  'contact-wechat': '\ue667',
  'contact-phone': '\ue666',
  'column-group': '\ue664',
  minichat: '\ue617',
  'remove-module': '\ue660',
  'add-module': '\ue662',
  drag: '\ue661',
  'switch-company': '\ue65f',
  'switch-person': '\ue65e',
  'manual-entry': '\ue65d',
  play: '\ue65c',
  plus: '\ue659',
  'file-pdf': '\ue65b',
  'file-video': '\ue65a',
  upload: '\ue650',
  'cert-company': '\ue64f',
  'qr-code': '\ue658',
  'company-card': '\ue657',
  'card-import': '\ue64e',
  camera: '\ue655',
  'card-apply': '\ue632',
  'check-2': '\ue616',
  check: '\ue614',
  'buy-vip-4': '\ue613',
  'buy-vip-10': '\ue656',
  'weixin-2': '\ue653',
  'qrcode-1': '\ue654',
  local: '\ue652',
  'cert-job': '\ue64d',
  'cert-name': '\ue651',
  'card-style-1': '\ue64c',
  'add-pic': '\ue646',
  'add-text': '\ue647',
  'buy-vip-2': '\ue648',
  'company-upload-logo': '\ue649',
  'Headset-one': '\ue64a',
  'edit-info': '\ue64b',
  'more-action': '\ue645',
  'upload-video': '\ue644',
  'upload-image': '\ue643',
  'company-info': '\ue62a',
  contact: '\ue642',
  'notice-1': '\ue641',
  visitor: '\ue640',
  'mobile-2': '\ue63e',
  'weixin-1': '\ue63f',
  share: '\ue63d',
  'refund-mistake': '\ue637',
  'buy-vip-7': '\ue63b',
  'table-import': '\ue63c',
  misService: '\ue63a',
  'buy-vip-6': '\ue634',
  import: '\ue638',
  download: '\ue639',
  image: '\ue636',
  'buy-vip-9': '\ue635',
  'buy-vip-5': '\ue62f',
  'buy-vip-3': '\ue630',
  'buy-vip-1': '\ue631',
  'buy-vip-8': '\ue633',
  companyWx: '\ue62b',
  dingding: '\ue62c',
  shui: '\ue62d',
  gongzhang: '\ue62e',
  wait: '\ue629',
  addImg: '\ue628',
  copy: '\ue625',
  'mobile-1': '\ue627',
  'functional-config': '\ue604',
  'module-config': '\ue601',
  'select-right': '\ue626',
  like: '\ue624',
  weixin: '\ue620',
  'column-user': '\ue621',
  'column-card': '\ue622',
  'column-company-card': '\ue623',
  'on-job': '\ue61e',
  person: '\ue61f',
  wallet: '\ue615',
  opinion: '\ue618',
  'sys-set': '\ue619',
  'sys-msg': '\ue61d',
  add: '\ue61a',
  search: '\ue61b',
  delete: '\ue61c',
  enter: '\ue60f',
  'card-style': '\ue610',
  switch: '\ue612',
  'card-edit': '\ue60a',
  close: '\ue60d',
  notice: '\ue611',
  edit: '\ue60b',
  'help-info': '\ue60c',
  'tag-filtering': '\ue60e',
  'kuanmai-logo': '\ue603',
  company: '\ue606',
  email: '\ue607',
  round: '\ue608',
  address: '\ue609',
  mobile: '\ue602',
  helper: '\ue663',
  bag: '\ue605',
  group: '\ue665'
}

const getIconChar = (name?: string) => {
  if (!name) return ''
  const key = name.startsWith('icon-') ? name.replace(/^icon-/, '') : name
  return ICON_MAP[key] ?? ''
}

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    layout: {
      type: Object,
      value: {}
    },
    data: {
      type: Object,
      value: {}
    }
  },
  data: {
    containerStyle: '',
    elements: [] as RenderElement[]
  },
  observers: {
    layout() {
      this.rebuild()
    },
    data() {
      this.rebuild()
    }
  },
  lifetimes: {
    attached() {
      this.rebuild()
    }
  },
  methods: {
    rebuild() {
      const layout = this.data.layout as CardLayoutSchema | null
      if (!layout || !layout.width) {
        this.setData({ containerStyle: '', elements: [] })
        return
      }

      const baseStyle: string[] = [
        `width:${formatLengthValue(layout.width) || '0rpx'}`,
        `height:${formatLengthValue(layout.height) || '0rpx'}`,
        `background:#111`,
        `border-radius:${formatLengthValue(layout.borderRadius) || '0rpx'}`,
        `box-sizing:border-box`
      ]

      if (layout.backgroundImage) {
        baseStyle.push(
          `background-image:url(${layout.backgroundImage})`,
          'background-size:cover',
          'background-repeat:no-repeat'
        )
      }

      const rendered: RenderElement[] = (layout.elements || [])
        .filter((element) => element.visible !== false)
        .map((element: CardElement) => {
        const styles: string[] = [
          `left:${formatLengthValue(element.x) || '0rpx'}`,
          `top:${formatLengthValue(element.y) || '0rpx'}`
        ]
        if (element.width !== undefined) styles.push(`width:${formatLengthValue(element.width)}`)
        if (element.height !== undefined) styles.push(`height:${formatLengthValue(element.height)}`)
        if (element.rotation) styles.push(`transform:rotate(${element.rotation}deg)`)
        if (element.zIndex !== undefined) styles.push(`z-index:${element.zIndex}`)

        const styleEntries = element.style ? Object.keys(element.style) : []
        for (let i = 0; i < styleEntries.length; i += 1) {
          const key = styleEntries[i]
          const value = (element.style as Record<string, string | number | undefined>)[key]
          const formatted = formatStyleEntryValue(key, value)
          if (formatted !== undefined) {
            styles.push(`${toKebabCase(key)}:${formatted}`)
          }
        }

        if (element.type === 'text') {
          const align = element.style?.textAlign
          const justify = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
          if (align) styles.push(`text-align:${align}`)
          styles.push(`justify-content:${justify}`)
          const hasLineHeight = !!(element.style && 'lineHeight' in element.style)
          if (!hasLineHeight) {
            styles.push('line-height:1.3')
          }
        }

        const boundValue = resolveBinding(element.binding, this.data.data as LayoutData)
        const textual =
          typeof boundValue === 'string' || typeof boundValue === 'number'
            ? String(boundValue)
            : ''

        return {
          id: element.id,
          type: element.type,
          style: styles.join(';'),
          text: textual,
          src: element.type === 'image' && typeof boundValue === 'string' && boundValue ? boundValue : undefined,
          iconChar:
            element.type === 'icon' && (!element.src || element.src === '')
              ? getIconChar(element.name)
              : undefined
        }
      })

      this.setData({
        containerStyle: baseStyle.join(';'),
        elements: rendered
      })
    }
  }
})
