import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useOpenFileMutation } from "../store/slices/Flieslice";

export default function FileView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [openFile, { isLoading: isFetching }] = useOpenFileMutation();
  const [fileData, setFileData] = useState(location.state || null);
  const [fetchError, setFetchError] = useState("");
  const [useGoogleDocsFallback, setUseGoogleDocsFallback] = useState(false);

  useEffect(() => {
    // If state is not present (e.g. page reload or direct link), fetch file by ID
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

  if (isFetching) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-gray-500">Loading file preview...</p>
      </div>
    );
  }

  if (fetchError || (!fileData && !isFetching)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">File Unavailable</h2>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          {fetchError || "No file was selected or you do not have permission to view it."}
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { name = "Untitled File", url = "", downloadUrl = "", extension = "" } = fileData || {};

  const ext = (extension || name.split(".").pop() || "").toLowerCase();
  const isPdf = ext === "pdf";
  const isImage = ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "ico"].includes(ext);
  const isVideo = ["mp4", "webm", "ogg", "mov", "mkv"].includes(ext);
  const isAudio = ["mp3", "wav", "ogg", "m4a", "aac"].includes(ext);

  // Download URL fallback
  const resolvedDownloadUrl =
    downloadUrl ||
    (url.includes("/upload/")
      ? url.replace("/upload/", "/upload/fl_attachment/")
      : url);

  // If using Google Docs viewer fallback for PDFs
  const pdfViewerUrl = useGoogleDocsFallback
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    : url;

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Navigation & Actions Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs border border-gray-200 transition hover:bg-slate-50 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title="Open file in new tab"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-xs border border-gray-200 hover:bg-slate-50 transition"
              >
                <ExternalLink className="h-4 w-4 text-gray-500" />
                <span className="hidden sm:inline">Open in New Tab</span>
              </a>
            )}

            {resolvedDownloadUrl && (
              <a
                href={resolvedDownloadUrl}
                download={name}
                title="Download file"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </a>
            )}
          </div>
        </div>

        {/* File Info Bar */}
        <div className="rounded-2xl bg-white p-4 shadow-xs border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600 shrink-0">
              {isPdf ? (
                <FileText className="h-6 w-6" />
              ) : isImage ? (
                <ImageIcon className="h-6 w-6" />
              ) : isVideo ? (
                <VideoIcon className="h-6 w-6" />
              ) : isAudio ? (
                <Music className="h-6 w-6" />
              ) : (
                <File className="h-6 w-6" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-bold text-gray-900 sm:text-lg" title={name}>
                {name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                {ext && <span className="uppercase font-semibold text-gray-500">{ext}</span>}
                <span>•</span>
                <span>Previewing file</span>
              </div>
            </div>
          </div>
        </div>

        {/* File Viewer Container */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xs border border-gray-200 flex flex-col">
          {isImage ? (
            <div className="flex min-h-[60vh] max-h-[80vh] items-center justify-center bg-slate-50/50 p-4">
              <img
                src={url}
                alt={name}
                className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain shadow-xs"
              />
            </div>
          ) : isVideo ? (
            <div className="flex min-h-[60vh] items-center justify-center bg-black p-2 sm:p-4">
              <video
                controls
                src={url}
                className="max-h-[75vh] w-full rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : isAudio ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center bg-slate-50 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Music className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-4">{name}</h3>
              <audio controls src={url} className="w-full max-w-md">
                Your browser does not support audio playback.
              </audio>
            </div>
          ) : isPdf ? (
            <div className="flex flex-col">
              <iframe
                src={pdfViewerUrl}
                title={name}
                className="h-[72vh] w-full sm:h-[80vh] border-0"
              />

              {/* PDF Viewer Helper Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-slate-50 px-4 py-2.5 text-xs text-gray-500">
                <span>PDF not displaying properly in the frame?</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setUseGoogleDocsFallback((prev) => !prev)}
                    className="font-medium text-blue-600 hover:text-blue-700 underline cursor-pointer"
                  >
                    {useGoogleDocsFallback
                      ? "Switch to native PDF viewer"
                      : "Try Google Docs viewer fallback"}
                  </button>
                  <span>•</span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-700 underline"
                  >
                    Open in new tab
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[50vh] flex-col items-center justify-center bg-slate-50 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <File className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-800">{name}</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">
                Direct browser preview is not supported for this file type. You can download and open it locally.
              </p>
              {resolvedDownloadUrl && (
                <a
                  href={resolvedDownloadUrl}
                  download={name}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition"
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
  );
}
