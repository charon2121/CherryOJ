import { Button, Card, Input, Link } from "@heroui/react";
import NextLink from "next/link";
import { Tag } from "@/components/ui/Tag";

const stats = [
  { value: "1,284", label: "题目", detail: "覆盖基础算法到竞赛专题" },
  { value: "12.4k", label: "活跃用户", detail: "持续刷题与提交反馈" },
  { value: "3.2k", label: "今日提交", detail: "实时状态与结果回写" },
  { value: "99.2%", label: "评测可用性", detail: "稳定执行与资源隔离" },
];

const hotProblems = [
  { id: "P1001", title: "A + B Problem", difficulty: "入门", acceptance: "92%", tags: ["模拟", "入门"] },
  { id: "P2047", title: "区间最值与懒标记", difficulty: "提高", acceptance: "18%", tags: ["线段树"] },
  { id: "P0888", title: "最短路计数", difficulty: "进阶", acceptance: "41%", tags: ["图论", "Dijkstra"] },
  { id: "P0420", title: "动态规划 · 背包变种", difficulty: "进阶", acceptance: "35%", tags: ["DP"] },
];

const activity = [
  { id: "#892341", problem: "P2047", language: "C++20", result: "AC", time: "48 ms", memory: "9.8 MB" },
  { id: "#892338", problem: "P0888", language: "Rust", result: "WA", time: "—", memory: "—" },
  { id: "#892331", problem: "P1001", language: "Python 3", result: "TLE", time: "1000 ms", memory: "—" },
  { id: "#892318", problem: "P0420", language: "C++17", result: "AC", time: "124 ms", memory: "12.1 MB" },
];

const capabilities = [
  {
    title: "读题与提交在同一工作区完成",
    description: "题面、样例、代码编辑器、运行结果与最近提交被组织在同一条主链路里，减少切换成本。",
  },
  {
    title: "服务端为页面骨架，客户端只保留交互叶子",
    description: "首页、题库、题目页与后台已经按 server shell + client leaf 拆分，首屏更稳，结构更可维护。",
  },
  {
    title: "后台配置与前台做题共用同一套产品语言",
    description: "用户端偏产品，后台偏工具，但保持同一套 token、排版和状态语义，不再一页一个风格。",
  },
];

const snippet = `// Runtime snapshot
problem: P1001
language: C++20
status: Accepted
time: 48 ms
memory: 9824 KB

stdin  -> 1 2
stdout -> 3`;

function difficultyTone(value: string) {
  if (value === "入门") return "text-emerald-700 dark:text-emerald-300";
  if (value === "进阶") return "text-amber-700 dark:text-amber-300";
  return "text-rose-700 dark:text-rose-300";
}

function resultBadge(result: string) {
  if (result === "AC") return <Tag tone="success">{result}</Tag>;
  if (result === "WA") return <Tag tone="danger">{result}</Tag>;
  if (result === "TLE") return <Tag tone="warning">{result}</Tag>;
  return <Tag>{result}</Tag>;
}

