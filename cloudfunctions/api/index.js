const cloud = require('wx-server-sdk')
const seed = require('./seed')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

const COLLECTIONS = {
  users: 'simpex_users',
  venues: 'simpex_venues',
  topics: 'simpex_topics',
  people: 'simpex_people',
  profileEvents: 'simpex_profile_events',
  officialEvents: 'simpex_official_events',
  applications: 'simpex_topic_applications',
  memberships: 'simpex_memberships',
  invites: 'simpex_invites',
  launchRequests: 'simpex_launch_requests',
  presenceConversations: 'simpex_presence_conversations',
  presenceRooms: 'simpex_presence_rooms',
  venueRecommendations: 'simpex_venue_recommendations',
  eventRsvps: 'simpex_event_rsvps',
  eventPins: 'simpex_event_pins'
}

const COLLECTION_NAMES = Object.values(COLLECTIONS)

const groupByKey = (items, key = 'id') => items.reduce((accumulator, item) => {
  accumulator[item[key]] = item
  return accumulator
}, {})

const safeGetCollection = (name) => db.collection(name)

async function readAll(name) {
  const result = await safeGetCollection(name).limit(100).get()
  return result.data || []
}

async function readOneWhere(name, where) {
  const result = await safeGetCollection(name).where(where).limit(1).get()
  return (result.data && result.data[0]) || null
}

function nowTimestamp() {
  return Date.now()
}

