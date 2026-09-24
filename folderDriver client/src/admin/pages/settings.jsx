import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Shield, Key, Lock, Sparkles } from "lucide-react";

export default function Settings() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Admin Security & Credentials
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage temporary admin access tokens and update your master authentication password.
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 self-start sm:self-auto dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40">
          <Sparkles size={12} /> Master Security
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <NavLink
          to="/admin/settings"
          end
          className={({ isActive }) => `
            flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition-all
            ${
              isActive
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }
          `}
        >
          <Key size={14} />
          <span>Temporary Access Keys</span>
        </NavLink>

        <NavLink
          to="/admin/settings/change-password"
          className={({ isActive }) => `
            flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-semibold transition-all
            ${
              isActive
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }
          `}
        >
          <Lock size={14} />
          <span>Admin Password</span>
        </NavLink>
      </div>

      {/* Active Tab View */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <Outlet />
      </div>
    </div>
  );
}
