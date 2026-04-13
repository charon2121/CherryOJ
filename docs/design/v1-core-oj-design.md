# V1 Design - Core OJ

## 1. 文档信息

- 版本：V1
- 对应问题文档：`docs/problem/v1-core-oj.md`
- 对应需求文档：`docs/prd/v1-core-oj-prd.md`
- 对应结构文档：`docs/structure/v1-core-oj-structure.md`
- 文档类型：Design Layer（定义技术实现、API、数据模型与架构）

## 2. 设计目标

V1 设计目标不是做一个“大而全”的 OJ，而是落地一个可运行、可扩展、可追溯的核心执行底座。

设计上需要同时满足三件事：

1. 支持用户完成最小做题闭环
2. 支持管理员维护题目与处理异常
3. 支持后续 V2 以 API 方式程序化调用

## 3. 实现边界

结合当前仓库，V1 建议采用三部分协作架构：

- `cherry-ui`：用户端与管理端前端
- `cherry`：主业务后端，负责认证、题目、提交、记录、管理 API
- `cherry-judge`：独立判题服务，负责代码执行与结果产出

职责边界如下：

| 组件 | 责任 |
|---|---|
| `cherry-ui` | 页面呈现、表单提交、状态轮询、权限入口控制 |
| `cherry` | 业务规则、权限校验、数据持久化、提交编排、结果聚合 |
| `cherry-judge` | 编译、运行、测试点判定、资源隔离、结果返回 |

## 4. 总体架构

```text
+-------------+        HTTP         +-------------+        HTTP / RPC       +----------------+
|  cherry-ui  | <-----------------> |   cherry    | <--------------------> |  cherry-judge  |
|  Frontend   |                     | Main API    |                        | Judge Service  |
+-------------+                     +-------------+                        +----------------+
       |                                   |                                        |
       |                                   |                                        |
       |                            MySQL / 持久化层                          临时工作目录 / 执行环境
       |                                   |
       +---------------------------- 用户 Cookie / Token ---------------------------+
```

设计原则：

- 前端不直接接触判题服务
- 主后端是唯一业务事实入口
- 判题服务只处理执行与结果，不承载业务权限

## 5. 模块设计

## 5.1 `cherry-ui`

建议拆为以下前端模块：

- 认证模块：登录、注册、会话保持
- 题库模块：题目列表、题目详情
- 提交模块：代码编辑、语言选择、发起提交
- 结果模块：提交详情、结果刷新、历史记录
- 管理模块：题目编辑、用例管理、提交监控

从现有目录看，前端已经有以下基础结构：

- `src/components/auth`
- `src/components/oj`
- `src/lib/api`

V1 应继续保持这个分层，避免把业务逻辑散落到页面组件中。

## 5.2 `cherry`

主后端建议划分为五类模块：

- 认证模块：用户身份、会话、管理员权限
- 题目模块：题目、题面、语言限制、模板管理
- 提交模块：提交创建、状态更新、结果查询
- 管理模块：题目发布、用例维护、提交监控
- 判题集成模块：与 `cherry-judge` 通讯、结果回写、重试编排

从现有目录看，主后端已经有以下骨架：

- `controller`
- `service`
- `mapper`
- `auth`

因此 V1 的实现应沿用 controller -> service -> mapper 的结构，不引入第二套并行模式。

## 5.3 `cherry-judge`

判题服务建议维持当前分层：

- `api`：接收判题请求
- `app`：提交服务、任务服务、判题流程编排
- `domain`：提交、任务、结果、语言、测试点等核心对象
- `execution`：编译器、运行器、执行环境封装
- `judge`：输出比对、判题引擎
- `queue`：任务队列
- `store`：结果与提交缓存
- `infra`：进程执行器、工作区管理器

这部分目录结构已经比较接近判题域服务形态，V1 的重点是把它与主后端的契约补齐。

## 6. 核心数据模型设计

当前 `docs/sql/cherry_oj.sql` 已给出 V1 的主要数据模型草案，建议保留并做以下语义约束。

### 6.1 用户域

- `user`：用户基础信息、管理员标记、状态

### 6.2 题目域

