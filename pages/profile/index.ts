const backend = require('../../lib/backend/index')
const IDEAS_STORAGE_KEY = 'liangzhu_status_cards'

function decorateEvent(item) {
  if (!item) return item
  return {
    ...item,
    coreTopic: item.innerQuestion || item.title,
    coreTopicHint: item.identityLens,
    expandChips: (item.chips || []).slice(0, 3),
    expandHint: item.summary || item.footnote || ''
  }
}

function buildIdeaCards(eventSlides = []) {
  return eventSlides.slice(0, 4).map((item, index) => ({
    id: `idea-seed-${index + 1}`,
    title: item.previewTitle || item.title,
    quote: item.previewText || item.description || '先把一个最近反复想到的状态留在这里。',
    createdAt: item.relativeTime || '最近',
    tone: item.heroTone || String(index % 5)
  }))
}

function readStoredIdeas() {
  try {
    return wx.getStorageSync(IDEAS_STORAGE_KEY) || []
  } catch (error) {
    return []
  }
}

function writeStoredIdeas(ideas) {
  try {
    wx.setStorageSync(IDEAS_STORAGE_KEY, ideas)
  } catch (error) {
    return
  }
}

Page({
  data: {
    user: {
      name: 'Lynn',
      initial: 'L',
      bio: '在练习更松弛地创作',
      location: '中国 · 杭州',
      tags: ['创作者']
    },
    unlockEntry: {
      badge: 'Invite to unlock',
      title: '邀请解锁',
      detail: '邀请 2 位同频好友，解锁本月完整权益',
      cta: '去邀请'
    },
    coBuildEntry: {
      badge: 'Co-build plan',
      title: '共建计划',
      detail: '邀请同频新朋友完成订阅，获得持续关键回馈',
      cta: '查看计划'
    },
    ideaCards: [],
    ideaCurrent: 0,
    showIdeaComposer: false,
    ideaDraft: '',
    pressedEntry: '',
    pressedProfileAction: '',
    pressedIdeaAction: '',
    backendMode: 'mock',
    pageReady: false,
    pageLeaving: false
  },
  async onShow() {
    this.showTabBar()
    await this.loadProfileHome()
    this.enterPage()
  },
  async loadProfileHome() {
    const result = await backend.fetchProfileHome()
    const seededIdeas = buildIdeaCards(result.eventSlides)
    const storedIdeas = readStoredIdeas()
    const ideaCards = storedIdeas.length ? storedIdeas : seededIdeas
    if (!storedIdeas.length) {
      writeStoredIdeas(ideaCards)
    }
    this.setData({
      user: result.user,
      unlockEntry: result.unlockEntry,
      coBuildEntry: result.coBuildEntry,
      ideaCards,
      backendMode: result.mode
    })
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  showTabBar() {
    const tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && tabBar.sync) {
      tabBar.sync('/pages/profile/index', false)
    }
  },
  onIdeaSwiperChange(e) {
    this.setData({ ideaCurrent: e.detail.current })
  },
  pressIdeaAction(e) {
    const { action } = e.currentTarget.dataset
    if (!action) return
    this.setData({ pressedIdeaAction: action })
  },
  releaseIdeaAction() {
    if (!this.data.pressedIdeaAction) return
    this.setData({ pressedIdeaAction: '' })
  },
  pressEntryCard(e) {
    const { entry } = e.currentTarget.dataset
    if (!entry) return
    this.setData({ pressedEntry: entry })
  },
  releaseEntryCard() {
    if (!this.data.pressedEntry) return
    this.setData({ pressedEntry: '' })
  },
  pressProfileAction(e) {
    const { action } = e.currentTarget.dataset
    if (!action) return
    this.setData({ pressedProfileAction: action })
  },
  releaseProfileAction() {
    if (!this.data.pressedProfileAction) return
    this.setData({ pressedProfileAction: '' })
  },
  openInviteUnlock() {
    this.releaseEntryCard()
    wx.navigateTo({ url: '/pages/access-center/index?source=profile&mode=unlock' })
  },
  openCoBuildPlan() {
    this.releaseEntryCard()
    wx.navigateTo({ url: '/pages/access-center/index?source=profile&mode=cobuild' })
  },
  openIdeaComposer() {
    this.setData({
      showIdeaComposer: true,
      ideaDraft: ''
    })
  },
  closeIdeaComposer() {
    this.releaseIdeaAction()
    this.setData({ showIdeaComposer: false })
  },
  updateIdeaDraft(e) {
    this.setData({ ideaDraft: e.detail.value })
  },
  submitIdea() {
    const draft = (this.data.ideaDraft || '').trim()
    if (!draft) {
      wx.showToast({ title: '先写一句状态', icon: 'none' })
      return
    }
    const nextIdea = {
      id: `idea-${Date.now()}`,
      title: draft,
      quote: '刚刚写下的一句状态，会先作为你的状态卡留在这里。',
      createdAt: '刚刚',
      tone: ['0', '1', '2', '3', '4'][Date.now() % 5]
    }
    const ideaCards = [nextIdea, ...this.data.ideaCards]
    writeStoredIdeas(ideaCards)
    this.releaseIdeaAction()
    this.setData({
      ideaCards,
      ideaCurrent: 0,
      showIdeaComposer: false,
      ideaDraft: ''
    })
    wx.showToast({ title: '已加入个人状态卡', icon: 'none' })
  },
  editProfile() {
    this.releaseProfileAction()
    wx.showToast({ title: '下一步接入编辑资料页', icon: 'none' })
  },
  openLaunchDraft() {
    wx.navigateTo({ url: '/pages/direct-launch/index' })
  },
  openAiEntry() {
    wx.navigateTo({ url: '/pages/ai-entry/index' })
  }
})
