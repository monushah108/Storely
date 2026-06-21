import { IoMdTrash } from "react-icons/io";
import { FaFolder, FaRegFolderOpen } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import RenderFileIcon from "../../hook/RenderFileIcon.jsx";

export default function DirItem({
  data,
  RenameData,
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
      {data.map(({ name, extension, _id }) => {
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
                      {name}
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
                    <p className="font-medium text-slate-700">{name}</p>

                    <p className="text-sm text-gray-400">Folder</p>
                  </div>
                </>
              )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button
                onClick={() => handlerOpen(_id, extension)}
                className="rounded-lg p-2 text-slate-600 hover:bg-blue-100 hover:text-blue-600"
              >
                <FaRegFolderOpen size={18} />
              </button>

              <button
                onClick={() => {
                  setRenameModal(true);
                  setDirId(_id);
                  setType(Boolean(extension));
                }}
                className="rounded-lg p-2 text-slate-600 hover:bg-amber-100 hover:text-amber-600"
              >
                <MdDriveFileRenameOutline size={18} />
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

      {/* <RenameModle
        renameModal={renameModal}
        newName={newName}
        setNewname={setNewname}
        closeModal={setRenameModal}
        HandleRename={async () => await RenameData(newName, DirId, type)}
      /> */}

      {renameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[420px] rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-slate-800">
              Rename Item
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter a new name below.
            </p>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="New name..."
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setRenameModal(false)}
                className="rounded-xl border px-5 py-2 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setRenameModal(false);
                  RenameData(newName, DirId, type);
                }}
                className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
