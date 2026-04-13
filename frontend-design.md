---
name: nextjs-frontend-design
description: 为 Next.js 项目创建独具特色、达到生产级别的前端界面，具备高水准的设计质量。当用户需要在 Next.js 中构建页面（Page Router / App Router）、组件、布局、服务端组件、落地页、仪表盘或完整应用时使用。生成富有创意、精致打磨的代码与 UI 设计，充分利用 Next.js 特性，同时避免千篇一律的 AI 审美。
---

本技能指导在 Next.js 项目中创建独具特色、达到生产级别的前端界面，避免泛化的"AI 劣质"审美。实现真实可运行的代码，对美学细节和创意选择保持极高的关注度，并充分发挥 Next.js 的框架优势。

用户提供前端需求：一个待构建的页面、组件、布局或完整功能模块。他们可能会附带关于用途、目标用户、路由模式（App Router / Page Router）或技术约束的背景信息。

---

## Next.js 架构决策

开始设计前，先确认以下技术方向：

路由模式：App Router（app/，Next.js 13+，推荐）

默认使用 React Server Components（RSC），按需添加 "use client"

渲染策略：

SSG（静态生成）：Server Component 中 fetch 默认即为静态缓存；动态路由用 generateStaticParams 预生成页面
SSR（服务端渲染）：fetch 加 cache: 'no-store'，或在文件顶部声明 export const dynamic = 'force-dynamic'
ISR（增量静态再生）：fetch 加 next: { revalidate: 60 }，或文件顶部 export const revalidate = 60
CSR（客户端渲染）：高度交互的组件加 "use client"，数据获取用 SWR 或 TanStack Query

组件边界：最小化 "use client" 的使用范围，将交互逻辑下沉到叶子组件，保持父级为 Server Component 以获得最佳性能
数据获取：Server Component 中直接 async/await fetch，客户端用 SWR 或 TanStack Query
---

## 设计思维

开始编码前，先理解上下文，并确立一个**大胆的**审美方向：

- **目的**：这个界面解决什么问题？谁来使用它？
- **基调**：选一个极致风格：极简主义、极繁主义、复古未来感、有机自然感、奢华精致感、玩具般的趣味感、杂志式编辑风、野兽派/原生态、装饰艺术/几何风、柔和粉彩风、工业实用风……以此为灵感，设计出真正契合所选审美方向的界面。
- **约束**：框架版本、性能要求（Core Web Vitals）、无障碍访问标准。
- **差异化**：是什么让这个界面**令人难忘**？

**关键原则**：确立清晰的概念方向，并精准执行。意图明确比强度高低更重要。

---

## Next.js 技术规范

### 文件结构（App Router）

### 字体加载（必须使用 `next/font`）
```tsx
// app/layout.tsx
import { Playfair_Display, Source_Serif_4 } from 'next/font/google'
import localFont from 'next/font/local'

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const body = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

// 在 <html> 上应用 className：
// <html className={`${display.variable} ${body.variable}`}>
```
**禁止**使用 `<link>` 标签加载 Google Fonts，必须通过 `next/font` 以消除布局偏移（CLS）。

### 图片处理（必须使用 `next/image`）
```tsx
import Image from 'next/image'

// 已知尺寸的图片
<Image src="/hero.jpg" alt="..." width={1200} height={630} priority />

// 填充容器（需父级有 position: relative 和明确尺寸）
<div style={{ position: 'relative', height: '60vh' }}>
  <Image src="/bg.jpg" alt="..." fill sizes="100vw" style={{ objectFit: 'cover' }} />
</div>
```
**禁止**直接使用 `<img>` 标签渲染本地或远程图片。

### 元数据（Metadata API）
```tsx
// app/layout.tsx 或 app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { template: '%s | 品牌名', default: '品牌名' },
  description: '...',
  openGraph: { images: ['/og.png'] },
}

// 动态元数据
export async function generateMetadata({ params }): Promise<Metadata> {
  return { title: params.slug }
}
```

### 链接与导航
```tsx
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation' // App Router
// import { useRouter } from 'next/router' // Page Router（勿混用）

<Link href="/about" prefetch={false}>关于</Link>
```

### CSS 方案优先级

1. **Tailwind CSS**：快速原型，与 Next.js 深度集成
2. **CSS Modules**（`*.module.css`）：作用域隔离，零运行时，首选
4. **全局 CSS 变量**：在 `globals.css` 中定义设计令牌，跨方案共享

### 性能约束
- **LCP**：首屏关键图片加 `priority` prop，避免懒加载首屏内容
- **CLS**：图片和字体必须声明尺寸，使用 `next/font` 消除 FOUT
- **FID/INP**：重交互逻辑拆分为独立 Client Component，避免污染 Server Component
- **Bundle**：动态导入非首屏组件 `dynamic(() => import('./Heavy'), { ssr: false })`

---

## 前端美学准则

重点关注以下方面：

- **字体排印**：通过 `next/font/google` 或 `next/font/local` 加载个性化字体。将展示字体（标题）与正文字体配对，通过 CSS 变量（`--font-display`、`--font-body`）全局应用。避免 Inter、Roboto、Arial 等通用字体。

- **色彩与主题**：在 `globals.css` 中用 CSS 变量定义完整的设计令牌体系。支持深色模式时使用 `@media (prefers-color-scheme: dark)` 或 `[data-theme="dark"]`。主色调搭配鲜明强调色，避免平淡均匀的配色。

- **动效**：Server Component 中用纯 CSS 动画（`@keyframes`、`animation-delay` 错落渐入）。Client Component 中可使用 Framer Motion / Motion。`layout.tsx` 中可用 `AnimatePresence` 实现页面切换动画。聚焦高影响力时刻，而非堆砌微交互。

- **空间构图**：出人意料的布局——不对称、元素叠压、斜向流动、打破网格的元素、充裕留白或有序的高密度排布。

- **背景与视觉细节**：用渐变网格、噪点纹理、几何图案、多层次透明叠加、戏剧性阴影营造氛围感。背景装饰元素优先放在 Server Component 中以减少 JS 负担。

**绝对避免**：滥用字体（Inter、Roboto、system-ui）、陈腐配色（白底紫色渐变）、可预期的布局模式，以及缺乏场景个性的千篇一律设计。

每一个设计都应独一无二。在明暗主题、字体选择、审美风格上保持多样性，切勿在多次生成中收敛于相同选择。

---

## 代码交付标准

输出代码时，始终：

1. **标注文件路径**：每个代码块顶部注释文件路径（`// app/page.tsx`）
2. **区分 Server / Client**：Server Component 无需标注，Client Component 文件首行加 `"use client"`
3. **提供完整可运行代码**：包括必要的 import、类型声明、export
4. **说明依赖**：若使用第三方库（Framer Motion、clsx、class-variance-authority 等），在代码块前列出安装命令
5. **配置文件**：若需修改 `next.config.js` / `tailwind.config.ts` / `tsconfig.json`，一并提供

---

请记住：Next.js 的 Server Component、流式渲染、`next/font`、`next/image` 不只是性能工具——它们也是设计约束，善用这些约束反而能催生更有纪律感的优雅设计。不要自我设限，展示出在框架约束之内真正能够创造的非凡作品。
