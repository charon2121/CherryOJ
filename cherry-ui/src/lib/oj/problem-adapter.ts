import type {
  ProblemDetailResponse,
  ProblemLanguageResponse,
  ProblemSummaryResponse,
} from "@/lib/api/oj-types";
import type { Difficulty, LangId, Problem } from "@/data/problems";

function mapDifficulty(value: number): Difficulty {
  if (value === 1) return "入门";
  if (value === 2) return "进阶";
  return "提高";
}

function toLangId(code: string): LangId | null {
  const normalized = code.toLowerCase();
  if (normalized.includes("cpp") || normalized.includes("c++")) return "cpp";
  if (normalized.includes("python")) return "python";
  if (normalized.includes("java")) return "java";
  if (normalized.includes("rust")) return "rust";
  return null;
}

function createTemplate(lang: LangId): string {
  if (lang === "cpp") {
    return `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    return 0;
}
`;
  }
  if (lang === "python") {
    return `def main() -> None:
    pass


if __name__ == "__main__":
    main()
`;
  }
  if (lang === "java") {
    return `public class Main {
    public static void main(String[] args) {
    }
}
`;
  }
  return `fn main() {
}
`;
}

function buildLanguageOptions(languages: ProblemLanguageResponse[]) {
  return languages
    .map((language) => {
      const uiId = toLangId(language.code);
      if (!uiId) return null;
      return {
        id: uiId,
        label: language.name,
        submitValue: language.code,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

function buildTemplates(languageOptions: Array<{ id: LangId }>): Record<LangId, string> {
  const fallback: Record<LangId, string> = {
    cpp: createTemplate("cpp"),
    python: createTemplate("python"),
    java: createTemplate("java"),
    rust: createTemplate("rust"),
  };

  for (const option of languageOptions) {
    fallback[option.id] = createTemplate(option.id);
  }
  return fallback;
}

export function adaptProblemSummary(problem: ProblemSummaryResponse): Problem {
  return {
    id: problem.problemCode || String(problem.id),
    routeId: String(problem.id),
    backendId: problem.id,
    title: problem.title,
    difficulty: mapDifficulty(problem.difficulty),
    acceptancePct: 0,
    tags: [],
    description: "",
    examples: [],
    constraints: [
      `时间限制：${problem.defaultTimeLimitMs} ms`,
      `内存限制：${problem.defaultMemoryLimitMb} MB`,
    ],
    timeLimit: `${problem.defaultTimeLimitMs} ms`,
    memoryLimit: `${problem.defaultMemoryLimitMb} MB`,
    templates: {
      cpp: createTemplate("cpp"),
      python: createTemplate("python"),
      java: createTemplate("java"),
      rust: createTemplate("rust"),
    },
  };
}

export function adaptProblemDetail(problem: ProblemDetailResponse): Problem {
  const languageOptions = buildLanguageOptions(problem.supportedLanguages);
  const constraints = [];
  if (problem.hint?.trim()) {
    constraints.push(...problem.hint.split(/\r?\n+/).map((line) => line.trim()).filter(Boolean));
  }
  constraints.push(`时间限制：${problem.defaultTimeLimitMs} ms`);
  constraints.push(`内存限制：${problem.defaultMemoryLimitMb} MB`);

  return {
    id: problem.problemCode || String(problem.id),
    routeId: String(problem.id),
    backendId: problem.id,
    title: problem.title,
    difficulty: mapDifficulty(problem.difficulty),
    acceptancePct: 0,
    tags: problem.source ? [problem.source] : [],
    description: problem.description || "暂无题面描述。",
    examples: problem.sampleCases.map((sample) => ({
      input: sample.input,
      output: sample.output,
    })),
    constraints,
    timeLimit: `${problem.defaultTimeLimitMs} ms`,
    memoryLimit: `${problem.defaultMemoryLimitMb} MB`,
    templates: buildTemplates(languageOptions),
    languageOptions,
  };
}
