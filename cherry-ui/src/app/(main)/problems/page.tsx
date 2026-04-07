import ProblemsList from "@/components/oj/ProblemsList.client";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "题库 — CherryOJ",
  description: "浏览题目、难度、通过率与标签",
};

export default function ProblemsPage() {
  return <ProblemsList/>;
}
