"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Checkbox,
  Input,
  ListBox,
  Select,
  TextArea,
} from "@heroui/react";
import { ArrowLeft, CheckCircle2, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type {
  AdminProblemDetail,
  AdminProblemTestCase,
  AdminProblemUpsertRequest,
} from "@/lib/api/admin-types";
import { ApiError } from "@/lib/api/core";
import {
  createAdminProblem,
  updateAdminProblem,
} from "@/lib/api/endpoints/admin-problems.client";
import { adminQueryKeys } from "@/lib/admin/query-keys";
import { useAdminProblemDraftStore } from "@/lib/state/admin-problem-draft.store";

const difficultyOptions = [
  { value: 1, label: "入门" },
  { value: 2, label: "提高" },
  { value: 3, label: "进阶" },
  { value: 4, label: "省选" },
  { value: 5, label: "NOI" },
];

const statusOptions = [
  { value: 1, label: "发布" },
  { value: 0, label: "草稿" },
];

const judgeModeOptions = [{ value: 1, label: "标准判题" }];

function createEmptyTestCase(caseNo: number): AdminProblemTestCase {
  return {
    caseNo,
    inputData: "",
    expectedOutput: "",
    score: 10,
    isSample: caseNo === 1 ? 1 : 0,
    status: 1,
  };
}

function createDefaultDraft(
  initialProblem?: AdminProblemDetail,
): AdminProblemUpsertRequest {
  if (initialProblem) {
    return {
      problemCode: initialProblem.problemCode,
      title: initialProblem.title,
      judgeMode: initialProblem.judgeMode,
      defaultTimeLimitMs: initialProblem.defaultTimeLimitMs,
      defaultMemoryLimitMb: initialProblem.defaultMemoryLimitMb,
      defaultStackLimitMb: initialProblem.defaultStackLimitMb ?? null,
      difficulty: initialProblem.difficulty,
      status: initialProblem.status,
      description: initialProblem.description,
      hint: initialProblem.hint ?? "",
      source: initialProblem.source ?? "",
      testCases:
        initialProblem.testCases.length > 0
          ? initialProblem.testCases.map((testCase, index) => ({
              ...testCase,
              caseNo: index + 1,
            }))
          : [createEmptyTestCase(1)],
    };
  }

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
    testCases: [createEmptyTestCase(1)],
  };
}

