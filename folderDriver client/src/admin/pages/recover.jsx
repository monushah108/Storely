import React, { useState, useMemo } from "react";
import {
  useGetDeletedUsersQuery,
  useRecoverUserMutation,
} from "../../store/slices/AdminSlice";
import {
  RotateCcw,
  Search,
  Trash2,
  Mail,
  User as UserIcon,
  CheckCircle2,
  RefreshCw,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function Recover() {
  const {
    data: deletedUsers = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetDeletedUsersQuery();

  const [recoverUser] = useRecoverUserMutation();
  const [recoveringId, setRecoveringId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRecover = async (user) => {
    try {
      setRecoveringId(user.id);
      await recoverUser(user.id).unwrap();
      toast.success(`Account for ${user.email} successfully restored!`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to restore user account");
    } finally {
      setRecoveringId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return deletedUsers;
    const q = searchQuery.toLowerCase();
    return deletedUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.id?.toLowerCase().includes(q)
    );
  }, [deletedUsers, searchQuery]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="h-20 animate-pulse rounded-2xl bg-slate-200/70" />
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertTriangle size={32} className="mx-auto text-red-500 mb-2" />
        <p className="text-sm font-semibold text-red-800">Failed to load deleted accounts</p>
        <p className="mt-1 text-xs text-red-600">Please verify your permissions and try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-red-700"
        >
          <RefreshCw size={14} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Banner / Stat Card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/50 p-5 shadow-2xs sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/40 dark:from-amber-950/30 dark:to-orange-950/20">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-400">
            <Trash2 size={24} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-950 dark:text-amber-100 sm:text-base">
              Trash & Account Recovery
            </h2>
            <p className="text-xs text-amber-700/90 dark:text-amber-300 mt-0.5">
              Soft-deleted users are held here. Restoring an account restores access to their Storely Drive and files.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-amber-300/60 bg-white/80 px-4 py-2 text-center shadow-2xs dark:border-amber-800/40 dark:bg-slate-900">
            <p className="text-lg font-bold text-amber-900 dark:text-amber-200">{deletedUsers.length}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">In Trash</p>
          </div>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search deleted accounts by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-9 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          title="Refresh deleted accounts"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <RefreshCw size={15} className={isFetching ? "animate-spin text-blue-600" : ""} />
        </button>
      </div>

      {/* Table / Empty State */}
      {deletedUsers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 size={28} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100">
            Trash is Empty
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            There are no soft-deleted accounts currently waiting for recovery.
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">No matching deleted users</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Check your search query or clear the filter.</p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
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
                    Previous Role
                  </th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Restore Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => {
                  const isRecovering = recoveringId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                    >
                      {/* Name / ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold dark:bg-amber-950/50 dark:text-amber-300">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {user.name || "Unknown User"}
                            </p>
                            <p className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                              ID: {user.id ? user.id.slice(-8) : "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                          <Mail size={13} className="text-slate-400 dark:text-slate-500" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {user.role || "user"}
                        </span>
                      </td>

                      {/* Recover Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          disabled={isRecovering}
                          onClick={() => handleRecover(user)}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <RotateCcw
                            size={13}
                            className={isRecovering ? "animate-spin" : ""}
                          />
                          <span>{isRecovering ? "Restoring..." : "Restore User"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
