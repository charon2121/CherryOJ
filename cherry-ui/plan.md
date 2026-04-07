# Online Judge 前端项目规划

## 技术栈

- **框架**：Next.js 16（App Router）
- **打包器**：Turbopack（Next.js 16 默认）
- **React**:  19.2（随 Next.js 16）
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **UI 组件**：heroui（原 nextui）
- **客户端数据层**：TanStack Query（管理端使用）
- **表单校验**：Zod
- **编辑器**：Monaco Editor（动态 import，仅客户端）

## 架构总览

Next.js **仅作为前端 + BFF 层**，所有业务逻辑、判题、数据存储在独立的 **Java 后端**。

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │◄───────►│   Next.js    │◄───────►│ Java Backend│
│             │   SSR   │  (前端+BFF)   │  HTTP   │ (业务+判题)  │
└─────────────┘         └──────────────┘         └─────────────┘
```

### 两端分工


|      | 主站（`(main)`）                     | 管理端（`admin`）                       |
| ---- | -------------------------------- | ---------------------------------- |
| 渲染模式 | SSR + Cache Components (PPR)     | 纯 CSR                              |
| 数据获取 | Server Component 内 `serverFetch` | 浏览器 `clientFetch` + TanStack Query |
| SEO  | 需要                               | 不需要                                |
| 目标   | 题目/题解被搜索引擎收录，秒开                  | 表格、筛选、乐观更新体验                       |


### 部署建议

生产环境 **同域部署**，nginx 分流：

- `oj.example.com/` → Next.js
- `oj.example.com/api/`* → Java 后端

同域可避免 CORS，Cookie 自动共享。

---

## 目录结构

```
oj-frontend/
├── app/
│   ├── layout.tsx                    # 根 layout，全局 Provider、字体
│   ├── page.tsx                      # 首页（可重定向到 /problems）
│   ├── globals.css
│   ├── error.tsx                     # 全局错误边界
│   ├── not-found.tsx                 # 404
│   │
│   ├── (main)/                       # 主站 Route Group，SSR
│   │   ├── layout.tsx                # 主站布局（顶栏、页脚）
│   │   ├── problems/
│   │   │   ├── page.tsx              # 题目列表
│   │   │   ├── loading.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # 题目详情（PPR）
│   │   │       ├── _components/      # 页面私有组件
│   │   │       │   ├── problem-content.tsx
│   │   │       │   ├── user-status.tsx    # Suspense 动态块
│   │   │       │   └── code-editor.tsx    # dynamic import
│   │   │       └── loading.tsx
│   │   ├── contests/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── problems/[pid]/page.tsx
│   │   ├── submissions/
│   │   │   ├── page.tsx              # 公开提交列表
│   │   │   └── [id]/page.tsx         # 提交详情
│   │   ├── users/
│   │   │   └── [username]/page.tsx   # 用户主页
│   │   ├── ranklist/page.tsx
│   │   └── about/page.tsx
│   │
│   ├── (auth)/                       # 登录注册 Route Group
│   │   ├── layout.tsx                # 简洁 layout（无顶栏）
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   ├── admin/                        # 管理端，纯 CSR
│   │   ├── layout.tsx                # "use client"，TanStack Query Provider
│   │   ├── page.tsx                  # Dashboard
│   │   ├── problems/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── contests/
│   │   ├── users/
│   │   ├── submissions/
│   │   ├── judgers/                  # 判题机状态
│   │   └── settings/
│   │
│   └── api/                          # 仅保留必要的 BFF 端点
│       ├── auth/
│       │   ├── login/route.ts        # 登录：转发 Java + 写 httpOnly Cookie
│       │   └── logout/route.ts       # 登出：清 Cookie
│       └── revalidate/route.ts       # Java 回调触发缓存失效
│
├── proxy.ts                          # Next.js 16 的 proxy（原 middleware）
│
├── components/                       # 共享组件
│   ├── ui/                           # shadcn/ui 基础组件
│   ├── layout/                       # 布局相关
│   │   ├── main-header.tsx
│   │   ├── main-footer.tsx
│   │   └── admin-sidebar.tsx
│   ├── problem/                      # 业务组件
│   │   ├── problem-card.tsx
│   │   ├── difficulty-badge.tsx
│   │   └── tag-list.tsx
│   ├── submission/
│   │   ├── verdict-badge.tsx
│   │   └── submission-table.tsx
│   ├── editor/
│   │   ├── monaco-editor.tsx         # 'use client' + dynamic import
│   │   └── language-selector.tsx
│   ├── markdown/
│   │   ├── markdown-viewer.tsx       # 可在 Server Component 渲染
│   │   └── latex.tsx
│   └── common/
│       ├── pagination.tsx
│       ├── empty-state.tsx
│       └── loading-spinner.tsx
│
├── lib/
│   ├── api/                          # API 层
│   │   ├── core.ts                   # 共享：ApiError、parseResponse、buildUrl
│   │   ├── server.ts                 # serverFetch，import 'server-only'
│   │   ├── client.ts                 # clientFetch
│   │   ├── types.ts                  # 从 OpenAPI 生成的类型
│   │   └── endpoints/                # 按资源分组的接口封装
│   │       ├── problems.ts
│   │       ├── contests.ts
│   │       ├── submissions.ts
│   │       ├── users.ts
│   │       └── auth.ts
│   │
│   ├── auth/
│   │   ├── session.ts                # 'server-only' 读取当前用户
│   │   ├── permissions.ts            # 权限判断（isAdmin 等）
│   │   └── cookie.ts                 # Cookie 名字、过期时间常量
│   │
│   ├── cache/
│   │   ├── tags.ts                   # 缓存 tag 常量统一管理
│   │   └── lifetimes.ts              # cacheLife 预设
│   │
│   ├── query/                        # 管理端 TanStack Query 相关
│   │   ├── client.ts                 # QueryClient 实例
│   │   ├── keys.ts                   # queryKey 工厂
│   │   └── hooks/                    # 自定义 hooks
│   │       ├── use-problems.ts
│   │       ├── use-submissions.ts
│   │       └── use-users.ts
│   │
│   ├── realtime/
│   │   └── submission-sse.ts         # 判题结果 SSE 订阅（client-only）
│   │
│   ├── utils/
│   │   ├── cn.ts                     # classnames 工具
│   │   ├── format.ts                 # 时间、大小、语言名格式化
│   │   ├── verdict.ts                # 判题结果相关工具
│   │   └── validation.ts             # zod schema
│   │
│   └── constants/
│       ├── languages.ts              # 支持的编程语言列表
│       ├── verdicts.ts               # AC/WA/TLE 等结果常量
│       └── difficulty.ts
│
├── hooks/                            # 通用 React hooks（非 query 相关）
│   ├── use-debounce.ts
│   ├── use-countdown.ts              # 比赛倒计时
│   └── use-media-query.ts
│
├── providers/                        # Context Providers
│   ├── theme-provider.tsx
│   ├── query-provider.tsx            # TanStack Query（给 admin layout 用）
│   └── toast-provider.tsx
│
├── types/                            # 全局 TS 类型
│   ├── env.d.ts
│   └── global.d.ts
│
├── public/
│   ├── favicon.ico
│   └── images/
│
├── scripts/
│   └── generate-api-types.ts         # 从 Java OpenAPI 生成 TS 类型
│
├── .env.local                        # 本地环境变量（不提交）
├── .env.example
├── next.config.ts
├── tsconfig.json
├── package.json
├── tailwind.config.ts
├── postcss.config.ts
└── AGENTS.md
```

---

## 关键设计决策

### 1. API 层：共享核心 + 薄封装分开

**不使用** `typeof window` 运行时分支的统一封装，而是 Server 和 Client 各一套，共享核心逻辑。

- `lib/api/core.ts`：`ApiError`、`parseResponse`、`buildUrl`、TS 类型（共享）
- `lib/api/server.ts`：`serverFetch`，顶部 `import 'server-only'`，从 `cookies()` 读 token 加到 Authorization header，走内网 `BACKEND_URL`
- `lib/api/client.ts`：`clientFetch`，走公网 `NEXT_PUBLIC_BACKEND_URL`，依赖浏览器自动带 Cookie（`credentials: 'include'`）
- `lib/api/endpoints/*.ts`：按资源分组封装具体接口，页面里直接 import 调用

`**import 'server-only'` 是关键**：从编译层面防止服务端代码（内网地址、内部 token）被打进浏览器 bundle。

### 2. 缓存策略（Cache Components）

Next.js 16 的 `fetch` 默认不缓存，所有缓存必须显式通过 `"use cache"` 指令开启。

按数据变化频率分三层：

- **静态内容**（题目描述、题解、公告）：`"use cache"` + `cacheLife('hours')`，配合 `cacheTag` 按需失效
- **半动态**（排行榜、通过率、比赛列表）：`"use cache"` + `cacheLife('minutes')`，判题完成后 Java 回调 `/api/revalidate` 触发 `revalidateTag`
- **完全动态**（我的提交、当前用户状态）：不缓存，`cache: 'no-store'`

**缓存 tag 统一管理**：在 `lib/cache/tags.ts` 里集中定义 tag 工厂函数，避免拼写错误。

```ts
export const cacheTags = {
  problem: (id: string) => `problem:${id}`,
  problemList: () => 'problems:list',
  // ...
}
```

### 3. PPR（题目详情页的混合渲染）

题目详情页是典型的混合场景：题目主体对所有人相同（可缓存），"你是否已通过"是用户私有（不可缓存）。

**正确做法**：题目主体用 `"use cache"` 缓存，用户状态块用 `<Suspense>` 包裹一个独立的动态 Server Component，内部读 cookie 查 Java 后端。

```tsx
export default async function ProblemPage({ params }) {
  const { id } = await params
  const problem = await getProblem(id)  // 缓存，所有人共享
  
  return (
    <>
      <ProblemContent problem={problem} />
      <Suspense fallback={<StatusSkeleton />}>
        <UserProblemStatus problemId={id} />  {/* 不缓存，读 cookie */}
      </Suspense>
    </>
  )
}
```

### 4. 鉴权方案

**Java 后端下发 httpOnly Cookie + 同域部署**：

1. 用户在 `(auth)/login` 提交表单
2. 表单提交到 Next.js 的 `app/api/auth/login/route.ts`
3. Route Handler 转发凭证到 Java 后端
4. Java 后端验证成功返回 JWT，Next.js 写入 httpOnly Cookie
5. 之后：
  - **SSR**：从 `cookies()` 读 JWT，加到 `serverFetch` 的 Authorization header
  - **CSR（管理端）**：同域部署，Cookie 自动携带，Java 后端直接校验

### 5. 管理端纯 CSR 的实现

`app/admin/layout.tsx` 顶部 `"use client"`，整个子树变成 Client Component 树：

```tsx
"use client"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query/client'

