const backend = require('./lib/backend/index')

App({
  globalData: {
    systemInfo: null,
    backendMode: 'mock',
    currentUser: null,
    openingSeenInSession: false
  },
  async onLaunch() {
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo
    this.globalData.openingSeenInSession = false

    const bootstrap = await backend.bootstrapBackend()
    this.globalData.backendMode = bootstrap.mode

    const session = await backend.ensureCurrentUser()
    this.globalData.currentUser = session.user
    this.globalData.backendMode = session.mode
  }
})