function formatClock(timestamp = Date.now()) {
  const date = new Date(timestamp)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function createInviteCode(user) {
  const base = (user.name || user.initial || 'SIMPEX').replace(/\s+/g, '').toUpperCase()
  return `${base.slice(0, 6)}-2026`
}

function createLaunchTopicId() {
  return `topic-${nowTimestamp()}`
}

function createLaunchRequestId() {
  return `launch-${nowTimestamp()}`
}

function toTopicCard(topic, peopleById) {
  return {
    ...topic,
    participants: (topic.participants || []).map((personId) => {
      const person = typeof personId === 'string' ? peopleById[personId] : peopleById[personId.id]
      if (!person) return null
      return {
        id: person.id,
        name: person.name,
        role: person.bio,
        initial: person.initial
      }
    }).filter(Boolean)
  }
}

function buildMembershipOverview(membership, invite) {
  const selectedPlanKey = membership.selectedPlanKey || seed.defaultMembership.selectedPlanKey
  const activePlan = seed.membershipPlans.find((item) => item.key === selectedPlanKey) || seed.membershipPlans[0]
  return {
    selectedPlanKey,
    planOptions: seed.membershipPlans,
    activePlan,
    activeBenefits: seed.membershipBenefitsByPlan[selectedPlanKey] || seed.membershipBenefitsByPlan.week,
    membershipBenefitsByPlan: seed.membershipBenefitsByPlan,
    cobuildBenefits: seed.cobuildBenefits,
    quota: membership.quota || seed.defaultMembership.quota,
    limitedQuota: membership.quota || seed.defaultMembership.quota,
    inviteProgram: membership.inviteProgram || seed.defaultMembership.inviteProgram,
    inviteCode: invite.code
  }
}

function buildInviteStatus(invite) {
  return {
    inviteCode: invite.code,
    unlockSlots: invite.unlockSlots || seed.inviteUnlockSlots
  }
}

function buildBlackholeRows(items) {
  const rows = []
  for (let index = 0; index < items.length; index += 2) {
    rows.push({
      id: `row-${index / 2}`,
      left: items[index] || null,
      right: items[index + 1] || null
    })
  }
  return rows
}

function buildLaunchTopic(payload, user) {
  const launchMode = payload.launchMode === 'offline' ? 'offline' : 'online'
  const current = 1
  const total = 6
  const venueName = launchMode === 'offline' ? (payload.venue || '待确认场地') : (payload.platform || '线上房间')
  return {
    id: createLaunchTopicId(),
    venueId: '',
    dateKey: '',
    monthLabel: '',
    dayLabel: '',
    weekday: '',
    status: 'pending_review',
    statusLabel: '待审核',
    title: `"${payload.topic}"`,
    initiator: user.name,
    time: payload.time || '时间待确认',
    location: venueName,
    tags: launchMode === 'offline' ? ['线下发起'] : ['线上发起'],
    current,
    total,
    rules: payload.joinHint || '等待确认加入方式',
    participants: [],
    source: payload.source || 'direct',
    launchMode,
    reason: payload.reason || '',
    createdBy: user.id,
    createdAt: nowTimestamp()
  }
}

function buildPresenceDecision(conversation, decision) {
  if (decision === 'approve') {
    return {
      ...conversation,
      status: 'confirmed',
      statusLabel: '已确认加入',
      statusHint: '你已同意这位申请者加入。这场对话现在已经进入待到场状态。',
      autoConfirmHint: '票据与同场名单已就绪。',
      ticketReady: true,
      roomReady: true,
      updatedAt: nowTimestamp()
    }
  }

  return {
    ...conversation,
    status: 'declined',
    statusLabel: '你已婉拒',
    statusHint: '你刚刚婉拒了这次申请。系统会继续为对方推荐别的相遇。',
    autoConfirmHint: '这条提醒会在稍后淡出列表。',
    ticketReady: false,
    roomReady: false,
    updatedAt: nowTimestamp()
  }
}

function buildCompletedConversation(conversation) {
  const scheduleTail = conversation.schedule.includes('·')
    ? conversation.schedule.split('·').slice(1).join('·').trim()
    : conversation.schedule

  return {
    ...conversation,
    role: 'ended',
    roleLabel: '刚刚结束',
    status: 'recap',
    statusLabel: '写此刻',
    statusHint: '这一刻已经过去了。如果愿意，留一句话或一张照片，让它成为下次相遇前的期待。',
    autoConfirmHint: '你留下的内容，会在下次对话前被温柔展示。',
    ticketReady: false,
    roomReady: false,
    schedule: `刚刚结束 · ${scheduleTail}`,
    updatedAt: nowTimestamp()
  }
}

function buildMomentFromConversation(conversation, user) {
  return {
    id: `my-event-${nowTimestamp()}`,
    ownerId: user.id,
    sourceConversationId: conversation.id,
    previewEyebrow: '写此刻',
    previewTitle: conversation.title,
    previewText: '这一场刚刚结束，但它留下来的感觉还在。',
    kindLabel: '一句话',
    title: conversation.title,
    venue: conversation.venue,
    date: new Date().toISOString().slice(5, 10).replace('-', '/'),
    heroTone: String(nowTimestamp() % 5),
    anchor: '写此刻',
    body: `今晚在 ${conversation.venue} 的这场见面刚刚结束。真正被留下来的不是结论，而是我终于愿意把一些原本不会说出来的话慢慢说完整。`,
    summary: '这是一次见面之后自动生成的第一版沉淀。',
    identityLens: '它会让后来的自己记得，这次相遇里你是怎样在场的。',
    innerQuestion: '如果下一次还会见面，我最想继续聊下去的那一部分是什么？',
    graphTag: '在场感',
    footnote: '来自一场刚刚结束的见面',
    createdAt: nowTimestamp(),
    updatedAt: nowTimestamp()
  }
}

async function ensureSeedData() {
  for (const [collectionName, items] of [
    [COLLECTIONS.venues, seed.venues],
    [COLLECTIONS.topics, seed.topics],
    [COLLECTIONS.people, seed.people],
    [COLLECTIONS.profileEvents, seed.profileEvents],
    [COLLECTIONS.officialEvents, seed.officialEvents],
    [COLLECTIONS.presenceConversations, seed.presenceConversations],
    [COLLECTIONS.presenceRooms, seed.presenceRooms]
  ]) {
    const existing = await readAll(collectionName)
    if (existing.length > 0) continue
    for (const item of items) {
      await safeGetCollection(collectionName).add({ data: item })
    }
  }
}

async function ensureUser(openid) {
  const existing = await readOneWhere(COLLECTIONS.users, { openid })
  if (existing) return existing

  const user = {
    openid,
    ...seed.defaultUser,
    createdAt: nowTimestamp(),
    updatedAt: nowTimestamp()
  }
  await safeGetCollection(COLLECTIONS.users).add({ data: user })
  return user
}

async function ensureMembership(user) {
  const existing = await readOneWhere(COLLECTIONS.memberships, { userId: user.id })
  if (existing) return existing

  const membership = {
    userId: user.id,
    selectedPlanKey: seed.defaultMembership.selectedPlanKey,
    quota: seed.defaultMembership.quota,
    inviteProgram: seed.defaultMembership.inviteProgram,
    createdAt: nowTimestamp(),
    updatedAt: nowTimestamp()
  }
  await safeGetCollection(COLLECTIONS.memberships).add({ data: membership })
  return membership
}

async function ensureInvite(user) {
  const existing = await readOneWhere(COLLECTIONS.invites, { userId: user.id })
  if (existing) return existing

  const invite = {
    userId: user.id,
    code: createInviteCode(user),
    unlockSlots: seed.inviteUnlockSlots,
    createdAt: nowTimestamp(),
    updatedAt: nowTimestamp()
  }
  await safeGetCollection(COLLECTIONS.invites).add({ data: invite })
  return invite
}

async function bootstrap() {
  try {
    await ensureSeedData()
    return {
      ok: true,
      data: {
        collections: COLLECTION_NAMES
      }
    }
  } catch (error) {
    return {
      ok: false,
      message: `Bootstrap failed: ${error.message}`
    }
  }
}

async function authSession(openid) {
  const user = await ensureUser(openid)
  return {
    ok: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        initial: user.initial,
        bio: user.bio,
        location: user.location,
        tags: user.tags
      }
    }
  }
}

