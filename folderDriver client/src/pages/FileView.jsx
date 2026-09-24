import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Download,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  File,
  Eye,
  Music,
  Video as VideoIcon,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Share2,
  Cloud,
  FileCode,
  Archive,
} from "lucide-react";
import { toast } from "sonner";
import { useOpenFileMutation } from "../store/slices/Flieslice";
import SEO from "../components/common/SEO";
import ThemeToggle from "../components/common/ThemeToggle";

export default function FileView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [openFile, { isLoading: isFetching }] = useOpenFileMutation();
  const [fileData, setFileData] = useState(location.state || null);
  const [fetchError, setFetchError] = useState("");
  const [useGoogleDocsFallback, setUseGoogleDocsFallback] = useState(false);

  // Image manipulation state
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewContainerRef = useRef(null);

  useEffect(() => {
    // If state is not present, fetch file by ID
    if (!fileData && id) {
      openFile({ id })
        .unwrap()
        .then((data) => {
          setFileData(data);
        })
        .catch((err) => {
          console.error("Failed to load file:", err);
          setFetchError(
            err?.data?.message || err?.message || "Failed to load file details."
          );
        });
    }
  }, [id, fileData, openFile]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!previewContainerRef.current) return;
    if (!document.fullscreenElement) {
      previewContainerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Preview link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return null;
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );
    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  };

  if (isFetching) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/25">
          <Loader2 className="h-7 w-7 animate-spin text-white" />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Opening file preview
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  if (fetchError || (!fileData && !isFetching)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          File Preview Unavailable
        </h2>
        <p className="mt-2 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          {fetchError || "The requested file could not be loaded or you do not have permission to view it."}
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    );
  }

  const {
    name = "Untitled File",
    url = "",
    downloadUrl = "",
    extension = "",
    size = 0,
    createdAt,
  } = fileData || {};

  const ext = (extension || name.split(".").pop() || "").toLowerCase();
  const isPdf = ext === "pdf";
  const isImage = ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "ico", "avif"].includes(ext);
  const isVideo = ["mp4", "webm", "ogg", "mov", "mkv"].includes(ext);
  const isAudio = ["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ext);
  const isCode = ["js", "jsx", "ts", "tsx", "html", "css", "json", "py", "java", "c", "cpp", "md", "xml", "yaml", "yml"].includes(ext);
  const isArchive = ["zip", "rar", "7z", "tar", "gz"].includes(ext);

  const formattedSize = formatBytes(size);

  const resolvedDownloadUrl =
    downloadUrl ||
    (url.includes("/upload/")
      ? url.replace("/upload/", "/upload/fl_attachment/")
      : url);

  const pdfViewerUrl = useGoogleDocsFallback
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    : url;

  return (
    <div className="min-h-screen bg-slate-100/80 transition-colors dark:bg-slate-950 p-3 sm:p-5 lg:p-6 flex flex-col font-sans">
      <SEO
        title={name ? `${name} - Storely File Preview` : "File Preview - Storely"}
        description={`Preview and download ${name} securely on Storely.`}
        noIndex={true}
      />

      <div className="mx-auto flex-1 w-full max-w-7xl flex flex-col space-y-3">
        {/* ================= TOP NAVIGATION BAR ================= */}
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-2xs backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95">
          {/* Left: Back & File Name */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <ChevronLeft size={15} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                {isPdf ? (
                  <FileText size={18} />
                ) : isImage ? (
                  <ImageIcon size={18} />
                ) : isVideo ? (
                  <VideoIcon size={18} />
                ) : isAudio ? (
                  <Music size={18} />
                ) : isCode ? (
                  <FileCode size={18} />
                ) : isArchive ? (
                  <Archive size={18} />
                ) : (
                  <File size={18} />
                )}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-xs font-bold text-slate-900 dark:text-white sm:text-sm max-w-[200px] sm:max-w-md" title={name}>
                  {name}
                </h1>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  {ext && <span className="uppercase font-bold text-blue-600 dark:text-blue-400">{ext}</span>}
                  {formattedSize && (
                    <>
                      <span>•</span>
                      <span>{formattedSize}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Controls & Actions */}
          <div className="flex items-center gap-2">
            {/* Image zoom controls */}
            {isImage && (
              <div className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-850">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  title="Zoom Out"
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                  }}
                  title="Reset 100%"
                  className="px-1.5 text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  title="Zoom In"
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  title="Rotate 90deg"
                  className="rounded-lg p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <RotateCw size={14} />
                </button>
              </div>
            )}

            {/* Copy preview link */}
            <button
              onClick={copyShareLink}
              title="Copy share link"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Open Raw in New Tab */}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title="Open original file"
                className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ExternalLink size={14} />
                <span>Open in Tab</span>
              </a>
            )}

            {/* Direct Download */}
            {resolvedDownloadUrl && (
              <a
                href={resolvedDownloadUrl}
                download={name}
                title="Download to device"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99]"
              >
                <Download size={14} />
                <span>Download</span>
              </a>
            )}
          </div>
        </header>

        {/* ================= PREVIEW CANVAS CONTAINER ================= */}
        <div
          ref={previewContainerRef}
          className={`flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs transition-colors dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-center ${
            isFullscreen ? "p-4" : ""
          }`}
        >
          {/* IMAGE VIEWER */}
          {isImage ? (
            <div className="relative flex flex-1 items-center justify-center overflow-auto p-4 sm:p-8 min-h-[60vh] max-h-[82vh] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:16px_16px]">
              <img
                src={url}
                alt={name}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-md drop-shadow-sm select-none"
              />
            </div>
          ) : isVideo ? (
            /* VIDEO PLAYER */
            <div className="flex flex-1 items-center justify-center bg-black/95 p-3 sm:p-6 min-h-[60vh]">
              <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                <video
                  controls
                  autoPlay={false}
                  src={url}
                  className="max-h-[75vh] w-full bg-black object-contain"
                >
                  Your browser does not support the video preview.
                </video>
              </div>
            </div>
          ) : isAudio ? (
            /* AUDIO PLAYER */
            <div className="flex flex-1 flex-col items-center justify-center p-8 sm:p-14 text-center min-h-[50vh]">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/25 ring-8 ring-blue-500/10">
                <Music size={40} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white max-w-md truncate">
                {name}
              </h3>
              <p className="mt-1 text-xs text-slate-400">Audio playback</p>

              <div className="mt-8 w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-850">
                <audio controls src={url} className="w-full">
                  Your browser does not support audio playback.
                </audio>
              </div>
            </div>
          ) : isPdf ? (
            /* PDF VIEWER */
            <div className="flex flex-1 flex-col h-full min-h-[75vh]">
              <iframe
                src={pdfViewerUrl}
                title={name}
                className="h-[75vh] sm:h-[82vh] w-full border-0 rounded-t-2xl"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
                <span>PDF Document Viewer</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setUseGoogleDocsFallback((prev) => !prev)}
                    className="font-semibold text-blue-600 hover:text-blue-700 underline dark:text-blue-400"
                  >
                    {useGoogleDocsFallback
                      ? "Switch to native viewer"
                      : "Try Google Docs fallback"}
                  </button>
                  <span>•</span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:text-blue-700 underline dark:text-blue-400"
                  >
                    Open direct PDF
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* UNSUPPORTED / GENERIC FILE PREVIEW */
            <div className="flex flex-1 flex-col items-center justify-center p-8 sm:p-14 text-center min-h-[50vh]">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 ring-8 ring-slate-200/40 dark:ring-slate-800/40">
                <File size={36} />
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300 mb-2">
                .{ext || "file"}
              </span>

              <h3 className="text-base font-bold text-slate-900 dark:text-white max-w-md truncate">
                {name}
              </h3>

              <p className="mt-2 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                Inline browser preview is not supported for this file type. You can download and inspect it locally on your computer.
              </p>

              {resolvedDownloadUrl && (
                <a
                  href={resolvedDownloadUrl}
                  download={name}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99]"
                >
                  <Download size={14} />
                  <span>Download {formattedSize ? `(${formattedSize})` : "File"}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
