const backend = require('../../lib/backend/index')

Page({
  data: {
    topic: null,
    statusBarHeight: 0,
    isSubmitting: false,
    showSignupConfirm: false,
    backendMode: 'mock',
    pageReady: false,
    pageLeaving: false
  },
  async onLoad(options) {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const result = await backend.fetchTopicDetail(options.id)
    this.setData({
      topic: result.topic,
      backendMode: result.mode,
      statusBarHeight: info.statusBarHeight || 0
    })
  },
  onShow() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  goBack() {
    wx.navigateBack()
  },
  applyToJoin() {
    if (this.data.isSubmitting) return
    this.setData({ showSignupConfirm: true })
  },
  closeSignupConfirm() {
    if (this.data.isSubmitting) return
    this.setData({ showSignupConfirm: false })
  },
  async confirmApplyToJoin() {
    const topicId = this.data.topic && this.data.topic.id
    if (!topicId || this.data.isSubmitting) return
    this.setData({ isSubmitting: true })
    try {
      await backend.applyToTopic(topicId)
      this.setData({ showSignupConfirm: false })
      wx.showToast({ title: '已在火边留位', icon: 'none' })
    } finally {
      this.setData({ isSubmitting: false })
    }
  },
  goMemberCard(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/person/index?id=${id}` })
  }
})
