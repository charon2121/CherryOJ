# V1 Design - Admin Frontend Redesign

## 1. 文档信息

- 版本：V1
- 所属系统：`cherry-ui`
- 对应总设计：[docs/design/v1-frontend-architecture-design.md](./v1-frontend-architecture-design.md)
- 对应视觉规范：[前端视觉规范文档.md](./../../前端视觉规范文档.md)
- 文档类型：Design Layer（管理后台从 0 重建设计）

## 2. 重建背景

旧后台页面已删除。本次后台不做“修补式优化”，而是从 0 重新设计。

重建原因：

- 旧后台壳层、页面和编辑器耦合过重。
- 侧边栏、顶部栏和用户菜单的职责没有稳定下来。
- Markdown 编辑器接入过早，阻塞了后台主体体验。
- 页面视觉虽然多次调整，但缺少一套后台级的信息架构约束。

本次重建目标不是一次性做完所有后台能力，而是先建立一个稳定、可扩展、可维护的后台骨架。

## 3. 设计目标

后台 V1 重建设计目标：

1. 建立独立的 Admin Layout，不与用户端共用页面壳层。
2. 以“题目管理”为第一主功能，先跑通列表、新建、编辑、删除。
3. 使用 HeroUI 组件作为默认 UI 基础，不手写已有组件库能力。
4. 使用 `lucide-react` 作为统一图标来源。
5. 采用 `Server Boundary + CSR Feature` 混合模型：服务端负责权限和入口，客户端负责后台高频数据交互。
6. 第一版不接复杂 Markdown WYSIWYG 编辑器，题面内容先用稳定的 Markdown 文本编辑区。
7. 后台服务器状态统一交给 `TanStack Query` 管理，不再用组件级 `useEffect` 散落请求状态。

## 4. 设计原则

## 4.1 稳定优先

后台是生产工具，不追求炫技。第一版必须先稳定可用。

禁止：

- 为了“高级感”引入复杂动效。
- 在主链路未稳定前接入重型编辑器。
- 把大量状态塞进全局 store。

## 4.2 信息架构优先

后台不是一组孤立页面，而是一个工作台。

基本结构：

- 左侧：主导航
- 主区：当前功能页面

侧栏只放功能模块，不放个人信息卡片。

## 4.3 组件库优先

优先级：

1. HeroUI 组件
2. 项目内封装组件
3. 原生元素

只有在 HeroUI 没有合适语义时，才允许自定义基础结构。

## 4.4 数据边界清晰

- Server Components 负责权限校验、页面入口和用户快照下发。
- Client Components 负责后台功能页面、表格筛选、表单编辑、弹窗确认和提交状态。
- TanStack Query 负责后台服务器状态，包括列表、详情、创建、更新、删除和失效刷新。
- Zustand 只用于必要的 UI 状态，不承载后台题目列表、题目详情这类服务器状态。

## 4.5 后台可以 CSR，但不能失去服务端边界

后台页面可以整体退回以 CSR 为主，因为后台的数据交互十分频繁：

- 搜索
- 筛选
- 翻页
- 保存
- 删除
- 刷新
- 错误重试

这些场景使用 Server Component 强行承载会导致交互链路复杂，且容易和表单状态冲突。

但后台不能完全变成传统 SPA。必须保留服务端边界：

- `/admin/layout.tsx` 仍然是 Server Component。
- 管理员权限仍然通过 `requireAdmin()` 在服务端确认。
- 非管理员不应先看到后台壳层再由客户端跳转。
- 后台 UI 不展示当前用户信息。当前用户快照只在需要执行登出、权限判断等逻辑时作为内部数据传入。

## 5. 路由设计

第一版后台路由：

```text
src/app/admin/
  layout.tsx
  page.tsx
  problems/
    page.tsx
    new/
      page.tsx
    [id]/
      page.tsx
```

路由职责：

- `/admin`：默认跳转或承载题目管理首页。
- `/admin/problems`：题目管理列表。
- `/admin/problems/new`：新建题目。
- `/admin/problems/[id]`：编辑题目。

后续扩展路由：

```text
src/app/admin/
  submissions/
  users/
  settings/
```

但 V1 不急于实现。

## 6. 布局设计

## 6.1 Admin Layout

Admin Layout 必须是 Server Component。

职责：

