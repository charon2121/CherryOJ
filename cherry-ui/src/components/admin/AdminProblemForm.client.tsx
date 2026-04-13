"use client";

import type { AdminProblemDetail, AdminProblemTestCase, AdminProblemUpsertRequest } from "@/lib/api/admin-types";
import {
  createAdminProblem,
  deleteAdminProblem,
  updateAdminProblem,
} from "@/lib/api/endpoints/admin-problems.client";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

function normalizePayload(state: AdminProblemUpsertRequest): AdminProblemUpsertRequest {
  return {
    ...state,
    problemCode: state.problemCode.trim(),
    title: state.title.trim(),
    description: state.description,
    hint: state.hint,
    source: state.source.trim(),
    testCases: state.testCases.map((testCase, index) => ({
      ...testCase,
      caseNo: index + 1,
    })),
  };
}

function emptyTestCase(caseNo: number): AdminProblemTestCase {
  return {
    caseNo,
    inputData: "",
    expectedOutput: "",
    score: 0,
    isSample: 1,
    status: 1,
  };
}

function toInitialState(problem?: AdminProblemDetail | null): AdminProblemUpsertRequest {
  if (!problem) {
    return {
      problemCode: "",
      title: "",
      judgeMode: 1,
      defaultTimeLimitMs: 1000,
      defaultMemoryLimitMb: 256,
      defaultStackLimitMb: null,
      difficulty: 1,
      status: 1,
      description: "",
      hint: "",
      source: "",
      testCases: [emptyTestCase(1)],
    };
  }

  return {
    problemCode: problem.problemCode,
    title: problem.title,
    judgeMode: problem.judgeMode,
    defaultTimeLimitMs: problem.defaultTimeLimitMs,
    defaultMemoryLimitMb: problem.defaultMemoryLimitMb,
    defaultStackLimitMb: problem.defaultStackLimitMb ?? null,
    difficulty: problem.difficulty,
    status: problem.status,
    description: problem.description ?? "",
    hint: problem.hint ?? "",
    source: problem.source ?? "",
    testCases: problem.testCases.length > 0 ? problem.testCases : [emptyTestCase(1)],
  };
}

interface AdminProblemFormProps {
  mode: "create" | "edit";
  problem?: AdminProblemDetail | null;
}

