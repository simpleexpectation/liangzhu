const backend = require('../../lib/backend/index')
const IDEAS_STORAGE_KEY = 'liangzhu_status_cards'

function readStoredIdeas() {
  try {
    return wx.getStorageSync(IDEAS_STORAGE_KEY) || []
  } catch (error) {
    return []
  }
}

function buildThoughtDetailText(event) {
  return [
    event.body || event.description || event.summary || event.title,
    event.identityLens,
    event.innerQuestion ? `还想继续想的问题：${event.innerQuestion}` : '',
    event.summary ? `这条思考留下来的回声：${event.summary}` : '',
    '如果把它放回一次真实的相遇里，它不是一个结论，而像是一个入口。一个人先把自己正在经历的东西说出来，另一个人才能知道该从哪里靠近。',
    '也许真正值得被留下来的，不是当时谁说得最完整，而是某个瞬间里，大家都忽然安静下来，意识到这件事也发生在自己身上。',
    '所以这张卡不是为了证明什么。它只是把一个人的状态、问题和微弱的期待放在这里，让下一次见面开始之前，彼此已经多知道一点点。'
  ].filter(Boolean).join('\n\n')
}

function buildStatusCardsFromEvents(events) {
  return (events || []).map((event, index) => ({
    id: `status-${event.id || index}`,
    detailId: event.id || '',
    title: event.previewTitle || event.anchor || event.kindLabel || event.title,
    quote: event.summary || event.body || event.description || event.title,
    detailText: buildThoughtDetailText(event),
    createdAt: event.footnote || event.date || event.venue || '最近留下',
    tone: `${index % 5}`
  }))
}

function hydrateIdeaDetails(ideas, fallbackCards) {
  return (ideas || []).map((idea) => {
    const matched = (fallbackCards || []).find((card) => card.title === idea.title || card.quote === idea.quote)
    return matched ? { ...matched, ...idea, detailId: matched.detailId, detailText: matched.detailText } : idea
  })
}

function resolveStatusCards(person, visibleEvents) {
  const fallbackCards = buildStatusCardsFromEvents(visibleEvents)
  const isLocalProfile = person && (person.id === 'person-lynn' || person.name === 'Lynn')
  if (!isLocalProfile) return fallbackCards

  const storedCards = readStoredIdeas()
  return storedCards.length ? hydrateIdeaDetails(storedCards, fallbackCards) : fallbackCards
}

Page({
  data: {
    person: null,
    statusCards: [],
    visibleEvents: [],
    showThoughtDetail: false,
    thoughtDetailExpanded: false,
    selectedThought: null,
    backendMode: 'mock',
    pageReady: false,
    pageLeaving: false
  },
  async onLoad(options) {
    const result = await backend.fetchPersonProfile(options.id)
    this.setData({
      person: result.person,
      visibleEvents: result.visibleEvents || [],
      statusCards: resolveStatusCards(result.person, result.visibleEvents),
      backendMode: result.mode
    })
  },
  onShow() {
    if (this.data.person && (this.data.person.id === 'person-lynn' || this.data.person.name === 'Lynn')) {
      this.setData({ statusCards: resolveStatusCards(this.data.person, this.data.visibleEvents) })
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
  },
  openIdeaDetail(e) {
    const { thoughtId } = e.currentTarget.dataset
    const thought = this.data.statusCards.find((item) => item.id === thoughtId)
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
  closeThoughtDetail() {
    this.setData({
      showThoughtDetail: false,
      thoughtDetailExpanded: false,
      selectedThought: null
    })
  }
})
