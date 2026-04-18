const { venues } = require('../../data/mock')

const basePeople = [
  {
    personId: 'person-qingyuan',
    name: '青原',
    line: '一个正在研究哲学的程序员',
    titles: ['我开始允许自己慢下来', '工作之外，还有什么能定义一个人？', '不急着回答，也是一种诚实'],
    quotes: ['先承认自己已经太久没有停下来了。', '最近在重新理解什么叫真正的生活。', '有时候比答案更重要的是，终于愿意把问题说出来。'],
    tone: 'mist'
  },
  {
    personId: 'person-momo',
    name: 'Momo',
    line: '做城市策展，也在学习慢一点生活',
    titles: ['没有产出的时刻，也算活着', '我想把城市里的陌生感说出来', '慢一点，好像反而更接近自己'],
    quotes: ['我只是很久没有认真感受它了。', '最近常常在想，人和空间到底怎么彼此安放。', '很多时候不是没有答案，而是太快了。'],
    tone: 'peach'
  },
  {
    personId: 'person-aki',
    name: 'Aki',
    line: '拍纪录片，也写诗',
    titles: ['一句话，也可以成为见面的起点', '有些瞬间值得被轻轻记住', '我还想为一场真实对话留出位置'],
    quotes: ['也许今晚某个片刻，会变成一句被记住的话。', '不是所有重要的事都要说得很大声。', '我在练习把感受留得更久一点。'],
    tone: 'sand'
  },
  {
    personId: 'person-lynn',
    name: 'Lynn',
    line: '在练习更松弛地创作',
    titles: ['我想重新定义努力和表达', '原来创作也可以先松下来', '不是更厉害，而是更真一点'],
    quotes: ['最近正在重新定义努力与表达。', '我想做一点不那么用力，但更像自己的东西。', '先把状态摆在这里，再慢慢决定往哪走。'],
    tone: 'sky'
  },
  {
    personId: 'person-xiaoyue',
    name: '小越',
    line: '产品设计师，最近在重建节奏',
    titles: ['失控以后，我想慢慢回来', '重建节奏，比追上别人更重要', '我在学着不过度消耗自己'],
    quotes: ['可能会谈到如何从失控里慢慢回来。', '这段时间最难的，是接受节奏已经变了。', '现在更想把日子过回自己的手里。'],
    tone: 'rose'
  },
  {
    personId: 'person-nora',
    name: 'Nora',
    line: '一个做播客的观察者',
    titles: ['我想把模糊的感受说轻一点', '有些情绪，不必一个人消化', '我们能不能先好好听彼此说话'],
    quotes: ['她总能把别人的情绪说得很轻很准。', '我也在学着更慢地靠近别人。', '先不急着判断，先把那一点真感受留住。'],
    tone: 'ivory'
  }
]

const buildMeetPeople = () => (
  Array.from({ length: 24 }, (_, index) => {
    const source = basePeople[index % basePeople.length]
    return {
      id: `liangzhu-person-${index + 1}`,
      personId: source.personId,
      name: source.name,
      line: source.line,
      title: source.titles[index % source.titles.length],
      quote: source.quotes[(index + 1) % source.quotes.length],
      tone: source.tone,
      offset: index % 4
    }
  })
)

const buildRows = (people) => {
  const rows = []
  for (let i = 0; i < people.length; i += 2) {
    rows.push({
      id: `row-${i / 2}`,
      left: people[i] || null,
      right: people[i + 1] || null
    })
  }
  return rows
}

Page({
  data: {
    statusBarHeight: 44,
    activeSubtab: 'places',
    venues,
    goodPeopleRows: [],
    pageReady: false,
    pageLeaving: false
  },
  onLoad() {
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: info.statusBarHeight || 44,
      goodPeopleRows: buildRows(buildMeetPeople())
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
  switchSubtab(e) {
    const { tab } = e.currentTarget.dataset
    if (!tab || tab === this.data.activeSubtab) return
    this.setData({ activeSubtab: tab })
  },
  goVenueDetail(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    wx.navigateTo({ url: `/pages/venue-detail/index?id=${id}` })
  },
  openVenueRecommend() {
    wx.showToast({ title: '下一步接入推荐空间提交流程', icon: 'none' })
  },
  openPerson(e) {
    const { personId } = e.currentTarget.dataset
    if (!personId) return
    wx.navigateTo({ url: `/pages/person/index?id=${personId}` })
  }
})
