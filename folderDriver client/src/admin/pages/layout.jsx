import { IoMdMenu, IoMdPerson, IoMdLogOut } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FiUserX, FiUsers } from "react-icons/fi";
import { RiDashboardFill } from "react-icons/ri";
import { HiOutlineX } from "react-icons/hi";
import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import { useGetProfileQuery } from "@/store/slices/AdminSlice";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { data: user } = useGetProfileQuery();

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* OVERLAY (mobile + tablet) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static z-50 top-0 left-0 h-full w-[260px]
          bg-slate-900 text-white p-5 flex flex-col shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
          <div>
            <h2 className="font-bold text-lg">Admin Panel</h2>
            <p className="text-sm text-slate-400">Control Center</p>
          </div>

          <HiOutlineX
            size={22}
            className="cursor-pointer text-slate-400 hover:text-red-400 lg:hidden"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? "bg-blue-600" : "hover:bg-slate-800"
              }`
            }
          >
            <RiDashboardFill size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="users"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? "bg-blue-600" : "hover:bg-slate-800"
              }`
            }
          >
            <FiUsers size={20} />
            Users
          </NavLink>

          <NavLink
            to="recover"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? "bg-blue-600" : "hover:bg-slate-800"
              }`
            }
          >
            <FiUserX size={20} />
            Recover
          </NavLink>

          <NavLink
            to="staffes"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive ? "bg-blue-600" : "hover:bg-slate-800"
              }`
            }
          >
            <MdOutlineManageAccounts size={20} />
            Staff
          </NavLink>

          <NavLink
            to="/logout"
            className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition"
          >
            <IoMdLogOut size={20} />
            Logout
          </NavLink>
        </nav>
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex flex-col flex-1 w-full">
        {/* HEADER */}
        <header className="h-[70px] bg-white shadow-sm flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            {/* Menu button (mobile + tablet) */}
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <IoMdMenu size={24} />
            </button>

            <div>
              <h1 className="md:text-lg text-sm lg:text-2xl font-bold text-slate-800">
                Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>

          {/* User */}
          <div className="md:flex items-center gap-3 bg-gray-50 px-3 sm:px-4 py-2 rounded-xl hidden">
            <div className="size-9 sm:size-10   rounded-full bg-blue-600 text-white flex items-center justify-center">
              <IoMdPerson size={20} />
            </div>

            <div>
              <h3 className="font-medium text-slate-700">{user?.name}</h3>
              <span className="text-xs text-gray-500 capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
