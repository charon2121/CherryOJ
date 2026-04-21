import type { HTMLAttributes, ReactNode } from "react";

type TagTone = "neutral" | "accent" | "success" | "warning" | "danger";
type TagSize = "sm" | "md";

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: TagTone;
  size?: TagSize;
  bordered?: boolean;
};

function joinClassNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function toneClassName(tone: TagTone, bordered: boolean) {
  if (tone === "accent") {
    return bordered
      ? "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
      : "border border-transparent bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300";
  }
  if (tone === "success") {
    return bordered
      ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
      : "border border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (tone === "warning") {
    return bordered
      ? "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
      : "border border-transparent bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  }
  if (tone === "danger") {
    return bordered
      ? "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
      : "border border-transparent bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300";
  }
  return bordered
    ? "border border-[color:var(--border)] bg-[color:var(--surface-secondary)] text-[color:var(--muted)]"
    : "border border-transparent bg-[color:var(--surface-secondary)] text-[color:var(--muted)]";
}

function sizeClassName(size: TagSize) {
  if (size === "md") {
    return "px-3 py-1 text-xs";
  }
  return "px-2 py-0.5 text-[11px]";
}

export function Tag({
  children,
  tone = "neutral",
  size = "sm",
  bordered = true,
  className,
  ...props
}: TagProps) {
  return (
    <span
      className={joinClassNames(
        "inline-flex w-fit items-center rounded-full font-medium",
        sizeClassName(size),
        toneClassName(tone, bordered),
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

