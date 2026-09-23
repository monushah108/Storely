import React from "react";
import { ExternalLink, Download, Pencil, Share2, Trash2 } from "lucide-react";

export default function DriveContextMenu({
  menu,
  menuRef,
  onClose,
  handleOpen,
  handleRename,
  handleShare,
  handleDelete,
  item,
}) {
  if (!menu.visible || !item) return null;

  const isFolder = !item.extension;

  // Ensure menu stays within window bounds on both axes
  const x = Math.max(10, Math.min(menu.x, window.innerWidth - 200));
  const y = Math.max(10, Math.min(menu.y, window.innerHeight - 260));

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={onClose}
        onTouchStart={onClose}
      />
      <div
        ref={menuRef}
        style={{ position: "fixed", top: y, left: x }}
        className="z-50 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95"
      >
      {/* Open */}
      <button
        type="button"
        onClick={() => {
          onClose();
          handleOpen(item._id, item.extension);
        }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-100"
      >
        <ExternalLink className="h-4 w-4 text-gray-500" />
        <span>Open</span>
      </button>

      {/* Download */}
      {!isFolder && item.url && (
        <a
          href={item.downloadUrl || item.url.replace("/upload/", "/upload/fl_attachment/")}
          download={item.name}
          onClick={onClose}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-100"
        >
          <Download className="h-4 w-4 text-gray-500" />
          <span>Download</span>
        </a>
      )}

      {/* Share */}
      <button
        type="button"
        onClick={() => {
          onClose();
          handleShare(item._id, !isFolder);
        }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-100"
      >
        <Share2 className="h-4 w-4 text-gray-500" />
        <span>Share {isFolder ? "folder" : "file"}</span>
      </button>

      {/* Rename */}
      <button
        type="button"
        onClick={() => {
          onClose();
          handleRename(item._id, item.name, item.extension);
        }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-100"
      >
        <Pencil className="h-4 w-4 text-gray-500" />
        <span>Rename</span>
      </button>

      {/* Divider */}
      <div className="my-1 border-t border-gray-100" />

      {/* Delete */}
      <button
        type="button"
        onClick={() => {
          onClose();
          handleDelete(item._id, item.extension);
        }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete</span>
      </button>
    </div>
    </>
  );
}
