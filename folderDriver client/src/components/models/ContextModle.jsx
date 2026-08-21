import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Pencil, Share2, Trash2 } from "lucide-react";

import {
  useDeleteFileMutation,
  useOpenFileMutation,
} from "../../store/slices/Flieslice";

export default function ContextModle({
  menu,
  setMenu,
  menuRef,
  setRenameModal,
  setNewname,
  setDirId,
  setExt,
  setIsShare,
  id,
  name,
  ext,
  setDeleteId,
  setShareId,
}) {
  const [deleteFile] = useDeleteFileMutation();
  const [openFile] = useOpenFileMutation();

  const navigate = useNavigate();

  const closeMenu = () => {
    setMenu((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const handleOpen = async (id, type) => {
    closeMenu();

    try {
      const { data } = await openFile({ id, type });
      if (!type) {
        navigate(`dirItem/${id}`);
      } else {
        navigate(`/file/${id}`, {
          state: { ...data },
        });
      }
    } catch (error) {
      console.error("Failed to open:", error);
    }
  };

  const handleDelete = useCallback(
    async (id, type) => {
      setDeleteId(id);
      closeMenu();

      try {
        await deleteFile({ id, type });
      } catch (error) {
        console.error("Failed to delete:", error);
        setDeleteId(null);
      }
    },
    [deleteFile, setDeleteId],
  );

  const handleRename = useCallback(
    (id, name, ext) => {
      setDirId(id);
      setNewname(name);
      setExt(ext || "");
      setRenameModal(true);
      closeMenu();
    },
    [setDirId, setNewname, setExt, setRenameModal],
  );

  const handleShare = (id) => {
    setShareId(id);
    setIsShare(true);
    closeMenu();
  };

  if (!menu.visible) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: menu.y,
        left: menu.x,
      }}
      className="z-[9999] w-40 overflow-hidden rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg"
    >
      {/* Open */}
      <button
        type="button"
        onClick={() => handleOpen(id, ext)}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
      >
        <ExternalLink className="h-4 w-4 text-gray-400" />
        <span>Open</span>
      </button>

      {/* Rename */}
      <button
        type="button"
        onClick={() => handleRename(id, name, ext)}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
      >
        <Pencil className="h-4 w-4 text-gray-400" />
        <span>Rename</span>
      </button>

      {/* Share */}
      {ext && (
        <button
          type="button"
          onClick={() => handleShare(id)}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
        >
          <Share2 className="h-4 w-4 text-gray-400" />
          <span>Share</span>
        </button>
      )}

      {/* Divider */}
      <div className="my-1 border-t border-gray-100" />

      {/* Delete */}
      <button
        type="button"
        onClick={() => handleDelete(id, ext)}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete</span>
      </button>
    </div>
  );
}
