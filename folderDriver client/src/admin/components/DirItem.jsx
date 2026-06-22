import { IoMdTrash } from "react-icons/io";
import { FaFolder } from "react-icons/fa";
import { FolderOpen, FolderPen } from "lucide-react";
import RenderFileIcon from "../../hook/RenderFileIcon.jsx";
import RenameModle from "../../components/models/RenameModle.jsx";

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
}) {
  const renderFileIcon = RenderFileIcon;

  return (
    <div className="space-y-2">
      {data.map(({ name, extension, _id }) => (
        <div
          key={_id}
          className="
            flex items-center justify-between
            rounded-xl px-3 sm:px-4 py-3
            hover:bg-slate-100 transition
            gap-3
          "
        >
          {/* LEFT SIDE */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {/* ICON */}
            <div className="text-2xl sm:text-3xl shrink-0">
              {extension ? (
                renderFileIcon(extension)
              ) : (
                <FaFolder className="text-blue-500" />
              )}
            </div>

            {/* TEXT */}
            <div className="min-w-0">
              <p className="font-medium text-slate-700 truncate max-w-[140px] sm:max-w-[250px] md:max-w-md">
                {name}
              </p>

              <p className="text-xs sm:text-sm text-gray-400 uppercase">
                {extension ? extension : "Folder"}
              </p>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div
            className="
              flex items-center gap-1 sm:gap-2
              opacity-100 sm:opacity-0 sm:group-hover:opacity-100
              transition
              shrink-0
            "
          >
            {/* Open */}
            <button
              onClick={() => handlerOpen(_id, extension)}
              className="p-2 rounded-lg text-slate-600 hover:bg-blue-100 hover:text-blue-600"
            >
              <FolderOpen size={18} />
            </button>

            {/* Rename */}
            <button
              onClick={() => {
                setRenameModal(true);
                setDirId(_id);
                setType(Boolean(extension));
                setNewName(name);
              }}
              className="p-2 rounded-lg text-slate-600 hover:bg-amber-100 hover:text-amber-600"
            >
              <FolderPen size={18} />
            </button>

            {/* Delete */}
            <button
              onClick={() => deleteData(_id, extension)}
              className="p-2 rounded-lg text-slate-600 hover:bg-red-100 hover:text-red-600"
            >
              <IoMdTrash size={18} />
            </button>
          </div>
        </div>
      ))}

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
