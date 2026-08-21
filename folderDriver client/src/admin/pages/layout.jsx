import { IoMdMenu, IoMdPerson, IoMdLogOut } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FiShield, FiUserX, FiUsers } from "react-icons/fi";
import { RiDashboardFill } from "react-icons/ri";
import { HiOutlineX, HiOutlineChevronRight } from "react-icons/hi";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  UserRoundKey,
} from "lucide-react";
import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import { useGetProfileQuery } from "../../store/slices/AdminSlice";

export default function Layout() {
  const [open, setOpen] = useState(false);

  const { data: user, isLoading } = useGetProfileQuery();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          className="
            fixed inset-0 z-40
            bg-black/50
            backdrop-blur-[2px]
            lg:hidden
          "
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      {/* SIDEBAR */}
      <aside
        className={`
    fixed inset-y-0 left-0 z-50
    flex w-[250px] flex-col
    bg-[#111827] text-white
    shadow-2xl
    transition-transform duration-300 ease-out
    lg:static lg:translate-x-0
    ${open ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        {/* Brand */}
        <div className="flex h-[72px] items-center border-b border-white/[0.06] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <ShieldCheck size={19} strokeWidth={2.2} />
            </div>

            <div className="leading-none">
              <h2 className="text-[15px] font-semibold tracking-tight">
                Storely
              </h2>

              <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">
                Administration
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-gray-500 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <HiOutlineX size={19} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
            Workspace
          </p>

          <nav className="space-y-1">
            <NavLink
              to="/admin"
              onClick={() => setOpen(false)}
              className={({ isActive }) => `
          group relative flex items-center gap-3
          rounded-xl px-3 py-2.5
          text-[13px] font-medium
          transition-all duration-200
          ${
            isActive
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
              : "text-gray-400 hover:bg-white/[0.045] hover:text-gray-100"
          }
        `}
            >
              {({ isActive }) => (
                <>
                  <RiDashboardFill
                    size={18}
                    className={
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-gray-300"
                    }
                  />

                  <span>Users</span>

                  {isActive && (
                    <HiOutlineChevronRight
                      size={15}
                      className="ml-auto text-blue-100"
                    />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="recover"
              onClick={() => setOpen(false)}
              className={({ isActive }) => `
          group relative flex items-center gap-3
          rounded-xl px-3 py-2.5
          text-[13px] font-medium
          transition-all duration-200
          ${
            isActive
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
              : "text-gray-400 hover:bg-white/[0.045] hover:text-gray-100"
          }
        `}
            >
              {({ isActive }) => (
                <>
                  <FiUserX
                    size={18}
                    className={
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-gray-300"
                    }
                  />

                  <span>Recover</span>

                  {isActive && (
                    <HiOutlineChevronRight
                      size={15}
                      className="ml-auto text-blue-100"
                    />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="access"
              onClick={() => setOpen(false)}
              className={({ isActive }) => `
          group relative flex items-center gap-3
          rounded-xl px-3 py-2.5
          text-[13px] font-medium
          transition-all duration-200
          ${
            isActive
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
              : "text-gray-400 hover:bg-white/[0.045] hover:text-gray-100"
          }
        `}
            >
              {({ isActive }) => (
                <>
                  <MdOutlineManageAccounts
                    size={19}
                    className={
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-gray-300"
                    }
                  />

                  <span>user Acess</span>

                  {isActive && (
                    <HiOutlineChevronRight
                      size={15}
                      className="ml-auto text-blue-100"
                    />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="setting"
              onClick={() => setOpen(false)}
              className={({ isActive }) => `
          group relative flex items-center gap-3
          rounded-xl px-3 py-2.5
          text-[13px] font-medium
          transition-all duration-200
          ${
            isActive
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
              : "text-gray-400 hover:bg-white/[0.045] hover:text-gray-100"
          }
        `}
            >
              {({ isActive }) => (
                <>
                  <MdOutlineManageAccounts
                    size={19}
                    className={
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-gray-300"
                    }
                  />

                  <span>setting</span>

                  {isActive && (
                    <HiOutlineChevronRight
                      size={15}
                      className="ml-auto text-blue-100"
                    />
                  )}
                </>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="px-3 pb-4">
          {/* Admin profile */}
          <div className="mb-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || "Admin"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <IoMdPerson size={17} />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-gray-200">
                  {user?.name || "Administrator"}
                </p>

                <p className="mt-0.5 truncate text-[10px] text-gray-500">
                  {user?.email || "Admin account"}
                </p>
              </div>

              <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            className="
        group flex w-full items-center gap-3
        rounded-xl px-3 py-2.5
        text-[13px] font-medium text-gray-500
        transition-all duration-200
        hover:bg-red-500/10
        hover:text-red-400
      "
          >
            <IoMdLogOut
              size={19}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* ================= HEADER ================= */}
        <header
          className="
            flex h-[68px] shrink-0
            items-center justify-between
            border-b border-gray-200
            bg-white
            px-3
            sm:px-5
            lg:px-7
          "
        >
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="
                flex h-9 w-9
                shrink-0
                items-center justify-center
                rounded-lg
                border border-gray-200
                text-gray-600
                transition
                hover:bg-gray-50
                lg:hidden
              "
            >
              <IoMdMenu size={21} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <LayoutDashboard
                  size={18}
                  className="hidden text-blue-600 sm:block"
                />

                <h1 className="truncate text-base font-bold text-slate-800 sm:text-lg lg:text-xl">
                  Admin Dashboard
                </h1>
              </div>

              <p className="mt-0.5 truncate text-[11px] text-gray-500 sm:text-xs">
                Welcome back,{" "}
                <span className="font-medium text-gray-700">
                  {isLoading ? "..." : user?.name || "Administrator"}
                </span>
              </p>
            </div>
          </div>

          {/* Desktop profile */}
          <div
            className="
              hidden
              items-center
              gap-3
              rounded-xl
              border border-gray-200
              bg-gray-50
              px-3 py-2
              md:flex
            "
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-white">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || "Admin"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <IoMdPerson size={18} />
              )}
            </div>

            <div className="max-w-[150px]">
              <h3 className="truncate text-sm font-semibold text-slate-700">
                {user?.name || "Administrator"}
              </h3>

              <span className="text-[11px] capitalize text-gray-500">
                {user?.role || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* ================= MAIN ================= */}
        <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
          <div className="min-h-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
