# V1 Test - Frontend Architecture Validation

## 1. 文档信息

- 对应设计文档：`docs/design/v1-frontend-architecture-design.md`
- 对应执行清单：`docs/tasks/v1-frontend-architecture-refactor.json`
- 文档类型：Execution Layer（验证与回归检查）

## 2. 目标

本文档用于验证 `cherry-ui` 的前端架构重构是否真正落地，而不是只完成了表面页面改写。

本轮验证关注四件事：

1. 主题入口是否已收敛
2. 路由与权限是否已回到服务端入口
3. 页面是否已形成 `server shell + client leaf` 结构
4. 客户端状态是否已收缩为 auth snapshot / draft state / pure UI state

## 3. 静态检查

### 3.1 样式入口

- `app/layout.tsx` 只引入 `globals.css`
- `globals.css` 负责引入 `@heroui/styles` 与 `theme.css`
- `theme.css` 不再重复导入 Tailwind / HeroUI

### 3.2 路由布局

- `(main)/layout.tsx` 负责用户端 chrome 与用户快照注入
- `admin/layout.tsx` 负责管理员服务端校验与后台 chrome 注入
- `(auth)/layout.tsx` 负责认证页面壳与用户快照注入

### 3.3 页面分层

- 首页主内容为 Server Component
- 题库页拆成 `ProblemsPageShell` + `ProblemsFilterPanel.client`
- 题目详情页拆成 `ProblemPageShell` + `ProblemEditorPane.client`
- 后台编辑页拆成 `AdminProblemEditorShell` + `AdminProblemForm.client`

### 3.4 状态分层

- `auth.store.ts` 不再承担启动时 `/me` 拉取
- `problem-editor.store.ts` 承担题目代码草稿
- `admin-problem-draft.store.ts` 承担后台题目草稿
- `ui.store.ts` 承担纯 UI 状态

## 4. 人工回归清单

## 4.1 主题与首帧

- 打开首页，确认无 hydration mismatch 报错
- 点击主题切换按钮，确认浅色 / 深色 / 跟随系统正常轮换
- 刷新页面后，确认主题表现与 `next-themes` 当前设置一致

## 4.2 用户端路由

- 未登录访问 `/`、`/problems`，页面可正常渲染
- 未登录访问 `/problems/{id}`，应跳转到 `/login?returnUrl=...`
- 登录后重新访问 `/problems/{id}`，应直接进入题目页
- 顶栏用户名菜单打开 / 关闭行为正常
- 管理员用户应在顶栏菜单中看到“进入管理后台”

## 4.3 后台路由

- 普通用户访问 `/admin`，应被重定向到 `/problems`
- 未登录访问 `/admin`，应被重定向到 `/login?returnUrl=/admin`
- 管理员访问 `/admin`、`/admin/problems/new`、`/admin/problems/{id}`，页面可正常渲染

## 4.4 草稿恢复

### 题目工作台

- 在题目页输入代码与自定义输入
- 刷新页面后，草稿应恢复
- 点击“重置草稿”后，应恢复到题目默认模板与默认样例输入

### 后台题目编辑页

- 在新建题目页输入若干字段，不保存直接刷新
- 草稿应恢复
- 在编辑题目页修改若干字段，不保存直接刷新
- 草稿应恢复
- 点击“重置草稿”后，应恢复到服务端初始值
- 保存成功后，再次进入页面，不应继续残留旧草稿

## 5. 命令验证

当前最基础的前端校验命令：

```bash
cd cherry-ui
npm run lint
npm run typecheck
```

期望：

- 命令退出码为 0
- TypeScript 类型检查通过
- 不存在遗留的 `RequireAuth.client.tsx` / `RequireAdmin.client.tsx` 引用
- 不存在旧页面壳组件的悬挂引用

## 6. 完成标准

满足以下条件可认为本轮前端架构重构基本收口：

- 设计文档、执行清单、验证文档三者一致
- 路由与权限主入口均已迁移到服务端
- 核心页面已形成稳定的 `server shell + client leaf` 模式
- draft state 与 pure UI state 已形成明确 store 边界
- `npm run lint` 持续通过
- `npm run typecheck` 持续通过