- 调用 `requireAdmin()`
- 获取当前管理员用户
- 挂载后台 CSR runtime
- 向 Client Shell 传入最小用户快照，但不要求在 UI 中展示用户信息

示意：

```tsx
export default async function AdminLayout({ children }) {
  const user = await requireAdmin();

  return (
    <AdminQueryProvider>
      <AdminShell user={user}>{children}</AdminShell>
    </AdminQueryProvider>
  );
}
```

## 6.2 Admin Shell

Admin Shell 是 Client Component，因为它包含：

- 主题切换
- 侧栏折叠或展开
- 退出登录
- TanStack Query 下的客户端页面容器

结构：

```text
AdminShell
  Sidebar
  Content
```

Admin Shell 不负责业务数据请求。业务数据请求下沉到具体 feature client component。

## 6.3 侧边栏

侧边栏设计：

- 顶部 Header 区只放后台名、产品入口或必要的全局小操作。
- 中间是模块导航。
- 底部可以放退出登录、返回前台、主题切换等全局操作。
- 不放用户资料卡。
- 不放重复操作按钮。
- 不展示当前用户姓名、邮箱或头像。

第一版导航：

```text
题目管理
  全部题目
  新建题目
```

要求：

- 一级菜单支持二级菜单。
- active 状态清晰。
- 图标统一来自 `lucide-react`。
- 风格接近 Linear 的 workspace sidebar：轻边框、弱背景、克制层级。
- 行高可以比 Linear 更舒展，避免后台管理操作显得过于压缩。

## 6.3.1 Sidebar 分区

Sidebar 固定高度，不滚动，内部采用三段式纵向布局：

```text
Sidebar
  Header
    Brand
    optional compact product switch

  Navigation
    nav groups
    nav items
    nested nav items

  Footer
    theme toggle
    return frontend
    logout
```

高度策略：

- Header：`64px` 到 `72px`
- Navigation：占据剩余空间
- Footer：贴底，使用顶部边框分隔

禁止：

- Header 中展示当前用户姓名、邮箱、头像。
- Header 中放大面积卡片。
- Footer 中放用户资料卡。
- Navigation 中放页面级按钮堆叠。

## 6.3.2 Sidebar Header

Sidebar Header 只承担品牌和后台上下文识别。

建议结构：

```text
CherryOJ
Admin
```

视觉：

- 左侧一个 `C` 或 Cherry 标识，尺寸 `28px` 到 `32px`。
- 右侧两行文字：
  - 主标题：`CherryOJ`
  - 次标题：`Admin`
- 主标题字号 `14px`，字重 `600`。
- 次标题字号 `11px`，使用 `muted`。
- 整体高度紧凑，不做卡片。

允许：

- Header 整体点击返回 `/admin/problems`。
- 使用很轻的 hover 背景。

不允许：

- 在这里放当前用户。
- 在这里放“新建题目”。
- 在这里放统计数据。

## 6.3.3 Sidebar Navigation

V1 菜单结构：

```text
内容
  题目管理
    全部题目
    新建题目
```

V1 只显示已经实现或马上实现的功能，不提前展示大量灰掉的未来模块。

后续扩展结构：

```text
内容
  题目管理
    全部题目
    新建题目

运行
  提交记录
  判题节点

系统
  系统配置
```

但在对应页面未实现前，不应出现在实际 UI 中。

## 6.3.4 一级菜单

一级菜单用于表达模块。

当前 V1：

- `题目管理`

一级菜单行为：

- 支持展开 / 收起。
- 如果子项当前 active，一级菜单保持展开。
- 点击一级菜单只切换展开状态，不直接跳转，除非该模块没有子项。

一级菜单视觉：

- 高度：`40px` 到 `44px`
- 圆角：`10px` 到 `12px`
- 左侧图标：`16px`
- 文本字号：`14px`
- 默认颜色：`muted`
- hover：`surface-secondary`
- active parent：文本转 `foreground`，背景仍然轻，不使用重色块
- 展开箭头使用 `ChevronRight`，展开时旋转 `90deg`

推荐图标：

- `题目管理`：`BookOpen` 或 `FileText`

## 6.3.5 二级菜单

二级菜单用于具体页面入口。

当前 V1：

- `全部题目` -> `/admin/problems`
- `新建题目` -> `/admin/problems/new`

二级菜单视觉：