export default function AdminProblemForm({ mode, problem }: AdminProblemFormProps) {
  const router = useRouter();
  const [state, setState] = useState<AdminProblemUpsertRequest>(() => toInitialState(problem));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const pageTitle = mode === "create" ? "新建题目" : `编辑 ${problem?.problemCode ?? ""}`;

  const stats = useMemo(
    () => ({
      samples: state.testCases.filter((testCase) => testCase.isSample === 1).length,
      hidden: state.testCases.filter((testCase) => testCase.isSample !== 1).length,
    }),
    [state.testCases],
  );

  function updateField<K extends keyof AdminProblemUpsertRequest>(key: K, value: AdminProblemUpsertRequest[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function updateTestCase(index: number, patch: Partial<AdminProblemTestCase>) {
    setState((prev) => ({
      ...prev,
      testCases: prev.testCases.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addTestCase() {
    setState((prev) => ({
      ...prev,
      testCases: [...prev.testCases, emptyTestCase(prev.testCases.length + 1)],
    }));
  }

  function removeTestCase(index: number) {
    setState((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    startTransition(async () => {
      try {
        const payload = normalizePayload(state);
        const result =
          mode === "create"
            ? await createAdminProblem(payload)
            : await updateAdminProblem(problem!.id, payload);
        setNotice(mode === "create" ? "题目已创建。" : "题目已更新。");
        router.replace(`/admin/problems/${result.id}`);
        router.refresh();
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "保存失败");
      }
    });
  }

  function onDelete() {
    if (!problem) {
      return;
    }
    if (!window.confirm(`确认删除题目 ${problem.problemCode} 吗？`)) {
      return;
    }
    setError(null);
    setNotice(null);

    startTransition(async () => {
      try {
        await deleteAdminProblem(problem.id);
        router.replace("/admin");
        router.refresh();
      } catch (deleteError) {
        setError(deleteError instanceof Error ? deleteError.message : "删除失败");
      }
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">Problem Editor</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{pageTitle}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              在同一编辑器里管理题号、判题配置、题面内容与测试样例。布局保持后台视觉体系，不回退到前台做题界面。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-zinc-100 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-zinc-500">题目状态</div>
              <div className="mt-1 text-sm font-medium text-zinc-900">{state.status === 1 ? "已发布" : "下线"}</div>
            </div>
            <div className="rounded-2xl bg-zinc-100 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-zinc-500">模式</div>
              <div className="mt-1 text-sm font-medium text-zinc-900">{state.judgeMode === 1 ? "ACM" : "核心代码"}</div>
            </div>
            <div className="rounded-2xl bg-zinc-100 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-zinc-500">样例</div>
              <div className="mt-1 text-sm font-medium text-zinc-900">{stats.samples}</div>
            </div>
            <div className="rounded-2xl bg-zinc-100 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-zinc-500">隐藏用例</div>
              <div className="mt-1 text-sm font-medium text-zinc-900">{stats.hidden}</div>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">基础配置</h2>
                <p className="mt-1 text-sm text-zinc-500">控制题号、难度、判题模式和运行限制。</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">题号</span>
                <input
                  value={state.problemCode}
                  onChange={(event) => updateField("problemCode", event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:bg-white"
                  placeholder="例如 P1001"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">标题</span>
                <input
                  value={state.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:bg-white"
                  placeholder="例如 两数之和"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">难度</span>
                <select
                  value={state.difficulty}
                  onChange={(event) => updateField("difficulty", Number(event.target.value))}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:bg-white"
                >
                  <option value={1}>入门</option>
                  <option value={2}>进阶</option>
                  <option value={3}>提高</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">题目状态</span>
                <select
                  value={state.status}
                  onChange={(event) => updateField("status", Number(event.target.value))}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:bg-white"
                >
                  <option value={1}>已发布</option>
                  <option value={0}>下线</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">判题模式</span>
                <select
                  value={state.judgeMode}
                  onChange={(event) => updateField("judgeMode", Number(event.target.value))}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:bg-white"
                >
                  <option value={1}>ACM</option>
                  <option value={2}>核心代码</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">题目来源</span>
                <input
                  value={state.source}
                  onChange={(event) => updateField("source", event.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:bg-white"
                  placeholder="例如 《代码随想录》"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">时间限制（ms）</span>
                <input
                  type="number"
                  value={state.defaultTimeLimitMs}
                  onChange={(event) => updateField("defaultTimeLimitMs", Number(event.target.value))}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:bg-white"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">内存限制（MB）</span>
                <input
                  type="number"
                  value={state.defaultMemoryLimitMb}
                  onChange={(event) => updateField("defaultMemoryLimitMb", Number(event.target.value))}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:bg-white"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">栈限制（MB）</span>
                <input
                  type="number"
                  value={state.defaultStackLimitMb ?? ""}
                  onChange={(event) =>
                    updateField(
                      "defaultStackLimitMb",
                      event.target.value === "" ? null : Number(event.target.value),
                    )
                  }
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:bg-white"
                  placeholder="可留空"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-zinc-900">题面配置</h2>
              <p className="mt-1 text-sm text-zinc-500">描述、提示和来源一起作为题目编辑的一部分保存。</p>
            </div>

            <div className="space-y-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">题目描述</span>
                <textarea
                  value={state.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="min-h-[260px] w-full rounded-[1.5rem] border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm leading-6 outline-none transition focus:border-rose-400 focus:bg-white"
                  placeholder="使用 Markdown 或纯文本描述题面。"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">提示 / 约束</span>
                <textarea
                  value={state.hint}
                  onChange={(event) => updateField("hint", event.target.value)}
                  className="min-h-[140px] w-full rounded-[1.5rem] border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm leading-6 outline-none transition focus:border-rose-400 focus:bg-white"
                  placeholder="每行一个约束或提示。"
                />
              </label>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">测试用例</h2>
                <p className="mt-1 text-sm text-zinc-500">支持样例与隐藏用例的统一编辑。</p>
              </div>
              <button
                type="button"
                onClick={addTestCase}
                className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                新增用例
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {state.testCases.map((testCase, index) => (
                <div key={`${testCase.id ?? "new"}-${index}`} className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-medium text-zinc-900">用例 #{index + 1}</div>
                    <button
                      type="button"
                      onClick={() => removeTestCase(index)}
                      className="text-xs font-medium text-zinc-500 transition hover:text-rose-600"
                    >
                      删除
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">类型</span>
                      <select
                        value={testCase.isSample}
                        onChange={(event) => updateTestCase(index, { isSample: Number(event.target.value) })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-rose-400"
                      >
                        <option value={1}>样例</option>
                        <option value={0}>隐藏用例</option>
                      </select>
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">状态</span>
                      <select
                        value={testCase.status}
                        onChange={(event) => updateTestCase(index, { status: Number(event.target.value) })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-rose-400"
                      >
                        <option value={1}>启用</option>
                        <option value={0}>禁用</option>
                      </select>
                    </label>

                    <label className="space-y-1.5 sm:col-span-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">输入</span>
                      <textarea
                        value={testCase.inputData}
                        onChange={(event) => updateTestCase(index, { inputData: event.target.value })}
                        className="min-h-[100px] w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 font-mono text-xs outline-none transition focus:border-rose-400"
                      />
                    </label>

                    <label className="space-y-1.5 sm:col-span-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">输出</span>
                      <textarea
                        value={testCase.expectedOutput}
                        onChange={(event) => updateTestCase(index, { expectedOutput: event.target.value })}
                        className="min-h-[100px] w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 font-mono text-xs outline-none transition focus:border-rose-400"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">分值</span>
                      <input
                        type="number"
                        value={testCase.score}
                        onChange={(event) => updateTestCase(index, { score: Number(event.target.value) })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-rose-400"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-sm">
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "保存中…" : mode === "create" ? "创建题目" : "保存修改"}
              </button>
              {mode === "edit" ? (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isPending}
                  className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  删除题目
                </button>
              ) : null}
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {notice ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {notice}
              </div>
            ) : null}

            <div className="mt-5 rounded-2xl bg-zinc-100 px-4 py-4 text-sm leading-6 text-zinc-600">
              这版后台已经具备真实 CRUD 能力：
              <br />
              1. 保存题目基础配置
              <br />
              2. 保存题面与提示
              <br />
              3. 批量覆盖测试用例配置
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
