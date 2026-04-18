const {
  featuredEvent,
  myEvents,
  topics,
  venues,
  onlineEvents,
  presenceEvent,
  attendeeCards,
  presenceConversations,
  presenceRooms
} = require('../../data/mock')

const CLOUD_ENV_ID = 'replace-with-your-cloud-env-id'
const CLOUD_FUNCTION_NAME = 'api'
const PLACEHOLDER_ENV_ID = 'replace-with-your-cloud-env-id'

const fallbackUser = {
  id: 'local-user',
  name: 'Lynn',
  initial: 'L',
  bio: '在练习更松弛地创作',
  location: '中国 · 杭州',
  tags: ['创作者']
}

const fallbackUnlockEntry = {
  badge: 'Invite to unlock',
  title: '邀请解锁',
  detail: '邀请 2 位同频好友，解锁本月完整权益',
  cta: '去邀请'
}

const fallbackCoBuildEntry = {
  badge: 'Co-build plan',
  title: '共建计划',
  detail: '邀请同频新朋友完成订阅，获得持续关键回馈',
  cta: '查看计划'
}

const fallbackMembershipPlans = [
  {
    key: 'week',
    badge: 'TRY FIRST',
    title: '真实发生周卡',
    plan: '真实发生周卡',
    price: '49',
    billing: '/ 周',
    copy: '7 天轻量体验，先试试看适不适合你',
    renewal: '7 天轻量体验，适合第一次试试看',
    cta: '立即购买周卡 ¥49'
  },
  {
    key: 'month',
    badge: 'MONTHLY ACCESS',
    title: '真实发生月卡',
    plan: '真实发生月卡',
    price: '99',
    billing: '/ 月',
    copy: '到期前 3 天提醒，随时可取消续费',
    renewal: '到期前 3 天提醒，随时可取消续费',
    cta: '立即购买月卡 ¥99'
  }
]

const fallbackMembershipBenefitsByPlan = {
  week: [
    { icon: '◉', title: '7 天内解锁 8 场精选真实对话，含线上活动入口' },
    { icon: '✦', title: '第一次进入的人可以更低成本地试一周' },
    { icon: '◈', title: '保留一次主动发起权，先试着发起一场' }
  ],
  month: [
    { icon: '◉', title: '每月解锁全部 60 场深度对话，不限话题类型' },
    { icon: '✦', title: '优先匹配同频成员，响应时间缩短至 4 小时内' },
    { icon: '◈', title: '专属黑洞模式：进入对话后屏蔽所有外部通知' },
    { icon: '⌖', title: '每月 3 次主动发起权，可自定义话题和规则' },
    { icon: '◯', title: '对话结束后获得 AI 提炼的「话题 DNA」卡片' }
  ]
}

const fallbackCobuildBenefits = [
  { icon: '◉', title: '核心动作是邀请同频好友，而不是拉泛流量' },
  { icon: '✦', title: '每成功邀请一位完成月度订阅，你会获得25%对应的持续关键回馈' },
  { icon: '◈', title: '共建者可获得月卡权益与长期共建身份标识' },
  { icon: '⌖', title: '面向已被验证的高质量参与者、发起者与 KOL 开放' }
]

const fallbackInviteSlots = [
  { key: 'self', label: '你自己', status: '已点亮', active: true },
  { key: 'friend-a', label: '好友 #1', status: '等待中', active: false },
  { key: 'friend-b', label: '好友 #2', status: '等待中', active: false }
]

const memberProfiles = [
  {
    id: 'person-qingyuan',
    name: '青原',
    initial: '青',
    bio: '一个正在研究哲学的程序员',
    location: '中国 · 杭州',
    tags: ['哲学', '程序员'],
    connectionHint: '如果你也在想工作之外还有什么能定义一个人，也许可以从这里开始。',
    eventIds: ['my-event-1', 'my-event-4']
  },
  {
    id: 'person-momo',
    name: 'Momo',
    initial: 'M',
    bio: '做城市策展，也在学习慢一点生活',
    location: '中国 · 杭州',
    tags: ['策展', '城市'],
    connectionHint: '她很在意城市里的陌生感和人与人之间微妙的距离。',
    eventIds: ['my-event-2', 'my-event-5']
  },
  {
    id: 'person-lynn',
    name: 'Lynn',
    initial: 'L',
    bio: '在练习更松弛地创作',
    location: '中国 · 杭州',
    tags: ['创作者'],
    connectionHint: '和她聊天，常常会从一个很小的真感受开始，然后慢慢打开。',
    eventIds: ['my-event-3', 'my-event-4']
  },
  {
    id: 'person-aki',
    name: 'Aki',
    initial: 'A',
    bio: '拍纪录片，也写诗',
    location: '中国 · 杭州',
    tags: ['纪录片', '写作'],
    connectionHint: 'TA 会记住气氛、光线和停顿，比结论更先被留下来。',
    eventIds: ['my-event-2', 'my-event-5']
  },
  {
    id: 'person-xiaoyue',
    name: '小越',
    initial: '越',
    bio: '产品设计师，最近在重建节奏',
    location: '中国 · 杭州',
    tags: ['产品设计', '生活节奏'],
    connectionHint: '如果你也在经历失控之后的重建，可能会很容易和 TA 接上。',
    eventIds: ['my-event-1', 'my-event-3']
  },
  {
    id: 'person-nora',
    name: 'Nora',
    initial: 'N',
    bio: '一个做播客的观察者',
    location: '中国 · 杭州',
    tags: ['播客', '观察'],
    connectionHint: '她很擅长把模糊的情绪说得很轻，也很准。',
    eventIds: ['my-event-4', 'my-event-5']
  }
]

