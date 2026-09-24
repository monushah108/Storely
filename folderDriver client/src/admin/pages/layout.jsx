import React, { useState } from "react";
import { Outlet, NavLink, useLocation, Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  RotateCcw,
  UserCheck,
  Shield,
  Key,
  Cloud,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  Sparkles,
  UserCog,
} from "lucide-react";
import {
  useGetProfileQuery,
  useLogoutAdminMutation,
  useGetDeletedUsersQuery,
} from "../../store/slices/AdminSlice";
import CanAccess from "../components/CanAccess";
import SEO from "../../components/common/SEO";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: user, isLoading } = useGetProfileQuery();
  const { data: deletedUsers = [] } = useGetDeletedUsersQuery();
  const [logoutAdmin, { isLoading: loggingOut }] = useLogoutAdminMutation();

  const handleLogout = async () => {
    try {
      await logoutAdmin().unwrap();
      navigate("/auth/login");
    } catch {
      navigate("/auth/login");
    }
  };

  // Determine current section title and breadcrumbs
  const getHeaderInfo = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/users") {
      return { title: "User Management", subtitle: "Inspect, manage, and audit all registered accounts" };
    }
    if (path.startsWith("/admin/recover")) {
      return { title: "Trash & Recovery", subtitle: "Restore soft-deleted user accounts and clean data" };
    }
    if (path.startsWith("/admin/access")) {
      return { title: "Access Delegation", subtitle: "Grant or revoke administrative permissions" };
    }
    if (path.startsWith("/admin/staff")) {
      return { title: "Staff & Roles", subtitle: "Manage internal staff roles and administrator accounts" };
    }
    if (path.startsWith("/admin/data")) {
      return { title: "File Inspector", subtitle: "Admin inspection of stored files and directories" };
    }
    if (path.startsWith("/admin/settings")) {
      return { title: "Security & Credentials", subtitle: "Manage temporary access keys and admin authentication" };
    }
    return { title: "Admin Portal", subtitle: "Storely Administration Suite" };
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans">
      <SEO
        title={`${title} - Storely Admin`}
        description="Storely Administration Portal"
        noIndex={true}
      />

      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#0B0F17] text-white shadow-2xl transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex h-[70px] items-center justify-between border-b border-white/[0.08] px-5">
          <Link
            to="/admin"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20">
              <ShieldCheck size={22} className="text-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">
                  Storely
                </span>
                <span className="rounded-md bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-blue-400">
                  Admin
                </span>
              </div>
              <p className="text-[10px] font-medium tracking-wider text-slate-400">
                Management Console
              </p>
            </div>
          </Link>

          <button
            onClick={() => setOpen(false)}
            type="button"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Switch to User Drive */}
        <div className="px-3 pt-4 pb-2">
          <Link
            to="/dashboard"
            className="group flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-slate-300 transition-all hover:border-blue-500/40 hover:bg-blue-600/10 hover:text-white"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                <Cloud size={13} />
              </div>
              <span>Open My Drive</span>
            </div>
            <ExternalLink size={13} className="text-slate-500 group-hover:text-blue-400 transition" />
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {/* Main Management */}
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Overview & Data
            </p>

            <nav className="space-y-1">
              <NavLink
                to="/admin"
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) => `
                  group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Users
                      size={17}
                      className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}
                    />
                    <span>Users Directory</span>
                    {isActive && (
                      <ChevronRight size={14} className="ml-auto text-blue-200" />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/admin/recover"
                onClick={() => setOpen(false)}
                className={({ isActive }) => `
                  group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <RotateCcw
                        size={17}
                        className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}
                      />
                      <span>Trash & Recovery</span>
                    </div>

                    {deletedUsers.length > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? "bg-white text-blue-600"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {deletedUsers.length}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </nav>
          </div>

          {/* Owner-Level Administration */}
          <CanAccess role={["owner"]}>
            <div>
              <div className="mb-2 flex items-center justify-between px-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Governance
                </p>
                <span className="flex items-center gap-1 text-[9px] font-semibold text-amber-400">
                  <Sparkles size={10} /> Owner
                </span>
              </div>

              <nav className="space-y-1">
                <NavLink
                  to="/admin/access"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `
                    group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <UserCheck
                        size={17}
                        className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}
                      />
                      <span>Grant Access</span>
                      {isActive && (
                        <ChevronRight size={14} className="ml-auto text-blue-200" />
                      )}
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/admin/staff"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `
                    group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <UserCog
                        size={17}
                        className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}
                      />
                      <span>Staff & Roles</span>
                      {isActive && (
                        <ChevronRight size={14} className="ml-auto text-blue-200" />
                      )}
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/admin/settings"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `
                    group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Shield
                        size={17}
                        className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}
                      />
                      <span>Security & Keys</span>
                      {isActive && (
                        <ChevronRight size={14} className="ml-auto text-blue-200" />
                      )}
                    </>
                  )}
                </NavLink>
              </nav>
            </div>
          </CanAccess>
        </div>

        {/* Sidebar Footer: Admin Profile & Logout */}
        <div className="border-t border-white/[0.08] p-3 space-y-2">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 ring-2 ring-blue-500/30">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || "Admin"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-white uppercase">
                  {user?.name?.charAt(0) || "A"}
                </span>
              )}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-500" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-100">
                {user?.name || "Administrator"}
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-block rounded-xs px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                    user?.role === "owner"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {user?.role || "Admin"}
                </span>
                <span className="truncate text-[10px] text-slate-500">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            <LogOut size={14} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* ================= RIGHT SIDE VIEW ================= */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Glassmorphic Top Header */}
        <header className="sticky top-0 z-30 flex h-[70px] shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          {/* Left Title / Breadcrumbs */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            >
              <Menu size={19} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                  {title}
                </h1>
                <span className="hidden sm:inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  Console
                </span>
              </div>
              <p className="hidden text-xs text-slate-500 sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Cloud size={15} className="text-blue-600" />
              <span>Personal Drive</span>
            </Link>

            <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50/80 py-1 pl-1 pr-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-[11px] font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
              <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                {user?.name || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <main className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
