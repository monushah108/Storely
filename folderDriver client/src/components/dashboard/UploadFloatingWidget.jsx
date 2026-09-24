import React, { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import RenderFileIcon from "../../hook/RenderFileIcon";

export default function UploadFloatingWidget({
  file,
  isLoading,
  isError,
  error,
  onClose,
}) {
  const [minimized, setMinimized] = useState(false);

  if (!file && !isLoading && !isError) return null;

  const formatBytes = (bytes) => {
    if (!bytes) return "0 Bytes";
    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  };

  const extension = file?.name ? file.name.split(".").pop() : "";

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 z-50 sm:w-80 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl animate-in slide-in-from-bottom-5 dark:border-slate-800 dark:bg-slate-900">
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-[#f8fafd] px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950/60">
        <span className="text-xs font-semibold text-gray-800 dark:text-slate-100">
          {isLoading
            ? "Uploading 1 item"
            : isError
              ? "Upload failed"
              : "Upload complete"}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMinimized((prev) => !prev)}
            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            {minimized ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Widget Body */}
      {!minimized && file && (
        <div className="p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800">
                <div className="scale-75">{RenderFileIcon(extension)}</div>
              </div>

              <div className="min-w-0 flex-1">
                <p
                  title={file.name}
                  className="truncate text-xs font-medium text-gray-800 dark:text-slate-200"
                >
                  {file.name}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-slate-400">
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="shrink-0">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
              ) : isError ? (
                <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
          </div>

          {isError && (
            <p className="mt-2 text-[11px] text-red-600 dark:text-red-400">
              {error?.data?.message || "Failed to upload. Please try again."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
