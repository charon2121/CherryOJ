"use client";

import type { AdminProblemDetail, AdminProblemTestCase, AdminProblemUpsertRequest } from "@/lib/api/admin-types";
import {
  createAdminProblem,
  deleteAdminProblem,
  updateAdminProblem,
} from "@/lib/api/endpoints/admin-problems.client";
import { Badge, Button, Card, Input, TextArea } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

function normalizePayload(state: AdminProblemUpsertRequest): AdminProblemUpsertRequest {
  return {
    ...state,
    problemCode: state.problemCode.trim(),
    title: state.title.trim(),
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

function selectClassName() {
  return "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400";
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

  const stats = useMemo(
    () => ({
      total: state.testCases.length,
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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {mode === "create" ? "新建题目" : `编辑 ${problem?.problemCode ?? ""}`}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">维护基础配置、题面和测试用例。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="flat">用例 {stats.total}</Badge>
          <Badge variant="flat">样例 {stats.samples}</Badge>
          <Badge variant="flat">隐藏 {stats.hidden}</Badge>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card className="border border-zinc-200/80 bg-white shadow-none">
            <Card.Header className="border-b border-zinc-200/80 px-4 py-3">
              <Card.Title className="text-base text-zinc-900">基础信息</Card.Title>
            </Card.Header>
            <Card.Content className="grid gap-4 p-4 md:grid-cols-2">
              <Input
                label="题号"
                labelPlacement="outside"
                placeholder="P1001"
                value={state.problemCode}
                onChange={(event) => updateField("problemCode", event.target.value)}
              />
              <Input
                label="标题"
                labelPlacement="outside"
                placeholder="两数之和"
                value={state.title}
                onChange={(event) => updateField("title", event.target.value)}
              />
              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">难度</span>
                <select
                  value={state.difficulty}
                  onChange={(event) => updateField("difficulty", Number(event.target.value))}
                  className={selectClassName()}
                >
                  <option value={1}>入门</option>
                  <option value={2}>进阶</option>
                  <option value={3}>提高</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-zinc-700">状态</span>
                <select
                  value={state.status}
                  onChange={(event) => updateField("status", Number(event.target.value))}
                  className={selectClassName()}
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
                  className={selectClassName()}
                >
                  <option value={1}>ACM</option>
                  <option value={2}>核心代码</option>
                </select>
              </label>
              <Input
                label="来源"
                labelPlacement="outside"
                placeholder="《代码随想录》"
                value={state.source}
                onChange={(event) => updateField("source", event.target.value)}
              />
              <Input
                label="时间限制（ms）"
                labelPlacement="outside"
                type="number"
                value={String(state.defaultTimeLimitMs)}
                onChange={(event) => updateField("defaultTimeLimitMs", Number(event.target.value))}
              />
              <Input
                label="内存限制（MB）"
                labelPlacement="outside"
                type="number"
                value={String(state.defaultMemoryLimitMb)}
                onChange={(event) => updateField("defaultMemoryLimitMb", Number(event.target.value))}
              />
              <Input
                label="栈限制（MB）"
                labelPlacement="outside"
                type="number"
                placeholder="可留空"
                value={state.defaultStackLimitMb == null ? "" : String(state.defaultStackLimitMb)}
                onChange={(event) =>
                  updateField(
                    "defaultStackLimitMb",
                    event.target.value === "" ? null : Number(event.target.value),
                  )
                }
              />
            </Card.Content>
          </Card>

          <Card className="border border-zinc-200/80 bg-white shadow-none">
            <Card.Header className="border-b border-zinc-200/80 px-4 py-3">
              <Card.Title className="text-base text-zinc-900">题面内容</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4 p-4">
              <TextArea
                label="题目描述"
                labelPlacement="outside"
                value={state.description}
                onChange={(event) => updateField("description", event.target.value)}
                minRows={10}
              />
              <TextArea
                label="提示 / 约束"
                labelPlacement="outside"
                value={state.hint}
                onChange={(event) => updateField("hint", event.target.value)}
                minRows={6}
              />
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border border-zinc-200/80 bg-white shadow-none">
            <Card.Header className="flex flex-row items-center justify-between gap-3 border-b border-zinc-200/80 px-4 py-3">
              <Card.Title className="text-base text-zinc-900">测试用例</Card.Title>
              <Button size="sm" color="primary" variant="flat" onPress={addTestCase}>
                新增
              </Button>
            </Card.Header>
            <Card.Content className="space-y-3 p-4">
              {state.testCases.map((testCase, index) => (
                <Card key={`${testCase.id ?? "new"}-${index}`} className="border border-zinc-200/80 bg-zinc-50 shadow-none">
                  <Card.Content className="space-y-3 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="flat">{testCase.isSample === 1 ? "样例" : "隐藏"}</Badge>
                        <span className="text-sm font-medium text-zinc-900">#{index + 1}</span>
                      </div>
                      <Button size="sm" variant="light" color="danger" onPress={() => removeTestCase(index)}>
                        删除
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-zinc-700">类型</span>
                        <select
                          value={testCase.isSample}
                          onChange={(event) => updateTestCase(index, { isSample: Number(event.target.value) })}
                          className={selectClassName()}
                        >
                          <option value={1}>样例</option>
                          <option value={0}>隐藏</option>
                        </select>
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-medium text-zinc-700">状态</span>
                        <select
                          value={testCase.status}
                          onChange={(event) => updateTestCase(index, { status: Number(event.target.value) })}
                          className={selectClassName()}
                        >
                          <option value={1}>启用</option>
                          <option value={0}>禁用</option>
                        </select>
                      </label>
                    </div>

                    <TextArea
                      label="输入"
                      labelPlacement="outside"
                      value={testCase.inputData}
                      onChange={(event) => updateTestCase(index, { inputData: event.target.value })}
                      minRows={4}
                    />
                    <TextArea
                      label="输出"
                      labelPlacement="outside"
                      value={testCase.expectedOutput}
                      onChange={(event) => updateTestCase(index, { expectedOutput: event.target.value })}
                      minRows={4}
                    />
                    <Input
                      label="分值"
                      labelPlacement="outside"
                      type="number"
                      value={String(testCase.score)}
                      onChange={(event) => updateTestCase(index, { score: Number(event.target.value) })}
                    />
                  </Card.Content>
                </Card>
              ))}
            </Card.Content>
          </Card>

          <Card className="border border-zinc-200/80 bg-white shadow-none">
            <Card.Content className="space-y-3 p-4">
              <Button type="submit" color="primary" isLoading={isPending}>
                {mode === "create" ? "创建题目" : "保存修改"}
              </Button>
              {mode === "edit" ? (
                <Button type="button" color="danger" variant="flat" isDisabled={isPending} onPress={onDelete}>
                  删除题目
                </Button>
              ) : null}

              {error ? (
                <Card className="border border-rose-200 bg-rose-50 shadow-none">
                  <Card.Content className="p-3 text-sm text-rose-700">{error}</Card.Content>
                </Card>
              ) : null}

              {notice ? (
                <Card className="border border-emerald-200 bg-emerald-50 shadow-none">
                  <Card.Content className="p-3 text-sm text-emerald-700">{notice}</Card.Content>
                </Card>
              ) : null}
            </Card.Content>
          </Card>
        </div>
      </form>
    </div>
  );
}