- 高度：`36px` 到 `40px`
- 左侧缩进：相对一级菜单缩进 `16px` 到 `20px`
- 图标：可选，尺寸 `15px` 到 `16px`
- 文本字号：`13px` 到 `14px`
- 默认颜色：`muted`
- hover：`surface-secondary`
- active：`surface-secondary` 背景 + `foreground` 文本 + 左侧细 accent 指示线

active 不建议使用整块黑底或大面积 accent 背景。后台侧栏要保持轻。

推荐图标：

- `全部题目`：`List`
- `新建题目`：`Plus`

## 6.3.6 Sidebar Footer

Footer 放全局操作，但不展示用户信息。

V1 Footer 操作：

```text
主题切换
返回前台
退出登录
```

设计要求：

- Footer 和 Navigation 之间用顶部边框分隔。
- 操作项样式与普通菜单项一致，但层级更弱。
- `退出登录` 使用 danger 语义，但不要大面积红色背景。
- 主题切换可以是 icon-only，也可以是带文字行；V1 推荐带文字，减少后台可理解成本。

推荐图标：

- 主题切换：沿用当前 `ThemeToggle`
- 返回前台：`SquareArrowOutUpRight`
- 退出登录：`LogOut`

## 6.3.7 Sidebar 状态规则

状态规则：

- 当前路径命中子项时，子项 active。
- 子项 active 时，父级自动展开。
- 刷新页面后 active 状态必须由 pathname 推导，不依赖本地 store。
- 用户手动折叠父级后，如果当前页面仍在该组内，允许保持展开，避免把当前位置藏起来。

交互规则：

- hover 只改变背景和文本色。
- active 使用轻背景和 accent 左线。
- 菜单切换使用 `transition-colors` 和箭头旋转即可。
- 不使用复杂展开动画。

## 6.3.8 Sidebar 组件建议

建议组件拆分：

```text
AdminSidebar.client.tsx
  SidebarHeader
  SidebarNavGroup
  SidebarNavItem
  SidebarFooter
```

组件约束：

- `AdminSidebar.client.tsx` 可以是 Client Component，因为包含展开 / 收起状态和退出登录。
- 菜单配置应写成常量，不散落在 JSX 中。
- active 判断集中处理，不在每个 item 内重复写复杂逻辑。
- Link 优先使用 HeroUI `Link` 或 Next.js `Link` 结合 HeroUI 样式，避免原生 `<a>`。

## 6.4 顶部栏

后台 V1 不再使用独立顶部栏。

原本应该放在顶部栏里的内容，按职责重新分配：

- 当前页面标题：放到 Content 内的 PageHeader。
- 主题切换：放到 Sidebar 底部或 Header 区。
- 返回前台：放到 Sidebar 底部。
- 退出登录：放到 Sidebar 底部。
- 当前用户信息：不展示。
- 新建题目：属于题目管理模块，放到列表页 PageHeader 或侧栏二级菜单。

## 6.5 后台整体布局规格

后台采用稳定的左右工作台布局：

```text
┌──────────────────────────────────────────────┐
│ Sidebar │ Content                            │
│ fixed   │ scroll                             │
└──────────────────────────────────────────────┘
```

桌面端：

- 侧栏宽度：`240px`
- 内容区最大宽度：不强制居中，后台页面应充分利用横向空间
- 内容区 padding：`24px`
- 页面背景：`background`
- 侧栏背景：`surface`
- 分隔线：`border`
- Sidebar 高度固定为视口高度：`h-screen`
- Sidebar 不滚动
- Content 最小高度：`min-h-screen`
- Content 是主要滚动容器

实现建议：

```tsx
<div className="grid min-h-screen grid-cols-[240px_1fr] bg-[color:var(--background)]">
  <aside className="sticky top-0 h-screen border-r border-[color:var(--border)] bg-[color:var(--surface)]">
    <AdminSidebar />
  </aside>
  <main className="min-h-screen min-w-0 overflow-y-auto">
    <div className="p-6">{children}</div>
  </main>
</div>
```

约束：

- 不在 `body` 或全局 layout 上额外制造后台滚动逻辑。
- Sidebar 内部不放长列表，V1 不需要滚动。
- Content 内部页面自己处理宽度和分区。
- 不再实现独立 `AdminHeader.client.tsx`，页面 Header 属于具体页面组件。

