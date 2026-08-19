import ReactDOM from "react-dom";
import {
  AlertCircle,
  File,
  FileImage,
  FileText,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
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
  if (!isLoading && !isError) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-semibold text-gray-800">
            {isLoading ? "Uploading File" : "Upload Failed"}
          </h2>

          {isError && (
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="p-5">
          {/* File details */}
          {file && (
            <div className="rounded-xl border bg-gray-50 p-4">
              <div className="flex items-center gap-4">
                {/* File icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  {RenderFileIcon(file.type)}
                </div>

                {/* Name */}
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate font-medium text-gray-800"
                    title={file.name}
                  >
                    {file.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              {/* Extra details */}
              <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4">
                <div>
                  <p className="text-xs text-gray-400">File type</p>

                  <p className="mt-1 truncate text-sm font-medium text-gray-700">
                    {file.type || "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Size</p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="mt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Uploading...
                  </p>

                  <p className="text-xs text-gray-500">
                    Your file is being uploaded to Storely.
                  </p>
                </div>
              </div>

              {/* Fake progress indicator */}
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Please don't close this page.
              </p>
            </div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <div className="mt-5">
              <div className="rounded-xl bg-red-50 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />

                  <div>
                    <p className="text-sm font-semibold text-red-700">
                      Upload failed
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                      {error?.data?.message ||
                        "Something went wrong while uploading your file."}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-4 w-full rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
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
