# Simpex 正式后端 v1 方案

目标日期：2026-04-10  
目标：一周内支持小程序上线验证，形成“正式可用的 MVP 后端”，覆盖注册、发起、报名、沉淀、基础运营与支付预留。

## 1. 范围定义

这版不是 demo 后端，也不是一次性做完全部后台系统。

这版必须做到：

- 真实用户可注册进入
- 用户可发起话题/活动
- 用户可申请加入活动
- 发起人或官方可处理申请
- 活动结束后可沉淀“我的事件”
- 运营可以看到并处理关键数据
- 支付未来可平滑接入
- AI 生成链路可直接挂接

这版先不强求：

- 复杂推荐算法
- 复杂风控系统
- 多角色后台权限体系
- iOS / Android 最终支付实现
- 完整 BI 系统

## 2. 核心业务对象

### 2.1 User

用户账号主体，和微信登录绑定。

关键字段：

- `id`
- `openid`
- `unionid` 可选
- `nickname`
- `avatar_url`
- `bio`
- `city`
- `tags`
- `status`
- `membership_status`
- `inviter_user_id` 可选
- `created_at`
- `updated_at`

`status` 建议值：

- `active`
- `blocked`
- `pending_review`

`membership_status` 建议值：

- `none`
- `trial`
- `active`
- `expired`
- `frozen`

### 2.2 Conversation

统一承载“用户发起话题”和“官方活动”。

关键字段：

- `id`
- `type`
- `source`
- `creator_user_id`
- `title`
- `summary`
- `description`
- `city`
- `venue_id` 可选
- `venue_text`
- `start_time`
- `end_time`
- `capacity`
- `min_capacity`
- `join_mode`
- `price_type`
- `price_amount`
- `status`
- `visibility`
- `tags`
- `ai_draft_id` 可选
- `cover_image_url` 可选
- `created_at`
- `updated_at`

`type` 建议值：

- `user_conversation`
- `official_event`

`source` 建议值：

- `manual`
- `ai_assisted`
- `official_ops`

`join_mode` 建议值：

- `free_join`
- `apply_and_review`
- `paid_reservation`

`price_type` 建议值：

- `free`
- `single_ticket`
- `membership_only`

`status` 建议值：

- `draft`
- `pending_review`
- `published`
- `full`
- `in_progress`
- `completed`
- `cancelled`

### 2.3 ConversationApplication

用户对某个话题/活动的申请与审核状态。

关键字段：

- `id`
- `conversation_id`
- `applicant_user_id`
- `host_user_id`
- `message`
- `status`
- `decision_reason` 可选
- `created_at`
- `updated_at`
- `reviewed_at` 可选

`status` 建议值：

- `pending`
- `approved`
- `rejected`
- `cancelled`
- `expired`

### 2.4 Participation

真正的成局参与关系，不和申请表混在一起。

关键字段：

- `id`
- `conversation_id`
- `user_id`
- `role`
- `attendance_status`
- `joined_from_application_id` 可选
- `created_at`
- `updated_at`

`role` 建议值：

- `host`
- `participant`

`attendance_status` 建议值：

- `reserved`
- `checked_in`
- `no_show`
- `left`

### 2.5 Moment / MyEvent

活动后沉淀到“我的事件”的内容。

关键字段：

- `id`
- `user_id`
- `conversation_id`
- `type`
- `title`
- `preview_text`
- `body`
- `image_url` 可选
- `identity_lens` 可选
- `inner_question` 可选
- `graph_tag` 可选
- `visibility`
- `status`
- `created_at`
- `updated_at`

`type` 建议值：

- `text`
- `photo`
- `photo_text`

`visibility` 建议值：

- `private`
- `visible_to_participants`
- `public_profile`

`status` 建议值：

- `draft`
- `published`
- `hidden`

### 2.6 Venue

空间信息。

关键字段：

- `id`
- `name`
- `city`
- `address`
- `description`
- `mood`
- `status`
- `benefits`
- `created_at`
- `updated_at`

### 2.7 MembershipProduct

会员和权益商品定义。

关键字段：

- `id`
- `name`
- `product_type`
- `price_amount`
- `duration_days`
- `benefit_config`
- `status`

### 2.8 Order

支付预留的正式订单模型。

关键字段：

- `id`
- `user_id`
- `product_id`
- `business_type`
- `business_id`
- `amount`
- `currency`
- `payment_channel`
- `status`
- `paid_at` 可选
- `cancelled_at` 可选
- `refunded_at` 可选
- `created_at`
- `updated_at`

`business_type` 建议值：

- `membership`
- `conversation_ticket`

`payment_channel` 建议值：

- `wechat_pay`
- `apple_iap_future`

`status` 建议值：

- `pending`
- `paid`
- `cancelled`
- `refund_pending`
- `refunded`
- `failed`

### 2.9 AI Draft

为明天的大模型链路预留。

关键字段：

