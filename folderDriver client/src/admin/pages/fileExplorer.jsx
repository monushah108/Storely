import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useGetUserFilesQuery,
  useDeleteUserDataMutation,
  useRenameUserDataMutation,
  useLazyOpenUserDataQuery,
} from "@/store/slices/AdminSlice";

import { ArrowLeft, FolderOpen, Search, X } from "lucide-react";

import DirItem from "../components/DirItem";

export default function FileExplorer() {
  const navigate = useNavigate();
  const { userId, dirId } = useParams();

  const [renameModal, setRenameModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [DirId, setDirId] = useState("");
  const [type, setType] = useState();
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGetUserFilesQuery({
    userId,
    dirId,
  });

  const files = data?.file || [];
  const folders = data?.directory || [];
  const [deleteUserData, { isLoading: deleting }] = useDeleteUserDataMutation();

  const [deletingId, setDeletingId] = useState(null);
  const [renameUserData] = useRenameUserDataMutation();
  const [triggerOpenUserData] = useLazyOpenUserDataQuery();

  const combined = [...folders, ...files].filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id, type) => {
    try {
      setDeletingId(id);

      await deleteUserData({
        userId,
        id,
        type,
      }).unwrap();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRename = async () => {
    if (!newName.trim()) return;

    try {
      await renameUserData({
        userId,
        DirId,
        type,
        newName: newName.trim(),
      }).unwrap();

      setRenameModal(false);
      setNewName("");
    } catch (error) {
      console.error("Rename failed:", error);
    }
  };

  const handlerOpen = async (id, extension) => {
    try {
      const result = await triggerOpenUserData({
        userId,
        id,
        extension,
      }).unwrap();

      if (!extension) {
        navigate(`${id}`);
      } else {
        navigate(`/file/${id}`, {
          state: result,
        });
      }
    } catch (error) {
      console.error("Failed to open item:", error);
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  // Loading
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="mb-5 h-11 w-full animate-pulse rounded-lg bg-gray-100" />

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-14 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">
            File Explorer
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Browse this user's files and folders.
          </p>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">Failed to load user files.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            File Explorer
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Browse this user's files and folders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files and folders..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />

        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* Small information row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FolderOpen size={16} />

          <span>
            {combined.length} {combined.length === 1 ? "item" : "items"}
          </span>
        </div>

        {search && (
          <span className="text-xs text-gray-400">Search results</span>
        )}
      </div>

      {/* Content */}
      {combined.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
          <FolderOpen size={42} className="mx-auto text-gray-300" />

          <h3 className="mt-4 text-sm font-medium text-gray-700">
            {search ? "No matching items" : "Folder is empty"}
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            {search
              ? "Try searching with a different name."
              : "There are no files or folders here."}
          </p>

          {search && (
            <button
              onClick={clearSearch}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white">
          <DirItem
            handleRename={handleRename}
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
            deletingId={deletingId}
          />
        </div>
      )}
    </div>
  );
}
