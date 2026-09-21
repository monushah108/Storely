import React from "react";
import {
  X,
  Folder,
  Download,
  Share2,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
  HardDrive,
} from "lucide-react";
import RenderFileIcon from "../../hook/RenderFileIcon";

export default function FileDetailsDrawer({
  item,
  onClose,
  onOpen,
  onShare,
  onRename,
  onDelete,
}) {
  if (!item) return null;

  const isFolder = !item.extension;

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "-";
    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    );
    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <aside className="fixed inset-y-0 right-0 z-30 flex w-80 flex-col border-l border-gray-200 bg-white shadow-xl transition-all duration-200 lg:static lg:shadow-none">
      {/* Drawer Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
        <h3 className="text-sm font-bold text-gray-800">Details</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Preview Header */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-[#f8fafd] p-6 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xs">
            {isFolder ? (
              <Folder className="h-8 w-8 fill-blue-600 text-blue-600" />
            ) : (
              RenderFileIcon(item.extension || "")
            )}
          </div>
          <p
            title={item.name}
            className="w-full truncate text-sm font-semibold text-gray-900"
          >
            {item.name}
          </p>
          <p className="mt-1 text-xs text-gray-500 uppercase">
            {isFolder ? "Folder" : item.extension || "File"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpen(item._id, item.extension)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
            <span>Open</span>
          </button>

          {!isFolder && item.url && (
            <a
              href={item.url.replace("/upload/", "/upload/fl_attachment/")}
              download={item.name}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Download className="h-3.5 w-3.5 text-gray-500" />
              <span>Download</span>
            </a>
          )}

          {!isFolder && (
            <button
              type="button"
              onClick={() => onShare(item._id)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Share2 className="h-3.5 w-3.5 text-blue-600" />
              <span>Share</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onRename(item._id, item.name, item.extension)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Pencil className="h-3.5 w-3.5 text-gray-500" />
            <span>Rename</span>
          </button>
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDelete(item._id, item.extension)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-red-50 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete item</span>
        </button>

        {/* File Information */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Information
          </h4>

          <dl className="space-y-3 text-xs">
            <div className="flex justify-between">
              <dt className="text-gray-500">Type</dt>
              <dd className="font-medium text-gray-800">
                {isFolder ? "Folder" : item.extension?.toUpperCase() || "File"}
              </dd>
            </div>

            {!isFolder && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Size</dt>
                <dd className="font-medium text-gray-800">
                  {formatBytes(item.size)}
                </dd>
              </div>
            )}

            <div className="flex justify-between">
              <dt className="text-gray-500">Owner</dt>
              <dd className="font-medium text-gray-800">me</dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-gray-500">Modified</dt>
              <dd className="font-medium text-gray-800">
                {formatDate(item.updatedAt || item.createdAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </aside>
  );
}
