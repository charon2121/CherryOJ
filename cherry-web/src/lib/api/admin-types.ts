import type { ApiPageResult } from "./oj-types";

export interface AdminProblemListItem {
  id: number;
  problemCode: string;
  title: string;
  difficulty: number;
  status: number;
  judgeMode: number;
  defaultTimeLimitMs: number;
  defaultMemoryLimitMb: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type AdminProblemPage = ApiPageResult<AdminProblemListItem>;

export interface AdminProblemTestCase {
  id?: number | null;
  caseNo: number;
  inputData: string;
  expectedOutput: string;
  score: number;
  isSample: number;
  status: number;
}

export interface AdminProblemDetail {
  id: number;
  problemCode: string;
  title: string;
  judgeMode: number;
  defaultTimeLimitMs: number;
  defaultMemoryLimitMb: number;
  defaultStackLimitMb?: number | null;
  difficulty: number;
  status: number;
  description: string;
  hint: string;
  source: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  testCases: AdminProblemTestCase[];
}

export interface AdminProblemUpsertRequest {
  problemCode: string;
  title: string;
  judgeMode: number;
  defaultTimeLimitMs: number;
  defaultMemoryLimitMb: number;
  defaultStackLimitMb?: number | null;
  difficulty: number;
  status: number;
  description: string;
  hint: string;
  source: string;
  testCases: AdminProblemTestCase[];
}
