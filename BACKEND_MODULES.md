# Simpex 后端分板块开发台账

更新时间：2026-04-20

这份文档只管三件事：

1. 当前前端已经落下来的后端需求
2. 每个模块现在做到什么程度
3. 接下来按什么顺序继续推进

## 1. 当前后端模块

### A. 会话与发现

对应页面：

- `pages/card`
- `pages/topic-detail`
- `pages/venue-detail`

当前状态：

- 已有发现流读取
- 已有话题详情读取
- 已有报名申请写入

当前集合：

- `simpex_topics`
- `simpex_venues`
- `simpex_people`
- `simpex_topic_applications`

下一步：

- 从 `topic` 逐步过渡到统一 `conversation`
- 增加筛选、分页、状态管理
- 把“官方活动 / 用户发起 / 线上场”收敛到统一模型

### B. 用户与个人主页

对应页面：

- `pages/profile`
- `pages/person`
- `pages/event-detail`

当前状态：

- 已有用户会话
- 已有个人主页读取
- 已有人物页读取
- 已有我的事件读取

当前集合：

- `simpex_users`
- `simpex_profile_events`

下一步：

- 增加资料编辑
- 增加我的事件写入
- 支持事件可见性和发布状态

补充说明：

- 2026-04-20 本轮已补见面结束后的 `moment.create`
- `pages/meet -> pages/event-detail(source=profile)` 已能走后端生成第一版沉淀

### C. 会员与邀请

对应页面：

- `pages/membership`
- `pages/access-center`
- `pages/invite-friends`
- `pages/invite-unlock`

当前状态：

- 2026-04-18 开始进入正式后端模块
- 本轮已补会员概览读取接口
- 本轮已补邀请状态读取接口

当前集合：

- `simpex_memberships`
- `simpex_invites`

下一步：

- 接真实支付
- 接邀请关系绑定
- 区分试用、周卡、月卡、共建者
- 增加邀请达成后的权益发放

### D. 发起对话

对应页面：

- `pages/conversation-starter`
- `pages/direct-launch`

当前状态：

- 2026-04-18 开始进入正式后端模块
- 本轮已补发起提交接口
- 允许把前端表单直接落成 `topic draft/published` 数据

当前集合：

- `simpex_launch_requests`
- `simpex_topics`

下一步：

- 增加 AI 草稿生成记录
- 增加审核状态与运营回看
- 增加线上/线下不同字段校验

### E. 在场 / 同行房

对应页面：

- `pages/meet`
- `pages/presence-room`

当前状态：

- 2026-04-18 开始进入正式后端模块
- 本轮已补在场概览读取接口
- 本轮已补同行房详情读取接口
- 本轮已补同行房发言写入接口
- 本轮已补申请同意/拒绝、结束沉淀的状态更新接口

当前集合：

- `simpex_presence_conversations`
- `simpex_presence_rooms`

下一步：

- 接签到
- 接票据状态
- 接活动结束后的 moment 沉淀
- 接提醒和自动确认

### F. 地点 / 黑洞 / 官方局动作

对应页面：

- `pages/blackhole`
- `pages/venue-detail`
- `pages/event-detail`

当前状态：

- 2026-04-20 已补黑洞总览读取接口
- 2026-04-20 已补地点详情读取接口
- 2026-04-20 已补官方局预约接口
- 2026-04-20 已补保存思考接口
- 2026-04-20 已补推荐空间写入接口
- 2026-04-20 已把地点池切到“第三空间”模型，首批写入 15 个咖啡 / 见面空间
- 2026-04-20 已移除空间里的“会员权益 / 店内福利”字段，改为 `cluster / vibe / bestFor / timePreference`

当前集合：

- `simpex_venue_recommendations`
- `simpex_event_rsvps`
- `simpex_event_pins`

下一步：

- 把推荐空间入口换成正式表单
- 给官方局预约补重复预约状态和签到状态
- 把“保存思考”与后续个人内容链路真正打通
- 给第三空间补后台审核状态、排序策略与实地复核流程

## 2. 当前开发顺序

建议固定按下面顺序推进，不要乱跳：

1. 先把“读接口 + 基础写接口”补齐
2. 再把页面逐页接到 backend SDK
3. 再把 mock 数据逐步迁走
4. 最后接支付、审核、AI、运营后台

## 3. 本轮已落地的接口

- `membership.overview`
- `invite.status`
- `launch.create`
- `presence.overview`
- `presence.room.detail`
- `presence.room.send`
- `presence.conversation.decide`
- `presence.conversation.complete`
- `venues.detail`
- `blackhole.overview`
- `venues.recommend`
- `events.rsvp`
- `events.pin`
- `moments.create`

## 4. 接下来建议的下一轮

下一轮优先做这三件事：

1. 把 `membership / access-center / invite-friends` 全部接到真实 backend SDK
2. 把 `direct-launch` 接到 `launch.create`
3. 把 `meet / presence-room` 从纯 mock 切到真实接口
