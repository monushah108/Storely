import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CanAccess from "../components/CanAccess.jsx";
import Modal from "../components/Modle.jsx";

import {
  useGetUsersQuery,
  useGetProfileQuery,
  useLogoutUserMutation,
  useSoftDeleteUserMutation,
  useHardDeleteUserMutation,
} from "@/store/slices/AdminSlice";

import {
  FiUsers,
  FiMail,
  FiLogOut,
  FiTrash2,
  FiFolder,
  FiAlertTriangle,
} from "react-icons/fi";

import { FaUserCircle } from "react-icons/fa";

export default function Users() {
  const navigate = useNavigate();

  const [portal, setPortal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hardDeleteConfirm, setHardDeleteConfirm] = useState(false);

  const { data: profile } = useGetProfileQuery();

  const {
    data: users = [],
    isLoading,
    isError,
  } = useGetUsersQuery(profile?.role);

  const [logoutUser, { isLoading: loggingOut }] = useLogoutUserMutation();

  const [softDeleteUser, { isLoading: softDeleting }] =
    useSoftDeleteUserMutation();

  const [hardDeleteUser, { isLoading: hardDeleting }] =
    useHardDeleteUserMutation();

  const isDeleting = softDeleting || hardDeleting;

  const handleLogout = async (user) => {
    if (!window.confirm(`Log out ${user.email}?`)) return;

    try {
      await logoutUser(user.id).unwrap();
    } catch (error) {
      console.error(error);
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
      } else {
        await softDeleteUser(selectedUser.id).unwrap();
      }

      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-red-500">Failed to load users.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FiUsers className="text-blue-600" />

            <span className="text-sm font-medium text-blue-600">Users</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-slate-800">
            User Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage registered users and their access.
          </p>
        </div>

        <div className="text-sm text-gray-400">
          {users.length} {users.length === 1 ? "user" : "users"}
        </div>
      </div>

      {/* Empty state */}
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
          {/* Desktop table */}
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
                              alt={user.name}
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

                          <p className="text-xs text-gray-400">
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

                    {/* Logout */}
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
                            onClick={() => navigate(`data/${user.id}`)}
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
                        alt={user.name}
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

                  {user.isLoggedIn ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {user.isLoggedIn ? (
                    <span className="text-xs font-medium text-emerald-600">
                      Online
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Offline</span>
                  )}

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
                        onClick={() => navigate(`data/${user.id}`)}
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

      {/* Delete modal */}
      {portal && selectedUser && (
        <Modal isOpen={portal} onClose={closeModal}>
          <div className="w-full max-w-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <FiAlertTriangle className="text-red-500" size={20} />
            </div>

            <h2 className="mt-4 text-xl font-semibold text-slate-800">
              Delete user
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700">
                {selectedUser.name}
              </span>
              ?
            </p>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <FaUserCircle size={38} className="text-gray-300" />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-700">
                  {selectedUser.name}
                </p>

                <p className="truncate text-xs text-gray-400">
                  {selectedUser.email}
                </p>
              </div>
            </div>

            <label
              className={`mt-4 flex cursor-pointer gap-3 rounded-xl border p-3 transition ${
                hardDeleteConfirm
                  ? "border-red-200 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={hardDeleteConfirm}
                onChange={(e) => setHardDeleteConfirm(e.target.checked)}
                className="mt-1 accent-red-600"
              />

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Permanently delete
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  This action cannot be undone.
                </p>
              </div>
            </label>

            <div className="mt-5 flex gap-2">
              <button
                onClick={closeModal}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                disabled={isDeleting}
                onClick={handleUserDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting
                  ? "Deleting..."
                  : hardDeleteConfirm
                    ? "Delete Permanently"
                    : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
