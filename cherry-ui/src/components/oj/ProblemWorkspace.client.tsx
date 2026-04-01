"use client";

import CodeEditor from "@/components/oj/CodeEditor.client";
import OJChrome from "@/components/oj/OJChrome.client";
import type { LangId, Problem } from "@/data/problems";
import { LANG_LABEL } from "@/data/problems";
import { Badge, Button, Link, Spinner, Tabs, TextArea } from "@heroui/react";
import { useCallback, useMemo, useState } from "react";

function diffPill(d: Problem["difficulty"]) {
  if (d === "入门") return "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300";
  if (d === "进阶") return "bg-amber-500/15 text-amber-900 dark:text-amber-300";
  return "bg-rose-500/15 text-rose-900 dark:text-rose-300";
}

const LANGS: LangId[] = ["cpp", "python", "java", "rust"];

interface ProblemWorkspaceProps {
  problem: Problem;
}

export default function ProblemWorkspace({ problem }: ProblemWorkspaceProps) {
  const [lang, setLang] = useState<LangId>("cpp");
  const [code, setCode] = useState(problem.templates.cpp);
  const [customInput, setCustomInput] = useState(problem.examples[0]?.input ?? "");
  const [pending, setPending] = useState<"idle" | "run" | "submit">("idle");
  const [runResult, setRunResult] = useState<string | null>(null);
  const busy = pending !== "idle";

  const onLangChange = useCallback(
    (next: LangId) => {
      setLang(next);
      setCode(problem.templates[next]);
      setRunResult(null);
    },
    [problem.templates],
  );

  const descriptionBlocks = useMemo(() => problem.description.split(/\n\n+/), [problem.description]);

  const mockRun = useCallback(async () => {
    setPending("run");
    setRunResult(null);
    await new Promise((r) => setTimeout(r, 700));
    setRunResult(
      "编译成功\n\n样例测试（示意）\n────────────────\n" +
        `输入：\n${customInput.trim() || "（空）"}\n\n` +
        `输出：\n${problem.examples[0]?.output ?? "—"}\n\n` +
        "实际评测需接入后端沙箱。",
    );
    setPending("idle");
  }, [customInput, problem.examples]);

  const mockSubmit = useCallback(async () => {
    setPending("submit");
    setRunResult(null);
    await new Promise((r) => setTimeout(r, 900));
    setRunResult(
      `已提交（示意）\n语言：${LANG_LABEL[lang]}\n题目：${problem.id}\n\n` +
        "评测队列中… 接入 API 后将展示真实 verdict。",
    );
    setPending("idle");
  }, [lang, problem.id]);

  return (
    <OJChrome>
      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col border-t border-zinc-200/80 dark:border-white/[0.06] lg:min-h-[calc(100dvh-3.5rem)] lg:flex-row">
        {/* 左侧：题面（LeetCode 式信息架构） */}
        <section className="flex w-full flex-col border-zinc-200/80 dark:border-white/[0.06] lg:w-[46%] lg:max-w-xl lg:border-r xl:max-w-none xl:flex-1">
          <div className="border-b border-zinc-200/80 px-4 py-3 dark:border-white/[0.06] sm:px-5">
            <nav className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Link href="/" className="no-underline hover:text-rose-600 dark:hover:text-rose-400">
                CherryOJ
              </Link>
              <span aria-hidden>/</span>
              <Link href="/problems" className="no-underline hover:text-rose-600 dark:hover:text-rose-400">
                题库
              </Link>
              <span aria-hidden>/</span>
              <span className="text-zinc-700 dark:text-zinc-300">{problem.id}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-2 gap-y-2">
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-white sm:text-xl">
                {problem.id}. {problem.title}
              </h1>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${diffPill(problem.difficulty)}`}
              >
                {problem.difficulty}
              </span>
              <Badge variant="soft" className="tabular-nums">
                {problem.acceptancePct.toFixed(1)}% 通过
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {problem.tags.map((t) => (
                <Badge key={t} variant="soft">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <Tabs.Root defaultSelectedKey="description" className="flex min-h-[320px] flex-1 flex-col lg:min-h-0">
            <Tabs.ListContainer className="sticky top-14 z-10 border-b border-zinc-200/80 bg-zinc-50/95 px-2 backdrop-blur-sm dark:border-white/[0.06] dark:bg-[#0a0a0b]/95">
              <Tabs.List className="gap-0">
                <Tabs.Tab
                  id="description"
                  className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-zinc-600 data-selected:border-rose-500 data-selected:text-zinc-900 dark:text-zinc-400 dark:data-selected:border-rose-400 dark:data-selected:text-white"
                >
                  题目描述
                </Tabs.Tab>
                <Tabs.Tab
                  id="editorial"
                  className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-zinc-600 data-selected:border-rose-500 data-selected:text-zinc-900 dark:text-zinc-400 dark:data-selected:border-rose-400 dark:data-selected:text-white"
                >
                  题解
                </Tabs.Tab>
                <Tabs.Tab
                  id="submissions"
                  className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-zinc-600 data-selected:border-rose-500 data-selected:text-zinc-900 dark:text-zinc-400 dark:data-selected:border-rose-400 dark:data-selected:text-white"
                >
                  提交记录
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>

            <Tabs.Panel
              id="description"
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
            >
              <div className="mx-auto max-w-2xl space-y-5 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                {descriptionBlocks.map((block, i) => (
                  <p key={i} className="whitespace-pre-wrap">
                    {block}
                  </p>
                ))}

                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    示例
                  </h2>
                  <div className="space-y-4">
                    {problem.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-white/[0.08] dark:bg-zinc-950/50"
                      >
                        <div className="grid gap-0 sm:grid-cols-2">
                          <div className="border-b border-zinc-200 p-3 sm:border-b-0 sm:border-r dark:border-white/[0.08]">
                            <div className="mb-1 text-xs font-medium text-zinc-500">输入</div>
                            <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200">{ex.input}</pre>
                          </div>
                          <div className="p-3">
                            <div className="mb-1 text-xs font-medium text-zinc-500">输出</div>
                            <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200">{ex.output}</pre>
                          </div>
                        </div>
                        {ex.explanation && (
                          <div className="border-t border-zinc-200 px-3 py-2 text-xs text-zinc-600 dark:border-white/[0.08] dark:text-zinc-400">
                            解释：{ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    提示
                  </h2>
                  <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {problem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-500">
                  <span>时间限制：<strong className="text-zinc-700 dark:text-zinc-300">{problem.timeLimit}</strong></span>
                  <span>
                    内存限制：<strong className="text-zinc-700 dark:text-zinc-300">{problem.memoryLimit}</strong>
                  </span>
                </div>
              </div>
            </Tabs.Panel>

            <Tabs.Panel id="editorial" className="flex-1 overflow-y-auto px-4 py-8 sm:px-5">
              <p className="mx-auto max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
                官方题解与社区题解将在此展示。接入内容服务后可按点赞与时间排序。
              </p>
            </Tabs.Panel>

            <Tabs.Panel id="submissions" className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
              <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-zinc-200 dark:border-white/[0.08]">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500 dark:border-white/[0.08] dark:bg-white/[0.03]">
                      <th className="px-3 py-2 font-medium">状态</th>
                      <th className="px-3 py-2 font-medium">语言</th>
                      <th className="px-3 py-2 font-medium">用时</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { s: "AC", l: "C++", t: "4 ms" },
                      { s: "AC", l: "Python 3", t: "36 ms" },
                      { s: "WA", l: "C++", t: "—" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-zinc-100 dark:border-white/[0.05]">
                        <td className="px-3 py-2">
                          <Badge color={row.s === "AC" ? "success" : "danger"}>{row.s}</Badge>
                        </td>
                        <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">{row.l}</td>
                        <td className="px-3 py-2 tabular-nums text-zinc-600 dark:text-zinc-400">{row.t}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tabs.Panel>
          </Tabs.Root>
        </section>

        {/* 右侧：编辑器与操作（LeetCode 式工具栏） */}
        <section className="flex min-h-0 flex-1 flex-col bg-white dark:bg-[#0d0d0f]">
          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200/90 px-3 py-2 dark:border-white/[0.08] sm:px-4">
            <label className="sr-only" htmlFor="oj-lang">
              编程语言
            </label>
            <select
              id="oj-lang"
              value={lang}
              onChange={(e) => onLangChange(e.target.value as LangId)}
              className="h-9 max-w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-rose-500/40 focus:ring-2 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {LANG_LABEL[l]}
                </option>
              ))}
            </select>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                isDisabled={busy}
                onPress={() => void mockRun()}
                className="min-w-[96px]"
              >
                {pending === "run" ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="sm" />
                    运行中
                  </span>
                ) : (
                  "运行"
                )}
              </Button>
              <Button
                size="sm"
                isDisabled={busy}
                onPress={() => void mockSubmit()}
                className="min-w-[96px] bg-emerald-600 text-white hover:bg-emerald-500"
              >
                {pending === "submit" ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="sm" />
                    提交中
                  </span>
                ) : (
                  "提交"
                )}
              </Button>
            </div>
          </div>

          <div className="min-h-[min(420px,45vh)] flex-1 min-h-0 lg:min-h-0">
            <div className="h-full min-h-[280px] px-0 sm:px-1 sm:pt-1">
              <CodeEditor language={lang} value={code} onChange={setCode} />
            </div>
          </div>

          <div className="border-t border-zinc-200/90 dark:border-white/[0.08]">
            <div className="flex items-center gap-2 border-b border-zinc-100 px-3 py-2 dark:border-white/[0.06] sm:px-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                测试用例
              </span>
            </div>
            <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4">
              <div>
                <div className="mb-1.5 text-xs font-medium text-zinc-500">自定义输入</div>
                <TextArea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="min-h-[100px] w-full font-mono text-xs"
                  placeholder="粘贴或编辑样例输入…"
                />
              </div>
              <div>
                <div className="mb-1.5 text-xs font-medium text-zinc-500">运行结果</div>
                <pre className="min-h-[100px] w-full overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs text-zinc-800 whitespace-pre-wrap dark:border-white/[0.08] dark:bg-zinc-950/60 dark:text-zinc-200">
                  {runResult ?? "运行或提交后将在此显示输出（当前为前端示意）。"}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </OJChrome>
  );
}
