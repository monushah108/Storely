import { IoMdTrash } from "react-icons/io";
import { FaFolder } from "react-icons/fa";
import { FolderOpen, FolderPen } from "lucide-react";
import RenderFileIcon from "../../hook/RenderFileIcon.jsx";
import RenameModle from "../../components/models/RenameModle.jsx";
import { Loader2 } from "lucide-react";
export default function DirItem({
  data,
  handleRename,
  deleteData,
  handlerOpen,
  setRenameModal,
  setDirId,
  setType,
  setNewName,
  newName,
  renameModal,
  deletingId,
}) {
  const renderFileIcon = RenderFileIcon;

  return (
    <div className="space-y-2">
      {data.map(({ name, extension, _id }) => {
        const isDeleting = deletingId === _id;

        return (
          <div
            key={_id}
            className={`
        flex items-center justify-between
        rounded-xl px-3 py-3 sm:px-4
        transition
        ${isDeleting ? "opacity-50" : "hover:bg-slate-100"}
      `}
          >
            {/* LEFT */}
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <div className="shrink-0 text-2xl sm:text-3xl">
                {extension ? (
                  renderFileIcon(extension)
                ) : (
                  <FaFolder className="text-blue-500" />
                )}
              </div>

              <div className="min-w-0">
                <p className="max-w-[140px] truncate font-medium text-slate-700 sm:max-w-[250px] md:max-w-md">
                  {name}
                </p>

                <p className="text-xs uppercase text-gray-400 sm:text-sm">
                  {extension || "Folder"}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Open */}
              <button
                disabled={isDeleting}
                onClick={() => handlerOpen(_id, extension)}
                className="
            rounded-lg p-2 text-slate-600
            transition
            hover:bg-blue-100 hover:text-blue-600
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
              >
                <FolderOpen size={18} />
              </button>

              {/* Rename */}
              <button
                disabled={isDeleting}
                onClick={() => {
                  setRenameModal(true);
                  setDirId(_id);
                  setType(Boolean(extension));
                  setNewName(name);
                }}
                className="
            rounded-lg p-2 text-slate-600
            transition
            hover:bg-amber-100 hover:text-amber-600
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
              >
                <FolderPen size={18} />
              </button>

              {/* Delete */}
              <button
                disabled={isDeleting}
                onClick={() => deleteData(_id, extension)}
                className="
            rounded-lg p-2 text-slate-600
            transition
            hover:bg-red-100 hover:text-red-600
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
              >
                {isDeleting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <IoMdTrash size={18} />
                )}
              </button>
            </div>
          </div>
        );
      })}

      {/* MODAL */}
      <RenameModle
        renameModal={renameModal}
        newName={newName}
        setNewname={setNewName}
        closeModal={setRenameModal}
        HandleRename={handleRename}
      />
    </div>
  );
}