- `language`：支持语言字典
- `problem`：题目主信息
- `problem_statement`：题面内容
- `problem_language_limit`：题目按语言的时空限制
- `problem_template`：核心代码模式模板

### 6.3 判题依据域

- `test_case`：测试点、样例、隐藏属性、启停状态

建议补充一个语义字段：

- `visibility` 或等价状态枚举，用于区分 `public`、`draft`、`offline`、`session-private`

原因：

- 当前 SQL 中 `problem.status` 只有“可用/下线”表达力，不足以覆盖 PRD 中的草稿、已发布、已下线、会话私有。

### 6.4 提交域

- `submission`：提交主记录
- `submission_test_case_result`：测试点级结果明细

建议 `submission.status` 与 `submission.result_code` 分离使用：

- `status` 表达生命周期状态：`PENDING`、`JUDGING`、`FINISHED`、`SYSTEM_ERROR`
- `result_code` 表达业务结果：`AC`、`WA`、`TLE`、`MLE`、`RE`、`CE`

这样可以避免“系统状态”和“判题结论”混在一个字段里。

## 7. 状态机设计

### 7.1 题目状态机

```text
DRAFT -> PUBLISHED -> OFFLINE
   \         |
    \        v
     -> SESSION_PRIVATE
```

说明：

- `DRAFT`：管理员编辑中
- `PUBLISHED`：公开题库可见
- `OFFLINE`：停止对普通用户开放
- `SESSION_PRIVATE`：仅供特定会话或 AI 生成题使用

### 7.2 提交状态机

```text
PENDING -> JUDGING -> FINISHED
    \          \
     \          -> SYSTEM_ERROR
      -> SYSTEM_ERROR
```

设计要求：

- 所有状态变更必须写入 `submission`
- `judged_at` 只在终态写入
- 终态提交允许被管理员重新触发判题

## 8. API 设计

V1 应坚持“先有 API，再有页面”的原则。页面只是 API 的消费者之一。

## 8.1 用户侧 API

### 题目查询

- `GET /api/problems`
  - 查询公开题目列表
  - 支持关键词、难度、状态过滤

- `GET /api/problems/{id}`
  - 查询题目详情
  - 返回题面、样例、约束、支持语言

### 提交相关

- `POST /api/submissions`
  - 创建一次提交
  - 请求体包含：`problemId`、`languageCode`、`sourceCode`
  - 返回：`submissionId` 与初始状态

- `GET /api/submissions/{id}`
  - 查询单次提交详情
  - 返回：总体结果、资源消耗、测试点结果、错误摘要

- `GET /api/problems/{id}/submissions`
  - 查询当前用户在该题下的提交记录

