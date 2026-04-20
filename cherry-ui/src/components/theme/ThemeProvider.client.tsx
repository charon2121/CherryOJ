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
  | { type: "set-theme"; theme: ThemeSetting }
  | { type: "set-system-theme"; systemTheme: ResolvedTheme };

const STORAGE_KEY = "cherry-ui-theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

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
  root.style.colorScheme = resolvedTheme;
}

function reducer(state: ThemeState, action: ThemeAction): ThemeState {
  if (action.type === "set-theme") {
    if (state.theme === action.theme) {
      return state;
    }
    return {
      ...state,
      theme: action.theme,
    };
  }
  if (state.systemTheme === action.systemTheme) {
    return state;
  }
  return {
    ...state,
    systemTheme: action.systemTheme,
  };
}

export default function ThemeProvider({
  children,
  initialTheme,
  initialResolvedTheme,
}: {
  children: ReactNode;
  initialTheme: ThemeSetting;
  initialResolvedTheme: ResolvedTheme;
}) {
  const [state, dispatch] = useReducer(reducer, {
    theme: initialTheme,
    systemTheme: initialResolvedTheme,
    hydrated: true,
  });

  const resolvedTheme = state.theme === "system" ? state.systemTheme : state.theme;

  useEffect(() => {
    if (state.theme === "system") {
      dispatch({ type: "set-system-theme", systemTheme: getSystemTheme() });
    }
  }, [state.theme]);

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
    document.cookie = `${STORAGE_KEY}=${state.theme}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
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
