"use client";

import dynamic from "next/dynamic";

function EditorSkeleton() {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100/40 text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900/30 dark:text-zinc-400">
      加载编辑器…
    </div>
  );
}

const MonacoEditorInner = dynamic(() => import("./MonacoEditorInner.client"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

export interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor(props: CodeEditorProps) {
  return <MonacoEditorInner {...props} />;
}