const memberProfileByName = memberProfiles.reduce((accumulator, profile) => {
  accumulator[profile.name] = profile
  return accumulator
}, {})

const cloudState = {
  initialized: false,
  enabled: false
}

const isCloudConfigured = () => Boolean(
  typeof wx !== 'undefined' &&
  wx.cloud &&
  CLOUD_ENV_ID &&
  CLOUD_ENV_ID !== PLACEHOLDER_ENV_ID
)

const initCloudIfNeeded = () => {
  if (cloudState.initialized) return cloudState.enabled
  cloudState.initialized = true
  cloudState.enabled = isCloudConfigured()
  if (!cloudState.enabled) return false

  wx.cloud.init({
    env: CLOUD_ENV_ID,
    traceUser: true
  })
  return true
}

const callApi = async (action, payload = {}) => {
  if (!initCloudIfNeeded()) {
    throw new Error('Cloud backend is not configured.')
  }

  const response = await wx.cloud.callFunction({
    name: CLOUD_FUNCTION_NAME,
    data: {
      action,
      ...payload
    }
  })

  const result = response.result || {}
  if (result.ok === false) {
    throw new Error(result.message || 'Cloud function failed.')
  }

  return Object.prototype.hasOwnProperty.call(result, 'data') ? result.data : result
}

const sortEventsByDate = (events) => [...events].sort((left, right) => (left.date < right.date ? 1 : -1))

const buildEventSlides = (events) => sortEventsByDate(events).map((item, index, list) => ({
  ...item,
  relativeTime: ['17 天前', '12 天前', '8 天前', '5 天前', '3 天前'][index] || `${index + 1} 周前`,
  venueShort: item.venue.replace('某', '').slice(0, 4) || item.venue,
  indexLabel: `${String(index + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`
}))

const enrichTopicParticipants = (topic) => ({
  ...topic,
  participants: (topic.participants || []).map((participant) => {
    if (participant && participant.name) {
      const person = memberProfileByName[participant.name]
      return {
        ...participant,
        id: person ? person.id : participant.id,
        initial: person ? person.initial : participant.initial
      }
    }

    const person = memberProfiles.find((item) => item.id === participant)
    return person ? {
      id: person.id,
      name: person.name,
      role: person.bio,
      initial: person.initial
    } : null
  }).filter(Boolean)
})

const buildDiscoveryFeed = () => ({
  venues,
  topics: topics.map(enrichTopicParticipants),
  onlineEvents
})

const buildProfileHome = () => ({
  user: fallbackUser,
  unlockEntry: fallbackUnlockEntry,
  coBuildEntry: fallbackCoBuildEntry,
  eventSlides: buildEventSlides(myEvents)
})

const buildMembershipOverviewFallback = () => ({
  selectedPlanKey: 'week',
  planOptions: fallbackMembershipPlans,
  activePlan: fallbackMembershipPlans[0],
  activeBenefits: fallbackMembershipBenefitsByPlan.week,
  membershipBenefitsByPlan: fallbackMembershipBenefitsByPlan,
  cobuildBenefits: fallbackCobuildBenefits,
  quota: {
    remaining: 12,
    total: 30
  },
  limitedQuota: {
    remaining: 12,
    total: 30
  },
  inviteProgram: {
    buttonText: '邀请 2 位好友，限时 0 元开启',
    description: '好友完成注册并参与第一次对话后，你的月卡自动生效。无需付款，无需等待。'
  },
  inviteCode: 'SIMPEX-2026'
})

const buildInviteStatusFallback = () => ({
  inviteCode: 'SIMPEX-2026',
  unlockSlots: fallbackInviteSlots
})

const getPersonProfileFallback = (id) => {
  const person = memberProfiles.find((item) => item.id === id) || memberProfiles[0]
  const visibleEvents = myEvents.filter((item) => person.eventIds.includes(item.id))
  return {
    person,
    visibleEvents
  }
}

const buildPresenceOverviewFallback = () => ({
  presenceEvent,
  attendeeCards,
  presenceConversations
})

async function bootstrapBackend() {
  try {
    if (!initCloudIfNeeded()) {
      return { mode: 'mock' }
    }

    await callApi('bootstrap')
    return { mode: 'cloud' }
  } catch (error) {
    return {
      mode: 'mock',
      error
    }
  }
}

async function ensureCurrentUser() {
  try {
    if (!initCloudIfNeeded()) {
      return {
        mode: 'mock',
        user: fallbackUser
      }
    }

    const data = await callApi('auth.session')
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      mode: 'mock',
      user: fallbackUser,
      error
    }
  }
}

