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
    word: '主题',
    eyebrow: 'Topic',
    title: '像把自我这一角掀开',
    copy: '偏洋红的土地在最后一角发亮，让整句话带上一点主观温度。'
  }
]

const timeScopes = [
  { label: '今晚', value: '今晚', locked: false },
  { label: '本周', value: '本周', locked: true, badge: '会员' }
]

const timeSlots = [
  { label: '5:00-7:00', value: '5:00-7:00' },
  { label: '7:00-9:00', value: '7:00-9:00' },
  { label: '9:00 以后', value: '9:00 以后' },
  { label: '其他时间', value: '其他时间' }
]

const venueChoices = [
  { name: '泊光集', mood: '适合安静认真聊' },
  { name: '敞开酒馆', mood: '适合晚一点松弛聊' },
  { name: '猫客厅', mood: '适合轻松破冰' },
  { name: '香蕉小院', mood: '适合下午到黄昏' },
  { name: '好逢小屋', mood: '适合熟人感' },
  { name: '旷野公社', mood: '适合新想法碰撞' },
  { name: '良渚食堂', mood: '适合边吃边聊' },
  { name: '玉鸟咖啡', mood: '适合 Coffee Chat' },
  { name: '溪边长椅', mood: '适合散步后坐会儿' },
  { name: '村口小馆', mood: '适合临时起局' }
]

const formChoices = [
  { label: 'Coffee Chat', value: 'Coffee Chat' },
  { label: '吃饭', value: '吃饭' },
  { label: '散步', value: '散步' },
  { label: '随便坐坐', value: '随便坐坐' },
  { label: '其他形式', value: '其他形式' }
]

const capacityChoices = [
  { label: '限 4 人', value: '限 4 人' },
  { label: '限 6 人', value: '限 6 人' }
]

const promptChips = ['最近的状态', '想聊的方向', '一个问题', '今天的感受']

const defaultDraft = '我最近想聊聊 AI 为什么一边让人更高效，一边也更疲惫。'

const truncateText = (text, maxLength) => {
  const raw = (text || '').trim()
  if (!raw) return ''
  return raw.length > maxLength ? `${raw.slice(0, maxLength)}...` : raw
}

const splitTerrainText = (text, firstLineMax = 8) => {
  const raw = (text || '').trim()
  if (!raw) {
    return {
      line1: '',
      line2: ''
    }
  }
  if (raw.length <= firstLineMax) {
    return {
      line1: raw,
      line2: ''
    }
  }
  return {
    line1: raw.slice(0, firstLineMax),
    line2: raw.slice(firstLineMax)
  }
}

const buildConfirmedQuadrantCopy = (draft) => ({
  tonight: {
    line1: draft.timeScope,
    line2: draft.timeSlot
  },
  liangzhu: {
    line1: draft.venue,
    line2: ''
  },
  meet: {
    line1: draft.form,
    line2: draft.capacity
  },
  mine: splitTerrainText(truncateText(draft.topic || '输入主题', 24), 7)
})

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
    terrainCopy: '',
    activeLaunchPanel: '',
    timeScopes,
    timeSlots,
    venueChoices,
    formChoices,
    capacityChoices,
    launchDraft: {
      timeScope: '今晚',
      timeSlot: '7:00-9:00',
      venue: '泊光集',
      form: 'Coffee Chat',
      capacity: '限 4 人',
      topic: '',
      description: ''
    },
    confirmedQuadrantCopy: {}
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
        terrainCopy: '',
        activeLaunchPanel: ''
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
        terrainCopy: '',
        activeLaunchPanel: ''
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
        terrainCopy: '',
        activeLaunchPanel: ''
      })

      setTimeout(() => {
        this.setData({
          starfieldPhase: 'open',
          terrainTitle: '',
          terrainCopy: ''
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
          terrainCopy: '',
          activeLaunchPanel: ''
        })
      }, 260)
    },
    chooseTerrain(e) {
      const { key } = e.currentTarget.dataset || {}
      const next = terrainQuadrants.find((item) => item.key === key)
      if (!next) return
      this.setData({
        selectedTerrain: next.key,
        terrainTitle: '',
        terrainCopy: '',
        activeLaunchPanel: next.key
      })
    },
    closeLaunchPanel() {
      this.setData({
        activeLaunchPanel: '',
        selectedTerrain: ''
      })
    },
    switchLaunchPanel() {
      const currentIndex = terrainQuadrants.findIndex((item) => item.key === this.data.activeLaunchPanel)
      const next = terrainQuadrants[(currentIndex + 1 + terrainQuadrants.length) % terrainQuadrants.length]
      this.setData({
        activeLaunchPanel: next.key,
        selectedTerrain: next.key
      })
    },
    confirmLaunchSelection() {
      const confirmedQuadrantCopy = buildConfirmedQuadrantCopy(this.data.launchDraft)
      this.setData({
        confirmedQuadrantCopy,
        activeLaunchPanel: '',
        selectedTerrain: '',
        terrainTitle: '',
        terrainCopy: ''
      })
      wx.showToast({
        title: '已更新四块内容',
        icon: 'none'
      })
    },
    updateLaunchChoice(e) {
      const { field, value, locked } = e.currentTarget.dataset || {}
      if (!field || !value) return
      if (locked === true || locked === 'true') {
        wx.showToast({
          title: '会员可以提前升起本周的篝火',
          icon: 'none'
        })
        return
      }
      this.setData({
        [`launchDraft.${field}`]: value
      })
    },
    handlePickerScroll(e) {
      const { source, field, valueKey, itemHeight } = e.currentTarget.dataset || {}
      if (!source || !field || !valueKey) return
      const list = this.data[source] || []
      if (!list.length) return
      clearTimeout(this.pickerScrollTimer)
      const scrollTop = e.detail.scrollTop || 0
      this.pickerScrollTimer = setTimeout(() => {
        const height = Number(itemHeight) || 94
        const index = Math.max(0, Math.min(list.length - 1, Math.round(scrollTop / height)))
        const next = list[index]
        if (!next || next.locked) return
        this.setData({
          [`launchDraft.${field}`]: next[valueKey]
        })
      }, 120)
    },
    updateLaunchDraftText(e) {
      const { field } = e.currentTarget.dataset || {}
      if (!field) return
      this.setData({
        [`launchDraft.${field}`]: e.detail.value
      })
    },
    confirmQuadrantLaunch() {
      const draft = this.data.launchDraft
      wx.showToast({
        title: `这束火会在 ${draft.timeScope} ${draft.timeSlot} 升起`,
        icon: 'none'
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
        title: '这里接升起篝火提交流程',
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
        terrainCopy: '',
        activeLaunchPanel: ''
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
