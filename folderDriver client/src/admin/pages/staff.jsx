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
  useUpdateUserRoleMutation,
} from "../../store/slices/AdminSlice.js";

import { toast } from "sonner";

export default function Staff() {
  const navigate = useNavigate();

  const [portal, setPortal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hardDeleteConfirm, setHardDeleteConfirm] = useState(false);

  const { data: profile } = useGetProfileQuery();

  const {
    data: users = [],
    isLoading,
    isError,
  } = useGetUsersQuery(profile?.role, {
    skip: !profile?.role,
  });
  const [logoutUser] = useLogoutUserMutation();
  const [softDeleteUser] = useSoftDeleteUserMutation();
  const [hardDeleteUser] = useHardDeleteUserMutation();

  const [updateUserRole, { isLoading: updatingRole }] =
    useUpdateUserRoleMutation();

  const handleLogout = async (user) => {
    if (!window.confirm(`Logout ${user.email}?`)) return;

    try {
      await logoutUser(user.id).unwrap();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({
        userId,
        newRole,
      }).unwrap();
    } catch (error) {
      toast.error("Failed to update role:", error);
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

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "owner":
        return "bg-blue-50 text-blue-700 border-blue-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        Loading users...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-sm text-red-500">
        Error loading users.
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Users</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage registered users and their permissions.
        </p>
      </div>

      {/* Users */}
      {users.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                    User
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                    Email
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                    Status
                  </th>

                  <CanAccess role={["owner", "admin"]}>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                      Role
                    </th>
                  </CanAccess>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70"
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name || "User"}
                            className="h-9 w-9 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}

                        <span className="text-sm font-medium text-slate-700">
                          {user.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">
                        {user.email}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            user.isLoggedIn ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />

                        <span
                          className={`text-sm ${
                            user.isLoggedIn ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {user.isLoggedIn ? "Logged in" : "Logged out"}
                        </span>
                      </div>
                    </td>

                    {/* Role */}
                    <CanAccess role={["owner", "admin"]}>
                      <td className="px-5 py-4">
                        <div className="relative inline-block">
                          <select
                            value={user.role}
                            disabled={updatingRole}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className={`
        appearance-none
        cursor-pointer
        rounded-full
        border
        py-1.5
        pl-3
        pr-8
        text-xs
        font-medium
        capitalize
        outline-none
        transition-all
        focus:ring-2
        focus:ring-blue-500/20
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${getRoleStyle(user.role)}
      `}
                          >
                            <option value="user">User</option>
                            <option value="owner">Owner</option>
                            <option value="admin">Admin</option>
                          </select>

                          {/* Chevron */}
                          <svg
                            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-current opacity-60"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </td>
                    </CanAccess>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {/* Logout */}
                        <button
                          disabled={!user.isLoggedIn}
                          onClick={() => handleLogout(user)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Logout
                        </button>

                        {/* Admin / Owner actions */}
                        <CanAccess role={["owner", "admin"]}>
                          <>
                            <button
                              onClick={() => navigate(`/users/data/${user.id}`)}
                              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
                            >
                              Files
                            </button>

                            <button
                              onClick={() => openDeleteModal(user)}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </>
                        </CanAccess>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {portal && selectedUser && (
        <Modal isOpen={portal} onClose={closeModal}>
          <div className="w-full max-w-md">
            <h2 className="text-lg font-semibold text-slate-800">
              Delete user
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700">
                {selectedUser.name}
              </span>
              ?
            </p>

            <label className="mt-5 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={hardDeleteConfirm}
                onChange={(e) => setHardDeleteConfirm(e.target.checked)}
                className="h-4 w-4 rounded"
              />

              <span>Permanently delete this user</span>
            </label>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUserDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                {hardDeleteConfirm ? "Permanently Delete" : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
