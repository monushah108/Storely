import { IoMdTrash } from "react-icons/io";
import { FaRegFolderOpen } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import RenderFileIcon from "../../hook/RenderFileIcon.jsx";

export default function UserDirItem({
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
            className="flex items-center justify-between border-b border-gray-200 group"
          >
            <div className="flex items-center gap-4 p-4 mb-1 rounded cursor-pointer">
              {extension ? (
                <>
                  {renderFileIcon(extension)}
                  <span>{name}</span>
                </>
              ) : (
                <>
                  <FaFolder size={40} className="text-blue-500" />
                  <span>{name}</span>
                </>
              )}
            </div>
            <div className="relative flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity [&>button]:cursor-pointer">
              <button onClick={() => handlerOpen(_id, extension)}>
                <FaRegFolderOpen />
              </button>
              <button onClick={() => deleteData(_id, extension)}>
                <IoMdTrash />
              </button>
              <button
                onClick={() => {
                  setRenameModal(true);
                  setDirId(_id);
                  setType(Boolean(extension));
                }}
              >
                <MdDriveFileRenameOutline />
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
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Rename</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mb-4 w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => {
                  setRenameModal(false);
                  console.log(type);
                  RenameData(newName, DirId, type);
                }}
              >
                Save
              </button>
              <button
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                onClick={() => setRenameModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
