import React, { useState, useMemo } from "react";
import {
  useGetUsersQuery,
  useGetProfileQuery,
  useGetDeletedUsersQuery,
  useLogoutUserMutation,
  useSoftDeleteUserMutation,
  useHardDeleteUserMutation,
} from "../../store/slices/AdminSlice";

import {
  Users as UsersIcon,
  ShieldCheck,
  Activity,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  X,
  UserCheck,
} from "lucide-react";

import UserTable from "../components/userTable.jsx";
import UserDelete from "../components/module/userDelete.jsx";
import { toast } from "sonner";

export default function Users() {
  const [portal, setPortal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hardDeleteConfirm, setHardDeleteConfirm] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: profile } = useGetProfileQuery();
  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetUsersQuery(profile?.role);

  const { data: deletedUsers = [] } = useGetDeletedUsersQuery();

  const [logoutUser, { isLoading: loggingOut }] = useLogoutUserMutation();
  const [softDeleteUser, { isLoading: softDeleting }] = useSoftDeleteUserMutation();
  const [hardDeleteUser, { isLoading: hardDeleting }] = useHardDeleteUserMutation();

  const isDeleting = softDeleting || hardDeleting;

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        !searchQuery.trim() ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id?.toLowerCase().includes(searchQuery.toLowerCase());

      // Role filter
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "staff" && (user.role === "admin" || user.role === "owner")) ||
        user.role === roleFilter;

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "online" && user.isLoggedIn) ||
        (statusFilter === "offline" && !user.isLoggedIn);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // KPI Metrics Calculation
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isLoggedIn).length;
    const staff = users.filter((u) => u.role === "admin" || u.role === "owner").length;
    const deleted = deletedUsers.length;
    return { total, active, staff, deleted };
  }, [users, deletedUsers]);

  // Actions
  const handleLogout = async (user) => {
    if (!window.confirm(`Log out user ${user.email} from their active session?`)) return;

    try {
      await logoutUser(user.id).unwrap();
      toast.success(`Session terminated for ${user.email}`);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to log out user session");
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setHardDeleteConfirm(false);
    setPortal(true);
  };

  const closeModal = () => {
    if (isDeleting) return;
    setPortal(false);
    setSelectedUser(null);
    setHardDeleteConfirm(false);
  };

  const handleUserDelete = async () => {
    if (!selectedUser || isDeleting) return;

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

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-slate-300 border-t-blue-600" />
        <p className="text-sm font-medium text-slate-500">Loading user directory...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-800">Failed to load users</p>
        <p className="mt-1 text-xs text-red-600">Please verify your admin session and try again.</p>
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
      {/* ================= KPI STATS CARDS ================= */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs transition hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Users</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UsersIcon size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {stats.total}
            </span>
            <span className="ml-2 text-[11px] text-slate-400">registered</span>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs transition hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Online</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-600">
              {stats.active}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live sessions
            </span>
          </div>
        </div>

        {/* Staff & Admins */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs transition hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Admin Staff</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {stats.staff}
            </span>
            <span className="ml-2 text-[11px] text-indigo-600 font-medium">owners & admins</span>
          </div>
        </div>

        {/* In Trash */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs transition hover:shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Trash / Deleted</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Trash2 size={18} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {stats.deleted}
            </span>
            <span className="ml-2 text-[11px] text-amber-600 font-medium">pending recover</span>
          </div>
        </div>
      </div>

      {/* ================= SEARCH & CONTROLS TOOLBAR ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-9 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="staff">Staff (Owner + Admin)</option>
            <option value="owner">Owners Only</option>
            <option value="admin">Admins Only</option>
            <option value="user">Standard Users</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500"
          >
            <option value="all">All Sessions</option>
            <option value="online">Online Only</option>
            <option value="offline">Offline Only</option>
          </select>

          {/* Refetch Button */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh directory"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin text-blue-600" : ""} />
          </button>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <p>
          Showing <span className="font-semibold text-slate-800">{filteredUsers.length}</span> of{" "}
          <span className="font-semibold text-slate-800">{users.length}</span> accounts
        </p>

        {(searchQuery || roleFilter !== "all" || statusFilter !== "all") && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* ================= USERS TABLE ================= */}
      <UserTable
        loggingOut={loggingOut}
        users={filteredUsers}
        openDeleteModal={openDeleteModal}
        handleLogout={handleLogout}
        hasFilters={Boolean(searchQuery || roleFilter !== "all" || statusFilter !== "all")}
        onClearFilters={clearFilters}
      />

      {/* ================= DELETE MODAL ================= */}
      <UserDelete
        selectedUser={selectedUser}
        portal={portal}
        closeModal={closeModal}
        isDeleting={isDeleting}
        hardDeleteConfirm={hardDeleteConfirm}
        setHardDeleteConfirm={setHardDeleteConfirm}
        handleUserDelete={handleUserDelete}
      />
    </div>
  );
}
