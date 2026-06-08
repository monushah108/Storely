import { IoMdMenu, IoMdPerson, IoMdLogOut } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FiUserX, FiUsers } from "react-icons/fi";
import { GiCancel } from "react-icons/gi";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useGetProfileQuery } from "@/store/slices/AdminSlice";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { data: user, isLoading, isError } = useGetProfileQuery();

  return (
    <div
      className="h-screen grid"
      style={{
        gridTemplateColumns: open ? "250px 1fr" : "0px 1fr",
        gridTemplateRows: "60px 1fr",
        gridTemplateAreas: `
          "sidebar header"
          "sidebar main"
        `,
      }}
    >
      {/* Sidebar */}
      {open && (
        <aside
          className="bg-white p-6 flex flex-col shadow-md"
          style={{ gridArea: "sidebar" }}
        >
          <div className="flex items-center justify-between mb-6  pb-4 ">
            <h2 className="text-lg font-bold text-gray-800 shadow-ms border-b border-gray-300 pb-2">
              Admin Panel Control
            </h2>
            <GiCancel
              className="cursor-pointer text-gray-600 hover:text-red-500"
              onClick={() => setOpen(false)}
            />
          </div>

          <nav className="flex flex-col gap-4 text-gray-700 text-md [&>a]:cursor-pointer [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:text-gray-700 [&>a]:font-medium [&>a]:hover:text-gray-900">
            <Link to="/users">
              <FiUsers className="text-gray-600 align-middle " />
              <p>manage users</p>
            </Link>
            <Link to="recover">
              <FiUserX className="text-gray-600 align-middle " />
              <p>recover users</p>
            </Link>

            <Link to="staffes">
              <MdOutlineManageAccounts className="text-gray-600 align-middle " />
              <p>staff management</p>
            </Link>
            <Link to="/logout" className=" !text-red-600 hover:!text-red-700">
              <IoMdLogOut size={22} />
              <p>Logout</p>
            </Link>
          </nav>
        </aside>
      )}

      {/* Header */}
      <header
        className="flex items-center justify-between bg-white shadow-md px-4 py-3"
        style={{ gridArea: "header" }}
      >
        <div className="flex items-center gap-3">
          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <IoMdMenu size={24} className="text-gray-700" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back, {user?.name} 👋
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 border rounded-full bg-gray-50">
            <IoMdPerson size={22} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {user?.name}
            </span>
            <span
              className={`text-xs ${
                user?.role === "admin"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              } px-2 py-0.5 rounded-full`}
            >
              {user?.role}
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        className="bg-gray-50 p-6 overflow-y-auto"
        style={{ gridArea: "main" }}
      >
        <Outlet />
      </main>
    </div>
  );
}
