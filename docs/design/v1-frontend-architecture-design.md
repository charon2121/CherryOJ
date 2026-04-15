# V1 Design - Frontend Architecture

## 1. 文档信息

- 版本：V1
- 对应问题文档：`docs/problem/v1-core-oj.md`
- 对应需求文档：`docs/prd/v1-core-oj-prd.md`
- 对应结构文档：`docs/structure/v1-core-oj-structure.md`
- 相关专题文档：`docs/frontend/auth-requirements-and-design.md`
- 文档类型：Design Layer（定义前端技术实现、分层与演进路径）

## 2. 设计目标

本文档解决的不是“页面长什么样”，而是 `cherry-ui` 应如何从 0 到 1 建成一套可维护、可扩展、真正利用 Next.js App Router 的前端系统。

V1 的前端设计目标有四个：

1. 让 `cherry-ui` 默认以 Server Components 为主体，而不是退化成传统 CSR 应用。
2. 让 HeroUI 主题体系成为唯一设计令牌来源，而不是散落在页面 className 中。
3. 让状态管理只承载真正的客户端 UI 状态，而不是吞掉所有业务数据。
4. 让用户端与管理端共用同一套基础设施，但保留各自独立的布局、权限与页面节奏。

## 3. 当前问题

结合现有仓库，当前前端存在以下结构性问题：

- 页面实现大量依赖 Client Components，`page.tsx` 虽然是 Server Component，但页面主内容经常立即跳入 `.client.tsx`。
- `globals.css` 与 `theme.css` 职责混杂，二者都承担了全局入口角色。
- `auth.store` + `AuthProvider` 采用“客户端启动后拉 `/me`”的传统 SPA 模式。
- 用户态、权限态与导航态过多依赖客户端 store，导致 Server Layout 没有成为事实入口。
- HeroUI 已接入，但主题 token 还没有成为稳定的设计基础层。

这些问题不会立即阻止功能开发，但会持续降低 SSR、流式渲染、权限边界和样式治理的质量。

## 4. 总体设计原则

## 4.1 Server First

- `layout.tsx`、`page.tsx` 默认保持 Server Components。
- 数据优先在服务端获取，客户端只负责交互叶子节点。
- 需要浏览器能力的地方才使用 `"use client"`。

## 4.2 Theme First

- HeroUI 主题编辑器导出的 `theme.css` 作为设计令牌源。
- 页面样式优先消费语义 token，而不是直接堆砌原始颜色 class。
- `globals.css` 是唯一全局样式入口，`theme.css` 只负责 token。

## 4.3 State Minimal

- 服务器状态不进入全局客户端 store。
- Zustand 只保留客户端 UI 状态和必要草稿状态。
- 认证信息以服务端 session 为真相源，客户端 store 只做补充缓存。

## 4.4 Layout Separated

- 用户端与管理端使用不同 layout。
- 管理端权限检查应优先在服务端 layout 完成。
- 页面级 Client Component 不应再包裹整站 chrome。

## 5. 分层设计

## 5.1 路由层

建议的前端路由分层如下：

- Root Layout：字体、主题切换基础设施、全局样式入口
- Main Layout：用户端导航、会话注入、公共背景与页面框架
- Admin Layout：后台导航、管理员权限校验、工作台外壳
- Auth Layout：登录/注册/找回密码等轻量页面壳

职责约束：

- Root Layout 不承载具体业务导航。
- Main / Admin Layout 才是用户态和权限态的主要入口。
- 页面不直接决定全站导航长什么样，页面只描述当前业务内容。

## 5.2 组件层

前端组件分成四类：

1. Server Shell
   - 负责布局、取数、权限边界和数据注入。
   - 典型对象：`page.tsx`、`layout.tsx`、部分 server wrapper。

2. Client Leaf
   - 负责交互、编辑器、菜单、Tabs、表单联动。
   - 典型对象：题目工作区、登录表单、主题切换、下拉菜单。

3. Presentational UI
   - 不感知 API、路由或 store，只负责 UI 呈现。
   - 可按情况做成 Server 或 Client。

4. Domain Widget
   - 面向具体业务，如题目列表、题目编辑器、提交结果面板。
   - 内部可再拆分 server data wrapper 与 client interactive leaf。

## 5.3 API 层

现有 `src/lib/api` 可以保留，但职责应进一步明确：

- `server.ts`
  - 用于 Server Components / Server Layout / Server Actions 调后端
  - 从 Cookie 透传 JWT

- `client.ts`
  - 用于浏览器交互请求
  - 统一处理 401/403 与网络错误

- `endpoints/*.ts`
  - 默认作为服务端 endpoint 包装

- `endpoints/*.client.ts`
  - 明确浏览器侧调用

目标不是重写 API 层，而是让页面真的围绕这套分层来组织。

## 5.4 Theme 层

主题系统应分为两层：

### A. Global Entry Layer

由 `globals.css` 承担：

- `@import "tailwindcss";`
- `@import "@heroui/styles";`
- `@import "./theme.css";`
- dark variant
- reset
- html/body 基础样式

### B. Design Token Layer

由 `theme.css` 承担：

- `:root`
- `.dark`
- `[data-theme="light"]`
- `[data-theme="dark"]`
- HeroUI 颜色、surface、border、radius、font token

设计要求：

- `theme.css` 不再承担第二份全局样式入口职责。
- 不在 `theme.css` 中重复导入 Tailwind / HeroUI。
- 项目字体变量必须与 `next/font` 一致，例如 `--font-dm-sans`、`--font-jetbrains`。

