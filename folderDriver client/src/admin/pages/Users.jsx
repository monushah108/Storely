import { useState } from "react";
import {
  useGetUsersQuery,
  useGetProfileQuery,
  useLogoutUserMutation,
  useSoftDeleteUserMutation,
  useHardDeleteUserMutation,
} from "@/store/slices/AdminSlice";

import {
  FiUsers,
  FiAlertTriangle,
  FiX,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import UserTable from "../components/userTable.jsx";
import UserDelete from "../components/module/userDelete.jsx";

export default function Users() {
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

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = async (user) => {
    if (!window.confirm(`Log out ${user.email}?`)) return;

    try {
      await logoutUser(user.id).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  // ========================================
  // OPEN DELETE MODAL
  // ========================================

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setHardDeleteConfirm(false);
    setPortal(true);
  };

  // ========================================
  // CLOSE DELETE MODAL
  // ========================================

  const closeModal = () => {
    if (isDeleting) return;

    setPortal(false);
    setSelectedUser(null);
    setHardDeleteConfirm(false);
  };

  // ========================================
  // DELETE USER
  // ========================================

  const handleUserDelete = async () => {
    if (!selectedUser || isDeleting) return;

    try {
      if (hardDeleteConfirm) {
        await hardDeleteUser(selectedUser.id).unwrap();
      } else {
        await softDeleteUser(selectedUser.id).unwrap();
      }

      closeModal();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading users...</p>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (isError) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-red-500">Failed to load users.</p>
      </div>
    );
  }

  return (
    <>
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

        {/* Users */}
        <UserTable
          loggingOut={loggingOut}
          users={users}
          openDeleteModal={openDeleteModal}
          handleLogout={handleLogout}
        />
      </div>

      {/* ========================================
          DELETE MODAL
      ======================================== */}

      <UserDelete
        selectedUser={selectedUser}
        portal={portal}
        closeModal={closeModal}
        isDeleting={isDeleting}
        hardDeleteConfirm={hardDeleteConfirm}
        setHardDeleteConfirm={setHardDeleteConfirm}
        handleUserDelete={handleUserDelete}
      />
    </>
  );
}
