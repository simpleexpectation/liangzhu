const backend = require('../../lib/backend/index') as typeof import('../../lib/backend/index')

Page({
  data: {
    statusBarHeight: 44,
    activeSubtab: 'places',
    venues: [] as Array<any>,
    goodPeople: [] as Array<any>,
    goodPeopleRows: [] as Array<any>,
    backendMode: 'mock',
    pageReady: false,
    pageLeaving: false
  },
  async onLoad() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    const result = await backend.fetchBlackholeOverview()
    this.setData({
      statusBarHeight: info.statusBarHeight || 44,
      venues: result.venues,
      goodPeople: result.goodPeople,
      goodPeopleRows: result.goodPeopleRows,
      backendMode: result.mode
    })
  },
  onShow() {
    this.setData({
      pageLeaving: false,
      pageReady: false
    })
    this.syncTabBar()
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  syncTabBar() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && tabBar.sync) {
      tabBar.sync('/pages/blackhole/index', false)
    }
  },
  switchSubtab(e: WechatMiniprogram.BaseEvent) {
    const { tab } = e.currentTarget.dataset
    if (!tab || tab === this.data.activeSubtab) return
    this.setData({ activeSubtab: tab })
  },
  goVenueDetail(e: WechatMiniprogram.BaseEvent) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({ url: `/pages/venue-detail/index?id=${id}` })
  },
  openVenueRecommend() {
    backend.submitVenueRecommendation({
      venueName: '用户推荐空间',
      note: '来自黑洞页的快速推荐入口，后续会接正式表单。'
    }).then((result) => {
      wx.showToast({ title: result.message, icon: 'none' })
      this.setData({ backendMode: result.mode })
    })
  },
  openPerson(e: WechatMiniprogram.BaseEvent) {
    const { personId } = e.currentTarget.dataset
    if (!personId) return
    wx.navigateTo({ url: `/pages/person/index?id=${personId}` })
  }
})
