import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Universal Theme Toggle Component
 * Supports: 'segmented' (pill of 3 buttons) or 'dropdown' (compact button with popup menu)
 * Features:
 * - Default: Light Theme
 * - Dark: Classic Dark (True Neutral / Charcoal - No Blue)
 * - System: Follows OS with Classic Dark (No Blue)
 * - Theme Color: Choice of Classic Neutral, Emerald, Violet, Amber, Rose, Ocean
 */
export default function ThemeToggle({ variant = "dropdown", className = "" }) {
  const { theme, setTheme, resolvedTheme, themeColor, setThemeColor, themeColors } =
    useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [isOpen]);

  const themes = [
    { id: "light", label: "Light", icon: Sun, subtitle: "Default" },
    { id: "dark", label: "Classic Dark", icon: Moon, subtitle: "Pure Dark" },
    { id: "system", label: "System", icon: Laptop, subtitle: "Auto" },
  ];

  const activeColorObj =
    themeColors.find((c) => c.id === themeColor) || themeColors[0];

  // Render 3-button segmented pill
  if (variant === "segmented") {
    return (
      <div
        className={`inline-flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900 ${className}`}
      >
        {themes.map((t) => {
          const Icon = t.icon;
          const isActive = theme === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
              title={`Switch to ${t.label} mode`}
            >
              <Icon size={13} className={isActive ? "text-blue-600 dark:text-blue-400" : ""} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Current active icon for dropdown button
  const ActiveIcon =
    theme === "system" ? Laptop : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle theme"
        title={`Theme: ${theme === "dark" ? "Classic Dark" : theme.charAt(0).toUpperCase() + theme.slice(1)} • Color: ${activeColorObj.label}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <ActiveIcon size={16} className="text-slate-700 dark:text-slate-200" />
        <span
          className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full ring-1 ring-white dark:ring-slate-900"
          style={{ backgroundColor: activeColorObj.color }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          {/* Mode Header */}
          <div className="px-2.5 py-1 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Theme Mode
            </span>
          </div>

          {/* Mode Switchers */}
          <div className="space-y-0.5">
            {themes.map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t.id);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition ${
                    isSelected
                      ? "bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-white"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      size={14}
                      className={
                        isSelected
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400 dark:text-slate-500"
                      }
                    />
                    <span>{t.label}</span>
                  </div>

                  {isSelected && <Check size={13} strokeWidth={2.5} className="text-blue-600 dark:text-blue-400" />}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-1.5 border-t border-slate-200 dark:border-slate-800" />

          {/* Theme Color Header */}
          <div className="px-2.5 py-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Theme Color
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 capitalize">
                {activeColorObj.label}
              </span>
            </div>

            {/* Color Swatches */}
            <div className="flex items-center justify-between gap-1 pt-0.5 pb-1">
              {themeColors.map((c) => {
                const isSelected = themeColor === c.id;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setThemeColor(c.id)}
                    title={c.label}
                    className={`group relative flex h-5 w-5 items-center justify-center rounded-full transition-all duration-150 ${
                      isSelected
                        ? "scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                        : "opacity-80 hover:scale-105 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: c.color,
                      "--tw-ring-color": c.ringColor,
                    }}
                  >
                    {isSelected && (
                      <Check
                        size={10}
                        strokeWidth={3}
                        className="text-white drop-shadow-xs"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
