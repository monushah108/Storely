import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetUserFilesQuery,
  useDeleteUserDataMutation,
  useRenameUserDataMutation,
  useLazyOpenUserDataQuery,
} from "@/store/slices/AdminSlice";

import { ChevronLeft, FolderOpen, FileText, Search } from "lucide-react";

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

  const [deleteUserData] = useDeleteUserDataMutation();
  const [renameUserData] = useRenameUserDataMutation();
  const [triggerOpenUserData] = useLazyOpenUserDataQuery();
  const [triggerSearch, { data: searchData }] = useLazySearchFilesQuery();

  const combined = [...folders, ...files].filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id, type) => {
    deleteUserData({ userId, id, type });
  };

  const handleRename = async () => {
    await renameUserData({
      userId,
      DirId,
      type,
      newName,
    });

    setRenameModal(false);
  };

  const handlerOpen = async (id, extension) => {
    const data = await triggerOpenUserData({
      userId,
      id,
      extension,
    });

    if (!extension) {
      navigate(`${id}`);
    } else {
      navigate(`/file/${id}`, {
        state: data,
      });
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    if (value.trim()) {
      triggerSearch({
        userId,
        search: value,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-64 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          Failed to load user files.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                File Explorer
              </h1>
              <p className="text-slate-500 mt-1">
                Browse user files and directories
              </p>
            </div>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-5">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search files and folders..."
              value={search}
              onKeyDown={(e) => e.key == "enter" && handleSearch}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl bg-white p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <FolderOpen className="text-blue-500" />
              <div>
                <p className="text-sm text-slate-500">Folders</p>
                <p className="text-xl font-bold">{folders.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <FileText className="text-green-500" />
              <div>
                <p className="text-sm text-slate-500">Files</p>
                <p className="text-xl font-bold">{files.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm border">
            <p className="text-sm text-slate-500">Total Items</p>
            <p className="text-xl font-bold">{combined.length}</p>
          </div>
        </div>

        {/* Content */}
        {combined.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
            <FolderOpen size={60} className="mx-auto text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold">No files found</h3>
            <p className="text-slate-500 mt-2">This directory is empty.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border shadow-sm p-4">
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
            />
          </div>
        )}
      </div>
    </div>
  );
}
