import { IoMdTrash } from "react-icons/io";
import { FaFolder, FaRegFolderOpen } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import RenderFileIcon from "../../hook/RenderFileIcon.jsx";
import RenameModle from "../../components/models/RenameModle.jsx";
import { FolderOpen, FolderPen } from "lucide-react";

export default function DirItem({
  data,
  handleRename,
  deleteData,
  handlerOpen,
  setRenameModal,
  setDirId,
  DirId,
  setType,
  type,
  setNewName,
  newName,
  renameModal,
}) {
  const renderFileIcon = RenderFileIcon;

  return (
    <div>
      {data.map(({ name, extension, _id, userId }) => {
        return (
          <div
            key={_id}
            className="group flex items-center justify-between rounded-xl px-4 py-3 hover:bg-slate-100 transition-all duration-200"
          >
            {/* Left */}
            <div className="flex items-center gap-4 overflow-hidden">
              {extension ? (
                <>
                  <div className="text-3xl">{renderFileIcon(extension)}</div>

                  <div className="overflow-hidden">
                    <p className="font-medium text-slate-700 truncate">
                      {name.length > 20 ? name.slice(0, 20) + "..." : name}
                    </p>
                    <p className="text-sm text-gray-400 uppercase">
                      {extension}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <FaFolder size={34} className="text-blue-500 shrink-0" />

                  <div>
                    <p className="font-medium text-slate-700">
                      {name.length > 20 ? name.slice(0, 20) + "..." : name}
                    </p>

                    <p className="text-sm text-gray-400">Folder</p>
                  </div>
                </>
              )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                onClick={() => {
                  handlerOpen(_id, extension);
                }}
                className="rounded-lg p-2 text-slate-600 hover:bg-blue-100 hover:text-blue-600"
              >
                <FolderOpen size={18} />
              </button>

              <button
                onClick={() => {
                  setRenameModal(true);
                  setDirId(_id);
                  setType(Boolean(extension));
                  setNewName(name);
                }}
                className="rounded-lg p-2 text-slate-600 hover:bg-amber-100 hover:text-amber-600"
              >
                <FolderPen size={18} />
              </button>

              <button
                onClick={() => deleteData(_id, extension)}
                className="rounded-lg p-2 text-slate-600 hover:bg-red-100 hover:text-red-600"
              >
                <IoMdTrash size={18} />
              </button>
            </div>
          </div>
        );
      })}

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
