const backend = require('../../lib/backend/index')
const IDEAS_STORAGE_KEY = 'liangzhu_status_cards'

function readStoredIdeas() {
  try {
    return wx.getStorageSync(IDEAS_STORAGE_KEY) || []
  } catch (error) {
    return []
  }
}

Page({
  data: {
    person: null,
    statusCards: [],
    backendMode: 'mock',
    pageReady: false,
    pageLeaving: false
  },
  async onLoad(options) {
    const result = await backend.fetchPersonProfile(options.id)
    const isLocalProfile = result.person && (result.person.id === 'person-lynn' || result.person.name === 'Lynn')
    this.setData({
      person: result.person,
      statusCards: isLocalProfile ? readStoredIdeas() : [],
      backendMode: result.mode
    })
  },
  onShow() {
    if (this.data.person && (this.data.person.id === 'person-lynn' || this.data.person.name === 'Lynn')) {
      this.setData({ statusCards: readStoredIdeas() })
    }
    this.enterPage()
  },
  enterPage() {
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
  }
})
