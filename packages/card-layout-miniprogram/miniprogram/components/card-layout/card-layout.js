const { normalizeLayout } = require('../../utils/layout')

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    layout: {
      type: Object,
      value: null
    },
    data: {
      type: Object,
      value: null
    },
    width: {
      type: Number,
      value: null
    },
    autoFit: {
      type: Boolean,
      value: true
    }
  },
  data: {
    cardStyle: '',
    elements: [],
    viewportWidth: 0
  },
  lifetimes: {
    attached() {
      this.measureViewport()
    }
  },
  observers: {
    'layout,data,width,autoFit': function () {
      this.renderCard()
    }
  },
  methods: {
    measureViewport() {
      try {
        const info = wx.getSystemInfoSync()
        this.setData({ viewportWidth: info.windowWidth || 0 }, () => this.renderCard())
      } catch (error) {
        this.renderCard()
      }
    },
    resolveTargetWidth() {
      const { width, autoFit, viewportWidth, layout } = this.data
      if (typeof width === 'number' && width > 0) {
        return width
      }
      if (autoFit && viewportWidth) {
        return viewportWidth - 32
      }
      return layout?.width || 0
    },
    renderCard() {
      const { layout, data } = this.data
      if (!layout) {
        return
      }
      const targetWidth = this.resolveTargetWidth()
      if (!targetWidth) {
        return
      }
      const referenceWidth = targetWidth
      const { styleText, elements } = normalizeLayout(layout, data || {}, targetWidth, referenceWidth)
      this.setData({
        cardStyle: styleText,
        elements
      })
    }
  }
})
