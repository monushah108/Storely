import React from "react";
import { LayoutGrid, List, ArrowUpDown } from "lucide-react";

export default function DriveToolbar({
  itemsCount,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) {
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="flex items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 py-2 sm:px-6 sm:py-2.5 dark:border-slate-800 dark:bg-slate-900 transition-colors">
      {/* Left: Optional Item Count Badge / Label */}
      <div className="flex items-center">
        {itemsCount !== undefined ? (
          <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
            {itemsCount} {itemsCount === 1 ? "item" : "items"}
          </span>
        ) : (
          <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Files</span>
        )}
      </div>

      {/* Right: Sort & View Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Sort selector */}
        <div className="flex items-center rounded-lg border border-gray-200 bg-white text-xs shadow-2xs dark:border-slate-700 dark:bg-slate-800">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-l-lg border-0 bg-transparent py-1.5 pl-2 sm:pl-2.5 pr-1 text-xs font-medium text-gray-700 outline-none focus:ring-0 cursor-pointer dark:text-slate-200"
          >
            <option value="name" className="dark:bg-slate-900">Name</option>
            <option value="updatedAt" className="dark:bg-slate-900">Last modified</option>
            <option value="size" className="dark:bg-slate-900">Size</option>
          </select>

          <button
            type="button"
            onClick={toggleSortOrder}
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
            aria-label={sortOrder === "asc" ? "Sort ascending" : "Sort descending"}
            className="flex h-7 items-center px-1.5 text-gray-500 transition hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100 cursor-pointer"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            title="List view"
            aria-label="List view"
            className={`flex h-7 w-7 items-center justify-center rounded-md transition cursor-pointer ${
              viewMode === "list"
                ? "bg-gray-100 text-blue-600 font-semibold dark:bg-slate-700 dark:text-blue-400"
                : "text-gray-400 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <List className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setViewMode("grid")}
            title="Grid view"
            aria-label="Grid view"
            className={`flex h-7 w-7 items-center justify-center rounded-md transition cursor-pointer ${
              viewMode === "grid"
                ? "bg-gray-100 text-blue-600 font-semibold dark:bg-slate-700 dark:text-blue-400"
                : "text-gray-400 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
