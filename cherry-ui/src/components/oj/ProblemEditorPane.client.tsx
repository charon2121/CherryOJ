"use client";

import CodeEditor from "@/components/oj/CodeEditor.client";
import { Tag } from "@/components/ui/Tag";
import type { LangId, Problem } from "@/data/problems";
import { LANG_LABEL } from "@/data/problems";
import { getSubmission, submitCode } from "@/lib/api/endpoints/submissions.client";
import type { SubmissionDetailResponse } from "@/lib/api/oj-types";
import { useProblemEditorStore } from "@/lib/state/problem-editor.store";
import { Button, Spinner, TextArea } from "@heroui/react";
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
    await new Promise((resolve) => setTimeout(resolve, 700));
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
        await new Promise((resolve) => setTimeout(resolve, 900));
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
    <section className="min-w-0 bg-[color:var(--surface)]">
      <div className="flex h-full min-h-[420px] flex-col">
        <div className="border-b border-[color:var(--border)] px-4 py-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="border-b-2 border-[color:var(--accent)] pb-2 font-medium text-[color:var(--foreground)]">
                代码
              </div>
              <div className="pb-2 text-[color:var(--muted)]">提交结果</div>
              <div className="pb-2 text-[color:var(--muted)]">调试输入</div>
            </div>
            <Tag bordered={false}>草稿自动保存</Tag>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="oj-lang">
              编程语言
            </label>
            <select
              id="oj-lang"
              value={lang}
              onChange={(event) => onLangChange(event.target.value as LangId)}
              className="h-9 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm text-[color:var(--foreground)] outline-none ring-[color:var(--accent)]/25 focus:ring-2"
            >
              {languageOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <Button variant="tertiary" size="sm" isDisabled={busy} onPress={resetDraft}>
                重置
              </Button>
              <Button variant="secondary" size="sm" isDisabled={busy} onPress={() => void mockRun()}>
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
                className="bg-[color:var(--accent)] text-[color:var(--accent-foreground)] hover:opacity-90"
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
        </div>

        <div className="flex-1 border-b border-[color:var(--border)]">
          <div className="h-full min-h-[360px] px-0 sm:px-1 sm:pt-1">
            <CodeEditor language={lang} value={code} onChange={setCode} />
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="border-b border-[color:var(--border)] px-4 py-4 xl:border-b-0 xl:border-r">
            <div className="mb-2 text-sm font-medium text-[color:var(--foreground)]">自定义输入</div>
            <TextArea
              value={customInput}
              onChange={(event) => setCustomInput(event.target.value)}
              className="min-h-[132px] w-full font-mono text-xs"
              placeholder="粘贴或编辑样例输入…"
            />
          </div>

          <div className="space-y-4 px-4 py-4">
            <div>
              <div className="mb-2 text-sm font-medium text-[color:var(--foreground)]">运行结果</div>
              <pre className="min-h-[132px] overflow-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-secondary)] p-3 font-mono text-xs leading-6 whitespace-pre-wrap text-[color:var(--foreground)]">
                {runResult ?? "运行或提交后将在此显示结果。当前页面仍保留前端示意输出。"}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-[color:var(--foreground)]">最近提交</div>
              {latestSummary ? (
                <div className="space-y-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-secondary)] p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Tag tone={latestSummary.result === "AC" ? "success" : "danger"}>
                      {latestSummary.result}
                    </Tag>
                    <span className="text-[color:var(--foreground)]">{latestSummary.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[color:var(--muted)]">
                    <span>语言：{latestSummary.language}</span>
                    <span>用时：{latestSummary.time}</span>
                    <span>内存：{latestSummary.memory}</span>
                    <span>题目：{problem.id}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-6 text-[color:var(--muted)]">当前会话还没有提交记录。</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
