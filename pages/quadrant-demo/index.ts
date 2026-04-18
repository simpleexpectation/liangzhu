const quadrants = [
  {
    key: 'tonight',
    eyebrow: 'Time',
    word: '今晚',
    title: '从今晚进入',
    copy: '像从一种此刻的情绪里推门进去，带着还没来得及说出口的状态。'
  },
  {
    key: 'liangzhu',
    eyebrow: 'Place',
    word: '良渚',
    title: '从场域进入',
    copy: '像先选一块发光的地方，再让这句话慢慢长出空气和质地。'
  },
  {
    key: 'meet',
    eyebrow: 'Action',
    word: '见面',
    title: '从动作进入',
    copy: '像让“见面”这件事先发生，其他内容都跟着它往中间聚拢。'
  },
  {
    key: 'mine',
    eyebrow: 'Self',
    word: '我的',
    title: '从自我进入',
    copy: '像先把自己放进画面里，再决定要把谁邀请进来。'
  }
]

Page({
  data: {
    pageReady: false,
    quadrants,
    selectedQuadrant: '',
    currentTitle: '还没选择',
    currentCopy: '这一版是纯展示页，所以你只需要判断这股气质对不对。'
  },
  onShow() {
    this.setData({
      pageReady: false,
      selectedQuadrant: '',
      currentTitle: '还没选择',
      currentCopy: '这一版是纯展示页，所以你只需要判断这股气质对不对。'
    })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  goBack() {
    wx.navigateBack()
  },
  chooseQuadrant(e: WechatMiniprogram.BaseEvent) {
    const { key } = e.currentTarget.dataset as { key?: string }
    const next = quadrants.find((item) => item.key === key)
    if (!next) return
    this.setData({
      selectedQuadrant: next.key,
      currentTitle: next.title,
      currentCopy: next.copy
    })
  },
  resetSelection() {
    this.setData({
      selectedQuadrant: '',
      currentTitle: '还没选择',
      currentCopy: '这一版是纯展示页，所以你只需要判断这股气质对不对。'
    })
  },
  cycleSelection() {
    const currentIndex = quadrants.findIndex((item) => item.key === this.data.selectedQuadrant)
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % quadrants.length : 0
    const next = quadrants[nextIndex]
    this.setData({
      selectedQuadrant: next.key,
      currentTitle: next.title,
      currentCopy: next.copy
    })
  }
})
