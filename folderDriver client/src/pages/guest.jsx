import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FileText,
  Folder,
  Loader2,
  AlertCircle,
  Download,
  Eye,
  ExternalLink,
  FolderOpen,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import RenderFileIcon from "../hook/RenderFileIcon";

export default function Guest() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSharedItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/share/${id}`, {
          method: "POST",
          credentials: "include",
        });
        const result = await res.json();

        if (res.status === 404 || res.status === 410) {
          setError(result.message || "This shared link is invalid or has expired.");
          return;
        }

        setData(result);
      } catch (err) {
        toast.error("Failed to load shared content");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedItem();
  }, [id, baseUrl]);

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "-";
    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#f8fafd] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-gray-500">Loading shared content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#f8fafd] p-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Link Unavailable</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const isFolder = data.itemType === "directory" || data.isFolder;
  const owner = data.userId || {};

  return (
    <div className="min-h-screen bg-[#f8fafd] p-4 sm:p-6 md:p-8">
      <Toaster richColors position="top-center" />
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                {isFolder ? <Folder className="h-6 w-6 fill-blue-600" /> : <FileText className="h-6 w-6" />}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                  {data.name}
                </h1>
                <p className="text-xs text-gray-500">
                  Shared {isFolder ? "Folder" : "File"} • Anyone with this link can view
                </p>
              </div>
            </div>

            {/* Owner badge */}
            {owner.name && (
              <div className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-gray-50/70 py-1.5 pl-2 pr-3.5">
                {owner.picture ? (
                  <img
                    src={owner.picture}
                    alt={owner.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {owner.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-medium text-gray-700">
                  Shared by {owner.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content Viewer: Folder View */}
        {isFolder ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <h2 className="mb-4 text-sm font-bold text-gray-800">
              Folder Contents ({((data.directories?.length || 0) + (data.files?.length || 0))} items)
            </h2>

            {/* Subfolders */}
            {data.directories?.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Folders ({data.directories.length})
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {data.directories.map((dir) => (
                    <div
                      key={dir._id}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-[#f8fafd] p-3 text-sm font-medium text-gray-800"
                    >
                      <Folder className="h-5 w-5 fill-blue-600 text-blue-600" />
                      <span className="truncate">{dir.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Files list */}
            {data.files?.length > 0 ? (
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Files ({data.files.length})
                </h3>
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
                  {data.files.map((file) => (
                    <div
                      key={file._id}
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
                          <p className="text-xs text-gray-400">
                            {formatBytes(file.size)}
                          </p>
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
                            href={file.url.replace("/upload/", "/upload/fl_attachment/")}
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
              !data.directories?.length && (
                <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                  <FolderOpen className="h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-xs text-gray-400">This shared folder is empty</p>
                </div>
              )
            )}
          </div>
        ) : (
          /* Single File View */
          <div className="space-y-4">
            <div className="flex justify-end">
              {data.url && (
                <a
                  href={data.url.replace("/upload/", "/upload/fl_attachment/")}
                  download={data.name}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Download file</span>
                </a>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
              {data.resourceType === "video" ? (
                <video controls className="h-[70vh] w-full bg-black">
                  <source src={data.url} />
                </video>
              ) : (
                <iframe
                  src={data.url}
                  title={data.name}
                  className="h-[75vh] w-full"
                />
              )}
            </div>
          </div>
        )}

        {/* File Preview Modal for folders */}
        {previewFile && (
          <div
            onClick={() => setPreviewFile(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-[85vh] w-full max-w-5xl flex-col rounded-2xl bg-white overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <span className="font-semibold text-sm text-gray-800 truncate">
                  {previewFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="rounded-lg px-3 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-hidden bg-black/5">
                <iframe
                  src={previewFile.url}
                  title={previewFile.name}
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
