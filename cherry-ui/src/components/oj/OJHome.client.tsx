"use client";

import { Badge, Button, Card, Input, Link } from "@heroui/react";

const stats = [
  { value: "1,284", label: "题目" },
  { value: "12.4k", label: "用户" },
  { value: "3.2k", label: "今日提交" },
  { value: "99.2%", label: "评测可用性" },
];

const problems = [
  { id: "P1001", title: "A + B Problem", diff: "入门", rate: "92%", tags: ["模拟", "入门"] },
  { id: "P2047", title: "区间最值与懒标记", diff: "提高", rate: "18%", tags: ["线段树"] },
  { id: "P0888", title: "最短路计数", diff: "进阶", rate: "41%", tags: ["图论", "Dijkstra"] },
  { id: "P0420", title: "动态规划 · 背包变种", diff: "进阶", rate: "35%", tags: ["DP"] },
  { id: "P1337", title: "字符串哈希入门", diff: "入门", rate: "67%", tags: ["字符串"] },
];

const submissions = [
  { id: "#892341", prob: "P2047", lang: "C++20", status: "AC", time: "48 ms", mem: "9.8 MB", when: "2 分钟前" },
  { id: "#892338", prob: "P0888", lang: "Rust", status: "WA", time: "—", mem: "—", when: "6 分钟前" },
  { id: "#892331", prob: "P1001", lang: "Python 3", status: "TLE", time: "1000 ms", mem: "—", when: "12 分钟前" },
  { id: "#892318", prob: "P0420", lang: "C++17", status: "AC", time: "124 ms", mem: "12.1 MB", when: "1 小时前" },
];

const snippet = `// CherryOJ — 示例提交
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int a, b;
    if (cin >> a >> b) {
        cout << a + b << '\\n';
    }
    return 0;
}`;

function diffClass(d: string) {
  if (d === "入门") return "text-emerald-700 dark:text-emerald-400/90";
  if (d === "进阶") return "text-amber-700 dark:text-amber-400/90";
  return "text-rose-700 dark:text-rose-400/90";
}

function statusBadge(status: string) {
  if (status === "AC") return <Badge color="success">{status}</Badge>;
  if (status === "WA") return <Badge color="danger">{status}</Badge>;
  if (status === "TLE") return <Badge color="warning">{status}</Badge>;
  return <Badge variant="soft">{status}</Badge>;
}

export default function OJHome() {
  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <section className="mb-16 text-center sm:mb-20 sm:text-left">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
            为算法竞赛
            <span className="bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent dark:from-rose-400 dark:to-orange-300">
              而生的在线评测
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-zinc-600 sm:mx-0 sm:text-lg dark:text-zinc-400">
            在浏览器里完成读题、编码、提交与反馈。隔离评测环境、精确资源统计，让你专注思路与实现。
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-stretch">
            <Input
              placeholder="搜索题目、标签或题号…"
              className="w-full max-w-md sm:max-w-sm"
              aria-label="搜索题目"
            />
            <Link
              href={"/problems"}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-rose-600 px-5 text-sm font-medium text-white no-underline transition-colors hover:bg-rose-500"
            >
              进入题库
            </Link>
            <Button variant="secondary">查看比赛日历</Button>
          </div>
        </section>

        <section className="mb-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {stats.map((s) => (
            <Card
              key={s.label}
              className="border border-zinc-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:shadow-none"
            >
              <Card.Content className="p-0">
                <p className="text-2xl font-semibold tabular-nums text-zinc-900 sm:text-3xl dark:text-white">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-zinc-500">{s.label}</p>
              </Card.Content>
            </Card>
          ))}
        </section>

        <section id="problems" className="mb-16 scroll-mt-24">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl dark:text-white">热门题目</h2>
              <p className="text-sm text-zinc-500">按通过率与近期活跃度排序（示意数据）</p>
            </div>
            <Link
              href={"/problems"}
              className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-zinc-700 no-underline hover:bg-zinc-200/80 dark:text-zinc-300 dark:hover:bg-white/[0.06]"
            >
              全部题目
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="border border-zinc-200/80 bg-white shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] dark:shadow-none lg:col-span-3">
              <Card.Content className="overflow-x-auto p-0 sm:p-0">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500 dark:border-white/[0.06]">
                      <th className="px-4 py-3 font-medium">题号</th>
                      <th className="px-4 py-3 font-medium">题目名称</th>
                      <th className="px-4 py-3 font-medium">难度</th>
                      <th className="px-4 py-3 font-medium">通过率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-white/[0.04] dark:hover:bg-white/[0.04]"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">{p.id}</td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/problems/${p.id}`}
                            className="font-medium text-zinc-900 no-underline hover:text-rose-600 dark:text-zinc-100 dark:hover:text-rose-400"
                          >
                            {p.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {p.tags.map((t) => (
                              <span
                                key={t}
                                className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-500"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-sm font-medium ${diffClass(p.diff)}`}>{p.diff}</td>
                        <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">{p.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Content>
            </Card>

            <Card className="border border-zinc-200/80 bg-zinc-50/80 dark:border-white/[0.06] dark:bg-[#0c0c0e] lg:col-span-2">
              <Card.Header className="flex flex-row items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-white/[0.06]">
                <Card.Title className="text-base text-zinc-900 dark:text-white">提交预览</Card.Title>
                <div className="flex gap-2">
                  <Badge variant="soft">C++20</Badge>
                  <Badge variant="soft" color="warning">
                    1s / 256MB
                  </Badge>
                </div>
              </Card.Header>
              <Card.Content className="pt-4">
                <pre className="max-h-[280px] overflow-auto rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[11px] leading-relaxed text-zinc-800 sm:text-xs dark:border-white/[0.08] dark:bg-black/50 dark:text-zinc-300">
                  {snippet}
                </pre>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href="/problems/P1001"
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-rose-600 px-4 text-sm font-medium text-white no-underline hover:bg-rose-500"
                  >
                    提交评测
                  </Link>
                  <Button size="sm" variant="secondary">
                    自测样例
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </section>

        <section id="submissions" className="scroll-mt-24">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-zinc-900 sm:text-2xl dark:text-white">最近提交</h2>
            <p className="text-sm text-zinc-500">状态、时间与内存一目了然</p>
          </div>
          <Card className="border border-zinc-200/80 bg-white shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] dark:shadow-none">
            <Card.Content className="overflow-x-auto p-0">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500 dark:border-white/[0.06]">
                    <th className="px-4 py-3 font-medium">提交 ID</th>
                    <th className="px-4 py-3 font-medium">题目</th>
                    <th className="px-4 py-3 font-medium">语言</th>
                    <th className="px-4 py-3 font-medium">状态</th>
                    <th className="px-4 py-3 font-medium">用时</th>
                    <th className="px-4 py-3 font-medium">内存</th>
                    <th className="px-4 py-3 font-medium">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 dark:border-white/[0.04] dark:hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">{s.id}</td>
                      <td className="px-4 py-3 font-mono text-zinc-800 dark:text-zinc-300">{s.prob}</td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{s.lang}</td>
                      <td className="px-4 py-3">{statusBadge(s.status)}</td>
                      <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">{s.time}</td>
                      <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400">{s.mem}</td>
                      <td className="px-4 py-3 text-zinc-500">{s.when}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card.Content>
          </Card>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-white/[0.06] dark:text-zinc-600">
        <p>CherryOJ · 现代在线评测前端示意 · 可与任意后端评测机对接</p>
      </footer>
    </>
  );
}
