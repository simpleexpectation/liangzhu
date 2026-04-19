export interface BackendUser {
  id: string
  name: string
  initial: string
  bio: string
  location: string
  tags: string[]
}

export interface Venue {
  id: string
  name: string
  caption: string
  mood: string
  heroImage?: string
  cluster: string
  vibe: string
  bestFor: string
  timePreference: string
  addressHint: string
  sourceStatus: string
}

export interface TopicParticipant {
  id: string
  name: string
  role: string
  initial: string
}

export interface Topic {
  id: string
  venueId: string
  dateKey: string
  monthLabel: string
  dayLabel: string
  weekday: string
  status: string
  statusLabel: string
  title: string
  initiator: string
  time: string
  location: string
  tags: string[]
  current: number
  total: number
  rules: string
  participants: TopicParticipant[]
}

export interface ProfileEvent {
  id: string
  previewEyebrow?: string
  kindLabel: string
  previewTitle: string
  previewText: string
  graphTag: string
  venue: string
  venueShort?: string
  relativeTime?: string
  indexLabel?: string
  identityLens: string
  summary: string
  footnote: string
  date: string
  heroTone: string
  body: string
  innerQuestion: string
}

export interface PersonProfile {
  id: string
  name: string
  initial: string
  bio: string
  location: string
  tags: string[]
  connectionHint: string
}

export interface GoodPersonCard {
  id: string
  personId: string
  name: string
  line: string
  title: string
  quote: string
  tone: string
}

export interface MembershipPlan {
  key: string
  badge: string
  title: string
  plan: string
  price: string
  billing: string
  copy: string
  renewal: string
  cta: string
}

export interface MembershipBenefit {
  icon: string
  title: string
}

export interface MembershipOverview {
  selectedPlanKey: string
  planOptions: MembershipPlan[]
  activePlan: MembershipPlan
  activeBenefits: MembershipBenefit[]
  membershipBenefitsByPlan: Record<string, MembershipBenefit[]>
  cobuildBenefits: MembershipBenefit[]
  quota: { remaining: number; total: number }
  limitedQuota: { remaining: number; total: number }
  inviteProgram: { buttonText: string; description: string }
  inviteCode: string
}

export interface InviteSlot {
  key: string
  label: string
  status: string
  active: boolean
}

export interface PresenceEvent {
  title: string
  schedule: string
  venue: string
  status: string
  passCode: string
  qrHint: string
  notice: string
}

export interface PresenceAttendeeCard {
  id: string
  name: string
  line: string
  expectation: string
  accent: string
}

export interface PresenceConversation {
  id: string
  title: string
  schedule: string
  venue: string
  month: string
  day: string
  role: string
  roleLabel: string
  status: string
  statusLabel: string
  statusHint: string
  autoConfirmHint: string
  ticketReady: boolean
  roomReady: boolean
  attendeeCount: number
  featuredAttendeeId: string
  featuredAttendeeName: string
  featuredAttendeeLine: string
}

export interface PresenceRoomMessage {
  id: string
  type: string
  name: string
  text: string
  time: string
}

export interface PresenceRoom {
  conversationId: string
  title: string
  schedule: string
  venue: string
  badge: string
  hint: string
  prompt: string
  participants: string[]
  messages: PresenceRoomMessage[]
}

export function bootstrapBackend(): Promise<{ mode: 'cloud' | 'mock'; error?: unknown }>
export function ensureCurrentUser(): Promise<{ mode: 'cloud' | 'mock'; user: BackendUser; error?: unknown }>
export function fetchDiscoveryFeed(): Promise<{ mode: 'cloud' | 'mock'; venues: Venue[]; topics: Topic[]; error?: unknown }>
export function fetchTopicDetail(id: string): Promise<{ mode: 'cloud' | 'mock'; topic: Topic; error?: unknown }>
export function applyToTopic(id: string): Promise<{ mode: 'cloud' | 'mock'; ok: boolean; message: string; error?: unknown }>
export function fetchProfileHome(): Promise<{
  mode: 'cloud' | 'mock'
  user: BackendUser
  unlockEntry: { badge: string; title: string; detail: string; cta: string }
  coBuildEntry: { badge: string; title: string; detail: string; cta: string }
  eventSlides: ProfileEvent[]
  error?: unknown
}>
export function fetchEventDetail(options?: { id?: string; source?: string }): Promise<{
  mode: 'cloud' | 'mock'
  detailMode: 'official' | 'profile'
  event: any
  error?: unknown
}>
export function fetchPersonProfile(id: string): Promise<{
  mode: 'cloud' | 'mock'
  person: PersonProfile
  visibleEvents: ProfileEvent[]
  error?: unknown
}>
export function fetchVenueDetail(id: string): Promise<{
  mode: 'cloud' | 'mock'
  venue: Venue
  venueTopics: Topic[]
  venueTodayMood: string
  error?: unknown
}>
export function fetchBlackholeOverview(): Promise<{
  mode: 'cloud' | 'mock'
  venues: Venue[]
  goodPeople: GoodPersonCard[]
  goodPeopleRows: Array<{ id: string; left: GoodPersonCard | null; right: GoodPersonCard | null }>
  error?: unknown
}>
export function submitVenueRecommendation(payload?: { venueName?: string; note?: string }): Promise<{
  mode: 'cloud' | 'mock'
  ok: boolean
  message: string
  error?: unknown
}>
export function fetchMembershipOverview(): Promise<MembershipOverview & { mode: 'cloud' | 'mock'; error?: unknown }>
export function fetchInviteStatus(): Promise<{
  mode: 'cloud' | 'mock'
  inviteCode: string
  unlockSlots: InviteSlot[]
  error?: unknown
}>
export function rsvpEvent(payload?: { id?: string; source?: string }): Promise<{
  mode: 'cloud' | 'mock'
  ok: boolean
  message: string
  error?: unknown
}>
export function pinEvent(payload?: { id?: string; source?: string }): Promise<{
  mode: 'cloud' | 'mock'
  ok: boolean
  message: string
  error?: unknown
}>
export function createLaunch(payload: {
  source?: string
  launchMode?: string
  topic?: string
  reason?: string
  time?: string
  venue?: string
  platform?: string
  joinHint?: string
}): Promise<{
  mode: 'cloud' | 'mock'
  ok: boolean
  message: string
  topic: any
  error?: unknown
}>
export function fetchPresenceOverview(): Promise<{
  mode: 'cloud' | 'mock'
  presenceEvent: PresenceEvent
  attendeeCards: PresenceAttendeeCard[]
  presenceConversations: PresenceConversation[]
  error?: unknown
}>
export function fetchPresenceRoom(id: string): Promise<{
  mode: 'cloud' | 'mock'
  room: PresenceRoom
  error?: unknown
}>
export function sendPresenceRoomMessage(id: string, text: string): Promise<{
  mode: 'cloud' | 'mock'
  ok: boolean
  message: string
  room: PresenceRoom
  error?: unknown
}>
export function decidePresenceConversation(id: string, decision: 'approve' | 'reject'): Promise<{
  mode: 'cloud' | 'mock'
  ok: boolean
  message: string
  conversation?: PresenceConversation
  error?: unknown
}>
export function completePresenceConversation(id: string): Promise<{
  mode: 'cloud' | 'mock'
  ok: boolean
  message: string
  conversation?: PresenceConversation
  error?: unknown
}>
export function createMomentFromConversation(id: string): Promise<{
  mode: 'cloud' | 'mock'
  ok: boolean
  message: string
  event?: any
  error?: unknown
}>
