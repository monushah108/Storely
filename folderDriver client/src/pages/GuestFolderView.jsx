import React, { useState, useMemo } from "react";
import {
  Folder,
  FolderOpen,
  Download,
  Eye,
  ExternalLink,
  Search,
  X,
  LayoutGrid,
  List as ListIcon,
  ArrowUpDown,
  FileText,
  Image as ImageIcon,
  Video as VideoIcon,
  Music,
  Archive,
  File,
  Layers,
} from "lucide-react";
import RenderFileIcon from "../hook/RenderFileIcon";

export default function GuestFolderView({ data, formatBytes, setPreviewFile }) {
  const directories = data?.directories || [];
  const files = data?.files || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState("date-desc"); // 'name-asc', 'name-desc', 'size-desc', 'size-asc', 'date-desc', 'date-asc'

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

  const getFileCategory = (ext) => {
    const e = (ext || "").toLowerCase();
    if (["pdf", "doc", "docx", "txt", "rtf", "odt", "xls", "xlsx", "ppt", "pptx", "csv"].includes(e))
      return "documents";
    if (["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "ico"].includes(e))
      return "images";
    if (["mp4", "webm", "ogg", "mov", "mkv", "mp3", "wav", "aac", "m4a"].includes(e))
      return "media";
    if (["zip", "rar", "7z", "tar", "gz"].includes(e))
      return "archives";
    return "others";
  };

  // Filtered and sorted files
  const filteredFiles = useMemo(() => {
    let list = files.filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      if (!matchesSearch) return false;
      if (activeCategory === "all") return true;
      return getFileCategory(file.extension) === activeCategory;
    });

    list.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "size-desc") return (b.size || 0) - (a.size || 0);
      if (sortBy === "size-asc") return (a.size || 0) - (b.size || 0);
      if (sortBy === "date-desc")
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "date-asc")
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      return 0;
    });

    return list;
  }, [files, searchQuery, activeCategory, sortBy]);

  // Filtered directories
  const filteredDirectories = useMemo(() => {
    if (activeCategory !== "all") return [];
    let list = directories.filter((dir) =>
      dir.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
    list.sort((a, b) => {
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "date-asc")
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === "date-desc")
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [directories, searchQuery, activeCategory, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts = { all: files.length, documents: 0, images: 0, media: 0, archives: 0 };
    files.forEach((f) => {
      const cat = getFileCategory(f.extension);
      if (counts[cat] !== undefined) counts[cat]++;
    });
    return counts;
  }, [files]);

  const totalShown = filteredDirectories.length + filteredFiles.length;

  return (
    <div className="space-y-5">
      {/* Control Bar: Search, Filters, Sort & View Switcher */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs transition">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files and folders..."
              className="w-full rounded-xl border border-gray-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-blue-100 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right Toolbar: Sort & View Toggle */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <ArrowUpDown className="absolute left-3 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-7 text-xs font-medium text-gray-700 hover:border-gray-300 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition appearance-none cursor-pointer"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">Name (A to Z)</option>
                <option value="name-desc">Name (Z to A)</option>
                <option value="size-desc">Size (Largest)</option>
                <option value="size-asc">Size (Smallest)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-gray-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-xs font-semibold"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                title="List View"
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-xs font-semibold"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mr-1 flex items-center gap-1">
            <Layers className="h-3 w-3" /> Filter:
          </span>

          {[
            { id: "all", label: "All Items", count: categoryCounts.all },
            { id: "documents", label: "Documents", count: categoryCounts.documents },
            { id: "images", label: "Images", count: categoryCounts.images },
            { id: "media", label: "Media", count: categoryCounts.media },
            { id: "archives", label: "Archives", count: categoryCounts.archives },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white shadow-xs font-semibold"
                  : "bg-slate-100 text-gray-600 hover:bg-slate-200"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeCategory === cat.id
                    ? "bg-blue-700 text-white"
                    : "bg-white text-gray-500 border border-gray-200"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
        {/* Section Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <span>Folder Items</span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
              {totalShown} {totalShown === 1 ? "item" : "items"}
            </span>
          </h2>

          {data.size !== undefined && data.size > 0 && (
            <span className="text-xs font-medium text-gray-500">
              Total folder size:{" "}
              <strong className="text-gray-700">{formatBytes(data.size)}</strong>
            </span>
          )}
        </div>

        {/* 1. Subfolders Section */}
        {filteredDirectories.length > 0 && (
          <div className="mb-7">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Folder className="h-3.5 w-3.5 text-blue-600" />
              Folders ({filteredDirectories.length})
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredDirectories.map((dir) => (
                <div
                  key={dir._id || dir.id}
                  className="group relative flex items-center gap-3.5 rounded-xl border border-gray-200 bg-slate-50/70 p-3.5 transition-all hover:bg-white hover:border-blue-300 hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600 group-hover:scale-105 transition-transform">
                    <Folder className="h-6 w-6 fill-blue-600 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className="block truncate font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors"
                      title={dir.name}
                    >
                      {dir.name}
                    </span>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-400">
                      <span>{dir.itemCount !== undefined ? `${dir.itemCount} items` : "Folder"}</span>
                      {dir.size ? (
                        <>
                          <span>•</span>
                          <span>{formatBytes(dir.size)}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Files Section */}
        {filteredFiles.length > 0 ? (
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-gray-500" />
              Files ({filteredFiles.length})
            </h3>

            {viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {filteredFiles.map((file) => {
                  const ext = (file.extension || file.name.split(".").pop() || "").toLowerCase();
                  const isImage = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext);
                  const isPdf = ext === "pdf";
                  const resolvedDownload =
                    file.downloadUrl ||
                    (file.url?.includes("/upload/")
                      ? file.url.replace("/upload/", "/upload/fl_attachment/")
                      : file.url);

                  return (
                    <div
                      key={file._id || file.id}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-blue-400 hover:shadow-md"
                    >
                      {/* Top Preview Tile */}
                      <div
                        onClick={() => file.url && setPreviewFile(file)}
                        className="relative flex h-36 w-full items-center justify-center overflow-hidden bg-slate-50/80 cursor-pointer border-b border-gray-100 group-hover:bg-slate-100/60 transition-colors"
                      >
                        {isImage && file.url ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : isPdf ? (
                          <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
                            <div className="rounded-xl bg-red-50 p-2.5 text-red-500 shadow-2xs group-hover:scale-110 transition-transform">
                              <FileText className="h-8 w-8 text-red-500" />
                            </div>
                            <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 tracking-wider">
                              PDF DOCUMENT
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4">
                            <div className="scale-90 transition-transform group-hover:scale-100">
                              {RenderFileIcon(ext)}
                            </div>
                            <span className="mt-1 font-mono text-[10px] font-bold uppercase text-gray-400">
                              .{ext}
                            </span>
                          </div>
                        )}

                        {/* Hover Overlay with Preview Badge */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
                            <Eye className="h-3.5 w-3.5 text-blue-600" />
                            Quick Preview
                          </span>
                        </div>
                      </div>

                      {/* File Card Body */}
                      <div className="p-3.5 flex flex-col justify-between flex-1">
                        <div>
                          <p
                            className="truncate text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                            <span className="font-semibold text-gray-500 uppercase">{ext}</span>
                            <span>•</span>
                            <span>{formatBytes(file.size)}</span>
                            {file.createdAt && (
                              <>
                                <span>•</span>
                                <span>{formatDate(file.createdAt)}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="mt-3.5 flex items-center gap-2 pt-2 border-t border-gray-100">
                          {file.url && (
                            <button
                              type="button"
                              onClick={() => setPreviewFile(file)}
                              className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-medium text-gray-700 hover:bg-slate-50 transition cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-gray-500" />
                              <span>Preview</span>
                            </button>
                          )}

                          {resolvedDownload && (
                            <a
                              href={resolvedDownload}
                              download={file.name}
                              title="Download file"
                              className="inline-flex items-center justify-center rounded-lg bg-blue-600 p-1.5 text-white hover:bg-blue-700 shadow-xs transition"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="overflow-hidden rounded-xl border border-gray-200 divide-y divide-gray-100">
                {filteredFiles.map((file) => {
                  const ext = (file.extension || file.name.split(".").pop() || "").toLowerCase();
                  const resolvedDownload =
                    file.downloadUrl ||
                    (file.url?.includes("/upload/")
                      ? file.url.replace("/upload/", "/upload/fl_attachment/")
                      : file.url);

                  return (
                    <div
                      key={file._id || file.id}
                      className="group flex flex-wrap items-center justify-between p-3 sm:px-4 sm:py-3 transition hover:bg-blue-50/30 gap-3"
                    >
                      <div
                        onClick={() => file.url && setPreviewFile(file)}
                        className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-slate-50 border border-gray-100 scale-90">
                          {RenderFileIcon(ext)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                            <span className="font-mono text-[10px] font-bold uppercase text-gray-500">
                              .{ext}
                            </span>
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

                      {/* Row Action Buttons */}
                      <div className="flex items-center gap-2">
                        {file.url && (
                          <button
                            type="button"
                            onClick={() => setPreviewFile(file)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-gray-500" />
                            <span>Preview</span>
                          </button>
                        )}
                        {resolvedDownload && (
                          <a
                            href={resolvedDownload}
                            download={file.name}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Empty / Search Filter Not Found */
          <div className="flex min-h-[240px] flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 mb-3">
              <FolderOpen className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">
              {searchQuery ? "No matching files found" : "This shared folder is empty"}
            </h3>
            <p className="mt-1 max-w-sm text-xs text-gray-400">
              {searchQuery
                ? `No items in this folder match your search term "${searchQuery}".`
                : "No files or subfolders have been added to this shared folder yet."}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-slate-200 transition cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
