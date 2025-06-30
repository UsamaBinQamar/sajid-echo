
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type FontMode = "default" | "accessible";
type ContrastMode = "normal" | "high";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  fontMode: FontMode;
  contrastMode: ContrastMode;
  setTheme: (theme: Theme) => void;
  setFontMode: (fontMode: FontMode) => void;
  setContrastMode: (contrastMode: ContrastMode) => void;
  isDark: boolean;
  effectiveTheme: Theme;
};

const initialState: ThemeProviderState = {
  theme: "light",
  fontMode: "default",
  contrastMode: "normal",
  setTheme: () => null,
  setFontMode: () => null,
  setContrastMode: () => null,
  isDark: false,
  effectiveTheme: "light",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "echostrong-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [fontMode, setFontMode] = useState<FontMode>("default");
  const [contrastMode, setContrastMode] = useState<ContrastMode>("normal");

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "high-contrast");
    
    // Apply current theme
    root.classList.add(theme);
    
    // Professional font system
    root.style.setProperty("--font-display", "var(--font-display)");
    root.style.setProperty("--font-body", "var(--font-body)");
    root.style.setProperty("--font-ui", "var(--font-ui)");
    
    // Apply font accessibility if needed
    if (fontMode === "accessible") {
      document.body.style.fontSize = "18px";
      document.body.style.lineHeight = "1.8";
    } else {
      document.body.style.fontSize = "16px";
      document.body.style.lineHeight = "1.6";
    }
    
    // Apply contrast mode
    if (contrastMode === "high") {
      root.classList.add("high-contrast");
    }
    
    // Smooth transitions
    root.style.transition = "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms cubic-bezier(0.4, 0, 0.2, 1)";
  }, [theme, fontMode, contrastMode]);

  const value = {
    theme,
    fontMode,
    contrastMode,
    isDark: theme === "dark",
    effectiveTheme: theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    setFontMode,
    setContrastMode,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
