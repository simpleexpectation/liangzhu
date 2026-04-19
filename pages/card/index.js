const backend = require('../../lib/backend/index')
const { attendeeCards } = require('../../data/mock')
const stateKeywords = ['松弛', '节奏', '创作', '表达', 'AI', '关系']

const openingGuidePages = [
  {
    key: 'review',
    lines: [
      '走近之前，',
      '先让我们看见你一点。',
      '',
      '从自己的屋子里出来，',
      '走到火堆边，',
      '总要先带上一点自己。',
      '',
      '只要留下几条线索：',
      '最近在想什么，',
      '你是对哪些事物',
      '保持着充足好奇的人。',
      '',
      '我们会把这些回答，',
      '整理成你的个人信息卡。'
    ],
    buttons: [
      {
        text: '现在填写',
        action: 'startAnswer'
      },
      {
        text: '跳过以后填写',
        action: 'skipForNow'
      }
    ]
  },
  {
    key: 'recommend',
    lines: [
      '火光亮起来之后，',
      '不用立刻走进人群。',
      '',
      '我们先替你找一处',
      '适合坐下来的位置。',
      '',
      '也许只是几个人，',
      '在不太吵的地方，',
      '认真聊一会儿。',
      '',
      '今晚良渚，',
      '先见一面。'
    ],
    action: '下一页',
    buttons: [
      {
        text: '看看这场',
        action: 'join'
      }
    ]
  }
]

const sortTopicsByDate = (topics, selectedDateKey = '') => {
  const getDayValue = (dateKey) => new Date(dateKey).getTime()
  if (!selectedDateKey) {
    return [...topics].sort((a, b) => getDayValue(a.dateKey) - getDayValue(b.dateKey))
  }
  const target = getDayValue(selectedDateKey)
  return [...topics].sort((a, b) => {
    const aTime = getDayValue(a.dateKey)
    const bTime = getDayValue(b.dateKey)
    const aMatch = a.dateKey === selectedDateKey ? 0 : 1
    const bMatch = b.dateKey === selectedDateKey ? 0 : 1
    if (aMatch !== bMatch) return aMatch - bMatch
    const aFutureBucket = aTime >= target ? 0 : 1
    const bFutureBucket = bTime >= target ? 0 : 1
    if (aFutureBucket !== bFutureBucket) return aFutureBucket - bFutureBucket
    if (aFutureBucket === 0 && aTime !== bTime) return aTime - bTime
    if (aFutureBucket === 1 && aTime !== bTime) return bTime - aTime
    return aTime - bTime
  })
}

const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六']

const formatDateKey = (date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const buildVenueCards = (venues) => {
  const now = new Date()
  const monthLabel = `${now.getMonth() + 1}月`
  const dayLabel = `${now.getDate()}`
  const todayCopy = `今天 · 周${weekdayLabels[now.getDay()]}`

  return venues.map((venue) => ({
    ...venue,
    monthLabel,
    dayLabel,
    dateCopy: todayCopy
  }))
}

const buildCalendarDays = (topics) => {
  const topicDateSet = new Set(topics.map((item) => item.dateKey))
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sourceDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    return formatDateKey(date)
  })

  return sourceDates.map((dateKey) => {
    const date = new Date(dateKey)
    return {
      key: dateKey,
      day: `${date.getDate()}`,
      weekday: weekdayLabels[date.getDay()],
      hasTopic: topicDateSet.has(dateKey)
    }
  })
}

const scoreTopicByState = (topic) => {
  const source = `${topic.title} ${(topic.tags || []).join(' ')} ${topic.location || ''}`
  return stateKeywords.reduce((score, keyword) => score + (source.includes(keyword) ? 3 : 0), 0) + Math.max(0, 10 - topic.current)
}

const buildRecommendedTopics = (topics) => [...topics]
  .sort((left, right) => {
    const scoreDiff = scoreTopicByState(right) - scoreTopicByState(left)
    if (scoreDiff !== 0) return scoreDiff
    return new Date(left.dateKey).getTime() - new Date(right.dateKey).getTime()
  })
  .slice(0, 3)

const buildWeekTopics = (topics, selectedDateKey = '') => {
  const sorted = sortTopicsByDate(topics, selectedDateKey)
  if (!selectedDateKey) return sorted.slice(0, 6)
  const exactMatches = sorted.filter((item) => item.dateKey === selectedDateKey)
  return exactMatches
}

const isHorizontalSwipe = (startX, startY, endX, endY) => {
  const dx = endX - startX
  const dy = endY - startY
  return Math.abs(dx) > 72 && Math.abs(dx) > Math.abs(dy) * 1.35
}