export default function AdminLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminShell>{children}</AdminShell>
    </QueryClientProvider>
  )
}
```

数据用 TanStack Query 管理，queryKey 在 `lib/query/keys.ts` 集中定义。

### 6. `proxy.ts`（原 middleware）

Next.js 16 将 `middleware.ts` 重命名为 `proxy.ts`。主要职责：

- `/admin/*` 前置鉴权，未登录重定向到 `/login`
- 可能的多语言路径重写
- 注意：`proxy` 固定 nodejs runtime，不支持 edge runtime

### 7. API 类型生成

Java 后端用 springdoc 暴露 OpenAPI schema，`scripts/generate-api-types.ts` 使用 `openapi-typescript` 生成 TS 类型到 `lib/api/types.ts`。

在 `package.json` 中加 script：

```json
"gen:api": "tsx scripts/generate-api-types.ts"
```

前后端联调时跑一下，全程类型安全。

### 8. 判题结果实时推送

不走 Next.js 中转，浏览器直接通过 SSE 连 Java 后端（同域无 CORS 问题）。

- `lib/realtime/submission-sse.ts`：封装 `EventSource` 订阅逻辑，仅在客户端组件使用
- 提交详情页订阅单个提交的结果更新

---

## 环境变量

```bash
# .env.local
BACKEND_URL=http://java-backend:8080              # SSR 使用，内网地址
NEXT_PUBLIC_BACKEND_URL=https://oj.example.com/api  # 浏览器使用，公网地址
INTERNAL_TOKEN=xxx                                # Next.js ↔ Java 内部鉴权（可选）
REVALIDATE_SECRET=xxx                             # /api/revalidate 的校验 secret
```

---

## 开发顺序建议

1. **基础设施**：`lib/api/` 全套封装、`proxy.ts` 鉴权骨架、`.env` 配置
2. **鉴权流程**：`(auth)/login` + `/api/auth/login` Route Handler + 读取 session
3. **主站 MVP**：题目列表 + 题目详情（PPR 示例）
4. **提交与实时**：代码编辑器 + 提交接口 + SSE 订阅判题结果
5. **管理端 MVP**：`admin/layout.tsx` + TanStack Query + 题目管理
6. **比赛、排行榜、用户主页**等扩展功能
7. **OpenAPI 类型生成脚本接入**
8.  **性能优化**：检查缓存命中、PPR 效果、Bundle Analyzer

---

## 注意事项

- **Next.js 16 `fetch` 不再自动缓存**，必须显式 `"use cache"`，不要依赖旧的 `next.revalidate` 写法
- `**params` 在 Next.js 15+ 是 Promise**，必须 `await params` 解构
- `**middleware.ts` → `proxy.ts`**，新项目直接用新名字
- **服务端代码顶部加 `import 'server-only'`**，防止误引入客户端
- **用户私有数据绝对不要 `"use cache"`**，否则会跨用户串数据
- **Monaco Editor 用 `next/dynamic` + `ssr: false`** 加载，避免 `window is not defined`
- **安全补丁**：Next.js 15.x/16.x 受 CVE-2025-66478（React2Shell）影响，项目启动后确认使用已修复的版本

