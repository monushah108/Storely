import React from "react";
import { Folder, MoreVertical, Loader2, Download, Share2 } from "lucide-react";
import RenderFileIcon from "../../hook/RenderFileIcon";

export default function FileListView({
  items = [],
  selectedId,
  onSelect,
  onOpenItem,
  onContextMenu,
  onMenuClick,
  onShare,
  deletingId,
}) {
  if (!items.length) return null;

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
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500">
            <th className="py-3 pl-4 pr-3">Name</th>
            <th className="hidden py-3 px-3 sm:table-cell">Owner</th>
            <th className="hidden py-3 px-3 md:table-cell">Last modified</th>
            <th className="hidden py-3 px-3 lg:table-cell">File size</th>
            <th className="py-3 pr-4 pl-3 text-right">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => {
            const isFolder = !item.extension;
            const isSelected = selectedId === item._id;
            const isDeleting = deletingId === item._id;

            return (
              <tr
                key={item._id}
                onClick={() => onSelect(item)}
                onDoubleClick={() => onOpenItem(item._id, item.extension)}
                onContextMenu={(e) => {
                  if (!isDeleting) onContextMenu(e, item);
                }}
                className={`group transition cursor-pointer select-none ${
                  isDeleting
                    ? "cursor-not-allowed bg-red-50 text-red-600"
                    : isSelected
                      ? "bg-blue-50/70"
                      : "hover:bg-gray-50/80"
                }`}
              >
                {/* Name column */}
                <td className="py-3 pl-4 pr-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                      ) : isFolder ? (
                        <Folder className="h-5 w-5 fill-blue-600 text-blue-600" />
                      ) : (
                        <div className="scale-75">
                          {RenderFileIcon(item.extension || "")}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md">
                      <p
                        title={item.name}
                        className={`truncate text-sm font-medium ${
                          isDeleting ? "text-red-600" : "text-gray-800"
                        }`}
                      >
                        {isDeleting
                          ? `${item.name.slice(0, 20)}... deleting`
                          : item.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Owner */}
                <td className="hidden py-3 px-3 text-xs text-gray-500 sm:table-cell">
                  me
                </td>

                {/* Last modified */}
                <td className="hidden py-3 px-3 text-xs text-gray-500 md:table-cell">
                  {formatDate(item.updatedAt || item.createdAt)}
                </td>

                {/* Size */}
                <td className="hidden py-3 px-3 text-xs text-gray-500 lg:table-cell">
                  {isFolder ? "-" : formatBytes(item.size)}
                </td>

                {/* Actions */}
                <td className="py-3 pr-4 pl-3 text-right">
                  {!isDeleting && (
                    <div className="flex items-center justify-end gap-1">
                      {/* Direct action buttons on hover */}
                      {!isFolder && item.url && (
                        <a
                          href={item.url.replace("/upload/", "/upload/fl_attachment/")}
                          download={item.name}
                          onClick={(e) => e.stopPropagation()}
                          title="Download"
                          className="hidden h-7 w-7 items-center justify-center rounded-full text-gray-400 opacity-0 transition hover:bg-gray-200 hover:text-gray-700 group-hover:opacity-100 sm:flex"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShare(item._id, !isFolder);
                        }}
                        title={isFolder ? "Share folder" : "Share file"}
                        className="hidden h-7 w-7 items-center justify-center rounded-full text-gray-400 opacity-0 transition hover:bg-gray-200 hover:text-blue-600 group-hover:opacity-100 sm:flex"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMenuClick(e, item);
                        }}
                        title="More actions"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
