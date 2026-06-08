// import { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import UserDirItem from "./UserDirItem";

// export default function AdminUserFileExplorer() {
//   const navigate = useNavigate();
//   const { userId } = useParams();
//   const [renameModal, setRenameModal] = useState(false);
//   const [newName, setNewName] = useState("");
//   const [DirId, setDirId] = useState("");
//   const [type, setType] = useState();
//   const [files, setFiles] = useState([]);
//   const [folders, setFolders] = useState([]);

//   const param = useParams();
//   const menuRef = useRef();
//   const BASE_URL = "http://localhost:4000";

//   useEffect(() => {
//     fetchUserFiles();
//   }, [param, newName, renameModal]);

//   const fetchUserFiles = async () => {
//     const { userId, dirId } = param;
//     try {
//       const url = dirId
//         ? `${BASE_URL}/users/${userId}/${dirId}`
//         : `${BASE_URL}/users/${userId}`;

//       const res = await fetch(url, { credentials: "include" });

//       if (!res.ok) {
//         console.error("Error fetching user files:", res.status);
//         return;
//       }

//       const { file, directory } = await res.json();
//       setFiles(file);
//       setFolders(directory);
//     } catch (err) {
//       console.error("Fetch failed:", err);
//     }
//   };

//   const deleteData = async (id, type) => {
//     const pathname = type ? "file" : "directory";
//     const res = await fetch(`${BASE_URL}/users/${userId}/${pathname}/${id}`, {
//       method: "DELETE",
//       credentials: "include",
//       headers: {
//         "content-type": "application/json",
//       },
//     });
//   };

//   const RenameData = async (NewdirName, DirId, type) => {
//     const pathname = type ? "file" : "directory";
//     const res = await fetch(
//       `${BASE_URL}/users/${userId}/${pathname}/${DirId}`,
//       {
//         method: "PATCH",
//         credentials: "include",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify({ NewdirName }),
//       }
//     );
//     return await res.json();
//   };

//   const handlerOpen = async (id, extension) => {
//     const path = extension ? "file" : "directory";
//     console.log(id);

//     const res = await fetch(`${BASE_URL}/users/${userId}/${path}/${id}`, {
//       credentials: "include",
//     });

//     if (path === "directory") {
//       navigate(`${id}`);
//     } else {
//       window.location.href = `${BASE_URL}/file/${id}`;
//     }
//   };

//   const combined = [...folders, ...files];

//   return (
//     <div className="max-w-[1200px] mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">User File Explorer</h1>
//       {combined.length === 0 ? (
//         <p>No files or directories found.</p>
//       ) : (
//         <UserDirItem
//           RenameData={RenameData}
//           deleteData={deleteData}
//           handlerOpen={handlerOpen}
//           setRenameModal={setRenameModal}
//           setDirId={setDirId}
//           setType={setType}
//           setNewName={setNewName}
//           data={combined}
//           DirId={DirId}
//           type={type}
//           newName={newName}
//           renameModal={renameModal}
//         />
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserDirItem from "./UserDirItem";

import {
  useGetUserFilesQuery,
  useDeleteUserDataMutation,
  useRenameUserDataMutation,
  useLazyOpenUserDataQuery,
} from "@/store/slices/AdminSlice";

export default function UserFileExplorer() {
  const navigate = useNavigate();
  const { userId, dirId } = useParams();

  const [renameModal, setRenameModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [DirId, setDirId] = useState("");
  const [type, setType] = useState();

  // ✅ Get files & folders
  const { data, isLoading, isError } = useGetUserFilesQuery({ userId, dirId });
  const files = data?.file || [];
  const folders = data?.directory || [];

  // ✅ Mutations
  const [deleteUserData] = useDeleteUserDataMutation();
  const [renameUserData] = useRenameUserDataMutation();
  const [triggerOpenUserData] = useLazyOpenUserDataQuery();

  const combined = [...folders, ...files];

  const handleDelete = (id, type) => {
    deleteUserData({ userId, id, type });
  };

  const handleRename = async (NewdirName, DirId, type) => {
    await renameUserData({ userId, DirId, type, NewdirName });
    setRenameModal(false);
  };

  const handlerOpen = async (id, extension) => {
    const { data } = await triggerOpenUserData({ userId, id, extension });
    if (!extension) {
      navigate(`${id}`); // directory
    } else {
      window.location.href = `http://localhost:4000/file/${id}`; // file
    }
  };

  if (isLoading) return <p>Loading files...</p>;
  if (isError)
    return <p className="text-red-500">Failed to load user files.</p>;

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User File Explorer</h1>
      {combined.length === 0 ? (
        <p>No files or directories found.</p>
      ) : (
        <UserDirItem
          RenameData={handleRename}
          deleteData={handleDelete}
          handlerOpen={handlerOpen}
          setRenameModal={setRenameModal}
          setDirId={setDirId}
          setType={setType}
          setNewName={setNewName}
          data={combined}
          DirId={DirId}
          type={type}
          newName={newName}
          renameModal={renameModal}
        />
      )}
    </div>
  );
}
