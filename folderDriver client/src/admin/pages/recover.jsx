import {
  useGetDeletedUsersQuery,
  useRecoverUserMutation,
} from "@/store/slices/AdminSlice";
import { FaUserCircle, FaUndo } from "react-icons/fa";

export default function Recover() {
  const {
    data: deletedUsers = [],
    isLoading,
    isError,
  } = useGetDeletedUsersQuery();

  const [recoverUser, { isLoading: recovering }] = useRecoverUserMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading deleted users...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to fetch deleted users.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Recover Users</h1>

        <p className="text-gray-500 mt-1">
          Restore deleted accounts back into the system.
        </p>
      </div>

      {/* Empty State */}
      {deletedUsers.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-700">
            No Deleted Users
          </h2>

          <p className="text-gray-500 mt-2">
            There are currently no users to recover.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[80px_1fr_200px_150px_150px] px-6 py-4 bg-slate-50 border-b font-semibold text-slate-600">
            <div>#</div>
            <div>User</div>
            <div>Email</div>
            <div>Role</div>
            <div>Action</div>
          </div>

          {/* Rows */}
          {deletedUsers.map((user, index) => (
            <div
              key={user.id}
              className="grid grid-cols-[80px_1fr_200px_150px_150px] px-6 py-5 border-b last:border-none items-center hover:bg-gray-50 transition"
            >
              <div>{index + 1}</div>

              <div className="flex items-center gap-3">
                <FaUserCircle size={40} className="text-slate-400" />

                <div>
                  <h3 className="font-semibold text-slate-800">{user.name}</h3>
                </div>
              </div>

              <div className="text-gray-500">{user.email}</div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                  ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : user.role === "owner"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <div>
                <button
                  disabled={recovering}
                  onClick={() => recoverUser(user.id)}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  <FaUndo />

                  {recovering ? "Recovering..." : "Recover"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
