import { useState } from "react";
import { FaUndo } from "react-icons/fa";
import {
  useGetDeletedUsersQuery,
  useRecoverUserMutation,
} from "@/store/slices/AdminSlice";

export default function Recover() {
  const {
    data: deletedUsers = [],
    isLoading,
    isError,
  } = useGetDeletedUsersQuery();

  const [recoverUser] = useRecoverUserMutation();
  const [recoveringId, setRecoveringId] = useState(null);

  const handleRecover = async (userId) => {
    try {
      setRecoveringId(userId);

      await recoverUser(userId).unwrap();
    } catch (error) {
      console.error("Failed to recover user:", error);
    } finally {
      setRecoveringId(null);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <div className="h-7 w-44 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="space-y-4 p-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center justify-between"
              >
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-3 w-48 rounded bg-gray-100" />
                </div>

                <div className="h-8 w-20 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="w-full">
        <h1 className="text-2xl font-semibold text-slate-800">Recover Users</h1>

        <p className="mt-1 text-sm text-gray-500">
          Restore deleted user accounts.
        </p>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-600">
            Failed to load deleted users.
          </p>

          <p className="mt-1 text-xs text-red-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Recover Users</h1>

        <p className="mt-1 text-sm text-gray-500">
          Restore deleted accounts back into the system.
        </p>
      </div>

      {/* Empty state */}
      {deletedUsers.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-gray-600">No deleted users</p>

          <p className="mt-1 text-sm text-gray-400">
            There are currently no accounts available for recovery.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-left font-medium text-gray-500">
                    Name
                  </th>

                  <th className="px-5 py-3 text-left font-medium text-gray-500">
                    Email
                  </th>

                  <th className="px-5 py-3 text-left font-medium text-gray-500">
                    Role
                  </th>

                  <th className="px-5 py-3 text-right font-medium text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {deletedUsers.map((user) => {
                  const isRecovering = recoveringId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 last:border-0 transition hover:bg-gray-50"
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700">
                          {user.name || "Unknown"}
                        </p>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-gray-500">{user.email}</td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className="text-gray-500 capitalize">
                          {user.role || "user"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled={isRecovering}
                          onClick={() => handleRecover(user.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-green-200 px-3 py-1.5 text-xs font-medium text-green-600 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FaUndo
                            className={isRecovering ? "animate-spin" : ""}
                            size={12}
                          />

                          {isRecovering ? "Recovering..." : "Recover"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