async function discoveryFeed() {
  const [venues, topics, people] = await Promise.all([
    readAll(COLLECTIONS.venues),
    readAll(COLLECTIONS.topics),
    readAll(COLLECTIONS.people)
  ])

  const peopleById = groupByKey(people)
  const venueCards = venues.map((item) => ({
    ...item,
    monthLabel: `${new Date().getMonth() + 1}月`,
    dayLabel: `${new Date().getDate()}`,
    dateCopy: `今天 · 周${'日一二三四五六'[new Date().getDay()]}`
  }))

  return {
    ok: true,
    data: {
      venues: venueCards,
      topics: topics.map((item) => toTopicCard(item, peopleById))
    }
  }
}

async function topicDetail(id) {
  const [topic, people] = await Promise.all([
    readOneWhere(COLLECTIONS.topics, { id }),
    readAll(COLLECTIONS.people)
  ])

  if (!topic) {
    return { ok: false, message: 'Topic not found.' }
  }

  return {
    ok: true,
    data: toTopicCard(topic, groupByKey(people))
  }
}

async function topicRsvp(id, openid) {
  const user = await ensureUser(openid)
  const existing = await readOneWhere(COLLECTIONS.applications, {
    topicId: id,
    openid
  })

  if (existing) {
    return {
      ok: true,
      data: {
        ok: true,
        message: '你已经申请过这场对话了'
      }
    }
  }

  await safeGetCollection(COLLECTIONS.applications).add({
    data: {
      topicId: id,
      openid,
      userId: user.id,
      status: 'pending',
      createdAt: nowTimestamp(),
      updatedAt: nowTimestamp()
    }
  })

  return {
    ok: true,
    data: {
      ok: true,
      message: '已提交申请，等待发起人确认'
    }
  }
}

