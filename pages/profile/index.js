const backend = require('../../lib/backend/index')
const IDEAS_STORAGE_KEY = 'liangzhu_status_cards'

function decorateEvent(item) {
  if (!item) return item
  return {
    ...item,
    detailId: item.id || '',
    coreTopic: item.innerQuestion || item.title,
    coreTopicHint: item.identityLens,
    expandChips: (item.chips || []).slice(0, 3),
    expandHint: item.summary || item.footnote || ''
  }
}

function buildThoughtDetailText(item) {
  return [
    item.body || item.description || item.previewText || item.title,
    item.identityLens,
    item.innerQuestion ? `还想继续想的问题：${item.innerQuestion}` : '',
    item.summary ? `这条思考留下来的回声：${item.summary}` : '',
    '如果把它放回一次真实的相遇里，它不是一个结论，而像是一个入口。一个人先把自己正在经历的东西说出来，另一个人才能知道该从哪里靠近。',
    '也许真正值得被留下来的，不是当时谁说得最完整，而是某个瞬间里，大家都忽然安静下来，意识到这件事也发生在自己身上。',
    '所以这张卡不是为了证明什么。它只是把一个人的状态、问题和微弱的期待放在这里，让下一次见面开始之前，彼此已经多知道一点点。'
  ].filter(Boolean).join('\n\n')
}

function buildIdeaCards(eventSlides = []) {
  return eventSlides.slice(0, 4).map((item, index) => ({
    id: `idea-seed-${index + 1}`,
    detailId: item.id || '',
    title: item.previewTitle || item.title,
    quote: item.previewText || item.description || '先把一个最近反复想到的思考留在这里。',
    detailText: buildThoughtDetailText(item),
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

function hydrateIdeaDetails(ideas, seededIdeas) {
  return (ideas || []).map((idea) => {
    const matched = (seededIdeas || []).find((seed) => seed.title === idea.title || seed.quote === idea.quote)
    return matched ? { ...matched, ...idea, detailId: matched.detailId, detailText: matched.detailText } : idea
  })
}

function getVisibleIdeaCards(ideaCards, expanded) {
  return expanded ? ideaCards : ideaCards.slice(0, 3)
}

function buildFirelights(count = 0) {
  return Array.from({ length: count }, (_, index) => ({
    id: `firelight-${index + 1}`
  }))
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
    showFirelightHint: false,
    firelightIconSrc: '/assets/firelight/fire-simple-c.png',
    firelightCount: 0,
    firelights: [],
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
    visibleIdeaCards: [],
    thoughtsExpanded: false,
    ideaCurrent: 0,
    showIdeaComposer: false,
    showThoughtDetail: false,
    thoughtDetailExpanded: false,
    selectedThought: null,
    ideaDraft: '',
    ideaBodyDraft: '',
    composerFocus: '',
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
    const ideaCards = storedIdeas.length ? hydrateIdeaDetails(storedIdeas, seededIdeas) : seededIdeas
    if (!storedIdeas.length || ideaCards.some((item, index) => item.detailId !== storedIdeas[index]?.detailId || item.detailText !== storedIdeas[index]?.detailText)) {
      writeStoredIdeas(ideaCards)
    }
    this.setData({
      user: result.user,
      firelightCount: result.eventSlides.length,
      firelights: buildFirelights(result.eventSlides.length),
      unlockEntry: result.unlockEntry,
      coBuildEntry: result.coBuildEntry,
      ideaCards,
      visibleIdeaCards: getVisibleIdeaCards(ideaCards, this.data.thoughtsExpanded),
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
  toggleFirelightHint() {
    this.setData({ showFirelightHint: !this.data.showFirelightHint })
  },
  openIdeaComposer() {
    this.setData({
      showIdeaComposer: true,
      ideaDraft: '',
      ideaBodyDraft: '',
      composerFocus: 'topic'
    })
  },
  closeIdeaComposer() {
    this.releaseIdeaAction()
    this.setData({ showIdeaComposer: false, composerFocus: '' })
  },
  focusIdeaTopic() {
    if (this.data.composerFocus === 'topic') return
    this.setData({ composerFocus: 'topic' })
  },
  focusIdeaBody() {
    if (this.data.composerFocus === 'body') return
    this.setData({ composerFocus: 'body' })
  },
  updateIdeaDraft(e) {
    this.setData({ ideaDraft: e.detail.value })
  },
  updateIdeaBodyDraft(e) {
    this.setData({ ideaBodyDraft: e.detail.value })
  },
  submitIdea() {
    const topic = (this.data.ideaDraft || '').trim()
    const body = (this.data.ideaBodyDraft || '').trim()
    if (!body) {
      wx.showToast({ title: '先写具体文字', icon: 'none' })
      return
    }
    const title = topic || (body.length > 18 ? `${body.slice(0, 18)}...` : body)
    const nextIdea = {
      id: `idea-${Date.now()}`,
      detailId: '',
      title,
      quote: body,
      detailText: body,
      createdAt: '刚刚',
      tone: ['0', '1', '2', '3', '4'][Date.now() % 5]
    }
    const ideaCards = [nextIdea, ...this.data.ideaCards]
    writeStoredIdeas(ideaCards)
    this.releaseIdeaAction()
    this.setData({
      ideaCards,
      visibleIdeaCards: getVisibleIdeaCards(ideaCards, this.data.thoughtsExpanded),
      ideaCurrent: 0,
      showIdeaComposer: false,
      ideaDraft: '',
      ideaBodyDraft: '',
      composerFocus: ''
    })
    wx.showToast({ title: '已加入个人思考卡', icon: 'none' })
  },
  openIdeaDetail(e) {
    const { thoughtId } = e.currentTarget.dataset
    const thought = this.data.ideaCards.find((item) => item.id === thoughtId)
    if (!thought) {
      wx.showToast({ title: '这条思考还没有详情', icon: 'none' })
      return
    }
    this.setData({
      selectedThought: {
        title: thought.title,
        detailText: thought.detailText || thought.quote,
        canExpand: (thought.detailText || thought.quote || '').length > 120,
        tone: thought.tone || '0'
      },
      showThoughtDetail: true,
      thoughtDetailExpanded: false
    })
  },
  expandThoughtDetail() {
    this.setData({ thoughtDetailExpanded: true })
  },
  toggleThoughtsExpanded() {
    const thoughtsExpanded = !this.data.thoughtsExpanded
    this.setData({
      thoughtsExpanded,
      visibleIdeaCards: getVisibleIdeaCards(this.data.ideaCards, thoughtsExpanded)
    })
  },
  closeThoughtDetail() {
    this.setData({
      showThoughtDetail: false,
      thoughtDetailExpanded: false,
      selectedThought: null
    })
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
