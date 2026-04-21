import ProblemsPageShell from "@/components/oj/ProblemsPageShell";
import { listProblems as listProblemsApi } from "@/lib/api/endpoints/problems";
import { adaptProblemSummary } from "@/lib/oj/problem-adapter";
import { listProblems as listMockProblems } from "@/data/problems";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "题库 — CherryOJ",
  description: "浏览题目、难度、通过率与标签",
};

async function loadProblems() {
  try {
    const page = await listProblemsApi({ page: 1, pageSize: 100 });
    return page.items.map(adaptProblemSummary);
  } catch {
    return listMockProblems();
  }
}

export default async function ProblemsPage() {
  const problems = await loadProblems();
  return <ProblemsPageShell initialProblems={problems} />;
}