async function profileHome(openid) {
  const ensuredUser = await ensureUser(openid)
  const [user, events] = await Promise.all([
    readOneWhere(COLLECTIONS.users, { openid }),
    readAll(COLLECTIONS.profileEvents)
  ])
  const activeUser = user || ensuredUser

  return {
    ok: true,
    data: {
      user: {
        id: activeUser.id,
        name: activeUser.name,
        initial: activeUser.initial,
        bio: activeUser.bio,
        location: activeUser.location,
        tags: activeUser.tags
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
      eventSlides: events.filter((item) => item.ownerId === activeUser.id)
    }
  }
}

async function eventDetail(id, source) {
  if (source === 'profile') {
    const event = await readOneWhere(COLLECTIONS.profileEvents, { id })
    if (!event) return { ok: false, message: 'Event not found.' }
    return { ok: true, data: event }
  }

  const result = await readAll(COLLECTIONS.officialEvents)
  return {
    ok: true,
    data: result[0]
  }
}

async function peopleDetail(id) {
  const [person, events] = await Promise.all([
    readOneWhere(COLLECTIONS.people, { id }),
    readAll(COLLECTIONS.profileEvents)
  ])

  if (!person) return { ok: false, message: 'Person not found.' }

  return {
    ok: true,
    data: {
      person,
      visibleEvents: events.filter((item) => (person.eventIds || []).includes(item.id))
    }
  }
}

async function venueDetail(id) {
  const [venue, topics, people] = await Promise.all([
    readOneWhere(COLLECTIONS.venues, { id }),
    readAll(COLLECTIONS.topics),
    readAll(COLLECTIONS.people)
  ])

  if (!venue) return { ok: false, message: 'Venue not found.' }

  const peopleById = groupByKey(people)
  const venueTopics = topics
    .filter((item) => item.venueId === venue.id)
    .sort((left, right) => new Date(left.dateKey).getTime() - new Date(right.dateKey).getTime())
    .map((item) => toTopicCard(item, peopleById))

  return {
    ok: true,
    data: {
      venue,
      venueTopics,
      venueTodayMood: `今天${venue.mood}`
    }
  }
}

async function blackholeOverview() {
  const venues = await readAll(COLLECTIONS.venues)
  return {
    ok: true,
    data: {
      venues,
      goodPeople: seed.blackholePeople,
      goodPeopleRows: buildBlackholeRows(seed.blackholePeople)
    }
  }
}

async function venueRecommend(payload, openid) {
  const user = await ensureUser(openid)
  await safeGetCollection(COLLECTIONS.venueRecommendations).add({
    data: {
      id: `venue-rec-${nowTimestamp()}`,
      userId: user.id,
      openid,
      venueName: payload.venueName || '',
      note: payload.note || '',
      status: 'pending_review',
      createdAt: nowTimestamp(),
      updatedAt: nowTimestamp()
    }
  })

  return {
    ok: true,
    data: {
      ok: true,
      message: '已收到你的空间推荐，审核后会进入正式空间列表'
    }
  }
}

async function membershipOverview(openid) {
  const user = await ensureUser(openid)
  const membership = await ensureMembership(user)
  const invite = await ensureInvite(user)
  return {
    ok: true,
    data: buildMembershipOverview(membership, invite)
  }
}

async function inviteStatus(openid) {
  const user = await ensureUser(openid)
  const invite = await ensureInvite(user)
  return {
    ok: true,
    data: buildInviteStatus(invite)
  }
}

async function eventRsvp(id, source, openid) {
  const user = await ensureUser(openid)
  const existing = await readOneWhere(COLLECTIONS.eventRsvps, {
    eventId: id,
    userId: user.id
  })

  if (existing) {
    return {
      ok: true,
      data: {
        ok: true,
        message: '你已经预约过这场见面了'
      }
    }
  }

  await safeGetCollection(COLLECTIONS.eventRsvps).add({
    data: {
      id: `event-rsvp-${nowTimestamp()}`,
      eventId: id,
      source: source || 'official',
      userId: user.id,
      openid,
      status: 'reserved',
      createdAt: nowTimestamp(),
      updatedAt: nowTimestamp()
    }
  })

  return {
    ok: true,
    data: {
      ok: true,
      message: '预约成功'
    }
  }
}

async function eventPin(id, source, openid) {
  const user = await ensureUser(openid)
  const existing = await readOneWhere(COLLECTIONS.eventPins, {
    eventId: id,
    userId: user.id
  })

  if (existing) {
    return {
      ok: true,
      data: {
        ok: true,
        message: '这条内容已经保存过了'
      }
    }
  }

  await safeGetCollection(COLLECTIONS.eventPins).add({
    data: {
      id: `event-pin-${nowTimestamp()}`,
      eventId: id,
      source: source || 'official',
      userId: user.id,
      openid,
      createdAt: nowTimestamp(),
      updatedAt: nowTimestamp()
    }
  })

  return {
    ok: true,
    data: {
      ok: true,
      message: '已保存思考'
    }
  }
}

async function launchCreate(payload, openid) {
  const user = await ensureUser(openid)
  const topic = buildLaunchTopic(payload, user)
  const launchRequest = {
    id: createLaunchRequestId(),
    userId: user.id,
    openid,
    source: payload.source || 'direct',
    launchMode: payload.launchMode === 'offline' ? 'offline' : 'online',
    topic: payload.topic || '',
    reason: payload.reason || '',
    time: payload.time || '',
    venue: payload.venue || '',
    platform: payload.platform || '',
    joinHint: payload.joinHint || '',
    topicId: topic.id,
    status: 'submitted',
    createdAt: nowTimestamp(),
    updatedAt: nowTimestamp()
  }

  await safeGetCollection(COLLECTIONS.launchRequests).add({ data: launchRequest })
  await safeGetCollection(COLLECTIONS.topics).add({ data: topic })

  return {
    ok: true,
    data: {
      ok: true,
      message: '已提交发起请求，等待进入匹配与审核流程',
      topic
    }
  }
}

async function presenceOverview() {
  const [presenceConversations, presenceRooms] = await Promise.all([
    readAll(COLLECTIONS.presenceConversations),
    readAll(COLLECTIONS.presenceRooms)
  ])

  return {
    ok: true,
    data: {
      presenceEvent: seed.presenceEvent,
      attendeeCards: seed.attendeeCards,
      presenceConversations,
      roomsReadyCount: presenceRooms.length
    }
  }
}

async function presenceRoomDetail(id) {
  const room = await readOneWhere(COLLECTIONS.presenceRooms, { conversationId: id })
  if (!room) {
    return { ok: false, message: 'Presence room not found.' }
  }

  return {
    ok: true,
    data: room
  }
}

async function presenceRoomSend(id, text) {
  const room = await readOneWhere(COLLECTIONS.presenceRooms, { conversationId: id })
  if (!room) {
    return { ok: false, message: 'Presence room not found.' }
  }

  const nextMessage = {
    id: `${id}-${nowTimestamp()}`,
    type: 'self',
    name: '你',
    text,
    time: formatClock()
  }

  const messages = [...(room.messages || []), nextMessage]
  await safeGetCollection(COLLECTIONS.presenceRooms).doc(room._id).update({
    data: {
      messages,
      updatedAt: nowTimestamp()
    }
  })

  return {
    ok: true,
    data: {
      ok: true,
      message: '已发送到同行房',
      room: {
        ...room,
        messages
      }
    }
  }
}

async function presenceConversationDecide(id, decision) {
  const conversation = await readOneWhere(COLLECTIONS.presenceConversations, { id })
  if (!conversation) {
    return { ok: false, message: 'Conversation not found.' }
  }

  const nextConversation = buildPresenceDecision(conversation, decision)
  await safeGetCollection(COLLECTIONS.presenceConversations).doc(conversation._id).update({
    data: nextConversation
  })

  return {
    ok: true,
    data: {
      ok: true,
      conversation: nextConversation,
      message: decision === 'approve' ? '已同意加入' : '已暂不同意'
    }
  }
}

async function presenceConversationComplete(id) {
  const conversation = await readOneWhere(COLLECTIONS.presenceConversations, { id })
  if (!conversation) {
    return { ok: false, message: 'Conversation not found.' }
  }

  const nextConversation = buildCompletedConversation(conversation)
  await safeGetCollection(COLLECTIONS.presenceConversations).doc(conversation._id).update({
    data: nextConversation
  })

  return {
    ok: true,
    data: {
      ok: true,
      conversation: nextConversation,
      message: '已转入写此刻'
    }
  }
}

async function momentCreate(conversationId, openid) {
  const user = await ensureUser(openid)
  const conversation = await readOneWhere(COLLECTIONS.presenceConversations, { id: conversationId })
  if (!conversation) {
    return { ok: false, message: 'Conversation not found.' }
  }

  const existing = await readOneWhere(COLLECTIONS.profileEvents, {
    sourceConversationId: conversationId,
    ownerId: user.id
  })
  if (existing) {
    return {
      ok: true,
      data: {
        ok: true,
        message: '这场见面的沉淀已经生成过了',
        event: existing
      }
    }
  }

  const event = buildMomentFromConversation(conversation, user)
  await safeGetCollection(COLLECTIONS.profileEvents).add({ data: event })

  return {
    ok: true,
    data: {
      ok: true,
      message: '已生成一条见后沉淀',
      event
    }
  }
}

exports.main = async (event = {}) => {
  const {
    action,
    id,
    source,
    text,
    decision,
    launchMode,
    topic,
    reason,
    time,
    venue,
    platform,
    joinHint,
    note,
    venueName
  } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID || 'local-openid'

  switch (action) {
    case 'bootstrap':
      return bootstrap()
    case 'auth.session':
      return authSession(openid)
    case 'discovery.feed':
      return discoveryFeed()
    case 'topics.detail':
      return topicDetail(id)
    case 'topics.rsvp':
      return topicRsvp(id, openid)
    case 'profile.home':
      return profileHome(openid)
    case 'events.detail':
      return eventDetail(id, source)
    case 'people.detail':
      return peopleDetail(id)
    case 'venues.detail':
      return venueDetail(id)
    case 'blackhole.overview':
      return blackholeOverview()
    case 'venues.recommend':
      return venueRecommend({ venueName, note }, openid)
    case 'membership.overview':
      return membershipOverview(openid)
    case 'invite.status':
      return inviteStatus(openid)
    case 'events.rsvp':
      return eventRsvp(id, source, openid)
    case 'events.pin':
      return eventPin(id, source, openid)
    case 'launch.create':
      return launchCreate({
        source,
        launchMode,
        topic,
        reason,
        time,
        venue,
        platform,
        joinHint
      }, openid)
    case 'presence.overview':
      return presenceOverview()
    case 'presence.room.detail':
      return presenceRoomDetail(id)
    case 'presence.room.send':
      return presenceRoomSend(id, text)
    case 'presence.conversation.decide':
      return presenceConversationDecide(id, decision)
    case 'presence.conversation.complete':
      return presenceConversationComplete(id)
    case 'moments.create':
      return momentCreate(id, openid)
    default:
      return {
        ok: false,
        message: `Unknown action: ${action || 'undefined'}`
      }
  }
}
