import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FiArrowLeft,
  FiSearch,
  FiShield,
  FiUser,
  FiCheck,
} from "react-icons/fi";

import {
  useGetUsersQuery,
  useGetProfileQuery,
  useUpdateUserRoleMutation,
} from "../../store/slices/AdminSlice";

export default function GrantAdminAccess() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("admin");

  const { data: profile } = useGetProfileQuery();

  const {
    data: users = [],
    isLoading,
    isError,
  } = useGetUsersQuery(profile?.role, {
    skip: !profile?.role,
  });

  const [updateUserRole, { isLoading: updating }] = useUpdateUserRoleMutation();

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value)
    );
  });

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setRole(user.role === "admin" ? "admin" : "user");
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    try {
      await updateUserRole({
        userId: selectedUser.id,
        newRole: role,
      }).unwrap();

      toast.success(
        role === "admin"
          ? `${selectedUser.name} is now an admin`
          : "Admin access removed",
      );

      setSelectedUser(null);
      setSearch("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update user access");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-700"
        >
          <FiArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <FiShield className="text-blue-600" size={21} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Access</h1>

            <p className="mt-1 text-sm text-gray-500">
              Grant or remove admin access for users.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleGrantAccess}
        className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
      >
        {/* Search */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Select user
          </label>

          <div className="relative">
            <FiSearch
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedUser(null);
              }}
              placeholder="Search by name or email..."
              className="
                w-full rounded-xl border border-gray-200
                bg-white py-2.5 pl-10 pr-4
                text-sm text-gray-700
                outline-none transition
                placeholder:text-gray-400
                focus:border-blue-400
                focus:ring-2 focus:ring-blue-100
              "
            />
          </div>
        </div>

        {/* User results */}
        {search && !selectedUser && (
          <div className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white">
            {isLoading ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                Loading users...
              </div>
            ) : isError ? (
              <div className="px-4 py-6 text-center text-sm text-red-500">
                Failed to load users.
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                No users found.
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  type="button"
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="
                    flex w-full items-center gap-3
                    border-b border-gray-100
                    px-4 py-3 text-left
                    transition last:border-0
                    hover:bg-gray-50
                  "
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiUser className="text-gray-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {user.name || "Unknown user"}
                    </p>

                    <p className="truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                      user.role === "admin"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {user.role}
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        {/* Selected user */}
        {selectedUser && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                {selectedUser.picture ? (
                  <img
                    src={selectedUser.picture}
                    alt={selectedUser.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser className="text-gray-400" size={20} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {selectedUser.name || "Unknown user"}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {selectedUser.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {/* Access level */}
        {selectedUser && (
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Access level
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="
                w-full rounded-xl border border-gray-200
                bg-white px-3 py-2.5
                text-sm text-gray-700
                outline-none
                focus:border-blue-400
                focus:ring-2 focus:ring-blue-100
              "
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        {/* Warning */}
        {selectedUser && role === "admin" && (
          <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4">
            <div className="flex gap-3">
              <FiShield className="mt-0.5 shrink-0 text-amber-600" size={18} />

              <div>
                <p className="text-sm font-medium text-amber-800">
                  Admin access
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  This user will be able to enter the admin panel and access
                  administrative features allowed for the admin role.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={!selectedUser || updating}
            className="
              inline-flex items-center gap-2
              rounded-xl bg-blue-600
              px-5 py-2.5
              text-sm font-medium text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <FiCheck size={16} />

            {updating
              ? "Updating..."
              : role === "admin"
                ? "Grant Admin Access"
                : "Update Access"}
          </button>
        </div>
      </form>
    </div>
  );
}
