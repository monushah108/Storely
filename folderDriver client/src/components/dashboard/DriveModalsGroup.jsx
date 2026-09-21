import React from "react";
import DriveContextMenu from "./DriveContextMenu";
import { CreateFolderModal, RenameModal } from "./DriveModals";
import UploadFloatingWidget from "./UploadFloatingWidget";
import ShareModal from "../models/ShareModle";

export default function DriveModalsGroup({
  contextMenu,
  contextMenuRef,
  onCloseContextMenu,
  handleOpen,
  onPrepareRename,
  handleShare,
  handleDelete,
  createFolderOpen,
  onCloseCreateFolder,
  folderName,
  setFolderName,
  onCreateFolder,
  renameOpen,
  onCloseRename,
  newName,
  setNewName,
  onRename,
  shareOpen,
  onCloseShare,
  shareId,
  isFileShare,
  uploadingFile,
  isUploading,
  isUploadErr,
  uploadErr,
  onCloseUploadWidget,
}) {
  return (
    <>
      <DriveContextMenu
        menu={contextMenu}
        menuRef={contextMenuRef}
        onClose={onCloseContextMenu}
        handleOpen={handleOpen}
        handleRename={onPrepareRename}
        handleShare={handleShare}
        handleDelete={handleDelete}
        item={contextMenu.item}
      />

      <CreateFolderModal
        isOpen={createFolderOpen}
        onClose={onCloseCreateFolder}
        folderName={folderName}
        setFolderName={setFolderName}
        onCreate={onCreateFolder}
      />

      <RenameModal
        isOpen={renameOpen}
        onClose={onCloseRename}
        newName={newName}
        setNewName={setNewName}
        onRename={onRename}
      />

      <ShareModal
        IsShare={shareOpen}
        setIsShare={onCloseShare}
        shareId={shareId}
        isFile={isFileShare}
      />

      <UploadFloatingWidget
        file={uploadingFile}
        isLoading={isUploading}
        isError={isUploadErr}
        error={uploadErr}
        onClose={onCloseUploadWidget}
      />
    </>
  );
}
