import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  isDark: boolean;
}

/* ─── Context ────────────────────────────────────────────────────────────── */
const ThemeContext = createContext<ThemeContextValue | null>(null);

/* ─── Helper: Read initial theme ────────────────────────────────────────── */
function getInitialTheme(): Theme {
  // 1. Respect a previously saved preference
  const saved = localStorage.getItem("playtube-theme");
  if (saved === "dark" || saved === "light") return saved;
  // 2. Fall back to the OS-level dark/light setting
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/* ─── Provider ───────────────────────────────────────────────────────────── */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  /* Apply the correct class to <html> and persist choice */
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("playtube-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
};

/* ─── Hook ───────────────────────────────────────────────────────────────── */
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
};
