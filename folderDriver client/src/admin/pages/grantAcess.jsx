import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Search,
  ShieldCheck,
  User,
  Check,
  Shield,
  Sparkles,
  UserCheck,
  X,
  AlertCircle,
} from "lucide-react";

import {
  useGetUsersQuery,
  useGetProfileQuery,
  useUpdateUserRoleMutation,
} from "../../store/slices/AdminSlice";

export default function GrantAdminAccess() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("admin");

  const { data: profile } = useGetProfileQuery();
  const {
    data: users = [],
    isLoading,
    isError,
  } = useGetUsersQuery(profile?.role, {
    skip: !profile?.role,
  });

  const [updateUserRole, { isLoading: updating }] = useUpdateUserRoleMutation();

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.id?.toLowerCase().includes(value)
    );
  });

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setRole(user.role === "admin" ? "admin" : "user");
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error("Please select a user to update permissions");
      return;
    }

    try {
      await updateUserRole({
        userId: selectedUser.id,
        newRole: role,
      }).unwrap();

      toast.success(
        role === "admin"
          ? `Administrative privileges granted to ${selectedUser.name || selectedUser.email}`
          : `Admin access removed for ${selectedUser.name || selectedUser.email}`
      );

      setSelectedUser(null);
      setSearch("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user access");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40">
          <Sparkles size={12} /> Owner Governance Action
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <UserCheck size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Grant & Revoke Admin Access
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Delegate administrative capabilities or demote accounts back to standard user roles.
          </p>
        </div>
      </div>

      {/* Main 2-Column Form Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleGrantAccess} className="space-y-6">
          {/* Step 1: User Picker */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              1. Select User
            </label>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-9 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* User Selection List */}
            <div className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/30 divide-y divide-slate-100 dark:border-slate-700 dark:bg-slate-950/40 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <p className="p-4 text-center text-xs text-slate-400 dark:text-slate-500">
                  No accounts found matching "{search}"
                </p>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedUser?.id === user.id;

                  return (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className={`flex cursor-pointer items-center justify-between p-3 transition ${
                        isSelected
                          ? "bg-blue-50/80 font-medium dark:bg-blue-950/50"
                          : "hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs font-bold dark:bg-slate-700 dark:text-slate-300">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {user.name || "User"}
                          </p>
                          <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 capitalize dark:bg-slate-800 dark:text-slate-300">
                          {user.role}
                        </span>
                        {isSelected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {selectedUser && (
              <p className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                Selected: <span className="font-bold">{selectedUser.name}</span> ({selectedUser.email})
              </p>
            )}
          </div>

          {/* Step 2: Role Selector Cards */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              2. Assign Role & Permissions
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Admin Card */}
              <div
                onClick={() => setRole("admin")}
                className={`cursor-pointer rounded-2xl border p-4.5 transition-all ${
                  role === "admin"
                    ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/40"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Administrator</span>
                  </div>
                  <input
                    type="radio"
                    name="role"
                    checked={role === "admin"}
                    onChange={() => setRole("admin")}
                    className="accent-blue-600"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  Full administrative permissions. Can inspect stored files, manage user directories, recover soft-deleted accounts, and terminate active sessions.
                </p>
              </div>

              {/* Standard User Card */}
              <div
                onClick={() => setRole("user")}
                className={`cursor-pointer rounded-2xl border p-4.5 transition-all ${
                  role === "user"
                    ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/40"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Standard User</span>
                  </div>
                  <input
                    type="radio"
                    name="role"
                    checked={role === "user"}
                    onChange={() => setRole("user")}
                    className="accent-blue-600"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  Standard cloud storage access. Does not have access to the Admin Portal, user directory, or system security settings.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!selectedUser || updating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating ? "Saving Changes..." : "Apply Role Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
