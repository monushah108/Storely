import {
  useGetProfileQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
} from "@/store/slices/AdminSlice";
import { toast, Toaster } from "sonner";

export default function StaffManagement() {
  const { data: profile } = useGetProfileQuery();
  const {
    data: users = [],
    isLoading,
    isError,
  } = useGetUsersQuery(profile?.role);

  const [updateUserRole, { isLoading: updating, error }] =
    useUpdateUserRoleMutation();

  if (error?.status == 403) {
    toast.error(error?.data.message);
  }

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p className="text-red-500">Failed to fetch users.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Staff Management</h2>
      <Toaster richColors position="top-center" />
      {users.map((user) => (
        <div
          key={user.id}
          className="flex justify-between p-4 bg-white shadow-md rounded-xl mb-4"
        >
          <div>
            <div className="font-semibold flex items-center  gap-0.5">
              <span>
                {user.name} ({user.role})
              </span>{" "}
              <p
                className={
                  user.isLoggedIn ? "bg-red-500 rounded-full p-1 h-2 w-2" : ""
                }
              ></p>
            </div>
            <p>{user.email}</p>
          </div>
          <div>
            <select
              defaultValue={user.role}
              onChange={(e) =>
                updateUserRole({ userId: user.id, newRole: e.target.value })
              }
            >
              <option value="user">user</option>
              <option value="owner">owner</option>
              <option value="admin">admin</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
