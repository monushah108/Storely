import ReactDOM from "react-dom";
import { AlertCircle, Loader2, UploadCloud, X } from "lucide-react";
import RenderFileIcon from "../../hook/RenderFileIcon";

const formatBytes = (bytes) => {
  if (!bytes) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
};

export default function StateModle({
  file,
  isLoading,
  isError,
  error,
  onClose,
}) {
  if (!isLoading && !isError) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-blue-600" />

            <h2 className="text-sm font-semibold text-gray-800">
              {isLoading ? "Uploading file" : "Upload failed"}
            </h2>
          </div>

          {isError && (
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="p-5">
          {/* File */}
          {file && (
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                {RenderFileIcon(file.type)}
              </div>

              <div className="min-w-0">
                <p
                  className="truncate text-sm font-medium text-gray-800"
                  title={file.name}
                >
                  {file.name}
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />

              <span>Uploading...</span>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="mt-5">
              <div className="flex gap-3 rounded-lg bg-red-50 p-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />

                <p className="text-sm text-red-600">
                  {error?.data?.message ||
                    "Something went wrong while uploading your file."}
                </p>
              </div>

              <button
                onClick={onClose}
                className="mt-4 w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
