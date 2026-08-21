import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CanAccess from "../components/CanAccess.jsx";
import Modal from "../../components/models/Modle.jsx";

import {
  useGetUsersQuery,
  useGetProfileQuery,
  useLogoutUserMutation,
  useSoftDeleteUserMutation,
  useHardDeleteUserMutation,
} from "@/store/slices/AdminSlice";

import { FiUsers, FiAlertTriangle } from "react-icons/fi";

import UserTable from "../components/userTable.jsx";

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
      <UserTable users={users} />

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
