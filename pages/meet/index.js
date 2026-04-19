const backend = require('../../lib/backend/index')
const { attendeeCards, presenceConversations, presenceEvent } = require('../../data/mock')

const buildGlyphs = (text, step = 0.12) =>
  Array.from(text).map((glyph, index) => ({
    glyph,
    isSpace: glyph === ' ',
    delay: `${(index * step).toFixed(2)}s`
  }))

const sortPresenceConversations = (conversations) => {
  const recap = conversations.filter((item) => item.status === 'recap')
  const rest = conversations.filter((item) => item.status !== 'recap')
  return [...recap, ...rest].slice(0, 4)
}

const initialPresenceConversations = sortPresenceConversations(presenceConversations)
const initialSelectedConversationId =
  initialPresenceConversations.find((item) => item.status !== 'recap')?.id || initialPresenceConversations[0].id

const findConversationById = (conversations, conversationId) =>
  conversations.find((item) => item.id === conversationId) || null

Page({
  data: {
    statusBarHeight: 44,
    presenceEvent,
    presenceConversations: initialPresenceConversations,
    attendeeCards,
    immersiveCopyCn: buildGlyphs('此刻只需要慢慢在场', 0.1),
    immersiveCopyEn: buildGlyphs('Just be here in this moment', 0.08),
    qrMatrix: [
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
      [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1]
    ],
    presencePhase: 'before',
    enteringImmersive: false,
    showPassSheet: false,
    showRosterSheet: false,
    selectedConversationId: initialSelectedConversationId,
    pageReady: false,
    pageLeaving: false,
    backendMode: 'mock',
    loadingOverview: false,
    actingConversationId: ''
  },
  onLoad() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: info.statusBarHeight || 44
    })
  },
  async onShow() {
    this.setData({
      pageLeaving: false,
      pageReady: false,
      enteringImmersive: false,
      showPassSheet: false,
      showRosterSheet: false
    })
    await this.loadPresenceOverview()
    this.syncTabBar(this.data.presencePhase)
    setTimeout(() => { this.setData({ pageReady: true }) }, 20)
  },
  async loadPresenceOverview() {
    if (this.data.loadingOverview) return
    this.setData({ loadingOverview: true })
    try {
      const result = await backend.fetchPresenceOverview()
      const nextConversations = sortPresenceConversations(result.presenceConversations || [])
      const selectedConversationId = findConversationById(nextConversations, this.data.selectedConversationId)
        ? this.data.selectedConversationId
        : (nextConversations.find((item) => item.status !== 'recap')?.id || nextConversations[0]?.id || '')

      this.setData({
        presenceEvent: result.presenceEvent,
        attendeeCards: result.attendeeCards,
        presenceConversations: nextConversations,
        selectedConversationId,
        backendMode: result.mode
      })
    } finally {
      this.setData({ loadingOverview: false })
    }
  },
  enterImmersive(e) {
    if (this.data.enteringImmersive) return
    const { id } = e.currentTarget.dataset || {}
    this.setData({
      selectedConversationId: id || this.data.selectedConversationId,
      enteringImmersive: true
    })
    setTimeout(() => {
      this.setData({
        enteringImmersive: false,
        presencePhase: 'during'
      })
      this.syncTabBar('during')
    }, 880)
  },
  exitImmersive() {
    this.setData({
      enteringImmersive: false,
      presencePhase: 'before'
    })
    this.syncTabBar('before')
  },
  openPassSheet() {
    this.setData({ showPassSheet: true })
  },
  closePassSheet() {
    this.setData({ showPassSheet: false })
  },
  openRosterSheet(e) {
    const { id } = e.currentTarget.dataset || {}
    this.setData({
      showRosterSheet: true,
      selectedConversationId: id || this.data.selectedConversationId
    })
  },
  closeRosterSheet() {
    this.setData({ showRosterSheet: false })
  },
  openPresenceRoom(e) {
    const { id } = e.currentTarget.dataset || {}
    if (!id) return
    const conversation = findConversationById(this.data.presenceConversations, id)
    if (!conversation || !conversation.roomReady || conversation.status !== 'confirmed') return
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: `/pages/presence-room/index?id=${id}` })
    }, 180)
  },
  selectConversation(e) {
    const { id } = e.currentTarget.dataset || {}
    if (!id) return
    this.setData({ selectedConversationId: id })
  },
  async approveApplicant(e) {
    const { id } = e.currentTarget.dataset || {}
    if (!id || this.data.actingConversationId) return
    this.setData({ actingConversationId: id })
    try {
      const result = await backend.decidePresenceConversation(id, 'approve')
      await this.loadPresenceOverview()
      this.setData({
        selectedConversationId: id,
        backendMode: result.mode
      })
      wx.showToast({ title: result.message, icon: 'none' })
    } finally {
      this.setData({ actingConversationId: '' })
    }
  },
  async rejectApplicant(e) {
    const { id } = e.currentTarget.dataset || {}
    if (!id || this.data.actingConversationId) return
    this.setData({ actingConversationId: id })
    try {
      const result = await backend.decidePresenceConversation(id, 'reject')
      await this.loadPresenceOverview()
      this.setData({
        selectedConversationId: id,
        backendMode: result.mode
      })
      wx.showToast({ title: result.message, icon: 'none' })
    } finally {
      this.setData({ actingConversationId: '' })
    }
  },
  syncTabBar(phase) {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && tabBar.sync) {
      tabBar.sync('/pages/meet/index', phase === 'during')
    }
  },
  async completeSession() {
    const currentId = this.data.selectedConversationId
    if (!currentId || this.data.actingConversationId) return
    this.setData({ actingConversationId: currentId })
    try {
      const result = await backend.completePresenceConversation(currentId)
      await this.loadPresenceOverview()
      this.setData({
        presencePhase: 'before',
        enteringImmersive: false,
        showPassSheet: false,
        showRosterSheet: false,
        backendMode: result.mode
      })
      this.syncTabBar('before')
      wx.showToast({ title: result.message, icon: 'none' })
    } finally {
      this.setData({ actingConversationId: '' })
    }
  },
  createMoment() {
    const currentId = this.data.selectedConversationId
    if (!currentId) return
    backend.createMomentFromConversation(currentId).then((result) => {
      this.setData({ backendMode: result.mode })
      wx.showToast({ title: result.message, icon: 'none' })
      if (result.event && result.event.id) {
        wx.navigateTo({ url: `/pages/event-detail/index?id=${result.event.id}&source=profile` })
      }
    })
  }
})
