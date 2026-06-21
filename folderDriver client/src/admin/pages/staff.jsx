import {
  useGetProfileQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "@/store/slices/AdminSlice";
import { Toaster, toast } from "sonner";
import { FaUserCircle } from "react-icons/fa";

export default function Staff() {
  const { data: profile } = useGetProfileQuery();

  const {
    data: users = [],
    isLoading,
    isError,
  } = useGetUsersQuery(profile?.role);

  const [updateUserRole, { error }] = useUpdateUserRoleMutation();

  if (error?.status === 403) {
    toast.error(error.data.message);
  }

  if (isLoading)
    return (
      <div className="text-center py-10 text-gray-500">Loading users...</div>
    );

  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to fetch users
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Toaster richColors position="top-center" />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Staff Management</h1>
        <p className="text-gray-500">Manage roles and permissions</p>
      </div>

      {/* Users */}
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-5 border-b last:border-none hover:bg-gray-50 transition"
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaUserCircle size={50} className="text-slate-500" />

                <div
                  className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${
                    user.isLoggedIn ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">{user.name}</h3>

                <p className="text-sm text-gray-500">{user.email}</p>

                <div className="mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "owner"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                    }
                    `}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div>
              <select
                className="border rounded-xl px-4 py-2 outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500"
                defaultValue={user.role}
                onChange={(e) =>
                  updateUserRole({
                    userId: user.id,
                    newRole: e.target.value,
                  })
                }
              >
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
