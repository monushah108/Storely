import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useUploadFileMutation,
  useCreateDirectoryMutation,
  useRenameFileMutation,
  useDeleteFileMutation,
  useOpenFileMutation,
} from "../../store/slices/Flieslice";

export function useDriveOperations({
  folderId,
  selectedItem,
  setSelectedItem,
}) {
  const navigate = useNavigate();

  const [
    uploadFile,
    {
      isLoading: isUploading,
      isError: isUploadErr,
      error: uploadErr,
      reset: resetUpload,
    },
  ] = useUploadFileMutation();

  const [createDirectory] = useCreateDirectoryMutation();
  const [renameFile] = useRenameFileMutation();
  const [deleteFile] = useDeleteFileMutation();
  const [openFile] = useOpenFileMutation();

  // Modal & operation states
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameItem, setRenameItem] = useState(null);
  const [newName, setNewName] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareId, setShareId] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(null);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  const handleUploadFiles = (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    setUploadingFile(file);
    const form = new FormData();
    form.append("file", file);
    uploadFile({ paramId: folderId, form });
  };

  const handleCreateFolderSubmit = async () => {
    if (!folderName.trim()) return;
    try {
      await createDirectory({
        folderName: folderName.trim(),
        parentId: folderId,
      }).unwrap();
      setFolderName("");
      setCreateFolderOpen(false);
      toast.success("Folder created");
    } catch {
      toast.error("Failed to create folder");
    }
  };

  const handleRenameSubmit = async () => {
    if (!newName.trim() || !renameItem) return;
    try {
      await renameFile({
        newName: newName.trim(),
        DirId: renameItem._id,
        ext: renameItem.extension,
      }).unwrap();
      setRenameOpen(false);
      toast.success("Renamed successfully");
    } catch (err) {
      toast.error(err?.data?.error || "Failed to rename");
    }
  };

  const handleDelete = async (id, ext) => {
    setDeletingId(id);
    try {
      await deleteFile({ id, type: ext });
      if (selectedItem?._id === id) setSelectedItem(null);
      toast.success("Deleted successfully");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpen = async (id, ext) => {
    try {
      const { data } = await openFile({ id, type: ext });
      if (!ext) {
        navigate(`/dashboard/dirItem/${id}`);
      } else {
        navigate(`/file/${id}`, { state: { ...data } });
      }
    } catch {
      toast.error("Failed to open item");
    }
  };

  const openContextMenu = (e, item) => {
    e.preventDefault();
    setSelectedItem(item);
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, item });
  };

  const prepareRename = (id, name, ext) => {
    setRenameItem({ _id: id, name, extension: ext });
    setNewName(name);
    setRenameOpen(true);
  };

  const [isFileShare, setIsFileShare] = useState(true);

  const openShare = (id, isFile = true) => {
    setShareId(id);
    setIsFileShare(isFile);
    setShareOpen(true);
  };

  return {
    isUploading,
    isUploadErr,
    uploadErr,
    resetUpload,
    uploadingFile,
    setUploadingFile,
    createFolderOpen,
    setCreateFolderOpen,
    folderName,
    setFolderName,
    renameOpen,
    setRenameOpen,
    newName,
    setNewName,
    shareOpen,
    setShareOpen,
    shareId,
    isFileShare,
    deletingId,
    contextMenu,
    setContextMenu,
    handleUploadFiles,
    handleCreateFolderSubmit,
    handleRenameSubmit,
    handleDelete,
    handleOpen,
    openContextMenu,
    prepareRename,
    openShare,
  };
}
