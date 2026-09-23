import React from "react";
import { Folder, Download, Eye, FolderOpen } from "lucide-react";
import RenderFileIcon from "../hook/RenderFileIcon";

export default function GuestFolderView({ data, formatBytes, setPreviewFile }) {
  const directories = data.directories || [];
  const files = data.files || [];
  const totalItems = directories.length + files.length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-gray-800">
          Folder Contents ({totalItems} items)
        </h2>
        {data.size !== undefined && data.size > 0 && (
          <span className="text-xs font-semibold text-gray-500">
            Total Size: {formatBytes(data.size)}
          </span>
        )}
      </div>

      {/* Subfolders */}
      {directories.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Folders ({directories.length})
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {directories.map((dir) => (
              <div
                key={dir._id || dir.id}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-[#f8fafd] p-3 text-sm font-medium text-gray-800"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Folder className="h-5 w-5 fill-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{dir.name}</span>
                  <span className="text-[11px] text-gray-400">
                    {dir.itemCount !== undefined ? `${dir.itemCount} items` : "Folder"}
                    {dir.size ? ` • ${formatBytes(dir.size)}` : ""}
                    {dir.createdAt ? ` • ${formatDate(dir.createdAt)}` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files list */}
      {files.length > 0 ? (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Files ({files.length})
          </h3>
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
            {files.map((file) => (
              <div
                key={file._id || file.id}
                className="flex items-center justify-between p-3.5 transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                  <div className="scale-75">
                    {RenderFileIcon(file.extension || "")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {file.extension && (
                        <span className="font-mono uppercase font-bold text-gray-500">
                          .{file.extension}
                        </span>
                      )}
                      <span>•</span>
                      <span>{formatBytes(file.size)}</span>
                      {file.createdAt && (
                        <>
                          <span>•</span>
                          <span>Uploaded {formatDate(file.createdAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {file.url && (
                    <button
                      type="button"
                      onClick={() => setPreviewFile(file)}
                      className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <Eye className="h-3.5 w-3.5 text-gray-500" />
                      <span>Preview</span>
                    </button>
                  )}
                  {file.url && (
                    <a
                      href={file.downloadUrl || file.url.replace("/upload/", "/upload/fl_attachment/")}
                      download={file.name}
                      className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !directories.length && (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
            <FolderOpen className="h-10 w-10 text-gray-300" />
            <p className="mt-2 text-xs text-gray-400">This shared folder is empty</p>
          </div>
        )
      )}
    </div>
  );
}
