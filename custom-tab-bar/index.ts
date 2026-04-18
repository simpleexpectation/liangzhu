const tabs = [
  { text: '今晚', pagePath: '/pages/card/index', icon: '今' },
  { text: '良渚', pagePath: '/pages/blackhole/index', icon: '良' },
  { text: '见面', pagePath: '/pages/meet/index', icon: '见' },
  { text: '我的', pagePath: '/pages/profile/index', icon: '我' }
]

const terrainQuadrants = [
  {
    key: 'tonight',
    word: '今晚',
    eyebrow: 'Tonight',
    title: '像今晚忽然被点亮',
    copy: '偏电光黄的地表像刚被一颗星砸亮，整块空气都开始发热。'
  },
  {
    key: 'liangzhu',
    word: '良渚',
    eyebrow: 'Liangzhu',
    title: '像一块发光水域展开',
    copy: '青绿和湖蓝向外漫开，像地点本身从地底升上来。'
  },
  {
    key: 'meet',
    word: '见面',
    eyebrow: 'Meet',
    title: '像动作把人拉近',
    copy: '热橙和珊瑚红碰撞起来，像“见面”这件事先于内容发生。'
  },
  {
    key: 'mine',
    word: '我的',
    eyebrow: 'Mine',
    title: '像把自我这一角掀开',
    copy: '偏洋红的土地在最后一角发亮，让整句话带上一点主观温度。'
  }
]

const promptChips = ['最近的状态', '想聊的方向', '一个问题', '今天的感受']

const defaultDraft = '我最近想聊聊 AI 为什么一边让人更高效，一边也更疲惫。'

const buildAutofillPayload = (draft) => {
  const raw = (draft || '').trim() || defaultDraft
  const online = /AI|线上|远程|工具|互联网|产品|技术/.test(raw)

  return {
    topic: raw.includes('在场')
      ? '真正的在场'
      : raw.includes('AI')
        ? 'AI 让人更高效了，为什么也更疲惫了？'
        : '一个值得认真聊聊的问题',
    reason: raw.includes('AI')
      ? '我想聊聊一种越来越明显的体感：当 AI 让一切更高效之后，人为什么反而更容易分散、疲惫。'
      : '我想从一个最近反复想到的状态开始，把它变成一场别人也愿意加入的对话。',
    time: online ? '本周内' : '周六下午',
    launchMode: online ? 'online' : 'offline',
    venue: online ? '线上优先' : '杭州',
    platform: '微信群 / 线上房间',
    joinHint: '发起后自动带出加入方式'
  }
}

