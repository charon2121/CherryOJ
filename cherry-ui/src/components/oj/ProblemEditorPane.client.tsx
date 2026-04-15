"use client";

import CodeEditor from "@/components/oj/CodeEditor.client";
import type { LangId, Problem } from "@/data/problems";
import { LANG_LABEL } from "@/data/problems";
import type { SubmissionDetailResponse } from "@/lib/api/oj-types";
import { getSubmission, submitCode } from "@/lib/api/endpoints/submissions.client";
import { useProblemEditorStore } from "@/lib/state/problem-editor.store";
import { Badge, Button, Spinner, TextArea } from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ProblemEditorPaneProps {
  problem: Problem;
}

export default function ProblemEditorPane({ problem }: ProblemEditorPaneProps) {
  const problemKey = problem.routeId ?? problem.id;
  const languageOptions = problem.languageOptions?.length
    ? problem.languageOptions
    : ([
        { id: "cpp", label: LANG_LABEL.cpp, submitValue: "cpp17" },
        { id: "python", label: LANG_LABEL.python, submitValue: "python3" },
        { id: "java", label: LANG_LABEL.java, submitValue: "java17" },
        { id: "rust", label: LANG_LABEL.rust, submitValue: "rust" },
      ] satisfies Array<{ id: LangId; label: string; submitValue: string }>);
  const draft = useProblemEditorStore((state) => state.drafts[problemKey]);
  const saveDraft = useProblemEditorStore((state) => state.saveDraft);
  const clearDraft = useProblemEditorStore((state) => state.clearDraft);
  const defaultLanguage = languageOptions[0]?.id ?? "cpp";
  const [lang, setLang] = useState<LangId>(draft?.language ?? defaultLanguage);
  const [code, setCode] = useState(draft?.code ?? problem.templates[draft?.language ?? defaultLanguage]);
  const [customInput, setCustomInput] = useState(draft?.customInput ?? problem.examples[0]?.input ?? "");
  const [pending, setPending] = useState<"idle" | "run" | "submit">("idle");
  const [runResult, setRunResult] = useState<string | null>(null);
  const [latestSubmission, setLatestSubmission] = useState<SubmissionDetailResponse | null>(null);
  const busy = pending !== "idle";

  useEffect(() => {
    const nextLanguage = draft?.language ?? defaultLanguage;
    setLang(nextLanguage);
    setCode(draft?.code ?? problem.templates[nextLanguage]);
    setCustomInput(draft?.customInput ?? problem.examples[0]?.input ?? "");
    setRunResult(null);
    setLatestSubmission(null);
  }, [defaultLanguage, draft, problem.examples, problem.templates, problemKey]);

  useEffect(() => {
    saveDraft(problemKey, {
      language: lang,
      code,
      customInput,
    });
  }, [code, customInput, lang, problemKey, saveDraft]);

  const onLangChange = useCallback(
    (next: LangId) => {
      setLang(next);
      setCode((currentCode) => {
        const currentDefault = problem.templates[lang];
        if (currentCode === currentDefault) {
          return problem.templates[next];
        }
        return currentCode;
      });
      setRunResult(null);
    },
    [lang, problem.templates],
  );

  const latestSummary = useMemo(() => {
    if (!latestSubmission) {
      return null;
    }
    return {
      status: latestSubmission.status,
      result: latestSubmission.resultCode ?? "—",
      language: latestSubmission.languageCode ?? languageOptions.find((option) => option.id === lang)?.label ?? lang,
      time:
        latestSubmission.timeUsedMs != null ? `${latestSubmission.timeUsedMs} ms` : latestSubmission.status,
      memory:
        latestSubmission.memoryUsedKb != null ? `${latestSubmission.memoryUsedKb} KB` : "—",
    };
  }, [lang, languageOptions, latestSubmission]);

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
    setLatestSubmission(null);
    try {
      if (problem.backendId != null) {
        const selectedLanguage = languageOptions.find((option) => option.id === lang);
        const created = await submitCode({
          problemId: problem.backendId,
          languageCode: selectedLanguage?.submitValue ?? lang,
          sourceCode: code,
        });
        const detail = await getSubmission(created.submissionId);
        setLatestSubmission(detail);
        setRunResult(
          [
            `提交 #${detail.id}`,
            `状态：${detail.status}`,
            `结果：${detail.resultCode ?? "—"}`,
            `语言：${detail.languageCode ?? selectedLanguage?.label ?? lang}`,
            detail.message ? `说明：${detail.message}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        );
      } else {
        await new Promise((r) => setTimeout(r, 900));
        setRunResult(
          `已提交（示意）\n语言：${LANG_LABEL[lang]}\n题目：${problem.id}\n\n` +
            "当前页面使用的是本地 mock 数据，未绑定后端题目 ID。",
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "提交失败";
      setRunResult(`提交失败\n\n${message}`);
    } finally {
      setPending("idle");
    }
  }, [code, lang, languageOptions, problem.backendId, problem.id]);

  const resetDraft = useCallback(() => {
    clearDraft(problemKey);
    setLang(defaultLanguage);
    setCode(problem.templates[defaultLanguage]);
    setCustomInput(problem.examples[0]?.input ?? "");
    setRunResult(null);
  }, [clearDraft, defaultLanguage, problem.examples, problem.templates, problemKey]);

  return (
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
          {languageOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button variant="tertiary" size="sm" isDisabled={busy} onPress={resetDraft}>
            重置草稿
          </Button>
          <Button variant="secondary" size="sm" isDisabled={busy} onPress={() => void mockRun()} className="min-w-[96px]">
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

      <div className="grid gap-0 border-b border-zinc-200/80 bg-zinc-50/80 px-3 py-2 text-xs text-zinc-500 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-zinc-400 sm:grid-cols-4 sm:px-4">
        <div>题目：{problem.id}</div>
        <div>时限：{problem.timeLimit}</div>
        <div>内存：{problem.memoryLimit}</div>
        <div>语言：{languageOptions.find((option) => option.id === lang)?.label ?? lang}</div>
      </div>

      <div className="min-h-[min(420px,45vh)] flex-1 min-h-0 lg:min-h-0">
        <div className="h-full min-h-[280px] px-0 sm:px-1 sm:pt-1">
          <CodeEditor language={lang} value={code} onChange={setCode} />
        </div>
      </div>

      <div className="border-t border-zinc-200/90 dark:border-white/[0.08]">
        <div className="grid gap-4 p-3 lg:grid-cols-[minmax(0,1fr)_320px] sm:p-4">
          <div>
            <div className="mb-1.5 text-xs font-medium text-zinc-500">自定义输入</div>
            <TextArea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="min-h-[120px] w-full font-mono text-xs"
              placeholder="粘贴或编辑样例输入…"
            />
          </div>
          <div className="space-y-3">
            <div>
              <div className="mb-1.5 text-xs font-medium text-zinc-500">运行结果</div>
              <pre className="min-h-[120px] w-full overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs whitespace-pre-wrap text-zinc-800 dark:border-white/[0.08] dark:bg-zinc-950/60 dark:text-zinc-200">
                {runResult ?? "运行或提交后将在此显示输出（当前为前端示意）。"}
              </pre>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-3 dark:border-white/[0.08] dark:bg-white/[0.03]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">最近提交</div>
              {latestSummary ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge color={latestSummary.result === "AC" ? "success" : "danger"}>{latestSummary.result}</Badge>
                    <span className="text-zinc-700 dark:text-zinc-300">{latestSummary.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
                    <span>语言：{latestSummary.language}</span>
                    <span>用时：{latestSummary.time}</span>
                    <span>内存：{latestSummary.memory}</span>
                    <span>题目：{problem.id}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">当前会话还没有提交记录。</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