## 5.5 State 层

前端状态分为三类：

### A. 服务器状态

例如：

- 当前用户
- 题目列表
- 题目详情
- 后台题目列表与详情
- 提交详情

处理方式：

- 在 Server Components / Layout 中获取
- 作为 props 下传
- 不写入 Zustand 作为主事实源

### B. 客户端 UI 状态

例如：

- 侧边栏开关
- 弹窗开关
- 筛选面板临时值
- 代码编辑器草稿
- 题目编辑页未提交草稿

处理方式：

- Zustand 可保留
- 但 store 仅承载 UI / draft，不承载业务主数据

### C. 局部瞬时状态

例如：

- pending
- hover
- tab active
- 输入框局部值

处理方式：

- 组件内 `useState`
- 不提升为全局 store

## 6. 会话与权限设计

## 6.1 Session 真相源

当前登录态不应再以客户端 `refreshUser()` 为真相源，而应调整为：

- 服务端通过 Cookie 获取当前用户
- Main / Admin Layout 读取当前会话
- 读取结果作为页面首帧的一部分下发

## 6.2 客户端补充层

客户端仍可保留轻量 auth store，但它不再负责“应用启动时决定用户是谁”，而只负责：

- 登录成功后的即时 UI 同步
- 登出后的本地状态清理
- 某些必须在浏览器端消费的身份缓存

## 6.3 权限入口

- 管理端：在 `admin/layout.tsx` 服务端完成管理员校验，不再只靠客户端跳转。
- 需要登录的做题交互：逐步把 `RequireAuth.client.tsx` 替换为 server-side session 注入 + 叶子交互守卫。

## 7. 页面重构策略

整体重构不建议一次性推翻全部页面，而应按“先地基、后页面”的顺序推进。

### 阶段 1：基础设施

- 收敛 `globals.css` / `theme.css`
- 建立服务端 session helper
- 管理端 layout 改为服务端权限入口

### 阶段 2：布局重构

- 新增 `(main)/layout.tsx`
- 把 `OJChrome` 从页面级 client 包裹移到 route layout
- 用户端导航改为 server snapshot + client leaf 混合模式

### 阶段 3：页面下沉

- 题库列表页：Server Page + Client Filter Leaf
- 题目详情页：Server Data Wrapper + Client Workspace Leaf
- 首页：Server Page 为主，互动块单独 client 化

### 阶段 4：状态收缩

- 从业务 store 中剥离主数据
- 只保留 UI store 与 editor draft store
- auth store 从“启动加载器”退化为“客户端补充层”

### 阶段 5：后台完善

- 管理列表页继续保持服务端取数
- 新建 / 编辑页按 server shell + client form 分层
- 逐步拆出可复用的 admin table / admin form / admin chrome 组件

## 8. 目录建议

建议逐步收敛为如下结构：

```text
src/
  app/
    layout.tsx
    globals.css
    theme.css
    (auth)/
    (main)/
    admin/
  components/
    admin/
    auth/
    oj/
    theme/
  lib/
    api/
    auth/
    session/
    state/
```

其中：

- `lib/session/`：服务端会话 helper
- `lib/state/`：纯客户端 UI store
- `lib/auth/`：认证相关前端辅助逻辑，如 returnUrl、安全跳转

## 9. 验收标准

当前前端架构重构完成后，应满足：

- 主题切换与主题 token 只有一套入口定义。
- `theme.css` 可以独立替换，而不影响全局样式入口结构。
- 管理端入口在服务端完成管理员校验。
- 页面骨架默认由 Server Components 提供。
- 大部分业务数据不再通过客户端全局 store 启动拉取。
- Zustand 的职责明显收缩到 UI state / draft state。

## 10. 与现有专题文档的关系

- `docs/frontend/auth-requirements-and-design.md`
  - 继续负责认证专题需求与设计
  - 关注登录、登出、401/403、鉴权规则

- 本文档
  - 负责前端整体架构与分层
  - 关注 theme、state、layout、RSC/Client 边界、重构顺序

二者不是替代关系，而是“总设计 + 专题设计”的关系。

## 11. 当前落地状态（2026-04）

截至当前仓库状态，前端架构重构已经完成以下第一阶段与第二阶段起步工作：

- 已将 `globals.css` 收敛为唯一全局样式入口，并由其统一引入 `theme.css`。
- 已将 HeroUI 主题编辑器导出的 `theme.css` 收敛为 token 层，不再重复承担全局入口职责。
- 已新增服务端 session helper：
  - `src/lib/session/get-current-user.ts`
  - `src/lib/session/require-admin.ts`
- 已将后台 `admin/layout.tsx` 改为服务端管理员校验入口。
- 已新增 `src/app/(main)/layout.tsx`，用户端首页与题库页开始共享 route layout。
- 已通过 `AuthSnapshot.client.tsx` 把服务端用户快照下发给客户端 store。
- 已移除 `AuthProvider` 启动时主动拉 `/me` 的旧式初始化逻辑。

当前仍在持续推进的工作：

- 将更多用户端页面从“页面级 Client Chrome 包裹”改造为“Server Layout + Client Leaf”。
- 继续压缩 `auth.store` 的职责，逐步把权限判断迁回服务端。
- 将题目详情、工作台、后台编辑页进一步拆成 server shell 与 client interaction leaf。