async function fetchDiscoveryFeed() {
  try {
    const data = await callApi('discovery.feed')
    return {
      ...data,
      topics: (data.topics || []).map(enrichTopicParticipants),
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ...buildDiscoveryFeed(),
      mode: 'mock',
      error
    }
  }
}

async function fetchTopicDetail(id) {
  try {
    const topic = await callApi('topics.detail', { id })
    return {
      topic: enrichTopicParticipants(topic),
      mode: 'cloud'
    }
  } catch (error) {
    const fallbackTopic = buildDiscoveryFeed().topics.find((item) => item.id === id) || buildDiscoveryFeed().topics[0]
    return {
      topic: fallbackTopic,
      mode: 'mock',
      error
    }
  }
}

async function applyToTopic(id) {
  try {
    const data = await callApi('topics.rsvp', { id })
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ok: true,
      message: '已提交申请，等待发起人确认',
      mode: 'mock',
      error
    }
  }
}

async function fetchProfileHome() {
  try {
    const data = await callApi('profile.home')
    return {
      ...data,
      eventSlides: buildEventSlides(data.eventSlides || []),
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ...buildProfileHome(),
      mode: 'mock',
      error
    }
  }
}

async function fetchEventDetail(options = {}) {
  const { id = '', source = 'official' } = options
  try {
    const event = await callApi('events.detail', { id, source })
    return {
      event,
      detailMode: source === 'profile' ? 'profile' : 'official',
      mode: 'cloud'
    }
  } catch (error) {
    const fallbackEvent = source === 'profile'
      ? (myEvents.find((item) => item.id === id) || myEvents[0])
      : {
        ...featuredEvent,
        schedule: '今晚 19:30 - 21:30',
        location: '泊光集 · 杭州天目里附近',
        guide: 'Iris · 产品叙事研究',
        seatsText: `${featuredEvent.status} · 余 7 位（限额 20 人）`
      }

    return {
      event: fallbackEvent,
      detailMode: source === 'profile' ? 'profile' : 'official',
      mode: 'mock',
      error
    }
  }
}

async function fetchPersonProfile(id) {
  try {
    const data = await callApi('people.detail', { id })
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ...getPersonProfileFallback(id),
      mode: 'mock',
      error
    }
  }
}

async function fetchMembershipOverview() {
  try {
    const data = await callApi('membership.overview')
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ...buildMembershipOverviewFallback(),
      mode: 'mock',
      error
    }
  }
}

async function fetchInviteStatus() {
  try {
    const data = await callApi('invite.status')
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ...buildInviteStatusFallback(),
      mode: 'mock',
      error
    }
  }
}

async function createLaunch(payload = {}) {
  try {
    const data = await callApi('launch.create', payload)
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ok: true,
      message: '已提交发起请求，等待进入匹配与审核流程',
      topic: {
        id: `local-launch-${Date.now()}`,
        title: payload.topic || '未命名话题',
        reason: payload.reason || '',
        launchMode: payload.launchMode || 'online'
      },
      mode: 'mock',
      error
    }
  }
}

async function fetchPresenceOverview() {
  try {
    const data = await callApi('presence.overview')
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ...buildPresenceOverviewFallback(),
      mode: 'mock',
      error
    }
  }
}

async function fetchPresenceRoom(id) {
  try {
    const room = await callApi('presence.room.detail', { id })
    return {
      room,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      room: presenceRooms.find((item) => item.conversationId === id) || presenceRooms[0],
      mode: 'mock',
      error
    }
  }
}

async function sendPresenceRoomMessage(id, text) {
  try {
    const data = await callApi('presence.room.send', { id, text })
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    const room = presenceRooms.find((item) => item.conversationId === id) || presenceRooms[0]
    return {
      ok: true,
      message: '已发送到同行房',
      room: {
        ...room,
        messages: [
          ...(room.messages || []),
          {
            id: `${id}-${Date.now()}`,
            type: 'self',
            name: '你',
            text,
            time: '现在'
          }
        ]
      },
      mode: 'mock',
      error
    }
  }
}

async function decidePresenceConversation(id, decision) {
  try {
    const data = await callApi('presence.conversation.decide', { id, decision })
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ok: true,
      message: decision === 'approve' ? '已同意加入' : '已暂不同意',
      mode: 'mock',
      error
    }
  }
}

async function completePresenceConversation(id) {
  try {
    const data = await callApi('presence.conversation.complete', { id })
    return {
      ...data,
      mode: 'cloud'
    }
  } catch (error) {
    return {
      ok: true,
      message: '已转入写此刻',
      mode: 'mock',
      error
    }
  }
}

module.exports = {
  bootstrapBackend,
  ensureCurrentUser,
  fetchDiscoveryFeed,
  fetchTopicDetail,
  applyToTopic,
  fetchProfileHome,
  fetchEventDetail,
  fetchPersonProfile,
  fetchMembershipOverview,
  fetchInviteStatus,
  createLaunch,
  fetchPresenceOverview,
  fetchPresenceRoom,
  sendPresenceRoomMessage,
  decidePresenceConversation,
  completePresenceConversation
}
