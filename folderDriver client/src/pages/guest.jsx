import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FileText,
  Folder,
  Loader2,
  AlertCircle,
  Download,
  ExternalLink,
  X,
  Music,
  Video as VideoIcon,
  Image as ImageIcon,
  File,
  ShieldCheck,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import GuestFolderView from "./GuestFolderView";
import RenderFileIcon from "../hook/RenderFileIcon";

export default function Guest() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [useGoogleDocsFallback, setUseGoogleDocsFallback] = useState(false);

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

  // Handle ESC key to close preview modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewFile(null);
      }
    };
    if (previewFile) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [previewFile]);

  // Reset Google Docs fallback when preview changes
  useEffect(() => {
    setUseGoogleDocsFallback(false);
  }, [previewFile]);

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "-";
    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    );
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

  // For single file view:
  const singleExt = (data.extension || data.name?.split(".").pop() || "").toLowerCase();
  const isSinglePdf = singleExt === "pdf";
  const isSingleImage = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(singleExt);
  const isSingleVideo = ["mp4", "webm", "ogg", "mov"].includes(singleExt) || data.resourceType === "video";
  const isSingleAudio = ["mp3", "wav", "ogg", "m4a", "aac"].includes(singleExt);

  const singleDownloadUrl =
    data.downloadUrl ||
    (data.url?.includes("/upload/")
      ? data.url.replace("/upload/", "/upload/fl_attachment/")
      : data.url);

  // For modal preview file:
  const previewExt = (previewFile?.extension || previewFile?.name?.split(".").pop() || "").toLowerCase();
  const isPreviewPdf = previewExt === "pdf";
  const isPreviewImage = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(previewExt);
  const isPreviewVideo = ["mp4", "webm", "ogg", "mov"].includes(previewExt) || previewFile?.resourceType === "video";
  const isPreviewAudio = ["mp3", "wav", "ogg", "m4a", "aac"].includes(previewExt);

  const previewDownloadUrl =
    previewFile?.downloadUrl ||
    (previewFile?.url?.includes("/upload/")
      ? previewFile.url.replace("/upload/", "/upload/fl_attachment/")
      : previewFile?.url);

  const previewViewerPdfUrl = useGoogleDocsFallback && previewFile?.url
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(previewFile.url)}&embedded=true`
    : previewFile?.url;

  return (
    <div className="min-h-screen bg-[#f8fafd] p-4 sm:p-6 md:p-8">
      <Toaster richColors position="top-center" />
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Main Shared Header */}
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
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold text-blue-600">
                    Shared {isFolder ? "Folder" : "File"}
                  </span>
                  <span>•</span>
                  {isFolder ? (
                    <span>
                      {((data.directories?.length || 0) + (data.files?.length || 0))} items
                      {data.size ? ` (${formatBytes(data.size)})` : ""}
                    </span>
                  ) : (
                    <span>
                      {data.extension?.toUpperCase()} • {formatBytes(data.size)}
                    </span>
                  )}
                  {data.createdAt && (
                    <>
                      <span>•</span>
                      <span>
                        Created {new Date(data.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </>
                  )}
                </div>
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

        {/* Content Section */}
        {isFolder ? (
          /* FOLDER VIEW */
          <GuestFolderView
            data={data}
            formatBytes={formatBytes}
            setPreviewFile={setPreviewFile}
          />
        ) : (
          /* SINGLE FILE VIEW */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                File Preview
              </span>
              <div className="flex items-center gap-2">
                {data.url && (
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
                    <span>Open in new tab</span>
                  </a>
                )}
                {singleDownloadUrl && (
                  <a
                    href={singleDownloadUrl}
                    download={data.name}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download file</span>
                  </a>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
              {isSingleImage ? (
                <div className="flex min-h-[55vh] max-h-[75vh] items-center justify-center bg-slate-50/50 p-4">
                  <img
                    src={data.url}
                    alt={data.name}
                    className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-xs"
                  />
                </div>
              ) : isSingleVideo ? (
                <div className="flex min-h-[55vh] items-center justify-center bg-black p-2 sm:p-4">
                  <video controls src={data.url} className="h-[70vh] w-full rounded-lg">
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : isSingleAudio ? (
                <div className="flex min-h-[35vh] flex-col items-center justify-center bg-slate-50 p-8 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <Music className="h-7 w-7" />
                  </div>
                  <audio controls src={data.url} className="w-full max-w-md">
                    Your browser does not support audio.
                  </audio>
                </div>
              ) : isSinglePdf ? (
                <div className="flex flex-col">
                  <iframe
                    src={data.url}
                    title={data.name}
                    className="h-[75vh] w-full border-0 bg-white"
                  />
                  <div className="flex items-center justify-between border-t border-gray-100 bg-slate-50 px-4 py-2.5 text-xs text-gray-500">
                    <span>PDF preview not rendering in your browser?</span>
                    <a
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-700 underline"
                    >
                      Open in new tab
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[45vh] flex-col items-center justify-center bg-slate-50 p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <File className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-base">{data.name}</h3>
                  <p className="mt-1 text-xs text-gray-500 max-w-sm">
                    Direct browser preview is not available for this file type. Please download the file to open it.
                  </p>
                  {singleDownloadUrl && (
                    <a
                      href={singleDownloadUrl}
                      download={data.name}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download File</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced File Preview Modal for folder files */}
        {previewFile && (
          <div
            onClick={() => setPreviewFile(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-5 md:p-6 transition-all"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-[88vh] w-full max-w-5xl flex-col rounded-2xl bg-white overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-5">
                <div className="flex items-center gap-3 min-w-0 mr-4">
                  <div className="scale-75 shrink-0">
                    {RenderFileIcon(previewExt)}
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate font-bold text-sm text-gray-900" title={previewFile.name}>
                      {previewFile.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      {previewExt && <span className="uppercase font-semibold text-gray-500">{previewExt}</span>}
                      <span>•</span>
                      <span>{formatBytes(previewFile.size)}</span>
                    </div>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {previewFile.url && (
                    <a
                      href={previewFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in new window"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-slate-100 transition"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
                      <span className="hidden sm:inline">Open</span>
                    </a>
                  )}

                  {previewDownloadUrl && (
                    <a
                      href={previewDownloadUrl}
                      download={previewFile.name}
                      title="Download file"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setPreviewFile(null)}
                    title="Close preview (Esc)"
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Modal Viewer Body */}
              <div className="flex-1 overflow-auto bg-slate-100/50 flex flex-col">
                {isPreviewImage && previewFile.url ? (
                  <div className="flex flex-1 items-center justify-center p-4">
                    <img
                      src={previewFile.url}
                      alt={previewFile.name}
                      className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-xs"
                    />
                  </div>
                ) : isPreviewVideo && previewFile.url ? (
                  <div className="flex flex-1 items-center justify-center bg-black p-2 sm:p-4">
                    <video
                      controls
                      autoPlay
                      src={previewFile.url}
                      className="max-h-[75vh] w-full rounded-xl"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : isPreviewAudio && previewFile.url ? (
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-white">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-xs">
                      <Music className="h-10 w-10" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-base mb-4">{previewFile.name}</h3>
                    <audio controls src={previewFile.url} className="w-full max-w-md">
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                ) : isPreviewPdf && previewFile.url ? (
                  <div className="flex flex-1 flex-col h-full">
                    <iframe
                      src={previewViewerPdfUrl}
                      title={previewFile.name}
                      className="flex-1 w-full border-0 bg-white"
                    />
                    {/* PDF Helper Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-white px-4 py-2 text-xs text-gray-500">
                      <span>PDF preview issues?</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setUseGoogleDocsFallback((prev) => !prev)}
                          className="font-medium text-blue-600 hover:text-blue-700 underline cursor-pointer"
                        >
                          {useGoogleDocsFallback
                            ? "Switch to standard PDF viewer"
                            : "Try Google Docs viewer fallback"}
                        </button>
                        <span>•</span>
                        <a
                          href={previewFile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-700 underline"
                        >
                          Open directly
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-white">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-500 border border-slate-100 shadow-xs">
                      <File className="h-10 w-10" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-base">{previewFile.name}</h3>
                    <p className="mt-1 text-xs text-gray-400 max-w-sm">
                      Direct preview is not available for this file type in the browser. You can download the file to inspect its contents.
                    </p>
                    {previewDownloadUrl && (
                      <a
                        href={previewDownloadUrl}
                        download={previewFile.name}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download File</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