### 认证相关

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users/me`

## 8.2 管理侧 API

### 题目管理

- `POST /api/admin/problems`
  - 创建题目草稿

- `PUT /api/admin/problems/{id}`
  - 更新题目主信息和题面

- `POST /api/admin/problems/{id}/publish`
  - 发布题目

- `POST /api/admin/problems/{id}/offline`
  - 下线题目

### 用例管理

- `POST /api/admin/problems/{id}/test-cases`
  - 批量写入测试用例

- `PUT /api/admin/test-cases/{id}`
  - 修改单个测试用例状态或属性

- `DELETE /api/admin/test-cases/{id}`
  - 删除测试用例

### 提交监控

- `GET /api/admin/submissions`
  - 全局提交列表

- `GET /api/admin/submissions/{id}`
  - 查看提交详情与失败原因

- `POST /api/admin/submissions/{id}/rejudge`
  - 重新判题

## 8.3 面向 V2 的程序化 API

除管理端 API 外，还需要保留可被 AI 调用的统一写入接口：

- `POST /api/problems`
- `POST /api/problems/{id}/test-cases`
- `GET /api/submissions/{id}`

设计约束：

- 不要求调用方来自管理端页面
- 只要求调用方具备合法身份或系统级授权

## 9. 提交链路设计

用户提交的完整链路如下：

```text
1. cherry-ui 发起 POST /api/submissions
2. cherry 校验用户、题目状态、语言可用性
3. cherry 写入 submission(status = PENDING)
4. cherry 向 cherry-judge 发送判题任务
5. cherry-judge 拉起编译与运行流程
6. cherry-judge 返回总体结果与测试点结果
7. cherry 回写 submission / submission_test_case_result
8. cherry-ui 轮询 GET /api/submissions/{id} 获取最终结果
```

关键设计点：

- `submission` 先落库，再发往判题服务，避免任务丢失后无法追踪
- 判题服务不直接写主数据库，由 `cherry` 负责统一回写
- 页面只关心 `submissionId`，避免持有判题服务内部细节

## 10. 判题服务契约设计

`cherry` 与 `cherry-judge` 间建议采用简单明确的请求模型：

### 请求内容

- `submissionId`
- `problemId`
- `language`
- `sourceCode`
- `judgeMode`
- `timeLimitMs`
- `memoryLimitMb`
- `testCases`

### 响应内容

- `submissionId`
- `finalVerdict`
- `compileMessage`
- `timeUsedMs`
- `memoryUsedKb`
- `testCaseResults[]`
- `systemErrorMessage`

### 契约原则

- 判题服务返回“执行事实”
- 主后端负责把执行事实翻译为平台状态与业务展示字段

## 11. 权限设计

### 11.1 普通用户

- 可查看公开题目
- 可提交代码
- 可查看自己的提交记录
- 不可查看隐藏测试用例原文
- 不可查看其他用户提交源码

### 11.2 管理员

- 可创建、编辑、发布、下线题目
- 可查看和维护测试用例
- 可查看全局提交与异常状态
- 可触发重新判题

### 11.3 判题服务

- 不承载用户态权限判断
- 只接受来自主后端的内部调用

## 12. 错误处理设计

V1 至少应统一以下错误类型：

- 参数错误
- 未登录
- 无权限
- 资源不存在
- 题目不可提交
- 语言不可用
- 判题服务不可达
- 编译失败
- 运行失败
- 系统内部错误

前后端应统一响应壳。当前 `cherry-ui/src/lib/api/types.ts` 中已有：

- `success`
- `code`
- `message`
- `data`
- `timestamp`

主后端应保持这一响应格式，避免前端在不同接口上做特殊兼容。

## 13. 可观测性设计

V1 不需要完整平台监控系统，但必须保留最小可运维能力。

建议实现以下观测点：

- 提交创建日志
- 提交状态流转日志
- 判题请求与返回日志
- 判题耗时统计
- 系统异常分类统计

每次提交建议绑定 `traceId`，用于串联：

- 前端请求
- 主后端处理
- 判题服务执行

## 14. 演进兼容设计

为了支持 V2 AI Playground，V1 设计必须保留以下扩展位：

### 14.1 题目创建来源

建议在题目域增加“来源”语义：

- 管理员人工创建
- 系统或 AI 程序化创建

### 14.2 题目可见性

除公开题目外，需要支持会话私有题目，不进入公共题库。

### 14.3 结果可机器读取

提交结果不仅要能给人看，也要能给程序稳定读取，因此返回结构中应包含：

- 总体 verdict
- 每个测试点 verdict
- 编译信息
- 资源消耗
- 失败原因摘要

## 15. 与当前仓库的落地映射

建议按如下方式推进：

| 目标 | 仓库位置 |
|---|---|
| 前端题库与做题页面 | `cherry-ui/src/components/oj` |
| 前端认证能力 | `cherry-ui/src/components/auth` |
| 前端 API 封装 | `cherry-ui/src/lib/api` |
| 主后端控制器 | `cherry/src/main/java/com/cherry/controller` |
| 主后端业务服务 | `cherry/src/main/java/com/cherry/service` |
| 主后端数据访问 | `cherry/src/main/java/com/cherry/mapper` |
| 判题执行服务 | `cherry-judge/src/app`、`cherry-judge/src/execution`、`cherry-judge/src/judge` |

## 16. 设计验收口径

V1 设计成立的标志是：

- 前端、主后端、判题服务的职责边界清晰
- 提交链路能够稳定落库、执行、回写、回看
- API 可以同时服务 UI 和未来 AI 调用
- 数据模型能覆盖题目、用例、提交、结果、状态流转
- 题目状态与提交状态不会因为 V2 扩展而被整体推翻
