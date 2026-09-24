import React, { createContext, useContext, useEffect, useState } from "react";

export const THEME_COLORS = [
  { id: "neutral", label: "Classic", color: "#18181b", ringColor: "#71717a" },
  { id: "emerald", label: "Emerald", color: "#10b981", ringColor: "#10b981" },
  { id: "violet", label: "Violet", color: "#8b5cf6", ringColor: "#8b5cf6" },
  { id: "amber", label: "Amber", color: "#f59e0b", ringColor: "#f59e0b" },
  { id: "rose", label: "Rose", color: "#f43f5e", ringColor: "#f43f5e" },
  { id: "blue", label: "Ocean", color: "#3b82f6", ringColor: "#3b82f6" },
];

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  resolvedTheme: "light",
  themeColor: "neutral",
  setThemeColor: () => {},
  themeColors: THEME_COLORS,
});

export function ThemeProvider({ children }) {
  // Default is light theme as requested
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("storely_theme") || "light";
  });

  // Default theme color: "neutral" (zero blue)
  const [themeColor, setThemeColorState] = useState(() => {
    return localStorage.getItem("storely_theme_color") || "neutral";
  });

  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isSystemDark = mediaQuery.matches;
      // In system mode, if OS is dark, resolve to classic dark (never blue dark)
      const effectiveTheme =
        theme === "system" ? (isSystemDark ? "dark" : "light") : theme;

      setResolvedTheme(effectiveTheme);

      if (effectiveTheme === "dark") {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
        root.style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
        root.style.colorScheme = "light";
      }

      // Apply theme color attribute
      root.setAttribute("data-theme-color", themeColor);

      // Dynamically update browser meta theme-color tag
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        if (effectiveTheme === "dark") {
          metaTheme.setAttribute("content", "#09090b");
        } else {
          const selectedColor = THEME_COLORS.find((c) => c.id === themeColor);
          metaTheme.setAttribute("content", selectedColor ? selectedColor.color : "#ffffff");
        }
      }
    };

    applyTheme();

    const handleChange = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, themeColor]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("storely_theme", newTheme);
  };

  const setThemeColor = (newColor) => {
    setThemeColorState(newColor);
    localStorage.setItem("storely_theme_color", newColor);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        themeColor,
        setThemeColor,
        themeColors: THEME_COLORS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