移动端：

- V1 只保证基础可用。
- 侧栏可以先变成顶部横向入口或抽屉，不作为第一优先级。
- 后台主要面向桌面管理场景。

## 6.6 布局风格基准

后台风格基准：

- 参考 Linear 的 workspace 结构，而不是传统大屏后台。
- 左侧导航轻、窄、克制，不做重色块。
- 主内容区以表格、表单、面板为主，不做营销式大卡片。
- 页面级上下文放在 Content 的 PageHeader 中，而不是独立全局 Header。
- 菜单行高采用舒展版 Linear：保持轻和准，但不追求极限紧凑。

视觉关键词：

- 边框轻
- 阴影少
- 行高舒展但不松散
- 色彩克制
- 操作层级明确

禁止：

- 大面积渐变背景
- 复杂装饰图形
- 个人信息卡片塞进侧栏
- 独立顶部栏堆满页面操作
- 每个区域都套厚重 Card

## 7. 页面设计

## 7.1 题目列表页

目标：作为后台第一主页面。

内容：

- 标题：题目管理
- 说明：管理题目、配置限制、维护测试用例
- 主操作：新建题目
- 筛选：
  - 搜索标题 / 题号
  - 状态
  - 难度
- 表格：
  - 题号
  - 标题
  - 难度
  - 状态
  - 判题模式
  - 时间限制
  - 内存限制
  - 更新时间
  - 操作

第一版操作：

- 编辑
- 删除

页面布局：

```text
Content
  PageHeader
    title: 题目管理
    description
    primary action: 新建题目

  FilterBar
    search
    status select
    difficulty select

  ProblemTable
    rows
    pagination
```

页面 Header：

- 标题一行，字号克制。
- 描述文本只说明功能，不写产品宣传语。
- 主按钮只放一个：`新建题目`。

FilterBar：

- 放在表格上方。
- 使用轻边框容器或直接平铺，不做重卡片。
- 搜索框宽度优先，筛选项紧随其后。
- 筛选条件变化后由 TanStack Query 重新拉取数据。

表格视觉：

- 表头背景使用 `surface-secondary`。
- 行 hover 使用很轻的 `surface-secondary`。
- 行高偏紧凑。
- 题号使用等宽字体。
- 标题为主要信息。
- 状态、难度、判题模式使用 `Tag`。
- 操作列靠右，使用低强调按钮。

空状态：

- 空列表显示简洁提示和 `新建题目` 入口。
- 不放插画。

错误状态：

- 显示错误文本和重试按钮。
- 不自动吞掉错误。

## 7.2 新建 / 编辑题目页

页面结构：

```text
Header
  标题
  保存 / 删除 / 返回

Form
  基础信息
  题面内容
  判题配置
  测试用例
```

第一版字段：

- 题号
- 标题
- 难度
- 状态
- 来源
- 判题模式
- 时间限制
- 内存限制
- 栈限制
- 题目描述
- 提示 / 约束
- 测试用例

题面内容第一版使用 Markdown 文本编辑区，不使用 WYSIWYG。

原因：

- 先保证 CRUD 和数据结构稳定。
- 避免编辑器运行时阻塞后台重建。
- 后续如需富编辑器，应单独做技术验证页，而不是直接放进主表单。

页面布局：

```text
Content
  EditorHeader
    breadcrumb
    title
    actions: 返回 / 保存 / 删除

  EditorBody
    MainColumn
      基础信息
      题面内容
      测试用例
    SideColumn
      发布状态
      判题配置
      保存信息
```

桌面端建议采用双栏：

- 主栏：`minmax(0, 1fr)`
- 侧栏：`320px` 到 `360px`

主栏承载大块内容：

- 基础信息
- 题目描述
- 提示 / 约束
- 测试用例

侧栏承载短配置：

- 状态
- 难度
- 判题模式
- 时间限制
- 内存限制
- 栈限制
- 来源

这样可以避免一张超长表单从上到下堆叠。

表单分区：

- 每个分区使用轻 Card。
- Card header 只放简短标题。
- 不写长篇解释文案。
- 字段 label 要清晰，但辅助文案要少。

题面 Markdown TextArea：

- 默认高度不小于 `280px`。
- 使用等宽字体或正文使用等宽可选，但第一版建议普通正文。
- 提供简短占位提示。
- 不做实时预览，避免第一版复杂化。

