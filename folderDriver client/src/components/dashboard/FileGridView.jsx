import React from "react";
import { MoreVertical, Loader2 } from "lucide-react";
import RenderFileIcon from "../../hook/RenderFileIcon";

export default function FileGridView({
  files = [],
  selectedId,
  onSelect,
  onOpenFile,
  onContextMenu,
  onMenuClick,
  deletingId,
}) {
  if (!files.length) return null;

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    );
    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  };

  const isImage = (ext) => {
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
      (ext || "").toLowerCase(),
    );
  };

  return (
    <div>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
        Files ({files.length})
      </h2>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {files.map((file) => {
          const isSelected = selectedId === file._id;
          const isDeleting = deletingId === file._id;
          const imageFile = isImage(file.extension);

          return (
            <div
              key={file._id}
              onClick={() => onSelect(file)}
              onDoubleClick={() => onOpenFile(file._id, file.extension)}
              onContextMenu={(e) => {
                if (!isDeleting) onContextMenu(e, file);
              }}
              className={`group relative flex flex-col overflow-hidden rounded-xl border transition select-none ${
                isDeleting
                  ? "cursor-not-allowed border-red-200 bg-red-50"
                  : isSelected
                    ? "border-blue-400 bg-blue-50/40 shadow-xs ring-1 ring-blue-400"
                    : "cursor-pointer border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs"
              }`}
            >
              {/* Preview Thumbnail Container */}
              <div className="relative flex h-32 w-full items-center justify-center overflow-hidden bg-[#f8fafd]">
                {isDeleting ? (
                  <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                ) : imageFile && file.url ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-xs">
                    {RenderFileIcon(file.extension || "")}
                  </div>
                )}
              </div>

              {/* Card Footer: Details */}
              <div className="flex items-center justify-between p-3">
                <div className="min-w-0 flex-1 pr-2">
                  <p
                    title={file.name}
                    className={`truncate text-xs font-semibold ${
                      isDeleting ? "text-red-600" : "text-gray-800"
                    }`}
                  >
                    {isDeleting ? "Deleting..." : file.name}
                  </p>

                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400">
                    <span className="uppercase font-medium">
                      {file.extension || "FILE"}
                    </span>
                    <span>•</span>
                    <span>{formatBytes(file.size)}</span>
                  </div>
                </div>

                {!isDeleting && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMenuClick(e, file);
                    }}
                    title="Options"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 opacity-80 transition hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
