import React from "react";
import { Folder, MoreVertical, Loader2, Share2 } from "lucide-react";
import {
  getItemDate,
  formatDateShort,
  formatDateTime,
  formatBytes,
  getFolderDetailsText,
} from "./driveHelpers";

export default function FolderGrid({
  folders = [],
  selectedId,
  onSelect,
  onOpenFolder,
  onContextMenu,
  onMenuClick,
  onShare,
  deletingId,
}) {
  if (!folders.length) return null;

  return (
    <div className="mb-4 sm:mb-6">
      <h2 className="mb-2 sm:mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
        Folders ({folders.length})
      </h2>

      <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {folders.map((folder) => {
          const isSelected = selectedId === folder._id;
          const isDeleting = deletingId === folder._id;
          const createdDate = getItemDate(folder);
          const detailsText = getFolderDetailsText(folder);
          const tooltip = `Folder: ${folder.name}\nContents: ${folder.itemCount !== undefined ? folder.itemCount : 0} items\nSize: ${folder.size ? formatBytes(folder.size) : "0 Bytes"}\nCreated: ${formatDateTime(createdDate)}`;

          return (
            <div
              key={folder._id}
              onClick={() => onSelect(folder)}
              onDoubleClick={() => onOpenFolder(folder._id)}
              onContextMenu={(e) => {
                if (!isDeleting) onContextMenu(e, folder);
              }}
              title={tooltip}
              className={`group relative flex items-center justify-between rounded-xl border p-3 sm:p-3.5 transition select-none ${
                isDeleting
                  ? "cursor-not-allowed border-red-200 bg-red-50 text-red-600"
                  : isSelected
                    ? "border-blue-300 bg-blue-50/60 shadow-xs"
                    : "cursor-pointer border-gray-200 bg-white hover:border-gray-300 hover:bg-[#f0f4f9]"
              }`}
            >
              {/* Folder Icon + Details */}
              <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                  ) : (
                    <Folder className="h-4 w-4 sm:h-5 sm:w-5 fill-blue-600 text-blue-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-semibold text-gray-800"
                  >
                    {isDeleting ? `${folder.name.slice(0, 15)}... deleting` : folder.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gray-400">
                    <span className="font-medium text-gray-500">{detailsText}</span>
                    <span>•</span>
                    <span title={`Created: ${formatDateTime(createdDate)}`}>{formatDateShort(createdDate)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!isDeleting && (
                <div className="flex items-center gap-0.5 shrink-0 ml-1">
                  {onShare && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(folder._id, false);
                      }}
                      title="Share folder"
                      aria-label="Share folder"
                      className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full text-gray-400 opacity-0 transition hover:bg-gray-200 hover:text-blue-600 group-hover:opacity-100"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMenuClick(e, folder);
                    }}
                    title="More actions"
                    aria-label="More actions"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 focus:opacity-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
