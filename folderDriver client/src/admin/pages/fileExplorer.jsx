import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  FolderOpen,
  Search,
  X,
  FileText,
  Folder,
  Trash2,
  Edit2,
  ExternalLink,
  ChevronRight,
  HardDrive,
  RefreshCw,
} from "lucide-react";

import {
  useGetUserFilesQuery,
  useDeleteUserDataMutation,
  useRenameUserDataMutation,
  useLazyOpenUserDataQuery,
} from "../../store/slices/AdminSlice";

import DirItem from "../components/DirItem";

export default function FileExplorer() {
  const navigate = useNavigate();
  const { userId, dirId } = useParams();

  const [renameModal, setRenameModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [targetItem, setTargetItem] = useState(null);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch, isFetching } = useGetUserFilesQuery({
    userId,
    dirId,
  });

  const files = data?.file || [];
  const folders = data?.directory || [];
  const [deleteUserData, { isLoading: deleting }] = useDeleteUserDataMutation();
  const [deletingId, setDeletingId] = useState(null);
  const [renameUserData, { isLoading: renaming }] = useRenameUserDataMutation();
  const [triggerOpenUserData] = useLazyOpenUserDataQuery();

  const combined = [...folders, ...files].filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Delete this ${type ? "file" : "directory"} permanently?`)) return;

    try {
      setDeletingId(id);
      await deleteUserData({
        userId,
        id,
        type,
      }).unwrap();
      toast.success("Item deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  };

  const openRenameModal = (item, isFile) => {
    setTargetItem({ id: item._id || item.id, type: isFile });
    setNewName(item.name || "");
    setRenameModal(true);
  };

  const handleRename = async () => {
    if (!newName.trim() || !targetItem) return;

    try {
      await renameUserData({
        userId,
        DirId: targetItem.id,
        type: targetItem.type,
        newName: newName.trim(),
      }).unwrap();

      toast.success("Item renamed successfully");
      setRenameModal(false);
      setNewName("");
      setTargetItem(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to rename item");
    }
  };

  const handleOpenItem = async (id, extension) => {
    try {
      const result = await triggerOpenUserData({
        userId,
        id,
        extension,
      }).unwrap();

      if (!extension) {
        navigate(`/admin/data/${userId}/${id}`);
      } else {
        navigate(`/file/${id}`, {
          state: result,
        });
      }
    } catch (error) {
      toast.error("Failed to open item preview");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="h-20 animate-pulse rounded-2xl bg-white dark:bg-slate-900" />
        <div className="h-64 animate-pulse rounded-2xl bg-white dark:bg-slate-900" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20">
        <p className="text-sm font-semibold text-red-800 dark:text-red-300">Failed to load user files</p>
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">The requested user storage may not be accessible.</p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => navigate("/admin")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Back to Users
          </button>
          <button
            onClick={() => refetch()}
            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Navigation Breadcrumb Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft size={13} />
            Users
          </Link>
          <ChevronRight size={13} className="text-slate-400 dark:text-slate-600" />
          <Link
            to={`/admin/data/${userId}`}
            className={`hover:text-blue-600 dark:hover:text-blue-400 ${!dirId ? "font-bold text-slate-900 dark:text-slate-100" : ""}`}
          >
            Root Storage
          </Link>
          {dirId && (
            <>
              <ChevronRight size={13} className="text-slate-400 dark:text-slate-600" />
              <span className="font-bold text-slate-900 dark:text-slate-100">Folder</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{folders.length} folders</span>
          <span>•</span>
          <span>{files.length} files</span>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <RefreshCw size={12} className={isFetching ? "animate-spin text-blue-600 dark:text-blue-400" : ""} />
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files and folders in this directory..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-9 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Content Grid / List */}
      {combined.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <FolderOpen size={28} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-200">
            {search ? "No matching files or folders" : "This directory is empty"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {search ? "Try searching for a different keyword." : "The user has no items stored in this folder."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Folders Section */}
          {folders.length > 0 && !search && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              Folders ({folders.length})
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {combined.map((item) => {
              const isFile = Boolean(item.extension);
              const isDeletingThis = deletingId === (item._id || item.id);

              return (
                <div
                  key={item._id || item.id}
                  className="group relative flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:border-blue-300 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50"
                >
                  <div
                    onClick={() => handleOpenItem(item._id || item.id, item.extension)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      {isFile ? <FileText size={20} /> : <Folder size={20} className="fill-blue-500/20" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition dark:text-slate-200 dark:group-hover:text-blue-400">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">
                        {isFile ? `${item.extension}` : "Folder"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => openRenameModal(item, isFile)}
                      title="Rename"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                    >
                      <Edit2 size={12} />
                    </button>

                    <button
                      disabled={isDeletingThis}
                      onClick={() => handleDelete(item._id || item.id, isFile)}
                      title="Delete"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl space-y-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Rename Item</h3>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              autoFocus
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800 dark:focus:ring-blue-900/40"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRenameModal(false)}
                className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={renaming || !newName.trim()}
                onClick={handleRename}
                className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
              >
                {renaming ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
