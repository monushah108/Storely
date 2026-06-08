// import { useEffect, useState } from "react";

// export default function RecoverUserPage() {
//   const [deletedUsers, setDeletedUsers] = useState([]);
//   const BASE_URL = "http://localhost:4000";

//   useEffect(() => {
//     fetchDeletedUsers();
//   }, []);

//   const fetchDeletedUsers = async () => {
//     const res = await fetch(`${BASE_URL}/users/deleted`, {
//       credentials: "include",
//     });
//     if (res.ok) {
//       const data = await res.json();
//       setDeletedUsers(data);
//     } else {
//       console.error("Error fetching deleted users:", res.status);
//     }
//   };

//   const recoverUser = async (userId) => {
//     const res = await fetch(`${BASE_URL}/users/${userId}/recover`, {
//       method: "POST",
//       credentials: "include",
//     });
//     if (res.ok) {
//       fetchDeletedUsers();
//     } else {
//       console.error("Error recovering user:", res.status);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Recover Deleted Users</h1>
//       <p className="mb-6 text-gray-600">
//         Here you can view and recover users who have been soft-deleted.
//       </p>
//       <div className="max-w-[900px]  mt-10 font-sans">
//         {deletedUsers.length === 0 ? (
//           <p className="font-medium ml-4">No deleted users found.</p>
//         ) : (
//           <table className="w-full border-collapse [&_th]:border [&_th]:border-gray-300 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:bg-gray-100 [&_td]:border [&_td]:border-gray-300 [&_td]:px-3 [&_td]:py-2">
//             <thead>
//               <tr>
//                 <th className="w-3">No.</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Role</th>
//                 <th></th>
//               </tr>
//             </thead>
//             {
//               <tbody>
//                 {deletedUsers.map((user, index) => (
//                   <tr key={user.id}>
//                     <td>{index + 1}</td>
//                     <td>{user.name}</td>
//                     <td>{user.email}</td>
//                     <td>{user.role}</td>
//                     <td>
//                       <button
//                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                         onClick={() => recoverUser(user.id)}
//                       >
//                         Recover
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             }
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }
import {
  useGetDeletedUsersQuery,
  useRecoverUserMutation,
} from "@/store/slices/AdminSlice";

export default function RecoverUserPage() {
  const {
    data: deletedUsers = [],
    isLoading,
    isError,
  } = useGetDeletedUsersQuery();
  const [recoverUser, { isLoading: recovering }] = useRecoverUserMutation();

  if (isLoading) return <p>Loading deleted users...</p>;
  if (isError)
    return <p className="text-red-500">Failed to fetch deleted users.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Recover Deleted Users</h1>
      {deletedUsers.length === 0 ? (
        <p>No deleted users found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {deletedUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => recoverUser(user.id)}
                    disabled={recovering}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {recovering ? "Recovering..." : "Recover"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