Component({
  data: {
    selected: 0,
    tabs,
    hidden: false,
    showFab: false,
    composerOpen: false,
    launchSheetOpen: false,
    promptChips,
    draft: defaultDraft,
    launching: false,
    launchMode: 'online',
    launchForm: {
      topic: '',
      reason: '',
      time: '',
      venue: '',
      platform: '',
      joinHint: ''
    },
    launchModeLabel: '方式',
    launchModeField: 'platform',
    launchModeValue: '',
    launchModePlaceholder: '微信群 / 线上房间',
    launchJoinCopy: '开放加入',
    starfieldOpen: false,
    starfieldPhase: '',
    selectedTerrain: '',
    terrainQuadrants,
    terrainTitle: '',
    terrainCopy: ''
  },
  methods: {
    noop() {},
    sync(route, hidden) {
      const currentRoute = route || '/pages/card/index'
      const selected = tabs.findIndex((item) => item.pagePath === currentRoute)
      const showFab = !hidden && currentRoute === '/pages/card/index'
      this.setData({
        selected: selected >= 0 ? selected : 0,
        hidden: !!hidden,
        showFab,
        composerOpen: false,
        launchSheetOpen: false,
        starfieldOpen: false,
        starfieldPhase: '',
        selectedTerrain: '',
        terrainTitle: '',
        terrainCopy: ''
      })
    },
    setHidden(hidden) {
      this.setData({ hidden: !!hidden })
    },
    toggleComposer() {
      this.setData({
        composerOpen: !this.data.composerOpen,
        launchSheetOpen: false
      })
    },
    closeComposer() {
      this.setData({ composerOpen: false })
    },
    closeLaunchSheet() {
      this.setData({ launchSheetOpen: false })
    },
    closeOverlay() {
      this.setData({
        composerOpen: false,
        launchSheetOpen: false,
        starfieldOpen: false,
        starfieldPhase: '',
        selectedTerrain: '',
        terrainTitle: '',
        terrainCopy: ''
      })
    },
    openStarfield() {
      if (this.data.starfieldOpen) return
      this.setData({
        composerOpen: false,
        launchSheetOpen: false,
        starfieldOpen: true,
        starfieldPhase: 'impact',
        selectedTerrain: '',
        terrainTitle: '',
        terrainCopy: ''
      })

      setTimeout(() => {
        this.setData({
          starfieldPhase: 'open',
          terrainTitle: '四块土地已经展开',
          terrainCopy: '现在不是选功能，而是在选你想从哪种气候进入这句话。'
        })
      }, 520)
    },
    closeStarfield() {
      this.setData({
        starfieldPhase: 'closing'
      })

      setTimeout(() => {
        this.setData({
          starfieldOpen: false,
          starfieldPhase: '',
          selectedTerrain: '',
          terrainTitle: '',
          terrainCopy: ''
        })
      }, 260)
    },
    chooseTerrain(e) {
      const { key } = e.currentTarget.dataset || {}
      const next = terrainQuadrants.find((item) => item.key === key)
      if (!next) return
      this.setData({
        selectedTerrain: next.key,
        terrainTitle: next.title,
        terrainCopy: next.copy
      })
    },
    cycleTerrain() {
      const currentIndex = terrainQuadrants.findIndex((item) => item.key === this.data.selectedTerrain)
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % terrainQuadrants.length : 0
      const next = terrainQuadrants[nextIndex]
      this.setData({
        selectedTerrain: next.key,
        terrainTitle: next.title,
        terrainCopy: next.copy
      })
    },
    updateDraft(e) {
      this.setData({ draft: e.detail.value })
    },
    appendPrompt(e) {
      const { value } = e.currentTarget.dataset || {}
      if (!value) return
      const nextDraft = this.data.draft.trim() ? `${this.data.draft}\n${value}：` : `${value}：`
      this.setData({ draft: nextDraft })
    },
    startVoiceInput() {
      const voiceDraft = this.data.draft.trim()
        ? `${this.data.draft}\n我刚刚补充了一段语音，想表达最近这个主题为什么值得聊。`
        : '我刚刚补充了一段语音，想表达最近这个主题为什么值得聊。'
      this.setData({ draft: voiceDraft })
      wx.showToast({
        title: '这里接语音转文字输入',
        icon: 'none'
      })
    },
    openLaunchSheet(withAutofill) {
      const payload = withAutofill ? buildAutofillPayload(this.data.draft) : {
        topic: '',
        reason: '',
        time: '',
        launchMode: 'online',
        venue: '',
        platform: '',
        joinHint: ''
      }

      const isOnline = payload.launchMode === 'online'
      this.setData({
        composerOpen: false,
        launchSheetOpen: true,
        launchMode: payload.launchMode,
        launchForm: {
          topic: payload.topic,
          reason: payload.reason,
          time: payload.time,
          venue: payload.venue,
          platform: payload.platform,
          joinHint: payload.joinHint
        },
        launchModeLabel: isOnline ? '方式' : '地点',
        launchModeField: isOnline ? 'platform' : 'venue',
        launchModeValue: isOnline ? payload.platform : payload.venue,
        launchModePlaceholder: isOnline ? '微信群 / 线上房间' : '杭州',
        launchJoinCopy: '开放加入'
      })
    },
    updateLaunchField(e) {
      const { field } = e.currentTarget.dataset || {}
      if (!field) return
      const value = e.detail.value
      this.setData({
        [`launchForm.${field}`]: value
      })
      if (field === this.data.launchModeField) {
        this.setData({ launchModeValue: value })
      }
    },
    backToComposer() {
      this.setData({
        launchSheetOpen: false,
        composerOpen: true
      })
    },
    startAutofill() {
      this.openLaunchSheet(true)
    },
    skipEntry() {
      this.openLaunchSheet(false)
    },
    confirmLaunch() {
      wx.showToast({
        title: '这里接直接发起提交流程',
        icon: 'none'
      })
      this.setData({
        composerOpen: false,
        launchSheetOpen: false
      })
    },
    switchTab(e) {
      const { path, index } = e.currentTarget.dataset
      const showFab = path === '/pages/card/index'
      this.setData({
        selected: index,
        showFab,
        composerOpen: false,
        launchSheetOpen: false,
        starfieldOpen: false,
        starfieldPhase: '',
        selectedTerrain: '',
        terrainTitle: '',
        terrainCopy: ''
      })
      wx.switchTab({ url: path })
    }
  },
  lifetimes: {
    attached() {
      const pages = getCurrentPages()
      const current = pages[pages.length - 1]
      const currentRoute = `/${(current && current.route) || 'pages/card/index'}`
      this.sync(currentRoute, currentRoute === '/pages/blackhole/index')
    }
  }
})
