import React from "react";
import { useNavigate } from "react-router-dom";
import CanAccess from "./CanAccess";
import { FiUsers, FiMail, FiLogOut, FiTrash2, FiFolder } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

export default function UserTable({
  users,
  loggingOut,
  handleLogout,
  openDeleteModal,
}) {
  const navigate = useNavigate();

  return (
    <>
      {users.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
          <FiUsers size={30} className="mx-auto text-gray-300" />

          <h2 className="mt-4 font-semibold text-slate-700">No users found</h2>

          <p className="mt-1 text-sm text-gray-400">
            There are no registered users to display.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    User
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Email
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Session
                  </th>

                  <CanAccess role={["owner", "admin"]}>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Actions
                    </th>
                  </CanAccess>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                          {user.picture ? (
                            <img
                              src={user.picture}
                              alt={user.name || "User"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FaUserCircle size={36} className="text-gray-300" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {user.name || "Unknown user"}
                          </p>

                          <p className="text-xs capitalize text-gray-400">
                            {user.role || "user"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="max-w-[260px] px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiMail size={14} className="shrink-0 text-gray-400" />

                        <span className="truncate text-sm text-gray-500">
                          {user.email}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {user.isLoggedIn ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          Offline
                        </span>
                      )}
                    </td>

                    {/* Session */}
                    <td className="px-6 py-4">
                      <button
                        disabled={!user.isLoggedIn || loggingOut}
                        onClick={() => handleLogout(user)}
                        className="
                          inline-flex items-center gap-2
                          rounded-lg border border-gray-200
                          px-3 py-1.5
                          text-xs font-medium text-gray-600
                          transition
                          hover:border-red-200
                          hover:bg-red-50
                          hover:text-red-600
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                      >
                        <FiLogOut size={14} />
                        Logout
                      </button>
                    </td>

                    {/* Actions */}
                    <CanAccess role={["owner", "admin"]}>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/users/data/${user.id}`)}
                            title="Access files"
                            className="
                              rounded-lg border border-gray-200
                              p-2 text-gray-500
                              transition
                              hover:border-blue-200
                              hover:bg-blue-50
                              hover:text-blue-600
                            "
                          >
                            <FiFolder size={16} />
                          </button>

                          <button
                            onClick={() => openDeleteModal(user)}
                            title="Delete user"
                            className="
                              rounded-lg border border-gray-200
                              p-2 text-gray-500
                              transition
                              hover:border-red-200
                              hover:bg-red-50
                              hover:text-red-600
                            "
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </CanAccess>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-gray-100 md:hidden">
            {users.map((user) => (
              <div key={user.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaUserCircle size={40} className="text-gray-300" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {user.name || "Unknown user"}
                    </p>

                    <p className="truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      user.isLoggedIn ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      user.isLoggedIn ? "text-emerald-600" : "text-gray-400"
                    }`}
                  >
                    {user.isLoggedIn ? "Online" : "Offline"}
                  </span>

                  <div className="flex gap-2">
                    <button
                      disabled={!user.isLoggedIn || loggingOut}
                      onClick={() => handleLogout(user)}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 disabled:opacity-40"
                    >
                      <FiLogOut size={14} />
                      Logout
                    </button>

                    <CanAccess role={["owner", "admin"]}>
                      <button
                        onClick={() => navigate(`/users/data/${user.id}`)}
                        className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600"
                      >
                        <FiFolder size={15} />
                      </button>

                      <button
                        onClick={() => openDeleteModal(user)}
                        className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-500"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </CanAccess>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
