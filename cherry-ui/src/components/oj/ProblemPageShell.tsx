import type { Problem } from "@/data/problems";

import ProblemEditorPane from "./ProblemEditorPane.client";
import ProblemStatementPane from "./ProblemStatementPane.client";

export default function ProblemPageShell({ problem }: { problem: Problem }) {
  return (
    <main className="min-h-[calc(100dvh-3.5rem)] border-t border-[color:var(--border)] bg-[color:var(--background)] xl:h-[calc(100dvh-3.5rem)] xl:overflow-hidden">
      <div className="grid min-h-[calc(100dvh-3.5rem)] xl:h-full xl:min-h-0 xl:grid-cols-[minmax(420px,54%)_minmax(520px,46%)]">
        <ProblemStatementPane problem={problem} />
        <ProblemEditorPane problem={problem} />
      </div>
    </main>
  );
}
