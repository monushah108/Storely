import React from "react";
import { useNavigate } from "react-router-dom";
import CanAccess from "./CanAccess";
import {
  Folder,
  LogOut,
  Trash2,
  Mail,
  Users as UsersIcon,
  ShieldCheck,
  Crown,
  User as UserIcon,
  Sparkles,
} from "lucide-react";

export default function UserTable({
  users = [],
  loggingOut = false,
  handleLogout,
  openDeleteModal,
  hasFilters = false,
  onClearFilters,
}) {
  const navigate = useNavigate();

  // Helper for role badge
  const renderRoleBadge = (role = "user") => {
    switch (role.toLowerCase()) {
      case "owner":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
            <Crown size={12} className="text-amber-600 dark:text-amber-400" />
            Owner
          </span>
        );
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400">
            <ShieldCheck size={12} className="text-blue-600 dark:text-blue-400" />
            Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <UserIcon size={12} className="text-slate-400" />
            User
          </span>
        );
    }
  };

  // Helper for avatar initials fallback
  const getInitials = (name = "") => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-400">
          <UsersIcon size={28} />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100">
          {hasFilters ? "No matching users found" : "No registered users"}
        </h3>

        <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          {hasFilters
            ? "Try adjusting your search query, role filters, or status selection."
            : "No accounts have registered on this platform yet."}
        </p>

        {hasFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 dark:border-slate-800 dark:bg-slate-950/60">
              <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                User
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Role
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Session
              </th>
              <CanAccess role={["owner", "admin"]}>
                <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </CanAccess>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
              >
                {/* User Identity */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200/60 dark:bg-slate-800 dark:ring-slate-700">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {getInitials(user.name)}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {user.name || "Unnamed User"}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        ID: {user.id ? user.id.slice(-8) : "N/A"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="shrink-0 text-slate-400 dark:text-slate-500" />
                    <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                      {user.email}
                    </span>
                  </div>
                </td>

                {/* Role Badge */}
                <td className="px-6 py-4">
                  {renderRoleBadge(user.role)}
                </td>

                {/* Session Status */}
                <td className="px-6 py-4">
                  {user.isLoggedIn ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      Offline
                    </span>
                  )}
                </td>

                {/* Actions */}
                <CanAccess role={["owner", "admin"]}>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Inspect Drive Files */}
                      <button
                        onClick={() => navigate(`/admin/data/${user.id}`)}
                        title="Inspect user files"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:bg-slate-700"
                      >
                        <Folder size={14} />
                      </button>

                      {/* Terminate Session */}
                      <button
                        disabled={!user.isLoggedIn || loggingOut}
                        onClick={() => handleLogout(user)}
                        title={user.isLoggedIn ? "Terminate session" : "User offline"}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-amber-500/50 dark:hover:bg-slate-700"
                      >
                        <LogOut size={14} />
                      </button>

                      {/* Delete Account */}
                      <button
                        onClick={() => openDeleteModal(user)}
                        title="Delete user"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-red-500/50 dark:hover:bg-slate-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </CanAccess>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE VIEW (CARDS) ================= */}
      <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
        {users.map((user) => (
          <div key={user.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {getInitials(user.name)}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {user.name || "Unnamed User"}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>

              {renderRoleBadge(user.role)}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                {user.isLoggedIn ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online Session
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                    Offline
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigate(`/admin/data/${user.id}`)}
                  title="Inspect files"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Folder size={14} />
                </button>

                <button
                  disabled={!user.isLoggedIn || loggingOut}
                  onClick={() => handleLogout(user)}
                  title="End session"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <LogOut size={14} />
                </button>

                <button
                  onClick={() => openDeleteModal(user)}
                  title="Delete user"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
