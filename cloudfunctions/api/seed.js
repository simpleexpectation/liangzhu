const venues = [
  {
    id: 'venue-kuangye',
    name: '敞开酒馆',
    caption: '适合慢下来说真话',
    mood: '适合慢下来说真话',
    discount: '会员 8.5 折',
    presence: '在店 11 人'
  },
  {
    id: 'venue-boguang',
    name: '泊光集',
    caption: '适合深夜反刍与复盘',
    mood: '适合深夜反刍与复盘',
    discount: '赠热饮一杯',
    presence: '在店 7 人'
  },
  {
    id: 'venue-cat',
    name: '猫客厅',
    caption: '适合轻松破冰与漫谈',
    mood: '适合轻松破冰与漫谈',
    discount: '会员专属入场',
    presence: '在店 14 人'
  }
]

const topics = [
  {
    id: 'topic-1',
    venueId: 'venue-kuangye',
    dateKey: '2026-03-20',
    monthLabel: '3月',
    dayLabel: '20',
    weekday: '五',
    status: 'live',
    statusLabel: '正在发生',
    title: '"离职之后，你是怎么重新找到节奏的？"',
    initiator: '阿强',
    time: '22:30 · 今晚',
    location: '文二路某咖啡馆',
    tags: ['Gap Year', '职场'],
    current: 4,
    total: 6,
    rules: '< 6人 · 时长 > 2小时 · 用户自发',
    participants: ['person-qingyuan', 'person-xiaoyue', 'person-momo', 'person-aki']
  },
  {
    id: 'topic-2',
    venueId: 'venue-boguang',
    dateKey: '2026-03-21',
    monthLabel: '3月',
    dayLabel: '21',
    weekday: '六',
    status: 'upcoming',
    statusLabel: '明天发生',
    title: '"AI 会不会让创意工作者失业？我不这么认为"',
    initiator: '七哥',
    time: '20:00 · 明天',
    location: '某 Co-working Space',
    tags: ['AI', '创意', '辩论'],
    current: 3,
    total: 6,
    rules: '< 6人 · 时长 > 2小时 · 用户自发',
    participants: ['person-lynn', 'person-momo', 'person-aki']
  },
  {
    id: 'topic-3',
    venueId: 'venue-cat',
    dateKey: '2026-03-22',
    monthLabel: '3月',
    dayLabel: '22',
    weekday: '日',
    status: 'live',
    statusLabel: '正在发生',
    title: '"当代城市里，什么是真正的孤独？"',
    initiator: '子木',
    time: '23:00 · 今晚',
    location: '西湖边某处',
    tags: ['城市', '孤独', '深度'],
    current: 2,
    total: 6,
    rules: '< 6人 · 时长 > 2小时 · 用户自发',
    participants: ['person-qingyuan', 'person-xiaoyue']
  }
]

