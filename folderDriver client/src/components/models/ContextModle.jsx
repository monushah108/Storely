import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteFile, { isLoading }] = useDeleteFileMutation();

  const navigate = useNavigate();
  const [openFile] = useOpenFileMutation();

  const handleOpen = async (id, type) => {
    setMenuOpenId(null);
    const data = await openFile({ id, type });
    if (!type) {
      navigate(`/dirItem/${id}`);
    } else {
      navigate(`/file/${id}`, {
        state: data,
      });
    }
  };

  const deleteFunc = useCallback((id, type) => {
    setDeleteId(id);
    deleteFile({ id, type });
    setMenuOpenId(null);
    setMenu((pre) => ({ ...pre, visible: false }));
  }, []);

  const renameFunc = useCallback((id, name, ext) => {
    setDirId(id);
    setNewname(name);
    setMenuOpenId(null);
    setRenameModal(true);
    setExt(ext);
  }, []);

  const handleShare = (id) => {
    setIsShare(true);
    setShareId(id);
  };

  if (!menu.visible) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: menu.y, right: menu.x }}
      className="absolute right-2 top-10 z-10 w-32 rounded  bg-white shadow"
    >
      <button
        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        onClick={() => deleteFunc(id, ext)}
      >
        Delete
      </button>
      <button
        className="block w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50"
        onClick={() => renameFunc(id, name, ext)}
      >
        Rename
      </button>
      <button
        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
        onClick={() => handleOpen(id, ext)}
      >
        Open
      </button>
      {ext && (
        <button
          onClick={() => handleShare(id)}
          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
        >
          share
        </button>
      )}
    </div>
  );
}