Page({
  data: {
    topics: [],
    visibleTopics: [],
    weekTopics: [],
    recommendedTopics: [],
    attendeeCards,
    activeTab: 'tonight',
    activeTabIndex: 0,
    realityCurrent: 0,
    fullCalendarDays: [],
    calendarDays: [],
    nextWeekDays: [],
    showCalendar: false,
    selectedDateKey: '',
    pressedDateKey: '',
    pressedToggle: false,
    pressedTopicId: '',
    pressedJoinId: '',
    stateFocus: {
      eyebrow: 'Based on your current state',
      title: '先不推一个信息流，只先给你三个更适合今晚进入的线下对话',
      copy: '结合你最近「练习更松弛地创作」的状态，我们先把入口收窄，帮你更轻地迈出去。',
      tags: ['创作松弛', '表达欲', 'AI 与关系']
    },
    backendMode: 'mock',
    isLoading: true,
    pageReady: false,
    pageLeaving: false,
    showOpening: false,
    openingLeaving: false,
    openingStage: 'origin',
    openingGuideLeaving: false,
    openingGuideMotion: 'a',
    openingGuideIndex: 0,
    openingGuidePages,
    currentOpeningGuide: openingGuidePages[0]
  },
  openingTimer: 0,
  async onShow() {
    this.prepareOpening()
    this.syncHomeTabBar()
    await this.loadDiscoveryFeed()
    this.enterPage()
  },
  onHide() {
    this.clearOpeningTimer()
  },
  onUnload() {
    this.clearOpeningTimer()
  },
  async loadDiscoveryFeed() {
    const result = await backend.fetchDiscoveryFeed()
    const calendarDays = buildCalendarDays(result.topics)
    const selectedDateKey = this.data.selectedDateKey || (calendarDays[0] && calendarDays[0].key) || ''
    const visibleTopics = sortTopicsByDate(result.topics, selectedDateKey)
    const recommendedTopics = buildRecommendedTopics(result.topics)
    const weekTopics = buildWeekTopics(result.topics, selectedDateKey)

    this.setData({
      topics: result.topics,
      visibleTopics,
      weekTopics,
      recommendedTopics,
      fullCalendarDays: calendarDays,
      calendarDays: calendarDays.slice(0, 7),
      nextWeekDays: calendarDays.slice(7),
      selectedDateKey,
      backendMode: result.mode,
      isLoading: false
    })
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  syncHomeTabBar() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && tabBar.sync) {
      tabBar.sync('/pages/card/index', false)
    }
  },
  prepareOpening() {
    this.clearOpeningTimer()
    const app = getApp()
    if (app && app.globalData && app.globalData.openingSeenInSession) {
      this.setData({
        showOpening: false,
        openingLeaving: false,
        openingGuideLeaving: false
      })
      return
    }
    this.setData({
      showOpening: true,
      openingLeaving: false,
      openingStage: 'origin',
      openingGuideLeaving: false,
      openingGuideMotion: 'a',
      openingGuideIndex: 0,
      currentOpeningGuide: openingGuidePages[0]
    })
  },
  clearOpeningTimer() {
    if (!this.openingTimer) return
    clearTimeout(this.openingTimer)
    this.openingTimer = 0
  },
  enterHome() {
    if (this.data.openingLeaving) return
    this.clearOpeningTimer()
    const app = getApp()
    if (app && app.globalData) {
      app.globalData.openingSeenInSession = true
    }
    this.setData({ openingLeaving: true })
    setTimeout(() => {
      this.setData({ showOpening: false, openingLeaving: false })
    }, 520)
  },
  startOpeningGuide() {
    this.clearOpeningTimer()
    this.setData({
      openingStage: 'guide',
      openingGuideLeaving: false,
      openingGuideMotion: 'a',
      openingGuideIndex: 0,
      currentOpeningGuide: openingGuidePages[0]
    })
  },
  transitionOpeningGuide(nextIndex) {
    if (nextIndex === this.data.openingGuideIndex || this.data.openingGuideLeaving) return
    const nextMotion = this.data.openingGuideMotion === 'a' ? 'b' : 'a'
    this.setData({ openingGuideLeaving: true })
    setTimeout(() => {
      this.setData({
        openingGuideIndex: nextIndex,
        currentOpeningGuide: openingGuidePages[nextIndex],
        openingGuideMotion: nextMotion,
        openingGuideLeaving: false
      })
    }, 560)
  },
  closeOpeningThen(callback) {
    if (this.data.openingLeaving) return
    this.clearOpeningTimer()
    const app = getApp()
    if (app && app.globalData) {
      app.globalData.openingSeenInSession = true
    }
    this.setData({
      openingLeaving: true,
      openingGuideLeaving: true
    })
    setTimeout(() => {
      this.setData({ showOpening: false, openingLeaving: false, openingGuideLeaving: false })
      if (typeof callback === 'function') callback()
    }, 520)
  },
  handleOpeningGuideAction(e) {
    const { action } = e.currentTarget.dataset
    if (action === 'skipForNow') {
      this.enterHome()
      return
    }
    if (action === 'startAnswer') {
      this.transitionOpeningGuide(1)
      return
    }
    if (action === 'join') {
      this.closeOpeningThen(() => {
        this.setData({ activeTab: 'tonight', activeTabIndex: 0 })
      })
      return
    }
    if (action === 'launch') {
      this.closeOpeningThen(() => {
        const tabBar = this.getTabBar && this.getTabBar()
        if (tabBar && tabBar.openStarfield) {
          tabBar.openStarfield()
        }
      })
    }
  },
  switchTab(e) {
    const { tab } = e.currentTarget.dataset
    this.setData({
      activeTab: tab,
      activeTabIndex: tab === 'week' ? 1 : 0
    })
  },
  onTopicSectionChange(e) {
    const index = e.detail.current
    this.setData({
      activeTabIndex: index,
      activeTab: index === 1 ? 'week' : 'tonight'
    })
  },
  startPageSwipe(e) {
    const touch = e.touches[0]
    if (!touch) return
    this.pageSwipeStart = {
      x: touch.clientX,
      y: touch.clientY
    }
  },
  endPageSwipe(e) {
    const start = this.pageSwipeStart
    const touch = e.changedTouches[0]
    this.pageSwipeStart = null
    if (!start || !touch) return

    if (!isHorizontalSwipe(start.x, start.y, touch.clientX, touch.clientY)) return
    const dx = touch.clientX - start.x
    if (dx < 0 && this.data.activeTab === 'tonight') {
      this.setData({ activeTab: 'week' })
      return
    }
    if (dx > 0 && this.data.activeTab === 'week') {
      this.setData({ activeTab: 'tonight' })
    }
  },
  cancelPageSwipe() {
    this.pageSwipeStart = null
  },
  toggleCalendar() {
    this.setData({ showCalendar: !this.data.showCalendar })
  },
  pressCalendarDate(e) {
    const { key } = e.currentTarget.dataset
    if (!key) return
    this.setData({ pressedDateKey: key })
  },
  releaseCalendarDate() {
    if (!this.data.pressedDateKey) return
    this.setData({ pressedDateKey: '' })
  },
  pressCalendarToggle() {
    this.setData({ pressedToggle: true })
  },
  releaseCalendarToggle() {
    if (!this.data.pressedToggle) return
    this.setData({ pressedToggle: false })
  },
  pressTopicCard(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    this.setData({ pressedTopicId: id })
  },
  releaseTopicCard() {
    if (!this.data.pressedTopicId) return
    this.setData({ pressedTopicId: '' })
  },
  pressJoinButton(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    this.setData({ pressedJoinId: id })
  },
  releaseJoinButton() {
    if (!this.data.pressedJoinId) return
    this.setData({ pressedJoinId: '' })
  },
  selectCalendarDate(e) {
    const { key } = e.currentTarget.dataset
    if (!key) return
    this.releaseCalendarDate()
    const selectedDateKey = this.data.selectedDateKey === key ? '' : key
    const visibleTopics = sortTopicsByDate(this.data.topics, selectedDateKey)
    const weekTopics = buildWeekTopics(this.data.topics, selectedDateKey)
    this.setData({
      selectedDateKey,
      visibleTopics,
      weekTopics
    })
  },
  onRealitySwiperChange(e) {
    this.setData({ realityCurrent: e.detail.current })
  },
  rememberTopic() {
    wx.showToast({
      title: '先帮你记住了',
      icon: 'none'
    })
  },
  openLaunchDraft() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && tabBar.openStarfield) {
      tabBar.openStarfield()
    }
  },
  openAiEntry() {
    wx.navigateTo({ url: '/pages/ai-entry/index' })
  },
  goTopicDetail(e) {
    const { id } = e.currentTarget.dataset
    this.releaseTopicCard()
    wx.navigateTo({ url: `/pages/topic-detail/index?id=${id}` })
  },
  joinTopic(e) {
    const { id } = e.currentTarget.dataset
    this.releaseJoinButton()
    this.releaseTopicCard()
    wx.navigateTo({ url: `/pages/topic-detail/index?id=${id}` })
  }
})