const people = [
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

const profileEvents = [
  {
    id: 'my-event-1',
    ownerId: 'demo-user',
    previewEyebrow: '一句话',
    previewTitle: '我开始允许自己慢下来',
    previewText: '先承认自己已经太久没有停下来。',
    kindLabel: '一句话',
    title: '离职之后，你是怎么重新找到节奏的？',
    venue: '文二路某咖啡馆',
    date: '04/01',
    heroTone: '0',
    anchor: '写此刻',
    body: '在泊光集聊完之后，我终于决定停掉一个无效合作。原来重新找到节奏，不是立刻开始新的计划，而是先承认自己已经太久没有停下来。',
    summary: '一句话也可以成为一场相遇的后续。',
    identityLens: '它让别人看见，你不是一个一直往前冲的人。你在意节奏，也在意自己有没有被生活真正接住。',
    innerQuestion: '如果不再用效率证明自己，我还可以怎样定义现在的我？',
    graphTag: '节奏感',
    footnote: '来自一场刚结束的对话'
  },
  {
    id: 'my-event-2',
    ownerId: 'demo-user',
    previewEyebrow: '照片 + 文字',
    previewTitle: '风很大的夜里',
    previewText: '夜色',
    kindLabel: '照片',
    title: '当代城市里，什么是真正的孤独？',
    venue: '西湖边某处',
    date: '03/28',
    heroTone: '1',
    anchor: '一张照片',
    body: '那天的风很大，我们聊完以后沿着湖边走了很久，谁都没有急着离开。后来只留下这一张不太清晰的照片，但它反而比记叙更像真实发生过。',
    summary: '它会在下一次相遇前，轻轻提醒对方你曾经如何在场。',
    identityLens: '它代表你会记住氛围、停顿和人与空间之间的细小关系，而不只是结论本身。',
    innerQuestion: '什么样的时刻，会让我愿意和一个人继续走下去，而不是聊完就散？',
    graphTag: '场景感',
    footnote: '一张照片也能成为事件'
  },
  {
    id: 'my-event-3',
    ownerId: 'demo-user',
    previewEyebrow: '图文一起',
    previewTitle: '终于愿意把焦虑说完整',
    previewText: '泊光集',
    kindLabel: '图文',
    title: '设计焦虑与不确定感的对话',
    venue: '泊光集',
    date: '03/22',
    heroTone: '2',
    anchor: '图文一起',
    body: '第一次把焦虑说完整，发现它没有那么可怕。原来最难的不是解决问题，而是承认自己其实已经很累了。',
    summary: '这是你最常被点开的事件。',
    identityLens: '它会让人感到，你并不只想交换观点，你也愿意把自己真实卡住的地方说出来。',
    innerQuestion: '当我不再急着看起来成熟，什么样的连接才会开始发生？',
    graphTag: '脆弱感',
    footnote: '最近最常被看到的一则'
  }
]

const officialEvents = [
  {
    id: 'event-night-0322',
    title: '设计焦虑与不确定感的对话',
    subtitle: '今晚 19:30 - 21:30 · 泊光集 · 余位 7',
    host: '引导人 Iris',
    description: '把工作里的噪音留在门外，只讨论那些你最近真正卡住的事。',
    status: '报名中',
    schedule: '今晚 19:30 - 21:30',
    location: '泊光集 · 杭州天目里附近',
    guide: 'Iris · 产品叙事研究',
    seatsText: '报名中 · 余 7 位（限额 20 人）'
  }
]

const membershipPlans = [
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

const membershipBenefitsByPlan = {
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

const cobuildBenefits = [
  { icon: '◉', title: '核心动作是邀请同频好友，而不是拉泛流量' },
  { icon: '✦', title: '每成功邀请一位完成月度订阅，你会获得25%对应的持续关键回馈' },
  { icon: '◈', title: '共建者可获得月卡权益与长期共建身份标识' },
  { icon: '⌖', title: '面向已被验证的高质量参与者、发起者与 KOL 开放' }
]

const inviteUnlockSlots = [
  { key: 'self', label: '你自己', status: '已点亮', active: true },
  { key: 'friend-a', label: '好友 #1', status: '等待中', active: false },
  { key: 'friend-b', label: '好友 #2', status: '等待中', active: false }
]

const attendeeCards = [
  {
    id: 'attendee-1',
    name: '青原',
    line: '一个正在研究哲学的程序员',
    expectation: '工作之外，什么还能定义一个人',
    accent: 'peach'
  },
  {
    id: 'attendee-2',
    name: 'Momo',
    line: '做城市策展，也在学习慢一点生活',
    expectation: '会带来一个关于城市陌生感的真实故事',
    accent: 'mist'
  },
  {
    id: 'attendee-3',
    name: 'Aki',
    line: '拍纪录片，也写诗',
    expectation: '也许会把今晚某个瞬间变成一句被记住的话',
    accent: 'sand'
  },
  {
    id: 'attendee-4',
    name: 'Lynn',
    line: '在练习更松弛地创作',
    expectation: '最近正在重新定义努力与表达',
    accent: 'sky'
  },
  {
    id: 'attendee-5',
    name: '小越',
    line: '产品设计师，最近在重建节奏',
    expectation: '可能会谈到如何从失控里慢慢回来',
    accent: 'peach'
  },
  {
    id: 'attendee-6',
    name: 'Nora',
    line: '一个做播客的观察者',
    expectation: '她总能把别人的情绪说得很轻很准',
    accent: 'mist'
  }
]

const presenceEvent = {
  title: '设计焦虑与不确定感的对话',
  schedule: '今晚 19:30 - 21:30',
  venue: '泊光集 2F',
  status: '申请已确认',
  passCode: 'SPX-0721',
  qrHint: '到场后出示二维码完成签到，之后自动进入数字静默。',
  notice: '你已被加入本次在场名单。系统会在开场前 20 分钟再次提醒。'
}

const presenceConversations = [
  {
    id: 'presence-dialog-1',
    title: '设计焦虑与不确定感的对话',
    schedule: '今晚 19:30 - 21:30',
    venue: '泊光集 2F',
    month: '3月',
    day: '22日',
    role: 'applicant',
    roleLabel: '你申请加入',
    status: 'confirmed',
    statusLabel: '已确认',
    statusHint: '你和发起人都已确认，这场对话已经成立。',
    autoConfirmHint: '若 30 分钟内无人操作，系统将默认同意。',
    ticketReady: true,
    roomReady: true,
    attendeeCount: 6,
    featuredAttendeeId: 'attendee-1',
    featuredAttendeeName: '青原',
    featuredAttendeeLine: '一个正在研究哲学的程序员'
  },
  {
    id: 'presence-dialog-2',
    title: '离职之后，你是怎么重新找到节奏的？',
    schedule: '今晚 22:30 - 00:30',
    venue: '文二路某咖啡馆',
    month: '4月',
    day: '1日',
    role: 'applicant',
    roleLabel: '你申请加入',
    status: 'pending',
    statusLabel: '等待回应',
    statusHint: '发起人还没有处理你的申请。现在不需要你做任何事，只等对方点头。',
    autoConfirmHint: '若 30 分钟内仍未处理，系统将默认同意。',
    ticketReady: false,
    roomReady: false,
    attendeeCount: 4,
    featuredAttendeeId: 'attendee-2',
    featuredAttendeeName: 'Momo',
    featuredAttendeeLine: '做城市策展，也在学习慢一点生活'
  },
  {
    id: 'presence-dialog-3',
    title: '城市里的人情味，会如何慢慢长出来？',
    schedule: '明晚 20:00 - 22:00',
    venue: '旷野公社',
    month: '4月',
    day: '2日',
    role: 'host',
    roleLabel: '你发起的对话',
    status: 'pending',
    statusLabel: '待你确认',
    statusHint: '有 1 位申请者正在等待加入。你不处理的话，30 分钟后系统会默认同意。',
    autoConfirmHint: '剩余自动确认时间 17 分钟。',
    ticketReady: false,
    roomReady: false,
    attendeeCount: 4,
    featuredAttendeeId: 'attendee-4',
    featuredAttendeeName: 'Lynn',
    featuredAttendeeLine: '在练习更松弛地创作'
  },
  {
    id: 'presence-dialog-4',
    title: '人在亲密关系里，最难说出口的话是什么？',
    schedule: '4月3日 21:00 - 23:00',
    venue: '天目里咖啡厅',
    month: '4月',
    day: '3日',
    role: 'applicant',
    roleLabel: '你申请加入',
    status: 'declined',
    statusLabel: '未通过',
    statusHint: '这场对话这次没有和你匹配成功。你可以先放下，之后再看看别的相遇。',
    autoConfirmHint: '系统已为你保留同类型推荐。',
    ticketReady: false,
    roomReady: false,
    attendeeCount: 0,
    featuredAttendeeId: 'attendee-6',
    featuredAttendeeName: 'Nora',
    featuredAttendeeLine: '一个做播客的观察者'
  },
  {
    id: 'presence-dialog-5',
    title: '如果不再追求效率，生活会不会更完整？',
    schedule: '4月4日 15:00 - 17:00',
    venue: '西湖边书店',
    month: '4月',
    day: '4日',
    role: 'host',
    roleLabel: '你发起的对话',
    status: 'confirmed',
    statusLabel: '已成局',
    statusHint: '这场对话已经凑齐人了。你只需要按时到场，剩下的交给在场。',
    autoConfirmHint: '票据与同场名单已就绪。',
    ticketReady: true,
    roomReady: true,
    attendeeCount: 5,
    featuredAttendeeId: 'attendee-3',
    featuredAttendeeName: 'Aki',
    featuredAttendeeLine: '拍纪录片，也写诗'
  },
  {
    id: 'presence-dialog-6',
    title: '当代城市里，什么是真正的孤独？',
    schedule: '刚刚结束 · 今晚 23:00',
    venue: '西湖边某处',
    month: '4月',
    day: '1日',
    role: 'ended',
    roleLabel: '刚刚结束',
    status: 'recap',
    statusLabel: '写此刻',
    statusHint: '这一刻已经过去了。如果愿意，留一句话或一张照片，让它成为下次相遇前的期待。',
    autoConfirmHint: '你留下的内容，会在下次对话前被温柔展示。',
    ticketReady: false,
    roomReady: false,
    attendeeCount: 2,
    featuredAttendeeId: 'attendee-5',
    featuredAttendeeName: '小越',
    featuredAttendeeLine: '产品设计师，最近在重建节奏'
  }
]

const presenceRooms = [
  {
    conversationId: 'presence-dialog-1',
    title: '设计焦虑与不确定感的对话',
    schedule: '今晚 19:30 - 21:30',
    venue: '泊光集 2F',
    badge: '活动前同行房',
    hint: '只在开始前开放，开场后自动静默。',
    prompt: '现在不用把话说满，先轻轻开一个口就够了。',
    participants: ['青原', 'Momo', 'Aki', 'Lynn', '小越', 'Nora'],
    messages: [
      { id: 'room-1-msg-2', type: 'other', name: 'Momo', text: '我可能会提前十分钟到，想先找个靠窗的位置。', time: '19:02' },
      { id: 'room-1-msg-3', type: 'self', name: '你', text: '最近也一直在想，工作之外还有什么在定义一个人。', time: '19:06' },
      { id: 'room-1-msg-4', type: 'other', name: 'Aki', text: '今晚也许不用急着得出结论，先把那个卡住的点说出来就很好。', time: '19:08' }
    ]
  },
  {
    conversationId: 'presence-dialog-5',
    title: '如果不再追求效率，生活会不会更完整？',
    schedule: '4月4日 15:00 - 17:00',
    venue: '西湖边书店',
    badge: '活动前同行房',
    hint: '开始前可以先打个招呼，开场后这里会自动静下来。',
    prompt: '这更像一张安静留言板，不需要把它聊成一个大群。',
    participants: ['Aki', '青原', 'Lynn', 'Nora', '你'],
    messages: [
      { id: 'room-5-msg-2', type: 'other', name: 'Nora', text: '我会带一本最近在看的书过来，也许能接上今晚的话题。', time: '14:12' },
      { id: 'room-5-msg-3', type: 'other', name: 'Lynn', text: '我大概会提前一点到，想先在楼下站一会儿。', time: '14:15' }
    ]
  }
]

const defaultUser = {
  id: 'demo-user',
  name: 'Lynn',
  initial: 'L',
  bio: '在练习更松弛地创作',
  location: '中国 · 杭州',
  tags: ['创作者']
}

const defaultMembership = {
  selectedPlanKey: 'week',
  quota: {
    remaining: 12,
    total: 30
  },
  inviteProgram: {
    buttonText: '邀请 2 位好友，限时 0 元开启',
    description: '好友完成注册并参与第一次对话后，你的月卡自动生效。无需付款，无需等待。'
  }
}

module.exports = {
  venues,
  topics,
  people,
  profileEvents,
  officialEvents,
  membershipPlans,
  membershipBenefitsByPlan,
  cobuildBenefits,
  inviteUnlockSlots,
  attendeeCards,
  presenceEvent,
  presenceConversations,
  presenceRooms,
  defaultUser,
  defaultMembership
}
