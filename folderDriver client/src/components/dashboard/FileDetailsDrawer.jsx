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
  Clock,
  Layers,
  FileText,
} from "lucide-react";
import RenderFileIcon from "../../hook/RenderFileIcon";
import {
  formatBytes,
  formatDateTime,
  getItemDate,
  getItemTypeLabel,
} from "./driveHelpers";

export default function FileDetailsDrawer({
  item,
  isCurrentFolder = false,
  onClose,
  onOpen,
  onShare,
  onRename,
  onDelete,
}) {
  if (!item) return null;

  const isFolder = !item.extension;
  const createdDate = getItemDate(item);
  const modifiedDate = item.updatedAt ? new Date(item.updatedAt) : createdDate;
  const isRootFolder = isFolder && !item.parentDirId && isCurrentFolder;

  return (
    <aside className="fixed inset-y-0 right-0 z-30 flex w-80 flex-col border-l border-gray-200 bg-white shadow-xl transition-all duration-200 lg:static lg:shadow-none">
      {/* Drawer Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-800">
            {isCurrentFolder ? "Folder Details" : "Details"}
          </h3>
        </div>
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
            className="w-full truncate text-sm font-bold text-gray-900"
          >
            {item.name || (isRootFolder ? "My Drive" : "Folder")}
          </p>
          <p className="mt-1 text-xs font-medium text-gray-500">
            {isCurrentFolder ? "Current Directory" : getItemTypeLabel(item)}
          </p>
        </div>

        {/* Action Buttons */}
        {!isRootFolder && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onOpen(item._id, item.extension)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
              <span>Open</span>
            </button>

            {!isFolder && item.url && (
              <a
                href={item.url.replace("/upload/", "/upload/fl_attachment/")}
                download={item.name}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <Download className="h-3.5 w-3.5 text-gray-500" />
                <span>Download</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => onShare(item._id, !isFolder)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <Share2 className="h-3.5 w-3.5 text-blue-600" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={() => onRename(item._id, item.name, item.extension)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <Pencil className="h-3.5 w-3.5 text-gray-500" />
              <span>Rename</span>
            </button>
          </div>
        )}

        {/* Delete button */}
        {!isRootFolder && (
          <button
            type="button"
            onClick={() => onDelete(item._id, item.extension)}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-red-50 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete item</span>
          </button>
        )}

        {/* Properties Section */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            System Properties
          </h4>

          <dl className="space-y-3 text-xs">
            <div className="flex justify-between gap-2">
              <dt className="text-gray-500 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-gray-400" />
                <span>Type</span>
              </dt>
              <dd className="font-semibold text-gray-800 text-right truncate">
                {isFolder ? "Folder" : getItemTypeLabel(item)}
              </dd>
            </div>

            {!isFolder ? (
              <>
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-500 flex items-center gap-1.5">
                    <HardDrive className="h-3.5 w-3.5 text-gray-400" />
                    <span>Size</span>
                  </dt>
                  <dd className="font-semibold text-gray-800 text-right">
                    {formatBytes(item.size)}
                  </dd>
                </div>

                {item.size !== undefined && (
                  <div className="flex justify-between gap-2">
                    <dt className="text-gray-500">Exact Bytes</dt>
                    <dd className="font-mono text-gray-700 text-right">
                      {item.size.toLocaleString()} bytes
                    </dd>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-500 flex items-center gap-1.5">
                    <HardDrive className="h-3.5 w-3.5 text-gray-400" />
                    <span>Total Size</span>
                  </dt>
                  <dd className="font-semibold text-gray-800 text-right">
                    {formatBytes(item.size || 0)}
                  </dd>
                </div>

                {item.size !== undefined && item.size > 0 && (
                  <div className="flex justify-between gap-2">
                    <dt className="text-gray-500">Exact Bytes</dt>
                    <dd className="font-mono text-gray-700 text-right">
                      {item.size.toLocaleString()} bytes
                    </dd>
                  </div>
                )}

                <div className="flex justify-between gap-2">
                  <dt className="text-gray-500">Contents</dt>
                  <dd className="font-semibold text-gray-800 text-right">
                    {item.subDirCount !== undefined && item.subFileCount !== undefined
                      ? `${item.itemCount || 0} items (${item.subDirCount} folders, ${item.subFileCount} files)`
                      : `${item.itemCount || 0} ${item.itemCount === 1 ? "item" : "items"}`}
                  </dd>
                </div>
              </>
            )}

            <div className="flex justify-between gap-2">
              <dt className="text-gray-500">Location</dt>
              <dd className="font-semibold text-blue-600 text-right">
                My Drive
              </dd>
            </div>

            <div className="flex justify-between gap-2">
              <dt className="text-gray-500">Owner</dt>
              <dd className="font-semibold text-gray-800 text-right">me</dd>
            </div>

            <div className="flex justify-between gap-2">
              <dt className="text-gray-500 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>Uploaded / Created</span>
              </dt>
              <dd className="font-medium text-gray-800 text-right">
                {formatDateTime(createdDate)}
              </dd>
            </div>

            <div className="flex justify-between gap-2">
              <dt className="text-gray-500 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span>Modified</span>
              </dt>
              <dd className="font-medium text-gray-800 text-right">
                {formatDateTime(modifiedDate)}
              </dd>
            </div>

            {item.extension && (
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Extension</dt>
                <dd className="font-mono font-semibold text-gray-800 uppercase">
                  .{item.extension}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </aside>
  );
}
