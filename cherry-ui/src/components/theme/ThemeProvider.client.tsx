"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

type ThemeSetting = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeSetting;
  resolvedTheme: ResolvedTheme;
  hydrated: boolean;
  setTheme: (theme: ThemeSetting) => void;
};

type ThemeState = {
  theme: ThemeSetting;
  systemTheme: ResolvedTheme;
  hydrated: boolean;
};

type ThemeAction =
  | { type: "initialize"; theme: ThemeSetting; systemTheme: ResolvedTheme }
  | { type: "set-theme"; theme: ThemeSetting }
  | { type: "set-system-theme"; systemTheme: ResolvedTheme };

const STORAGE_KEY = "cherry-ui-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolvedTheme: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.classList.toggle("dark", resolvedTheme === "dark");
  root.dataset.theme = resolvedTheme;
}

function reducer(state: ThemeState, action: ThemeAction): ThemeState {
  if (action.type === "initialize") {
    return {
      theme: action.theme,
      systemTheme: action.systemTheme,
      hydrated: true,
    };
  }
  if (action.type === "set-theme") {
    return {
      ...state,
      theme: action.theme,
    };
  }
  return {
    ...state,
    systemTheme: action.systemTheme,
  };
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    theme: "system",
    systemTheme: "light",
    hydrated: false,
  });

  const resolvedTheme = state.theme === "system" ? state.systemTheme : state.theme;

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const nextTheme: ThemeSetting =
      saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
    dispatch({
      type: "initialize",
      theme: nextTheme,
      systemTheme: getSystemTheme(),
    });
  }, []);

  useEffect(() => {
    if (!state.hydrated) {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = () => {
      if (state.theme !== "system") {
        return;
      }
      dispatch({ type: "set-system-theme", systemTheme: getSystemTheme() });
    };

    media.addEventListener("change", onMediaChange);
    return () => {
      media.removeEventListener("change", onMediaChange);
    };
  }, [state.hydrated, state.theme]);

  useEffect(() => {
    if (!state.hydrated) {
      return;
    }
    applyTheme(resolvedTheme);
    window.localStorage.setItem(STORAGE_KEY, state.theme);
  }, [resolvedTheme, state.hydrated, state.theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: state.theme,
      resolvedTheme,
      hydrated: state.hydrated,
      setTheme: (theme) => dispatch({ type: "set-theme", theme }),
    }),
    [resolvedTheme, state.hydrated, state.theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
