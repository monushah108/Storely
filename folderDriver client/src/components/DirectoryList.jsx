import { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaFolder } from "react-icons/fa";
import RenderFileIcon from "../hook/RenderFileIcon.jsx";
import RenameModle from "./models/RenameModle.jsx";
import ContextModle from "./models/ContextModle.jsx";
import { useRenameFileMutation } from "../store/slices/Flieslice.js";
import { toast, Toaster } from "sonner";
import { Loader } from "lucide-react";
import ShareModle from "./models/ShareModle.jsx";

export default function DirectoryList({ DriveData }) {
  const [menu, setMenu] = useState({ x: 0, y: 0, visible: false });
  const [renameModal, setRenameModal] = useState(false);
  const [newName, setNewname] = useState("");
  const [DirId, setDirId] = useState("");
  const [ext, setExt] = useState();
  const [deleteId, setDeleteId] = useState(null);
  const [shareId, setShareId] = useState("");

  const menuRef = useRef();
  const [renameFile] = useRenameFileMutation();

  const [IsShare, setIsShare] = useState(false);

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
    console.log(e);
    e.preventDefault();
    setMenu({ visible: true, x: e.clientX / 100, y: e.clientY / 100 });
    setDirId(id);
    setNewname(name);
    setExt(extension);
  };

  const handleRename = async () => {
    try {
      const data = await renameFile({ newName, DirId, ext }).unwrap();
      toast.info(data.message);
      setRenameModal(false);
    } catch (err) {
      toast.error(err?.data.error);
    }
  };

  return (
    <div className="space-y-3 px-5 py-2 relative">
      <Toaster richColors position="top-center" />
      {!DriveData?.length ? (
        <h1 className="flex h-full items-center justify-center text-gray-500 mt-4 font-semibold">
          No File and Direcotry found
        </h1>
      ) : (
        DriveData.map(({ name, _id, extension }) => (
          <div
            key={_id}
            className={`flex items-center ${deleteId == _id && "cursor-not-allowed "}`}
            onContextMenu={(e) =>
              deleteId == _id || handleContextMenu(e, _id, name, extension)
            }
          >
            <div
              className={`flex flex-1 items-center justify-between ${deleteId == _id && "bg-red-500 border-red-500 rounded px-5 py-1 text-white"}`}
            >
              <div>
                {deleteId == _id ? (
                  <Loader className="animate-spin h-4 w-4" />
                ) : extension ? (
                  renderFileIcon(extension)
                ) : (
                  <FaFolder size={40} className="text-blue-500" />
                )}
              </div>

              <p className="truncate grow px-5 text-left font-medium text-gray-700">
                {deleteId == _id
                  ? `${name.slice(0, 10)} is deleting...`
                  : name.length > 20
                    ? name.slice(0, 20) + "..."
                    : name}
              </p>

              <button
                onClick={(e) =>
                  deleteId == _id || handleContextMenu(e, _id, name, extension)
                }
              >
                <FaEllipsisV />
              </button>
            </div>
          </div>
        ))
      )}

      <ContextModle
        menuRef={menuRef}
        menu={menu}
        setMenu={setMenu}
        setRenameModal={setRenameModal}
        setNewname={setNewname}
        setDirId={setDirId}
        setExt={setExt}
        setIsShare={setIsShare}
        id={DirId}
        name={newName}
        ext={ext}
        setDeleteId={setDeleteId}
        setShareId={setShareId}
      />

      <RenameModle
        renameModal={renameModal}
        newName={newName}
        setNewname={setNewname}
        closeModal={setRenameModal}
        HandleRename={handleRename}
      />
      <ShareModle
        IsShare={IsShare}
        setIsShare={setIsShare}
        shareId={shareId}
        isFile={ext}
      />
    </div>
  );
}
