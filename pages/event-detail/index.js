const backend = require('../../lib/backend/index')

Page({
  data: {
    event: null,
    detailMode: 'official',
    noShowCount: 2,
    showRsvpModal: false,
    statusBarHeight: 0,
    pressedFooterAction: '',
    backendMode: 'mock',
    pageReady: false,
    pageLeaving: false
  },
  async onLoad(options) {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const result = await backend.fetchEventDetail({
      id: options.id,
      source: options.source
    })
    this.setData({
      event: result.event,
      detailMode: result.detailMode,
      statusBarHeight: info.statusBarHeight || 0,
      backendMode: result.mode
    })
  },
  onShow() {
    this.enterPage()
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  pressFooterAction(e) {
    const { action } = e.currentTarget.dataset
    if (!action) return
    this.setData({ pressedFooterAction: action })
  },
  releaseFooterAction() {
    if (!this.data.pressedFooterAction) return
    this.setData({ pressedFooterAction: '' })
  },
  goBack() {
    this.releaseFooterAction()
    wx.navigateBack()
  },
  openRsvpModal() {
    this.releaseFooterAction()
    this.setData({ showRsvpModal: true })
  },
  closeRsvpModal() {
    this.setData({ showRsvpModal: false })
  },
  confirmRsvp() {
    const id = this.data.event && this.data.event.id
    if (!id) return
    backend.rsvpEvent({
      id,
      source: this.data.detailMode
    }).then((result) => {
      this.setData({
        showRsvpModal: false,
        backendMode: result.mode
      })
      wx.showToast({ title: '已在火边留位', icon: 'success', duration: 1800 })
    })
  },
  pinEventToCard() {
    this.releaseFooterAction()
    const id = this.data.event && this.data.event.id
    if (!id) return
    backend.pinEvent({
      id,
      source: this.data.detailMode
    }).then((result) => {
      this.setData({ backendMode: result.mode })
      wx.showToast({ title: result.message, icon: 'none' })
    })
  },
  enterBlackhole() {
    this.releaseFooterAction()
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/blackhole/index' })
    }, 180)
  }
})
