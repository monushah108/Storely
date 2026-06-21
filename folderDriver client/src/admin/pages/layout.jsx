import { IoMdMenu, IoMdPerson, IoMdLogOut } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FiUserX, FiUsers } from "react-icons/fi";
import { RiDashboardFill } from "react-icons/ri";
import { HiOutlineX } from "react-icons/hi";
import { Link, Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import { useGetProfileQuery } from "@/store/slices/AdminSlice";

export default function Layout() {
  const [open, setOpen] = useState(true);
  const { data: user } = useGetProfileQuery();

  return (
    <div
      className="h-screen grid bg-gray-100"
      style={{
        gridTemplateColumns: open ? "260px 1fr" : "0 1fr",
        gridTemplateRows: "70px 1fr",
        gridTemplateAreas: `
          "sidebar header"
          "sidebar main"
        `,
      }}
    >
      {/* Sidebar */}
      {open && (
        <aside
          style={{ gridArea: "sidebar" }}
          className="bg-slate-900 text-white p-5 flex flex-col shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
            <div>
              <h2 className="font-bold text-lg">Admin Panel</h2>
              <p className="text-sm text-slate-400">Control Center</p>
            </div>

            <HiOutlineX
              size={22}
              className="cursor-pointer text-slate-400 hover:text-red-400"
              onClick={() => setOpen(false)}
            />
          </div>

          <nav className="flex flex-col gap-2">
            <NavLink
              to="/dashboard"
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
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive ? "bg-blue-600" : "hover:bg-slate-800"
                }`
              }
            >
              <FiUsers size={20} />
              Manage Users
            </NavLink>

            <NavLink
              to="recover"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive ? "bg-blue-600" : "hover:bg-slate-800"
                }`
              }
            >
              <FiUserX size={20} />
              Recover Users
            </NavLink>

            <NavLink
              to="staffes"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive ? "bg-blue-600" : "hover:bg-slate-800"
                }`
              }
            >
              <MdOutlineManageAccounts size={20} />
              Staff Management
            </NavLink>

            <NavLink
              to="/logout"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition mt-auto"
            >
              <IoMdLogOut size={20} />
              Logout
            </NavLink>
          </nav>
        </aside>
      )}

      {/* Header */}
      <header
        style={{ gridArea: "header" }}
        className="bg-white shadow-sm flex items-center justify-between px-6"
      >
        <div className="flex items-center gap-4">
          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <IoMdMenu size={24} />
            </button>
          )}

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
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

      {/* Main */}
      <main style={{ gridArea: "main" }} className="overflow-y-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
