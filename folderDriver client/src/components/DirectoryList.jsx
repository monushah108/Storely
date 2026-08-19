import { useEffect, useRef, useState } from "react";
import { FaEllipsisV, FaFolder } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import RenderFileIcon from "../hook/RenderFileIcon.jsx";
import RenameModle from "./models/RenameModle.jsx";
import ContextModle from "./models/ContextModle.jsx";
import ShareModle from "./models/ShareModle.jsx";

import { useRenameFileMutation } from "../store/slices/Flieslice.js";

export default function DirectoryList({ DriveData = [] }) {
  const [menu, setMenu] = useState({
    x: 0,
    y: 0,
    visible: false,
  });

  const [renameModal, setRenameModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [dirId, setDirId] = useState("");
  const [ext, setExt] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [shareId, setShareId] = useState("");
  const [isShare, setIsShare] = useState(false);

  const menuRef = useRef(null);

  const [renameFile] = useRenameFileMutation();

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu((prev) => ({
          ...prev,
          visible: false,
        }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Open context menu
  const handleContextMenu = (event, id, name, extension) => {
    event.preventDefault();

    setMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
    });

    setDirId(id);
    setNewName(name);
    setExt(extension || "");
  };

  // Open menu from three-dot button
  const handleMenuClick = (event, id, name, extension) => {
    event.stopPropagation();

    setMenu({
      visible: true,
      x: event.clientX / 100,
      y: event.clientY / 100,
    });

    setDirId(id);
    setNewName(name);
    setExt(extension || "");
  };

  // Rename file/folder
  const handleRename = async () => {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      const data = await renameFile({
        newName: trimmedName,
        DirId: dirId,
        ext,
      }).unwrap();

      toast.success(data.message || "Renamed successfully");

      setRenameModal(false);
    } catch (err) {
      toast.error(err?.data?.error || err?.data?.message || "Failed to rename");
    }
  };

  if (!DriveData.length) {
    return (
      <div className="flex min-h-[250px] items-center justify-center">
        <p className="text-sm font-medium text-gray-400">
          No files or folders found
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-100 relative">
        {DriveData.map(({ name, _id, extension }) => {
          const isDeleting = deleteId === _id;

          return (
            <div
              key={_id}
              onContextMenu={(event) => {
                if (!isDeleting) {
                  handleContextMenu(event, _id, name, extension);
                }
              }}
              className={`group flex min-h-[58px] items-center gap-3 px-3 transition ${
                isDeleting ? "cursor-not-allowed bg-red-50" : "hover:bg-gray-50"
              }`}
            >
              {/* File / Folder icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                ) : extension ? (
                  RenderFileIcon(extension)
                ) : (
                  <FaFolder className="text-xl text-blue-500" />
                )}
              </div>

              {/* Name */}
              <div className="min-w-0 flex-1">
                <p
                  title={name}
                  className={`truncate text-sm font-medium ${
                    isDeleting ? "text-red-600" : "text-gray-700"
                  }`}
                >
                  {isDeleting ? `${name.slice(0, 20)}... is deleting` : name}
                </p>
              </div>

              {/* File type */}
              <span className="hidden w-24 truncate text-xs text-gray-400 sm:block">
                {extension || "Folder"}
              </span>

              {/* Menu */}
              {!isDeleting && (
                <button
                  type="button"
                  onClick={(event) =>
                    handleMenuClick(event, _id, name, extension)
                  }
                  className="rounded-md p-2 text-gray-400 opacity-0 transition hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100 focus:opacity-100"
                  aria-label={`Options for ${name}`}
                >
                  <FaEllipsisV className="text-sm" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Context menu */}
      <ContextModle
        menuRef={menuRef}
        menu={menu}
        setMenu={setMenu}
        setRenameModal={setRenameModal}
        setNewname={setNewName}
        setDirId={setDirId}
        setExt={setExt}
        setIsShare={setIsShare}
        id={dirId}
        name={newName}
        ext={ext}
        setDeleteId={setDeleteId}
        setShareId={setShareId}
      />

      {/* Rename */}
      <RenameModle
        renameModal={renameModal}
        newName={newName}
        setNewname={setNewName}
        closeModal={setRenameModal}
        HandleRename={handleRename}
      />

      {/* Share */}
      <ShareModle
        IsShare={isShare}
        setIsShare={setIsShare}
        shareId={shareId}
        isFile={ext}
      />
    </>
  );
}