测试用例编辑：

- 单独拆成 `ProblemTestCasesEditor.client.tsx`。
- 用例以折叠面板或紧凑 Card 列表展示。
- 每个用例包含：
  - 类型：样例 / 隐藏
  - 输入
  - 期望输出
  - 分值
  - 状态
  - 删除按钮
- 新增用例按钮放在用例区标题右侧。

保存交互：

- 保存按钮固定在页面 Header 或右侧栏顶部。
- 保存中显示 pending 状态。
- 保存失败显示错误提示。
- 保存成功后进入编辑页或保持当前页并刷新 query。

删除交互：

- 编辑模式才显示删除。
- 删除必须有确认。
- 删除成功后回到题目列表。

离开页面保护：

- V1 可以暂不做。
- 后续如果表单复杂化，再加 unsaved changes prompt。

## 7.3 新建题目页

新建题目页复用编辑页布局，但有以下差异：

- Header 标题为 `新建题目`
- 主按钮为 `创建题目`
- 不显示删除按钮
- 不显示更新时间
- 默认包含一个空测试用例

创建成功后：

- 跳转到 `/admin/problems/{id}`
- invalidate `adminQueryKeys.problems.all`

## 7.4 编辑题目页

编辑题目页通过 TanStack Query 拉取详情。

页面状态：

- loading：显示表单骨架
- error：显示错误和重试按钮
- success：显示表单

保存成功后：

- 更新 detail cache
- invalidate problem list
- 页面保留在当前编辑页

删除成功后：

- invalidate problem list
- 跳转到 `/admin/problems`

## 8. 组件设计

建议组件结构：

```text
src/components/admin/
  shell/
    AdminShell.client.tsx
    AdminSidebar.client.tsx
  problems/
    ProblemList.client.tsx
    ProblemForm.client.tsx
    ProblemTestCasesEditor.client.tsx
```

约束：

- Shell 组件只处理布局和导航。
- ProblemList 只处理列表交互。
- ProblemForm 只处理题目表单。
- TestCasesEditor 单独拆分，避免表单文件过大。

## 8.1 后台数据层目录

后台数据交互单独收敛到 `src/lib/admin`：

```text
src/lib/admin/
  query-client.ts
  query-keys.ts
  problems.queries.ts
  problems.mutations.ts
```

职责：

- `query-client.ts`：定义后台 QueryClient 默认配置。
- `query-keys.ts`：集中管理后台 query key。
- `problems.queries.ts`：题目管理查询 hook。
- `problems.mutations.ts`：题目管理 mutation hook。

后台页面不直接写散落的 `useQuery({ queryKey: [...] })`。业务模块必须通过封装 hook 使用数据。

## 8.2 TanStack Query 基线

后台引入 `@tanstack/react-query`。

默认配置建议：

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

设计理由：

- 后台数据不需要每次组件重新挂载都立即重复请求。
- 管理数据在窗口聚焦后应保持相对新鲜。
- 保存、删除失败必须立即暴露，不做多次静默重试。
- 第一版先不做 SSR prefetch / hydration，降低复杂度。

## 8.3 Query Key 设计

Query key 必须集中定义。

建议：

```ts
export const adminQueryKeys = {
  problems: {
    all: ["admin", "problems"] as const,
    list: (params: AdminProblemListParams) =>
      ["admin", "problems", "list", params] as const,
    detail: (id: string | number) =>
      ["admin", "problems", "detail", String(id)] as const,
  },
};
```

约束：

- 不允许在页面里临时手写 query key。
- 新增后台模块必须先扩展 `adminQueryKeys`。
- 删除、创建、更新后优先使用 query invalidation，而不是手动维护复杂缓存。

## 8.4 Mutation 设计

创建题目：

- 调用 `createAdminProblem`
- 成功后 invalidate `adminQueryKeys.problems.all`
- 跳转到编辑页

更新题目：

- 调用 `updateAdminProblem`
- 成功后更新 detail cache
- invalidate problem list

删除题目：

- 调用 `deleteAdminProblem`
- 成功后 invalidate problem list
- 回到 `/admin/problems`

第一版不做 optimistic update。后台操作更重视准确反馈，不需要为了“即时感”承担回滚复杂度。

## 8.5 Zustand 新边界

后台接入 TanStack Query 后，Zustand 不再承载服务器状态。

