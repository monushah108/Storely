import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ShieldCheck,
  Crown,
  User as UserIcon,
  Search,
  Filter,
  X,
  LogOut,
  Trash2,
  Folder,
  RefreshCw,
  Sparkles,
  ChevronDown,
} from "lucide-react";

import CanAccess from "../components/CanAccess.jsx";
import Modal from "../components/modle.jsx";

import {
  useGetUsersQuery,
  useGetProfileQuery,
  useLogoutUserMutation,
  useSoftDeleteUserMutation,
  useHardDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "../../store/slices/AdminSlice.js";

export default function Staff() {
  const navigate = useNavigate();

  const [portal, setPortal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hardDeleteConfirm, setHardDeleteConfirm] = useState(false);
  const [search, setSearch] = useState("");
  const [staffOnly, setStaffOnly] = useState(true);

  const { data: profile } = useGetProfileQuery();
  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetUsersQuery(profile?.role, {
    skip: !profile?.role,
  });

  const [logoutUser] = useLogoutUserMutation();
  const [softDeleteUser] = useSoftDeleteUserMutation();
  const [hardDeleteUser] = useHardDeleteUserMutation();
  const [updateUserRole, { isLoading: updatingRole }] = useUpdateUserRoleMutation();

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const isStaff = user.role === "admin" || user.role === "owner";
      if (staffOnly && !isStaff) return false;

      const q = search.toLowerCase();
      return (
        !search.trim() ||
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.id?.toLowerCase().includes(q)
      );
    });
  }, [users, search, staffOnly]);

  const handleLogout = async (user) => {
    if (!window.confirm(`Terminate active session for ${user.email}?`)) return;

    try {
      await logoutUser(user.id).unwrap();
      toast.success(`Session ended for ${user.email}`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to log out user");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({
        userId,
        newRole,
      }).unwrap();
      toast.success(`Role updated to ${newRole.toUpperCase()}`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update role");
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setHardDeleteConfirm(false);
    setPortal(true);
  };

  const closeModal = () => {
    setPortal(false);
    setSelectedUser(null);
    setHardDeleteConfirm(false);
  };

  const handleUserDelete = async () => {
    if (!selectedUser) return;

    try {
      if (hardDeleteConfirm) {
        await hardDeleteUser(selectedUser.id).unwrap();
        toast.success(`User ${selectedUser.email} permanently deleted`);
      } else {
        await softDeleteUser(selectedUser.id).unwrap();
        toast.success(`User ${selectedUser.email} moved to trash`);
      }
      closeModal();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete user");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="h-20 animate-pulse rounded-2xl bg-white" />
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-800">Failed to load staff accounts</p>
        <button
          onClick={() => refetch()}
          className="mt-3 inline-flex rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Staff & Role Management
          </h1>
          <p className="text-xs text-slate-500">
            Manage administrative personnel, assign owner privileges, and adjust user capabilities.
          </p>
        </div>

        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 self-start sm:self-auto">
          <Sparkles size={12} /> Owner Governance
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-9 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStaffOnly((prev) => !prev)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              staffOnly
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {staffOnly ? "Staff Accounts Only" : "Showing All Accounts"}
          </button>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin text-blue-600" : ""} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75">
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Staff Member
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Email
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Session
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Role Assignment
                </th>
                <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-slate-50/80">
                  {/* Member */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-200">
                        {user.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name || "User"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-600">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {user.name || "Unnamed"}
                        </p>
                        <p className="font-mono text-[10px] text-slate-400">
                          ID: {user.id ? user.id.slice(-8) : "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">
                    {user.email}
                  </td>

                  {/* Session Status */}
                  <td className="px-6 py-4">
                    {user.isLoggedIn ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        Offline
                      </span>
                    )}
                  </td>

                  {/* Role Selector */}
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <select
                        value={user.role}
                        disabled={updatingRole}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`cursor-pointer rounded-xl border py-1.5 pl-3 pr-8 text-xs font-semibold outline-none transition focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 ${
                          user.role === "owner"
                            ? "border-amber-300 bg-amber-50 text-amber-800"
                            : user.role === "admin"
                            ? "border-blue-300 bg-blue-50 text-blue-800"
                            : "border-slate-200 bg-slate-100 text-slate-700"
                        }`}
                      >
                        <option value="user">Standard User</option>
                        <option value="admin">Administrator</option>
                        <option value="owner">Owner (Master)</option>
                      </select>
                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-60"
                      />
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/admin/data/${user.id}`)}
                        title="Inspect files"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Folder size={14} />
                      </button>

                      <button
                        disabled={!user.isLoggedIn}
                        onClick={() => handleLogout(user)}
                        title="Terminate session"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 disabled:opacity-30"
                      >
                        <LogOut size={14} />
                      </button>

                      <button
                        onClick={() => openDeleteModal(user)}
                        title="Delete user"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {portal && selectedUser && (
        <Modal isOpen={portal} onClose={closeModal}>
          <div className="w-full max-w-md space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Delete Account
            </h2>

            <p className="text-xs text-slate-600">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-800">{selectedUser.name || selectedUser.email}</span>?
            </p>

            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={hardDeleteConfirm}
                onChange={(e) => setHardDeleteConfirm(e.target.checked)}
                className="h-4 w-4 rounded-xs accent-red-600"
              />
              <span>Permanently delete all files and database records</span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUserDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700"
              >
                {hardDeleteConfirm ? "Permanently Delete" : "Move to Trash"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
