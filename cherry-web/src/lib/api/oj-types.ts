export interface ApiPageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProblemSummaryResponse {
  id: number;
  problemCode: string;
  title: string;
  difficulty: number;
  status: number;
  judgeMode: number;
  defaultTimeLimitMs: number;
  defaultMemoryLimitMb: number;
}

export interface ProblemSampleCaseResponse {
  caseNo: number;
  input: string;
  output: string;
}

export interface ProblemLanguageResponse {
  id: number;
  code: string;
  name: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  stackLimitMb?: number | null;
}

export interface ProblemDetailResponse {
  id: number;
  problemCode: string;
  title: string;
  difficulty: number;
  status: number;
  judgeMode: number;
  defaultTimeLimitMs: number;
  defaultMemoryLimitMb: number;
  defaultStackLimitMb?: number | null;
  description: string;
  hint?: string | null;
  source?: string | null;
  sampleCases: ProblemSampleCaseResponse[];
  supportedLanguages: ProblemLanguageResponse[];
}

export interface CreateSubmissionRequest {
  problemId: number;
  languageCode: string;
  sourceCode: string;
}

export interface CreateSubmissionResponse {
  submissionId: number;
  status: string;
  resultCode?: string | null;
}

export interface SubmissionCaseResultResponse {
  caseNo: number;
  resultCode: string;
  timeUsedMs?: number | null;
  memoryUsedKb?: number | null;
  message?: string | null;
}

export interface SubmissionDetailResponse {
  id: number;
  userId: number;
  problemId: number;
  languageId: number;
  languageCode?: string | null;
  status: string;
  resultCode?: string | null;
  score: number;
  timeUsedMs?: number | null;
  memoryUsedKb?: number | null;
  codeLength: number;
  passedCases: number;
  totalCases: number;
  message?: string | null;
  judgedAt?: string | null;
  createdAt?: string | null;
  testCaseResults: SubmissionCaseResultResponse[];
}
