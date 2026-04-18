const backend = require('../../lib/backend/index')
const { presenceRooms } = require('../../data/mock')

const defaultRoom = presenceRooms[0]

Page({
  data: {
    room: defaultRoom,
    pageReady: false,
    pageLeaving: false,
    draft: '',
    backendMode: 'mock',
    sending: false
  },
  async onLoad(options) {
    const result = await backend.fetchPresenceRoom(options.id)
    const room = result.room || presenceRooms.find((item) => item.conversationId === options.id) || defaultRoom
    this.setData({
      room,
      backendMode: result.mode
    })
  },
  onShow() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  goBack() {
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateBack()
    }, 180)
  },
  onDraftInput(e) {
    this.setData({ draft: e.detail.value })
  },
  async sendDraft() {
    const draft = this.data.draft.trim()
    if (!draft || this.data.sending) return
    this.setData({ sending: true })
    try {
      const result = await backend.sendPresenceRoomMessage(this.data.room.conversationId, draft)
      this.setData({
        room: result.room,
        draft: '',
        backendMode: result.mode
      })
      wx.showToast({
        title: result.message,
        icon: 'none'
      })
    } finally {
      this.setData({ sending: false })
    }
  }
})