- `id`
- `user_id`
- `raw_input`
- `model_name`
- `prompt_version`
- `generated_title`
- `generated_summary`
- `generated_description`
- `generated_tags`
- `status`
- `created_at`

`status` 建议值：

- `generated`
- `accepted`
- `discarded`

## 3. 最关键状态流

### 3.1 用户发起链路

1. 用户进入发起页
2. 输入最近状态
3. 后端创建 `ai_draft` 或手动草稿
4. 用户补全时间、地点、人数、规则
5. 生成 `conversation.draft`
6. 提交后进入 `pending_review` 或直接 `published`

### 3.2 报名链路

1. 用户浏览 `conversation`
2. 发起报名申请，写入 `conversation_application.pending`
3. 发起人处理申请
4. 同意后创建 `participation`
5. 达到人数后 `conversation` 可变为 `full` 或保持 `published`

### 3.3 到场与结束链路

1. 活动开始前，参与者状态为 `reserved`
2. 到场后改为 `checked_in`
3. 活动结束，`conversation` 改为 `completed`
4. 用户可创建 `moment`

### 3.4 会员/支付链路

1. 用户选择会员或票券商品
2. 创建 `order.pending`
3. 支付成功后改 `order.paid`
4. 根据商品类型发放会员权益或活动资格

## 4. v1 必做接口

### 4.1 认证与用户

- `POST /auth/wechat-login`
- `GET /me`
- `PATCH /me/profile`
- `GET /me/membership`

### 4.2 发现与活动

- `GET /conversations`
- `GET /conversations/:id`
- `POST /conversations`
- `PATCH /conversations/:id`
- `POST /conversations/:id/publish`
- `POST /conversations/:id/cancel`

### 4.3 报名与参与

- `POST /conversations/:id/applications`
- `GET /me/applications`
- `GET /host/conversations/:id/applications`
- `POST /applications/:id/approve`
- `POST /applications/:id/reject`
- `GET /conversations/:id/participants`

### 4.4 我的事件

- `GET /me/moments`
- `POST /moments`
- `PATCH /moments/:id`
- `GET /users/:id/moments`

### 4.5 AI 草稿预留

- `POST /ai/topic-drafts`
- `POST /ai/topic-drafts/:id/accept`
- `POST /ai/topic-drafts/:id/discard`

### 4.6 运营后台

- `GET /admin/users`
- `GET /admin/conversations`
- `GET /admin/applications`
- `PATCH /admin/conversations/:id/status`
- `PATCH /admin/moments/:id/status`
- `PATCH /admin/users/:id/status`

### 4.7 支付预留

- `GET /products`
- `POST /orders`
- `GET /orders/:id`
- `POST /payments/wechat/prepare`
- `POST /payments/wechat/notify`

## 5. 最小权限规则

### 普通用户

- 可以看公开活动
- 可以修改自己的资料
- 可以发起自己的活动
- 可以申请加入他人的活动
- 可以编辑自己的 moment

### 发起人

- 可以看自己活动的申请列表
- 可以同意/拒绝申请
- 可以取消自己发起的活动

### 运营管理员

- 可以查看用户、活动、报名、moment
- 可以手动调整状态
- 可以下架内容

## 6. 一周开发顺序

### Day 1

- 用户表与微信登录
- 统一 `conversation` 模型
- 基础 `GET /me`、`GET /conversations`

### Day 2

- 创建活动 / 发起草稿
- 活动详情
- 用户资料编辑

### Day 3

- 报名申请
- 发起人处理申请
- 参与关系表

### Day 4

- 我的事件写入与读取
- 个人主页与人物主页联动

### Day 5

- 运营后台最小版
- 状态修改与下架

### Day 6

- 订单模型
- 微信支付预留接口
- 关键日志与错误处理

### Day 7

- 联调
- 审核自查
- 上线前回归测试

## 7. 上线前必须确认

- 小程序注册流程顺畅
- 发起活动流程顺畅
- 报名与审核流程顺畅
- 我的事件可正常展示
- 管理后台可处理异常数据
- 支付商品和订单模型已定型
- 日志至少能定位关键错误
- 敏感操作具备最小权限控制

## 8. 明天优先落地的第一批任务

明天建议直接开工这 5 件：

1. 把当前云函数后端从“页面读取型”升级为“正式实体模型”
2. 建立 `user / conversation / application / participation / moment / order` 六张核心表
3. 先完成微信登录、用户资料、活动列表、活动详情、报名申请
4. 给 AI 发起链路留正式接口，不先写死页面逻辑
5. 做一个最小运营页，哪怕先是内部页面也行

## 9. 对当前代码的判断

当前代码已经有“后端接入底座”，但还没有升级成这份文档定义的正式后端 v1。

差距主要在：

- 还没有正式实体模型分层
- 还没有完整报名状态机
- 还没有后台
- 还没有正式订单系统
- 还没有 AI 草稿正式接口

所以接下来不是推翻重做，而是：

在现有底座上继续往“正式后端 v1”扩展。
