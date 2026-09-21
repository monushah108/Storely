import React from "react";
import { Loader2, AlertCircle } from "lucide-react";
import FolderGrid from "./FolderGrid";
import FileGridView from "./FileGridView";
import FileListView from "./FileListView";
import DriveEmptyState from "./DriveEmptyState";

export default function DashboardContent({
  isLoading,
  isError,
  error,
  refetch,
  processedItems = [],
  folders = [],
  files = [],
  searchQuery,
  onClearSearch,
  onUploadClick,
  viewMode,
  selectedId,
  onSelect,
  onOpenItem,
  onContextMenu,
  onMenuClick,
  onShare,
  deletingId,
}) {
  if (isLoading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="text-xs font-medium text-gray-500">
          Loading files...
        </span>
      </div>
    );
  }

  if (isError && error?.status !== 401) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
        <div className="mb-3 rounded-full bg-red-100 p-3 text-red-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">
          Failed to load files
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={refetch}
          className="mt-3 rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (processedItems.length === 0) {
    return (
      <DriveEmptyState
        isSearch={!!searchQuery?.trim()}
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
        onUploadClick={onUploadClick}
      />
    );
  }

  if (viewMode === "grid") {
    return (
      <>
        <FolderGrid
          folders={folders}
          selectedId={selectedId}
          onSelect={onSelect}
          onOpenFolder={(id) => onOpenItem(id, null)}
          onContextMenu={onContextMenu}
          onMenuClick={onMenuClick}
          onShare={onShare}
          deletingId={deletingId}
        />
        <FileGridView
          files={files}
          selectedId={selectedId}
          onSelect={onSelect}
          onOpenFile={(id, ext) => onOpenItem(id, ext)}
          onContextMenu={onContextMenu}
          onMenuClick={onMenuClick}
          deletingId={deletingId}
        />
      </>
    );
  }

  return (
    <FileListView
      items={processedItems}
      selectedId={selectedId}
      onSelect={onSelect}
      onOpenItem={onOpenItem}
      onContextMenu={onContextMenu}
      onMenuClick={onMenuClick}
      onShare={onShare}
      deletingId={deletingId}
    />
  );
}