function parseRequiredInt(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseOptionalInt(value: string) {
  if (value.trim() === "") return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function inputClassName(extra = "") {
  return `w-full bg-[color:var(--field-background)] text-[color:var(--field-foreground)] ${extra}`.trim();
}

function fieldLabel(label: string, required = false) {
  return (
    <span className="text-sm font-medium text-[color:var(--foreground)]">
      {label}
      {required ? (
        <span className="ml-1 text-[color:var(--danger)]">*</span>
      ) : null}
    </span>
  );
}

function optionLabel(
  options: Array<{ value: number; label: string }>,
  value: number,
) {
  return (
    options.find((option) => option.value === value)?.label ??
    options[0]?.label ??
    ""
  );
}

function AdminNumberSelect({
  ariaLabel,
  options,
  value,
  isDisabled,
  onChange,
}: {
  ariaLabel: string;
  options: Array<{ value: number; label: string }>;
  value: number;
  isDisabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <Select
      selectedKey={String(value)}
      isDisabled={isDisabled}
      onSelectionChange={(key) =>
        key && onChange(parseRequiredInt(String(key), value))
      }
    >
      <Select.Trigger aria-label={ariaLabel} className="h-10 w-full">
        <Select.Value>{optionLabel(options, value)}</Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox items={options} selectionMode="single">
          {(option) => (
            <ListBox.Item id={String(option.value)} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          )}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

type AdminProblemCreateFormProps = {
  mode?: "create" | "edit";
  initialProblem?: AdminProblemDetail;
};

export default function AdminProblemCreateForm({
  mode = "create",
  initialProblem,
}: AdminProblemCreateFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";
  const draftKey =
    isEdit && initialProblem ? `edit-${initialProblem.id}` : "new";
  const saveDraft = useAdminProblemDraftStore((state) => state.saveDraft);
  const clearDraft = useAdminProblemDraftStore((state) => state.clearDraft);
  const [draft, setDraft] = useState<AdminProblemUpsertRequest>(() =>
    createDefaultDraft(initialProblem),
  );
  const [error, setError] = useState<string | null>(null);
  const [successTitle, setSuccessTitle] = useState<string | null>(null);

  useEffect(() => {
    saveDraft(draftKey, draft);
  }, [draft, draftKey, saveDraft]);

  const visibleTestCases = useMemo(
    () =>
      draft.testCases.map((testCase, index) => ({
        ...testCase,
        caseNo: index + 1,
      })),
    [draft.testCases],
  );

  const mutation = useMutation({
    mutationFn: (payload: AdminProblemUpsertRequest) => {
      if (isEdit && initialProblem) {
        return updateAdminProblem(initialProblem.id, payload);
      }
      return createAdminProblem(payload);
    },
    onSuccess: async (problem) => {
      clearDraft(draftKey);
      setSuccessTitle(`${problem.problemCode} · ${problem.title}`);
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.problems.all,
      });
      await queryClient.invalidateQueries({
        queryKey: adminQueryKeys.problems.detail(problem.id),
      });
      router.push("/admin/problems");
    },
  });

  function updateDraft<K extends keyof AdminProblemUpsertRequest>(
    key: K,
    value: AdminProblemUpsertRequest[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateTestCase(index: number, patch: Partial<AdminProblemTestCase>) {
    setDraft((current) => ({
      ...current,
      testCases: current.testCases.map((testCase, currentIndex) =>
        currentIndex === index ? { ...testCase, ...patch } : testCase,
      ),
    }));
  }

  function addTestCase() {
    setDraft((current) => ({
      ...current,
      testCases: [
        ...current.testCases,
        createEmptyTestCase(current.testCases.length + 1),
      ],
    }));
  }

  function removeTestCase(index: number) {
    setDraft((current) => {
      const nextTestCases = current.testCases.filter(
        (_, currentIndex) => currentIndex !== index,
      );
      return {
        ...current,
        testCases:
          nextTestCases.length > 0 ? nextTestCases : [createEmptyTestCase(1)],
      };
    });
  }

  function resetDraft() {
    const nextDraft = createDefaultDraft(initialProblem);
    clearDraft(draftKey);
    setDraft(nextDraft);
    setError(null);
    setSuccessTitle(null);
  }

  function buildPayload(): AdminProblemUpsertRequest | null {
    const problemCode = draft.problemCode.trim();
    const title = draft.title.trim();
    if (!problemCode) return (setError("请填写题号。"), null);
    if (!title) return (setError("请填写题目标题。"), null);
    if (draft.defaultTimeLimitMs <= 0)
      return (setError("时间限制必须大于 0。"), null);
    if (draft.defaultMemoryLimitMb <= 0)
      return (setError("内存限制必须大于 0。"), null);

    const testCases = draft.testCases
      .map((testCase, index) => ({
        ...testCase,
        caseNo: index + 1,
        inputData: testCase.inputData,
        expectedOutput: testCase.expectedOutput,
        score: Math.max(0, testCase.score),
        isSample: testCase.isSample ? 1 : 0,
        status: testCase.status ?? 1,
      }))
      .filter(
        (testCase) =>
          testCase.inputData.trim() || testCase.expectedOutput.trim(),
      );

    if (testCases.length === 0)
      return (setError("至少保留一个非空测试点。"), null);
    if (testCases.some((testCase) => !testCase.expectedOutput.trim())) {
      return (setError("每个非空测试点都需要填写期望输出。"), null);
    }

    setError(null);
    return {
      ...draft,
      problemCode,
      title,
      description: draft.description.trim(),
      hint: draft.hint.trim(),
      source: draft.source.trim(),
      defaultStackLimitMb: draft.defaultStackLimitMb ?? null,
      testCases,
    };
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = buildPayload();
    if (!payload) return;

    try {
      await mutation.mutateAsync(payload);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        return;
      }
      setError(
        err instanceof Error ? err.message : "保存题目失败，请稍后重试。",
      );
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Problems
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
            {isEdit ? "编辑题目" : "新建题目"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            {isEdit
              ? "调整基础信息、题面和测试点，保存后会同步到后台。"
              : "填写基础信息、题面和测试点，提交后会调用后台创建接口并清理本地草稿。"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/problems" className="no-underline">
            <Button type="button" variant="tertiary" className="gap-2">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.85} />
              返回列表
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            isDisabled={mutation.isPending}
            onPress={resetDraft}
          >
            重置
          </Button>
          <Button
            type="submit"
            isPending={mutation.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" strokeWidth={1.85} />
            {mutation.isPending ? "保存中" : isEdit ? "保存题目" : "创建题目"}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-[color:var(--danger)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--danger)]">
          {error}
        </div>
      ) : null}

      {successTitle ? (
        <div className="flex items-center gap-2 rounded-lg border border-[color:var(--success)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--success)]">
          <CheckCircle2 className="h-4 w-4" strokeWidth={1.85} />
          {isEdit ? "已保存" : "已创建"}：{successTitle}
        </div>
      ) : null}

      <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
        <Card.Header className="border-b border-[color:var(--border)] px-5 py-4">
          <Card.Title className="text-base font-semibold text-[color:var(--foreground)]">
            基础信息
          </Card.Title>
          <Card.Description className="text-sm text-[color:var(--muted)]">
            题号必须唯一，发布状态决定题目是否出现在前台题库。
          </Card.Description>
        </Card.Header>
        <Card.Content className="grid gap-4 px-5 py-5 lg:grid-cols-2">
          <label className="block space-y-2">
            {fieldLabel("题号", true)}
            <Input
              value={draft.problemCode}
              onChange={(event) =>
                updateDraft("problemCode", event.target.value)
              }
              className={inputClassName("font-mono")}
              disabled={mutation.isPending}
              placeholder="P1001"
            />
          </label>
          <label className="block space-y-2">
            {fieldLabel("标题", true)}
            <Input
              value={draft.title}
              onChange={(event) => updateDraft("title", event.target.value)}
              className={inputClassName()}
              disabled={mutation.isPending}
              placeholder="A + B Problem"
            />
          </label>
          <label className="block space-y-2">
            {fieldLabel("难度")}
            <AdminNumberSelect
              ariaLabel="选择题目难度"
              options={difficultyOptions}
              value={draft.difficulty}
              isDisabled={mutation.isPending}
              onChange={(value) => updateDraft("difficulty", value)}
            />
          </label>
          <label className="block space-y-2">
            {fieldLabel("状态")}
            <AdminNumberSelect
              ariaLabel="选择题目状态"
              options={statusOptions}
              value={draft.status}
              isDisabled={mutation.isPending}
              onChange={(value) => updateDraft("status", value)}
            />
          </label>
        </Card.Content>
      </Card>

      <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
        <Card.Header className="border-b border-[color:var(--border)] px-5 py-4">
          <Card.Title className="text-base font-semibold text-[color:var(--foreground)]">
            判题配置
          </Card.Title>
          <Card.Description className="text-sm text-[color:var(--muted)]">
            当前后端使用全局默认限制，语言级限制可在后续阶段扩展。
          </Card.Description>
        </Card.Header>
        <Card.Content className="grid gap-4 px-5 py-5 lg:grid-cols-4">
          <label className="block space-y-2">
            {fieldLabel("判题模式")}
            <AdminNumberSelect
              ariaLabel="选择判题模式"
              options={judgeModeOptions}
              value={draft.judgeMode}
              isDisabled={mutation.isPending}
              onChange={(value) => updateDraft("judgeMode", value)}
            />
          </label>
          <label className="block space-y-2">
            {fieldLabel("时间限制 ms")}
            <Input
              type="number"
              min={1}
              value={String(draft.defaultTimeLimitMs)}
              onChange={(event) =>
                updateDraft(
                  "defaultTimeLimitMs",
                  parseRequiredInt(event.target.value, 1000),
                )
              }
              className={inputClassName()}
              disabled={mutation.isPending}
            />
          </label>
          <label className="block space-y-2">
            {fieldLabel("内存限制 MB")}
            <Input
              type="number"
              min={1}
              value={String(draft.defaultMemoryLimitMb)}
              onChange={(event) =>
                updateDraft(
                  "defaultMemoryLimitMb",
                  parseRequiredInt(event.target.value, 256),
                )
              }
              className={inputClassName()}
              disabled={mutation.isPending}
            />
          </label>
          <label className="block space-y-2">
            {fieldLabel("栈限制 MB")}
            <Input
              type="number"
              min={0}
              value={
                draft.defaultStackLimitMb == null
                  ? ""
                  : String(draft.defaultStackLimitMb)
              }
              onChange={(event) =>
                updateDraft(
                  "defaultStackLimitMb",
                  parseOptionalInt(event.target.value),
                )
              }
              className={inputClassName()}
              disabled={mutation.isPending}
              placeholder="默认"
            />
          </label>
        </Card.Content>
      </Card>

      <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
        <Card.Header className="border-b border-[color:var(--border)] px-5 py-4">
          <Card.Title className="text-base font-semibold text-[color:var(--foreground)]">
            题面内容
          </Card.Title>
          <Card.Description className="text-sm text-[color:var(--muted)]">
            描述、提示和来源会写入 problem statement。
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4 px-5 py-5">
          <label className="block space-y-2">
            {fieldLabel("题目描述")}
            <TextArea
              value={draft.description}
              onChange={(event) =>
                updateDraft("description", event.target.value)
              }
              className={inputClassName("min-h-[180px]")}
              disabled={mutation.isPending}
              placeholder="输入题目背景、输入输出格式和数据范围..."
            />
          </label>
          <label className="block space-y-2">
            {fieldLabel("提示")}
            <TextArea
              value={draft.hint}
              onChange={(event) => updateDraft("hint", event.target.value)}
              className={inputClassName("min-h-[96px]")}
              disabled={mutation.isPending}
              placeholder="可选：算法提示或边界说明"
            />
          </label>
          <label className="block space-y-2">
            {fieldLabel("来源")}
            <Input
              value={draft.source}
              onChange={(event) => updateDraft("source", event.target.value)}
              className={inputClassName()}
              disabled={mutation.isPending}
              placeholder="校内训练 / 原创 / 竞赛名称"
            />
          </label>
        </Card.Content>
      </Card>

      <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
        <Card.Header className="flex-row items-center justify-between border-b border-[color:var(--border)] px-5 py-4">
          <div>
            <Card.Title className="text-base font-semibold text-[color:var(--foreground)]">
              测试点
            </Card.Title>
            <Card.Description className="text-sm text-[color:var(--muted)]">
              空测试点不会提交；样例会在前台题面展示。
            </Card.Description>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-2"
            onPress={addTestCase}
          >
            <Plus className="h-4 w-4" strokeWidth={1.85} />
            添加
          </Button>
        </Card.Header>
        <Card.Content className="space-y-4 px-5 py-5">
          {visibleTestCases.map((testCase, index) => (
            <div
              key={index}
              className="space-y-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-secondary)] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-semibold text-[color:var(--foreground)]">
                  测试点 #{testCase.caseNo}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Checkbox
                    isSelected={testCase.isSample === 1}
                    isDisabled={mutation.isPending}
                    variant="secondary"
                    onChange={(selected) =>
                      updateTestCase(index, { isSample: selected ? 1 : 0 })
                    }
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Content>
                      <span className="text-sm text-[color:var(--foreground)]">
                        样例
                      </span>
                    </Checkbox.Content>
                  </Checkbox>
                  <label className="flex items-center gap-2 text-sm text-[color:var(--foreground)]">
                    分值
                    <Input
                      type="number"
                      min={0}
                      value={String(testCase.score)}
                      onChange={(event) =>
                        updateTestCase(index, {
                          score: parseRequiredInt(event.target.value, 0),
                        })
                      }
                      className={inputClassName("w-24")}
                      disabled={mutation.isPending}
                    />
                  </label>
                  <Button
                    type="button"
                    isIconOnly
                    variant="danger"
                    size="sm"
                    aria-label={`删除测试点 ${testCase.caseNo}`}
                    isDisabled={mutation.isPending}
                    onPress={() => removeTestCase(index)}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.85} />
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block space-y-2">
                  {fieldLabel("输入数据")}
                  <TextArea
                    value={testCase.inputData}
                    onChange={(event) =>
                      updateTestCase(index, { inputData: event.target.value })
                    }
                    className={inputClassName(
                      "min-h-[132px] font-mono text-xs",
                    )}
                    disabled={mutation.isPending}
                    placeholder="1 2"
                  />
                </label>
                <label className="block space-y-2">
                  {fieldLabel("期望输出")}
                  <TextArea
                    value={testCase.expectedOutput}
                    onChange={(event) =>
                      updateTestCase(index, {
                        expectedOutput: event.target.value,
                      })
                    }
                    className={inputClassName(
                      "min-h-[132px] font-mono text-xs",
                    )}
                    disabled={mutation.isPending}
                    placeholder="3"
                  />
                </label>
              </div>
            </div>
          ))}
        </Card.Content>
      </Card>
    </form>
  );
}
