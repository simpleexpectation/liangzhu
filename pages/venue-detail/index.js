const backend = require('../../lib/backend/index')

Page({
  data: {
    venue: null,
    venueTopics: [],
    venueTodayMood: '',
    statusBarHeight: 44,
    backendMode: 'mock',
    pageReady: false,
    pageLeaving: false
  },
  async onLoad(query) {
    const systemInfo = wx.getSystemInfoSync()
    const result = await backend.fetchVenueDetail(query.id)
    this.setData({
      venue: result.venue,
      venueTopics: result.venueTopics,
      venueTodayMood: result.venueTodayMood,
      statusBarHeight: systemInfo.statusBarHeight || 44,
      backendMode: result.mode
    })
  },
  onShow() {
    this.enterPage()
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  goBack() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack()
      return
    }
    wx.switchTab({ url: '/pages/card/index' })
  },
  goTopicDetail(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/topic-detail/index?id=${id}` })
    }, 180)
  }
})
