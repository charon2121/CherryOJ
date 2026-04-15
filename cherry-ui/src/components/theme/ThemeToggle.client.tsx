"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore, type SVGProps } from "react";

function useClientMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MonitorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

const iconClass = "h-[18px] w-[18px]";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useClientMounted();
  const effectiveTheme = mounted ? theme ?? "system" : "system";

  const cycle = () => {
    const order = ["light", "dark", "system"] as const;
    const current = (theme ?? "system") as (typeof order)[number];
    const i = order.indexOf(current);
    setTheme(order[(i + 1) % order.length]);
  };

  const label =
    effectiveTheme === "light"
      ? "浅色主题"
      : effectiveTheme === "dark"
        ? "深色主题"
        : "跟随系统";

  return (
    <Button
      type="button"
      variant="tertiary"
      size="sm"
      isIconOnly
      aria-label={`切换主题，当前：${label}，点击在浅色、深色与跟随系统间轮换`}
      onPress={cycle}
      className="shrink-0 text-zinc-600 dark:text-zinc-300"
    >
      {!mounted ? (
        <MonitorIcon className={iconClass} />
      ) : effectiveTheme === "light" ? (
        <SunIcon className={iconClass} />
      ) : effectiveTheme === "dark" ? (
        <MoonIcon className={iconClass} />
      ) : (
        <MonitorIcon className={iconClass} />
      )}
    </Button>
  );
}
