import { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaFolder } from "react-icons/fa";
import RenderFileIcon from "../hook/RenderFileIcon.jsx";
import RenameModle from "./models/RenameModle.jsx";
import ContextModle from "./models/ContextModle.jsx";
import { useRenameFileMutation } from "../store/slices/Flieslice.js";
import { toast, Toaster } from "sonner";

export default function DirectoryList({ DriveData, onProgress }) {
  const [menu, setMenu] = useState({ x: 0, y: 0, visible: false });
  const [renameModal, setRenameModal] = useState(false);
  const [newName, setNewname] = useState("");
  const [DirId, setDirId] = useState("");
  const [type, setType] = useState();

  const menuRef = useRef();
  const [renameFile] = useRenameFileMutation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu((pre) => ({ ...pre, visible: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderFileIcon = RenderFileIcon;

  const handleContextMenu = (e, id, name, extension) => {
    e.preventDefault();
    setMenu({ visible: true, x: e.clientX / 100, y: e.clientY });
    setDirId(id);
    setNewname(name);
    setType(extension);
  };

  const handleRename = async () => {
    try {
      const data = await renameFile({ newName, DirId, type }).unwrap();
      setRenameModal(false);
    } catch (err) {
      toast.error(err.data.message);
    }
  };

  console.log(onProgress);

  return (
    <div className="space-y-3 p-2">
      <Toaster richColors position="top-center" />
      {!DriveData?.length ? (
        <h1 className="flex h-full items-center justify-center text-gray-500 mt-4 font-semibold">
          No File and Direcotry found
        </h1>
      ) : (
        DriveData.map(({ name, _id, extension }) => (
          <div
            key={_id}
            className="flex items-center justify-between"
            onContextMenu={(e) => handleContextMenu(e, _id, name, extension)}
          >
            <div>
              {extension ? (
                renderFileIcon(extension)
              ) : (
                <FaFolder size={40} className="text-blue-500" />
              )}
            </div>

            <p className="truncate grow px-5 text-left font-medium text-gray-700">
              {name}
            </p>

            <button onClick={(e) => handleContextMenu(e, _id, name, extension)}>
              <FaEllipsisV />
            </button>
          </div>
        ))
      )}

      {onProgress && (
        <div
          className="bg-green-500  rounded transition-transform duration-300 w-1"
          style={{ width: `${onProgress}%` }}
        >
          <p className="text-right">{onProgress}%</p>
        </div>
      )}

      <ContextModle
        menuRef={menuRef}
        menu={menu}
        setMenu={setMenu}
        setRenameModal={setRenameModal}
        setNewname={setNewname}
        setDirId={setDirId}
        setType={setType}
        id={DirId}
        name={newName}
        extension={type}
      />

      <RenameModle
        renameModal={renameModal}
        newName={newName}
        setNewname={setNewname}
        closeModal={setRenameModal}
        HandleRename={handleRename}
      />
    </div>
  );
}