允许使用 Zustand 的场景：

- 侧栏折叠
- 全局 UI 开关
- 临时本地偏好

不允许使用 Zustand 的场景：

- 题目列表
- 题目详情
- 后台用户列表
- 提交记录
- 任意来自后端的业务主数据

题目表单草稿第一版使用组件局部 state。只有在出现跨页面恢复草稿的明确需求时，才引入独立 draft store。

## 8.6 HeroUI 组件选型

后台 V1 优先使用以下 HeroUI 组件：

- `Button`
- `Card`
- `Input`
- `TextArea`
- `Dropdown`
- `Link`
- `Select`，如果当前 HeroUI v3 可用且类型稳定
- `Table`，如果当前 HeroUI v3 可用且类型稳定

如果 `Select` / `Table` 在当前版本类型或交互不稳定，允许先用项目内封装组件，但样式必须对齐 HeroUI。

项目内组件：

- `Tag`：用于状态、难度、判题模式。
- `AdminPageHeader`：可选，用于统一列表页和编辑页标题区。
- `ConfirmDialog`：后续可封装删除确认。

## 8.7 图标选型

图标统一使用 `lucide-react`。

建议映射：

- 题目管理：`BookOpen` 或 `FileText`
- 全部题目：`List`
- 新建题目：`Plus`
- 返回前台：`SquareArrowOutUpRight`
- 退出登录：`LogOut`
- 设置：`Settings`
- 保存：`Save`
- 删除：`Trash2`
- 搜索：`Search`

图标尺寸：

- 导航图标：`16px`
- 按钮图标：`16px`
- 页面标题辅助图标：`18px`

图标线宽：

- 默认 `strokeWidth={1.8}` 或 `1.9`
- 不使用填充型图标混入后台 UI

## 8.8 动效与反馈

后台动效必须克制。

允许：

- hover 背景过渡
- active 状态过渡
- dropdown / popover 默认动效
- loading skeleton

禁止：

- 页面大范围 reveal 动画
- 弹跳
- 过度缩放
- 复杂背景动效

操作反馈：

- 查询 loading 用 skeleton 或表格内 loading 状态。
- mutation pending 只锁定相关按钮，不锁死整个页面。
- 错误提示应靠近触发区域。
- 成功提示可以先使用轻量文本状态，后续再引入 toast。

## 9. Markdown 编辑策略

V1 策略：

- 使用普通 Markdown TextArea。
- 提供基础提示文案。
- 存储格式仍然是 Markdown string。

后续策略：

- 如果需要 Milkdown / MDXEditor / 其他编辑器，必须先建立独立验证页面。
- 验证通过后再替换 `ProblemForm` 中的文本编辑区。
- 编辑器组件必须是独立 Client Leaf，不允许污染 Server Shell。

## 10. 实施顺序

第一阶段：后台骨架

- 新建 `/admin/layout.tsx`
- 新建 `/admin/providers.tsx`
- 新建 `AdminShell`
- 新建 `AdminSidebar`
- 新建 `AdminHeader`
- 恢复管理员服务端权限入口
- 安装并配置 `@tanstack/react-query`

第二阶段：题目列表

- 新建 `/admin/problems/page.tsx`
- 通过 `useAdminProblemsQuery` 接入 `/api/admin/problems`
- 实现搜索、筛选、表格和新建入口

第三阶段：题目表单

- 新建 `/admin/problems/new/page.tsx`
- 新建 `/admin/problems/[id]/page.tsx`
- 实现题目基础信息、配置、题面和用例编辑
- 通过 `useAdminProblemQuery`、`useCreateAdminProblemMutation`、`useUpdateAdminProblemMutation`、`useDeleteAdminProblemMutation` 处理数据

第四阶段：交互收口

- 删除确认
- 保存状态
- 错误提示
- 空状态
- 加载状态

第五阶段：视觉收口

- 对齐前端视觉规范
- 检查深色模式
- 检查移动端基础可用性
- 跑 `pnpm typecheck` 和 `pnpm lint`

## 11. 明确不做

V1 后台重建不做：

- Markdown WYSIWYG 编辑器
- 复杂仪表盘
- 提交监控
- 用户管理
- 批量导入
- 拖拽排序
- 自动化测试

这些功能应在题目管理主链路稳定后再扩展。