export default function OJHome() {
  return (
    <>
      <main className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-12">
        <section className="grid gap-6 border-b border-[color:var(--border)] pb-8 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:pb-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <Tag size="md">
                CherryOJ · Online Judge Workspace
              </Tag>
              <div className="space-y-3">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
                  为算法训练与竞赛准备的
                  <span className="text-[color:var(--accent)]"> 现代在线评测工作台</span>
                </h1>
                <p className="max-w-3xl text-base leading-7 text-[color:var(--muted)] sm:text-lg">
                  CherryOJ 把题库、题面、代码编辑器、提交结果和后台配置收在同一套冷静、克制、可持续扩展的产品界面里。
                  它不是展示页，而是一个真正以效率为中心的做题工作区。
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <NextLink
                href="/problems"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[color:var(--accent)] px-4 text-sm font-medium text-[color:var(--accent-foreground)] no-underline transition-opacity hover:opacity-90"
              >
                进入题库
              </NextLink>
              <NextLink
                href="/admin"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-medium text-[color:var(--foreground)] no-underline hover:bg-[color:var(--surface-secondary)]"
              >
                查看后台
              </NextLink>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
              <Input
                aria-label="搜索题目"
                placeholder="搜索题号、标题或知识点"
                className="w-full"
              />
              <Button variant="secondary" className="w-full">
                查看比赛日历
              </Button>
            </div>
          </div>

          <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
            <Card.Header className="flex flex-row items-start justify-between gap-4 border-b border-[color:var(--border)]">
              <div>
                <Card.Title className="text-base text-[color:var(--foreground)]">评测运行快照</Card.Title>
                <Card.Description className="text-sm text-[color:var(--muted)]">
                  首页不做夸张 hero，而是直接展示核心工作对象。
                </Card.Description>
              </div>
              <Tag>Live</Tag>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-secondary)] p-3">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--muted)]">队列</div>
                  <div className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">07</div>
                </div>
                <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-secondary)] p-3">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--muted)]">Worker</div>
                  <div className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">12 / 12</div>
                </div>
              </div>
              <pre className="overflow-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-secondary)] p-4 font-mono text-xs leading-6 text-[color:var(--foreground)]">
                {snippet}
              </pre>
              <div className="flex items-center justify-between text-xs text-[color:var(--muted)]">
                <span>隔离执行</span>
                <span>实时结果回写</span>
                <span>状态可追踪</span>
              </div>
            </Card.Content>
          </Card>
        </section>

        <section className="grid gap-3 py-8 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <Card key={item.label} className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
              <Card.Content className="space-y-2 p-4">
                <div className="text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">{item.value}</div>
                <div className="text-sm font-medium text-[color:var(--foreground)]">{item.label}</div>
                <div className="text-sm leading-6 text-[color:var(--muted)]">{item.detail}</div>
              </Card.Content>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 border-t border-[color:var(--border)] py-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-[color:var(--foreground)]">热门题目</h2>
                <p className="mt-1 text-sm text-[color:var(--muted)]">首页直接展示题目对象，不展示空洞宣传文案。</p>
              </div>
              <Link href="/problems" className="text-sm no-underline">
                查看全部
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[color:var(--border)] bg-[color:var(--surface-secondary)] text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">
                      <th className="px-4 py-3 font-medium">题号</th>
                      <th className="px-4 py-3 font-medium">题目</th>
                      <th className="px-4 py-3 font-medium">难度</th>
                      <th className="px-4 py-3 font-medium">通过率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotProblems.map((problem) => (
                      <tr
                        key={problem.id}
                        className="border-b border-[color:var(--border)] last:border-b-0 hover:bg-[color:var(--surface-secondary)]"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-[color:var(--muted)]">{problem.id}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-[color:var(--foreground)]">{problem.title}</div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {problem.tags.map((tag) => (
                              <Tag key={tag}>
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        </td>
                        <td className={`px-4 py-3 font-medium ${difficultyTone(problem.difficulty)}`}>{problem.difficulty}</td>
                        <td className="px-4 py-3 tabular-nums text-[color:var(--muted)]">{problem.acceptance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[color:var(--foreground)]">构建原则</h2>
              <p className="mt-1 text-sm text-[color:var(--muted)]">用户端像产品，后台像工具，但必须看起来属于同一产品。</p>
            </div>

            <div className="space-y-3">
              {capabilities.map((capability) => (
                <Card key={capability.title} className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
                  <Card.Content className="space-y-2 p-4">
                    <div className="text-sm font-medium text-[color:var(--foreground)]">{capability.title}</div>
                    <div className="text-sm leading-6 text-[color:var(--muted)]">{capability.description}</div>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 border-t border-[color:var(--border)] py-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[color:var(--foreground)]">最近提交</h2>
              <p className="mt-1 text-sm text-[color:var(--muted)]">所有结果都应该一眼能读，不靠重装饰来制造所谓设计感。</p>
            </div>

            <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
              <Card.Content className="space-y-3 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[color:var(--muted)]">平均评测时延</span>
                  <span className="font-medium text-[color:var(--foreground)]">83 ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[color:var(--muted)]">平均资源占用</span>
                  <span className="font-medium text-[color:var(--foreground)]">11.2 MB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[color:var(--muted)]">实时失败告警</span>
                  <span className="font-medium text-[color:var(--foreground)]">0 unresolved</span>
                </div>
              </Card.Content>
            </Card>
          </div>

          <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--border)] bg-[color:var(--surface-secondary)] text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">
                    <th className="px-4 py-3 font-medium">提交 ID</th>
                    <th className="px-4 py-3 font-medium">题目</th>
                    <th className="px-4 py-3 font-medium">语言</th>
                    <th className="px-4 py-3 font-medium">状态</th>
                    <th className="px-4 py-3 font-medium">用时</th>
                    <th className="px-4 py-3 font-medium">内存</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[color:var(--border)] last:border-b-0 hover:bg-[color:var(--surface-secondary)]"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-[color:var(--muted)]">{item.id}</td>
                      <td className="px-4 py-3 font-mono text-[color:var(--foreground)]">{item.problem}</td>
                      <td className="px-4 py-3 text-[color:var(--muted)]">{item.language}</td>
                      <td className="px-4 py-3">{resultBadge(item.result)}</td>
                      <td className="px-4 py-3 tabular-nums text-[color:var(--muted)]">{item.time}</td>
                      <td className="px-4 py-3 tabular-nums text-[color:var(--muted)]">{item.memory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[color:var(--border)]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-4 py-6 text-sm text-[color:var(--muted)] sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <span>CherryOJ · Minimal judge workspace for practice and competition.</span>
          <div className="flex gap-4">
            <Link href="/problems" className="text-sm no-underline">
              题库
            </Link>
            <Link href="/admin" className="text-sm no-underline">
              管理后台
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
