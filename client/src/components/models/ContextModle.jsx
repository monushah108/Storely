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
  setType,
  id,
  name,
  extension,
}) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [deleteFile] = useDeleteFileMutation();
  const BASE_URL = "http://localhost:4000";
  const navigate = useNavigate();
  const [openFile] = useOpenFileMutation();

  const handleOpen = async (id, type) => {
    setMenuOpenId(null);
    const path = await openFile({ id, type });
    if (!type) {
      navigate(`/dirItem/${id}`);
    } else {
      window.location.href = `${BASE_URL}/file/${id}`;
    }
  };

  const deleteFunc = useCallback((id, type) => {
    console.log(id, type);
    deleteFile({ id, type });
    setMenuOpenId(null);
    setMenu((pre) => ({ ...pre, visible: false }));
  }, []);

  const renameFunc = useCallback((id, name, extension) => {
    setDirId(id);
    setNewname(name);
    setMenuOpenId(null);
    setRenameModal(true);
    setType(extension);
  }, []);

  if (!menu.visible) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: menu.y, right: menu.x }}
      className="absolute right-2 top-10 z-10 w-32 rounded  bg-white shadow"
    >
      <button
        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        onClick={() => deleteFunc(id, extension)}
      >
        Delete
      </button>
      <button
        className="block w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50"
        onClick={() => renameFunc(id, name, extension)}
      >
        Rename
      </button>
      <button
        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
        onClick={() => handleOpen(id, extension)}
      >
        Open
      </button>
    </div>
  );
}
