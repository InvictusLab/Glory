import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
);

// Resolve the effective class for a theme. The FOUC script in index.html
// duplicates this rule by hand (it must run before React hydrates).
function resolveTheme(theme: Theme, prefersDark: boolean): "light" | "dark" {
  if (theme === "system") return prefersDark ? "dark" : "light";
  return theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "glory-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      root.classList.remove("light", "dark");
      root.classList.add(resolveTheme(theme, mql.matches));
    };

    apply();

    // Live-follow OS theme changes while in system mode (the shadcn docs
    // version resolves only once at mount/theme-change).
    if (theme === "system") {
      mql.addEventListener("change", apply);
      return () => mql.removeEventListener("change", apply);
    }
  }, [theme]);

  const value: ThemeProviderState = {
    theme,
    setTheme: (next: Theme) => {
      localStorage.setItem(storageKey, next);
      setTheme(next);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
