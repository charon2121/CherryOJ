"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "@/components/theme/ThemeProvider.client";

function monacoLanguage(language: string): string {
  const normalized = language.toLowerCase();
  if (normalized.includes("cpp") || normalized.includes("c++")) return "cpp";
  if (normalized.includes("python")) return "python";
  if (normalized.includes("java")) return "java";
  if (normalized.includes("rust")) return "rust";
  return "plaintext";
}

export interface MonacoEditorInnerProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export default function MonacoEditorInner({ language, value, onChange }: MonacoEditorInnerProps) {
  const { resolvedTheme } = useTheme();
  const editorTheme = resolvedTheme === "dark" ? "vs-dark" : "light";

  return (
    <Editor
      height="100%"
      language={monacoLanguage(language)}
      theme={editorTheme}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      options={{
        minimap: { enabled: true, scale: 0.85 },
        fontSize: 14,
        fontFamily: "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontLigatures: true,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: "line",
        cursorBlinking: "smooth",
        smoothScrolling: true,
      }}
    />
  );
}
