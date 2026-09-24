import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  Cloud,
  Copy,
  Check,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import GuestFolderView from "./GuestFolderView";
import RenderFileIcon from "../hook/RenderFileIcon";
import SEO from "../components/common/SEO";
import ThemeToggle from "../components/common/ThemeToggle";

export default function Guest() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [useGoogleDocsFallback, setUseGoogleDocsFallback] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Share link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "-";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );
    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/25">
          <Loader2 className="h-7 w-7 animate-spin text-white" />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Loading shared files
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Decrypting and validating link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Shared Link Unavailable
        </h2>
        <p className="mt-2 max-w-md text-xs text-slate-500 dark:text-slate-400">
          {error}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
        >
          <Cloud className="h-4 w-4" />
          <span>Explore Storely</span>
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const isFolder = data.itemType === "directory" || data.isFolder;
  const owner = data.userId || {};

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

  const singlePdfViewerUrl = useGoogleDocsFallback && data.url
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(data.url)}&embedded=true`
    : data.url;

  // For modal preview
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
    <div className="min-h-screen bg-slate-50/70 transition-colors dark:bg-slate-950 font-sans">
      <SEO
        title={data?.name ? `${data.name} - Shared on Storely` : "Shared Content - Storely"}
        description={`View and download ${data.name || "files"} shared with you securely on Storely.`}
        noIndex={true}
      />
      <Toaster richColors position="top-center" />

      {/* ================= GUEST TOP NAVIGATION ================= */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/20">
              <Cloud className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Storely
              </span>
              <span className="ml-2 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 uppercase dark:bg-blue-500/10 dark:text-blue-400">
                Shared
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              to="/auth/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
            >
              <span className="hidden sm:inline">Get Free Drive</span>
              <span className="sm:hidden">Join</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8 space-y-6">
        {/* HERO CARD */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left File/Folder Details */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs dark:bg-blue-500/10 dark:text-blue-400">
                {isFolder ? (
                  <Folder size={28} className="fill-blue-500/20" />
                ) : (
                  <FileText size={28} />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-base font-bold text-slate-900 dark:text-white sm:text-xl" title={data.name}>
                    {data.name}
                  </h1>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    Shared {isFolder ? "Folder" : "File"}
                  </span>
                  <span>•</span>
                  {isFolder ? (
                    <span>
                      {(data.directories?.length || 0) + (data.files?.length || 0)} items
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
                        {new Date(data.createdAt).toLocaleDateString("en-US", {
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

            {/* Right: Owner Badge & Copy Button */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {owner.name && (
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 py-1 pl-1 pr-3 dark:border-slate-800 dark:bg-slate-850">
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
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Shared by {owner.name}
                  </span>
                </div>
              )}

              <button
                onClick={copyShareLink}
                title="Copy share link"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        {isFolder ? (
          /* FOLDER DIRECTORY VIEW */
          <GuestFolderView
            data={data}
            formatBytes={formatBytes}
            setPreviewFile={setPreviewFile}
          />
        ) : (
          /* SINGLE FILE PREVIEW CARD */
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-colors dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                File Preview
              </span>

              <div className="flex items-center gap-2">
                {data.url && (
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <ExternalLink size={13} className="text-slate-500" />
                    <span>Open Raw</span>
                  </a>
                )}

                {singleDownloadUrl && (
                  <a
                    href={singleDownloadUrl}
                    download={data.name}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition active:scale-[0.99]"
                  >
                    <Download size={14} />
                    <span>Download File</span>
                  </a>
                )}
              </div>
            </div>

            {/* Viewer frame */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-center min-h-[50vh]">
              {isSingleImage ? (
                <div className="flex items-center justify-center p-4">
                  <img
                    src={data.url}
                    alt={data.name}
                    className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-xs"
                  />
                </div>
              ) : isSingleVideo ? (
                <div className="flex items-center justify-center bg-black p-2 sm:p-4">
                  <video controls src={data.url} className="max-h-[70vh] w-full rounded-xl">
                    Your browser does not support the video preview.
                  </video>
                </div>
              ) : isSingleAudio ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Music size={36} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">{data.name}</h3>
                  <audio controls src={data.url} className="w-full max-w-md">
                    Your browser does not support audio playback.
                  </audio>
                </div>
              ) : isSinglePdf ? (
                <div className="flex flex-col h-[75vh]">
                  <iframe src={singlePdfViewerUrl} title={data.name} className="h-full w-full border-0" />
                  <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    <span>PDF Document</span>
                    <button
                      type="button"
                      onClick={() => setUseGoogleDocsFallback((prev) => !prev)}
                      className="text-blue-600 underline font-semibold dark:text-blue-400"
                    >
                      {useGoogleDocsFallback ? "Use native viewer" : "Try Google Docs fallback"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    <File size={36} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{data.name}</h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm">
                    Direct browser preview is not supported for this file type. Please download the file to inspect it.
                  </p>
                  {singleDownloadUrl && (
                    <a
                      href={singleDownloadUrl}
                      download={data.name}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
                    >
                      <Download size={14} />
                      <span>Download File</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL PREVIEW FOR FOLDER FILES */}
        {previewFile && (
          <div
            onClick={() => setPreviewFile(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-5 md:p-6 transition-all"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-[88vh] w-full max-w-5xl flex-col rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3 min-w-0 mr-4">
                  <div className="scale-75 shrink-0">
                    {RenderFileIcon(previewExt)}
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate font-bold text-sm text-slate-900 dark:text-white" title={previewFile.name}>
                      {previewFile.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      {previewExt && <span className="uppercase font-semibold text-blue-600 dark:text-blue-400">{previewExt}</span>}
                      <span>•</span>
                      <span>{formatBytes(previewFile.size)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {previewFile.url && (
                    <a
                      href={previewFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <ExternalLink size={13} className="text-slate-500" />
                      <span className="hidden sm:inline">Open</span>
                    </a>
                  )}

                  {previewDownloadUrl && (
                    <a
                      href={previewDownloadUrl}
                      download={previewFile.name}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
                    >
                      <Download size={13} />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setPreviewFile(null)}
                    title="Close (Esc)"
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-950 flex flex-col justify-center">
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
                    <video controls autoPlay src={previewFile.url} className="max-h-[75vh] w-full rounded-xl">
                      Your browser does not support the video preview.
                    </video>
                  </div>
                ) : isPreviewAudio && previewFile.url ? (
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Music size={36} />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">{previewFile.name}</h3>
                    <audio controls src={previewFile.url} className="w-full max-w-md">
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                ) : isPreviewPdf && previewFile.url ? (
                  <div className="flex flex-1 flex-col h-full">
                    <iframe src={previewViewerPdfUrl} title={previewFile.name} className="flex-1 w-full border-0" />
                    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                      <span>PDF Document</span>
                      <button
                        type="button"
                        onClick={() => setUseGoogleDocsFallback((prev) => !prev)}
                        className="text-blue-600 underline font-semibold dark:text-blue-400"
                      >
                        {useGoogleDocsFallback ? "Use standard viewer" : "Try Google Docs fallback"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                      <File size={36} />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{previewFile.name}</h3>
                    <p className="mt-1 text-xs text-slate-400 max-w-sm">
                      Direct preview is not available in the browser. You can download the file directly.
                    </p>
                    {previewDownloadUrl && (
                      <a
                        href={previewDownloadUrl}
                        download={previewFile.name}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
                      >
                        <Download size={14} />
                        <span>Download File</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
