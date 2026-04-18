const promptChips = ['最近的状态', '想聊的方向', '一个问题', '今天的感受']

const defaultDraft = '我最近想聊聊 AI 为什么一边让人更高效，一边也更疲惫。'

const quadrantEntries = [
  {
    key: 'tonight',
    word: '今晚',
    eyebrow: 'Time',
    title: '把今晚的状态，带进一场见面',
    subtitle: '从此刻最真实的一句感受开始，不必先把它说完整。',
    composerTitle: '从今晚的状态开始',
    composerSub: '先说一句你今晚带着什么来，我们再把它收成一张卡。',
    seed: '我今晚最想聊的是'
  },
  {
    key: 'liangzhu',
    word: '良渚',
    eyebrow: 'Place',
    title: '把一处地方，变成一段对话的背景',
    subtitle: '像在夜里选一块缓慢发光的场域，先决定气氛，再决定要说什么。',
    composerTitle: '先从良渚的场感开始',
    composerSub: '想象你正站在那个地方，先说一句那里适合发生什么样的对话。',
    seed: '如果今晚在良渚见面，我想聊'
  },
  {
    key: 'meet',
    word: '见面',
    eyebrow: 'Action',
    title: '先决定你想靠近怎样的人',
    subtitle: '不是先做活动，而是先想清楚，这次你想和谁认真坐下来聊聊。',
    composerTitle: '先从一场见面开始',
    composerSub: '写下你想遇见的人、关系或问题，我们替你起一张邀请卡。',
    seed: '我想发起一场关于'
  },
  {
    key: 'mine',
    word: '我的',
    eyebrow: 'Self',
    title: '先把你自己放进来，再邀请别人',
    subtitle: '从一句近况、一种犹豫、一个念头开始，见面才会真正长出温度。',
    composerTitle: '先从你自己的一句话开始',
    composerSub: '不用想得很正式，像发一条只写给自己的状态那样就够了。',
    seed: '我最近反复想到'
  }
] as const

const defaultEntryTone = quadrantEntries[0]

const buildAutofillPayload = (draft: string) => {
  const raw = draft.trim() || defaultDraft
  const online = /AI|线上|远程|工具|互联网|产品|技术/.test(raw)

  return {
    topic: raw.includes('在场')
      ? '真正的在场'
      : raw.includes('AI')
        ? 'AI 让人更高效了，为什么也更疲惫了？'
        : '一个值得认真聊聊的问题',
    reason: raw.includes('AI')
      ? '我想聊聊一种越来越明显的体感：当 AI 让一切更高效之后，人为什么反而更容易分散、疲惫，甚至更难真正进入工作与交流。'
      : '我想从一个最近反复想到的状态开始，把它变成一场别人也愿意加入的对话。',
    time: online ? '本周内' : '周六下午',
    launchMode: online ? 'online' : 'offline',
    venue: online ? '线上优先' : '杭州',
    platform: online ? '微信群 / 线上房间' : '微信群 / 线上房间',
    joinHint: online ? '发起后自动带出加入方式' : '发起后自动带出加入方式'
  }
}

Page({
  data: {
    pageReady: false,
    pageLeaving: false,
    showQuadrantIntro: true,
    quadrantLeaving: false,
    selectedQuadrant: '',
    quadrantEntries,
    entryToneTitle: defaultEntryTone.composerTitle,
    entryToneSub: defaultEntryTone.composerSub,
    processing: false,
    processingMode: 'autofill',
    promptChips,
    voiceDraft: defaultDraft
  },
  onShow() {
    this.setData({
      pageLeaving: false,
      pageReady: false,
      processing: false,
      showQuadrantIntro: true,
      quadrantLeaving: false,
      selectedQuadrant: '',
      entryToneTitle: defaultEntryTone.composerTitle,
      entryToneSub: defaultEntryTone.composerSub,
      voiceDraft: defaultDraft
    })
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
  updateVoiceDraft(e: WechatMiniprogram.Input) {
    this.setData({ voiceDraft: e.detail.value })
  },
  appendPrompt(e: WechatMiniprogram.BaseEvent) {
    const { value } = e.currentTarget.dataset as { value?: string }
    if (!value) return
    const nextDraft = this.data.voiceDraft.trim()
      ? `${this.data.voiceDraft}\n${value}：`
      : `${value}：`
    this.setData({ voiceDraft: nextDraft })
  },
  chooseQuadrant(e: WechatMiniprogram.BaseEvent) {
    const { key } = e.currentTarget.dataset as { key?: string }
    const selection = quadrantEntries.find((item) => item.key === key)
    if (!selection) return

    const nextDraft = this.data.voiceDraft === defaultDraft
      ? `${selection.seed} `
      : this.data.voiceDraft

    this.setData({
      selectedQuadrant: selection.key,
      quadrantLeaving: true,
      entryToneTitle: selection.composerTitle,
      entryToneSub: selection.composerSub,
      voiceDraft: nextDraft
    })

    setTimeout(() => {
      this.setData({
        showQuadrantIntro: false,
        quadrantLeaving: false
      })
    }, 560)
  },
  skipQuadrantIntro() {
    this.setData({
      quadrantLeaving: true,
      selectedQuadrant: ''
    })

    setTimeout(() => {
      this.setData({
        showQuadrantIntro: false,
        quadrantLeaving: false
      })
    }, 420)
  },
  goToLaunch(withAutofill: boolean) {
    const payload = withAutofill ? buildAutofillPayload(this.data.voiceDraft) : {
      topic: '',
      reason: '',
      time: '',
      launchMode: 'online',
      venue: '',
      platform: '',
      joinHint: ''
    }
    const params = [
      `entry=ai`,
      `source=starter`,
      `autofill=${withAutofill ? '1' : '0'}`,
      `topic=${encodeURIComponent(payload.topic)}`,
      `reason=${encodeURIComponent(payload.reason)}`,
      `time=${encodeURIComponent(payload.time)}`,
      `mode=${encodeURIComponent(payload.launchMode)}`,
      `venue=${encodeURIComponent(payload.venue)}`,
      `platform=${encodeURIComponent(payload.platform)}`,
      `joinHint=${encodeURIComponent(payload.joinHint)}`
    ].join('&')

    this.setData({
      processing: true,
      processingMode: withAutofill ? 'autofill' : 'skip'
    })

    setTimeout(() => {
      this.setData({ pageLeaving: true })
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/direct-launch/index?${params}`
        })
      }, 120)
    }, 1400)
  },
  generateCard() {
    this.goToLaunch(true)
  },
  skipEntry() {
    this.goToLaunch(false)
  }
})
