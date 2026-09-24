import React from "react";
import { Folder, MoreVertical, Loader2, Download, Share2 } from "lucide-react";
import RenderFileIcon from "../../hook/RenderFileIcon";
import {
  formatBytes,
  formatDateShort,
  formatDateTime,
  getItemDate,
  getItemTypeLabel,
  getFolderDetailsText,
} from "./driveHelpers";

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

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 dark:border-slate-800 dark:text-slate-400">
            <th className="py-2.5 sm:py-3 pl-2.5 sm:pl-4 pr-2 sm:pr-3">Name</th>
            <th className="hidden py-3 px-3 md:table-cell">Type</th>
            <th className="hidden py-3 px-3 sm:table-cell">Owner</th>
            <th className="hidden py-3 px-3 md:table-cell">Created / Uploaded</th>
            <th className="hidden py-3 px-3 lg:table-cell">Last Modified</th>
            <th className="hidden py-3 px-3 sm:table-cell">Size / Items</th>
            <th className="py-2.5 sm:py-3 pr-2.5 sm:pr-4 pl-2 sm:pl-3 text-right">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
          {items.map((item) => {
            const isFolder = !item.extension;
            const isSelected = selectedId === item._id;
            const isDeleting = deletingId === item._id;
            const createdDate = getItemDate(item);
            const modifiedDate = item.updatedAt ? new Date(item.updatedAt) : createdDate;
            const sizeText = isFolder
              ? getFolderDetailsText(item)
              : formatBytes(item.size);
            const exactBytes = !isFolder && item.size !== undefined ? `${item.size.toLocaleString()} bytes` : "";
            const tooltip = `${isFolder ? "Folder" : "File"}: ${item.name}\nType: ${getItemTypeLabel(item)}\nSize: ${sizeText}${exactBytes ? ` (${exactBytes})` : ""}\nCreated: ${formatDateTime(createdDate)}\nModified: ${formatDateTime(modifiedDate)}`;

            return (
              <tr
                key={item._id}
                onClick={() => onSelect(item)}
                onDoubleClick={() => onOpenItem(item._id, item.extension)}
                onContextMenu={(e) => {
                  if (!isDeleting) onContextMenu(e, item);
                }}
                title={`${item.name} • ${getItemTypeLabel(item)} • Created: ${formatDateTime(createdDate)}`}
                className={`group transition cursor-pointer select-none ${
                  isDeleting
                    ? "cursor-not-allowed bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                    : isSelected
                      ? "bg-blue-50/70 dark:bg-blue-950/40"
                      : "hover:bg-gray-50/80 dark:hover:bg-slate-800/50"
                }`}
              >
                {/* Name column */}
                <td className="py-2.5 sm:py-3 pl-2.5 sm:pl-4 pr-2 sm:pr-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                      ) : isFolder ? (
                        <Folder className="h-5 w-5 fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400" />
                      ) : (
                        <div className="scale-75">
                          {RenderFileIcon(item.extension || "")}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-sm lg:max-w-md">
                      <p
                        className={`truncate text-sm font-medium ${
                          isDeleting ? "text-red-600 dark:text-red-400" : "text-gray-800 dark:text-slate-200"
                        }`}
                      >
                        {isDeleting
                          ? `${item.name.slice(0, 20)}... deleting`
                          : item.name}
                      </p>
                      <span className="block sm:hidden text-[10px] sm:text-[11px] text-gray-400 dark:text-slate-400">
                        {sizeText} • {formatDateShort(createdDate)}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className="hidden py-3 px-3 text-xs text-gray-500 md:table-cell dark:text-slate-400">
                  <span className="inline-block max-w-[130px] truncate rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-slate-800 dark:text-slate-300">
                    {getItemTypeLabel(item)}
                  </span>
                </td>

                {/* Owner */}
                <td className="hidden py-3 px-3 text-xs text-gray-500 sm:table-cell dark:text-slate-400">
                  me
                </td>

                {/* Date Created */}
                <td
                  title={formatDateTime(createdDate)}
                  className="hidden py-3 px-3 text-xs text-gray-500 md:table-cell dark:text-slate-400"
                >
                  {formatDateShort(createdDate)}
                </td>

                {/* Last modified */}
                <td
                  title={formatDateTime(modifiedDate)}
                  className="hidden py-3 px-3 text-xs text-gray-500 lg:table-cell dark:text-slate-400"
                >
                  {formatDateShort(modifiedDate)}
                </td>

                {/* Size / Items */}
                <td
                  title={exactBytes || sizeText}
                  className="hidden py-3 px-3 text-xs font-medium text-gray-700 sm:table-cell dark:text-slate-300"
                >
                  {sizeText}
                </td>

                {/* Actions */}
                <td className="py-2.5 sm:py-3 pr-2.5 sm:pr-4 pl-2 sm:pl-3 text-right">
                  {!isDeleting && (
                    <div className="flex items-center justify-end gap-1">
                      {/* Direct action buttons on hover */}
                      {!isFolder && item.url && (
                        <a
                          href={item.downloadUrl || item.url.replace("/upload/", "/upload/fl_attachment/")}
                          download={item.name}
                          onClick={(e) => e.stopPropagation()}
                          title="Download"
                          className="hidden h-7 w-7 items-center justify-center rounded-full text-gray-400 opacity-0 transition hover:bg-gray-200 hover:text-gray-700 group-hover:opacity-100 sm:flex dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 cursor-pointer"
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
                        className="hidden h-7 w-7 items-center justify-center rounded-full text-gray-400 opacity-0 transition hover:bg-gray-200 hover:text-blue-600 group-hover:opacity-100 sm:flex dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400 cursor-pointer"
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
                        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 cursor-pointer"
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
