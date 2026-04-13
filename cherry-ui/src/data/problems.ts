export type Difficulty = "入门" | "进阶" | "提高";

export type LangId = "cpp" | "python" | "java" | "rust";

export interface ExampleCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  routeId?: string;
  backendId?: number;
  title: string;
  difficulty: Difficulty;
  /** 通过率百分比 0–100 */
  acceptancePct: number;
  tags: string[];
  /** 题面简介（纯文本，分段用双换行） */
  description: string;
  examples: ExampleCase[];
  constraints: string[];
  timeLimit: string;
  memoryLimit: string;
  templates: Record<LangId, string>;
  languageOptions?: Array<{ id: LangId; label: string; submitValue: string }>;
}

export const PROBLEMS: Problem[] = [
  {
    id: "P1001",
    title: "A + B Problem",
    difficulty: "入门",
    acceptancePct: 92.4,
    tags: ["模拟", "入门"],
    description:
      "计算两个整数的和。\n\n给定两个整数 a 和 b，输出 a + b 的值。本题用于熟悉 CherryOJ 的输入输出格式。",
    examples: [
      {
        input: "1 2",
        output: "3",
        explanation: "1 + 2 = 3",
      },
      {
        input: "-5 10",
        output: "5",
      },
    ],
    constraints: ["−10^9 ≤ a, b ≤ 10^9", "所有运算在 32 位有符号整数范围内完成。"],
    timeLimit: "1 s",
    memoryLimit: "256 MB",
    templates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long a, b;
    if (cin >> a >> b) {
        cout << a + b << '\\n';
    }
    return 0;
}
`,
      python: `def main() -> None:
    line = input().split()
    if len(line) >= 2:
        a, b = int(line[0]), int(line[1])
        print(a + b)


if __name__ == "__main__":
    main()
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextLong()) {
            long a = sc.nextLong();
            long b = sc.nextLong();
            System.out.println(a + b);
        }
        sc.close();
    }
}
`,
      rust: `use std::io::{self, BufRead};

fn main() {
    let stdin = io::stdin();
    let mut it = stdin.lock().lines();
    if let Some(Ok(line)) = it.next() {
        let mut nums = line.split_whitespace().filter_map(|s| s.parse::<i64>().ok());
        if let (Some(a), Some(b)) = (nums.next(), nums.next()) {
            println!("{}", a + b);
        }
    }
}
`,
    },
  },
  {
    id: "P2047",
    title: "区间最值与懒标记",
    difficulty: "提高",
    acceptancePct: 18.2,
    tags: ["线段树", "懒惰标记"],
    description:
      "给定长度为 n 的数组与 q 次操作。操作有两种：区间赋值、区间查询最大值。\n\n请实现能在对数时间内完成每次操作的数据结构（示意题面，评测逻辑可后续接入）。",
    examples: [
      {
        input: "5 3\n1 2 3 4 5\n2 1 5\n1 2 4 10\n2 1 5",
        output: "5\n10",
      },
    ],
    constraints: ["1 ≤ n, q ≤ 2×10^5", "数组元素与赋值取值在 32 位有符号整数范围内。"],
    timeLimit: "2 s",
    memoryLimit: "512 MB",
    templates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // TODO: 线段树 + 懒标记
    return 0;
}
`,
      python: `def main() -> None:
    # TODO: 线段树 + 懒标记
    pass


if __name__ == "__main__":
    main()
`,
      java: `public class Main {
    public static void main(String[] args) {
        // TODO: 线段树 + 懒标记
    }
}
`,
      rust: `fn main() {
    // TODO: 线段树 + 懒标记
}
`,
    },
  },
  {
    id: "P0888",
    title: "最短路计数",
    difficulty: "进阶",
    acceptancePct: 41.0,
    tags: ["图论", "最短路"],
    description:
      "在无向简单图上求 S 到 T 的最短距离，并统计最短路径条数（对 10^9+7 取模）。",
    examples: [
      {
        input: "3 3 1 3\n1 2\n2 3\n1 3",
        output: "1 2",
        explanation: "最短距离为 1，路径有 1→3 与 1→2→3 两条（若距离相同则都计入）。",
      },
    ],
    constraints: ["1 ≤ n ≤ 10^5", "0 ≤ m ≤ 2×10^5"],
    timeLimit: "1 s",
    memoryLimit: "256 MB",
    templates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    return 0;
}
`,
      python: `def main() -> None:
    pass


if __name__ == "__main__":
    main()
`,
      java: `public class Main {
    public static void main(String[] args) {
    }
}
`,
      rust: `fn main() {
}
`,
    },
  },
  {
    id: "P0420",
    title: "动态规划 · 背包变种",
    difficulty: "进阶",
    acceptancePct: 35.4,
    tags: ["动态规划"],
    description: "0-1 背包的变种：每件物品最多选一次，求恰好装满容量为 W 的方案是否存在。",
    examples: [
      { input: "3 5\n2 3 4", output: "Yes" },
      { input: "2 3\n4 5", output: "No" },
    ],
    constraints: ["1 ≤ n ≤ 100", "1 ≤ W ≤ 10^4"],
    timeLimit: "1 s",
    memoryLimit: "256 MB",
    templates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    return 0;
}
`,
      python: `def main() -> None:
    pass


if __name__ == "__main__":
    main()
`,
      java: `public class Main {
    public static void main(String[] args) {
    }
}
`,
      rust: `fn main() {
}
`,
    },
  },
  {
    id: "P1337",
    title: "字符串哈希入门",
    difficulty: "入门",
    acceptancePct: 67.1,
    tags: ["字符串", "哈希"],
    description: "判断两个子串是否相等，使用多项式哈希实现 O(1) 比较（题面示意）。",
    examples: [{ input: "abcde\n1 3\n3 5", output: "No" }],
    constraints: ["字符串长度 ≤ 10^5"],
    timeLimit: "1 s",
    memoryLimit: "256 MB",
    templates: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    return 0;
}
`,
      python: `def main() -> None:
    pass


if __name__ == "__main__":
    main()
`,
      java: `public class Main {
    public static void main(String[] args) {
    }
}
`,
      rust: `fn main() {
}
`,
    },
  },
];

export function getProblemById(id: string): Problem | undefined {
  return PROBLEMS.find((p) => p.id.toLowerCase() === id.toLowerCase());
}

export function listProblems(): Problem[] {
  return [...PROBLEMS];
}

export const LANG_LABEL: Record<LangId, string> = {
  cpp: "C++",
  python: "Python 3",
  java: "Java",
  rust: "Rust",
};

export function monacoLanguage(lang: LangId): string {
  if (lang === "cpp") return "cpp";
  if (lang === "python") return "python";
  if (lang === "java") return "java";
  return "rust";
}
