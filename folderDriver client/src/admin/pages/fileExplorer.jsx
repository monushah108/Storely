import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DirItem from "../components/DirItem";

import {
  useGetUserFilesQuery,
  useDeleteUserDataMutation,
  useRenameUserDataMutation,
  useLazyOpenUserDataQuery,
} from "@/store/slices/AdminSlice";

export default function FileExplorer() {
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
  const url = import.meta.env.CLIENT_URL;

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
      window.location.href = `/file/${id}`; // file
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
        <DirItem
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
