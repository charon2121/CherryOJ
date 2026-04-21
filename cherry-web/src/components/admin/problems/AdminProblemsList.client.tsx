"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Input, ListBox, Pagination, Select, Table } from "@heroui/react";
import { Edit3, Eye, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Tag } from "@/components/ui/Tag";
import type { AdminProblemListItem } from "@/lib/api/admin-types";
import { ApiError } from "@/lib/api/core";
import {
  deleteAdminProblem,
  listAdminProblemsClient,
} from "@/lib/api/endpoints/admin-problems.client";
import { adminQueryKeys } from "@/lib/admin/query-keys";

const pageSize = 20;

const difficultyOptions = [
  { value: "all", label: "全部难度" },
  { value: "1", label: "入门" },
  { value: "2", label: "提高" },
  { value: "3", label: "进阶" },
  { value: "4", label: "省选" },
  { value: "5", label: "NOI" },
];

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "1", label: "发布" },
  { value: "0", label: "草稿" },
];

const difficultyLabels: Record<number, string> = {
  1: "入门",
  2: "提高",
  3: "进阶",
  4: "省选",
  5: "NOI",
};

const statusLabels: Record<number, string> = {
  0: "草稿",
  1: "发布",
};

type SelectOption = {
  value: string;
  label: string;
};

function selectLabel(options: SelectOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? options[0]?.label ?? "";
}

