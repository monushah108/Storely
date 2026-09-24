import { Cloud, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Profile from "../../components/ui/profile";
import ThemeToggle from "../common/ThemeToggle";

export default function Header({ data }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95 sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/20">
            <Cloud className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Storely
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-3 sm:flex">
          <ThemeToggle />

          {data ? (
            <Profile />
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/auth/login")}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/auth/register")}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
              >
                Get started
              </button>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />

          {!data && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}

          {data && <Profile />}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && !data && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 sm:hidden dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <button
            onClick={() => navigate("/auth/login")}
            className="w-full rounded-xl px-4 py-2.5 text-left text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/auth/register")}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white text-center shadow-xs"
          >
            Get started
          </button>
        </div>
      )}
    </header>
  );
}
