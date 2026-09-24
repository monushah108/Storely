import React from "react";
import { FolderOpen, Search, UploadCloud } from "lucide-react";

export default function DriveEmptyState({
  isSearch,
  searchQuery,
  onClearSearch,
  onUploadClick,
}) {
  if (isSearch) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400">
          <Search className="h-7 w-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-800 dark:text-slate-100">
          No matching items
        </h3>
        <p className="mt-1 max-w-sm text-xs text-gray-500 dark:text-slate-400">
          No files or folders matched &ldquo;{searchQuery}&rdquo;. Try another
          search term.
        </p>
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-4 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400 dark:hover:bg-blue-900/60"
        >
          Clear search
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <FolderOpen className="h-10 w-10" />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
        A place for all your files
      </h3>

      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-gray-500 dark:text-slate-400">
        Drag and drop files here, or use the &ldquo;New&rdquo; button to upload
        documents, photos, and folders.
      </p>

      <button
        type="button"
        onClick={onUploadClick}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
      >
        <UploadCloud className="h-4 w-4" />
        <span>Upload files</span>
      </button>
    </div>
  );
}