function AdminSelect({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select selectedKey={value} onSelectionChange={(key) => key && onChange(String(key))}>
      <Select.Trigger aria-label={ariaLabel} className="h-10 w-full">
        <Select.Value>{selectLabel(options, value)}</Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox items={options} selectionMode="single">
          {(option) => (
            <ListBox.Item id={option.value} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          )}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

function difficultyTone(difficulty: number) {
  if (difficulty <= 1) return "success" as const;
  if (difficulty <= 3) return "warning" as const;
  return "danger" as const;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function matchesProblem(problem: AdminProblemListItem, keyword: string, status: string, difficulty: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  const keywordMatched =
    !normalizedKeyword ||
    problem.problemCode.toLowerCase().includes(normalizedKeyword) ||
    problem.title.toLowerCase().includes(normalizedKeyword);
  const statusMatched = status === "all" || problem.status === Number(status);
  const difficultyMatched = difficulty === "all" || problem.difficulty === Number(difficulty);
  return keywordMatched && statusMatched && difficultyMatched;
}

export default function AdminProblemsList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => ({ page, pageSize }), [page]);

  const query = useQuery({
    queryKey: adminQueryKeys.problems.list(params),
    queryFn: () => listAdminProblemsClient(params),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminProblem,
    onSuccess: async () => {
      setError(null);
      await queryClient.invalidateQueries({ queryKey: adminQueryKeys.problems.all });
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        setError(err.message);
        return;
      }
      setError(err instanceof Error ? err.message : "删除失败，请稍后重试。");
    },
  });

  const pageData = query.data;
  const totalPages = Math.max(1, Math.ceil((pageData?.total ?? 0) / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, pageData?.total ?? 0);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const rows = useMemo(
    () => (pageData?.items ?? []).filter((problem) => matchesProblem(problem, keyword, status, difficulty)),
    [difficulty, keyword, pageData?.items, status],
  );

  function confirmDelete(problem: AdminProblemListItem) {
    const ok = window.confirm(`确认删除 ${problem.problemCode} · ${problem.title}？`);
    if (!ok) return;
    deleteMutation.mutate(problem.id);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Content
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
            题目管理
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
            管理题目基础信息、判题限制和测试用例。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            isPending={query.isFetching}
            onPress={() => void query.refetch()}
          >
            <RefreshCw className="h-4 w-4" strokeWidth={1.85} />
            刷新
          </Button>
          <Link href="/admin/problems/new" className="no-underline">
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" strokeWidth={1.85} />
              新建题目
            </Button>
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-[color:var(--danger)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--danger)]">
          {error}
        </div>
      ) : null}

      <Card className="border border-[color:var(--border)] bg-[color:var(--surface)] shadow-none">
        <Card.Content className="space-y-4 p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
            <label className="relative block">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]"
                strokeWidth={1.85}
              />
              <Input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                className="w-full bg-[color:var(--field-background)] pl-9 text-[color:var(--field-foreground)]"
                placeholder="搜索题号或标题"
              />
            </label>
            <AdminSelect
              ariaLabel="按难度筛选"
              options={difficultyOptions}
              value={difficulty}
              onChange={setDifficulty}
            />
            <AdminSelect ariaLabel="按状态筛选" options={statusOptions} value={status} onChange={setStatus} />
          </div>

          <Table variant="secondary">
            <Table.ScrollContainer>
              <Table.Content aria-label="后台题目列表" className="min-w-[920px]">
                <Table.Header>
                  <Table.Column isRowHeader>题号</Table.Column>
                  <Table.Column>标题</Table.Column>
                  <Table.Column>难度</Table.Column>
                  <Table.Column>状态</Table.Column>
                  <Table.Column>限制</Table.Column>
                  <Table.Column>更新时间</Table.Column>
                  <Table.Column className="text-right">操作</Table.Column>
                </Table.Header>
                <Table.Body>
                  {query.isLoading ? (
                    <Table.Row>
                      <Table.Cell colSpan={7} className="py-8 text-center text-[color:var(--muted)]">
                        加载中...
                      </Table.Cell>
                    </Table.Row>
                  ) : rows.length > 0 ? (
                    rows.map((problem) => (
                      <Table.Row key={problem.id} id={problem.id}>
                        <Table.Cell className="font-mono text-xs">{problem.problemCode}</Table.Cell>
                        <Table.Cell>
                          <div className="font-medium text-[color:var(--foreground)]">{problem.title}</div>
                          <div className="mt-1 text-xs text-[color:var(--muted)]">ID {problem.id}</div>
                        </Table.Cell>
                        <Table.Cell>
                          <Tag tone={difficultyTone(problem.difficulty)}>
                            {difficultyLabels[problem.difficulty] ?? `难度 ${problem.difficulty}`}
                          </Tag>
                        </Table.Cell>
                        <Table.Cell>
                          <Tag tone={problem.status === 1 ? "success" : "neutral"}>
                            {statusLabels[problem.status] ?? `状态 ${problem.status}`}
                          </Tag>
                        </Table.Cell>
                        <Table.Cell className="text-xs text-[color:var(--muted)]">
                          {problem.defaultTimeLimitMs} ms / {problem.defaultMemoryLimitMb} MB
                        </Table.Cell>
                        <Table.Cell className="text-xs text-[color:var(--muted)]">
                          {formatDate(problem.updatedAt ?? problem.createdAt)}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex justify-end gap-2">
                            <Link href={`/problems/${problem.id}`} className="no-underline">
                              <Button isIconOnly type="button" variant="tertiary" size="sm" aria-label="预览题目">
                                <Eye className="h-4 w-4" strokeWidth={1.85} />
                              </Button>
                            </Link>
                            <Link href={`/admin/problems/${problem.id}`} className="no-underline">
                              <Button isIconOnly type="button" variant="secondary" size="sm" aria-label="编辑题目">
                                <Edit3 className="h-4 w-4" strokeWidth={1.85} />
                              </Button>
                            </Link>
                            <Button
                              isIconOnly
                              type="button"
                              variant="danger"
                              size="sm"
                              aria-label="删除题目"
                              isDisabled={deleteMutation.isPending}
                              onPress={() => confirmDelete(problem)}
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.85} />
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell colSpan={7} className="py-8 text-center text-[color:var(--muted)]">
                        暂无题目
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
            <Table.Footer>
              <Pagination size="sm">
                <Pagination.Summary>
                  共 {pageData?.total ?? 0} 条，当前显示 {rows.length} 条
                  {pageData?.total ? `（${start}-${end}）` : ""}
                </Pagination.Summary>
                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={page <= 1 || query.isFetching}
                      onPress={() => setPage((current) => Math.max(1, current - 1))}
                    >
                      <Pagination.PreviousIcon />
                      上一页
                    </Pagination.Previous>
                  </Pagination.Item>
                  {pages.map((currentPage) => (
                    <Pagination.Item key={currentPage}>
                      <Pagination.Link
                        isActive={currentPage === page}
                        onPress={() => setPage(currentPage)}
                      >
                        {currentPage}
                      </Pagination.Link>
                    </Pagination.Item>
                  ))}
                  <Pagination.Item>
                    <Pagination.Next
                      isDisabled={page >= totalPages || query.isFetching}
                      onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
                    >
                      下一页
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </Table.Footer>
          </Table>
        </Card.Content>
      </Card>
    </div>
  );
}
