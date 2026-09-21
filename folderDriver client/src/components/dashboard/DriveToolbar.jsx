import React from "react";
import { LayoutGrid, List, ArrowUpDown } from "lucide-react";

export default function DriveToolbar({
  filterType,
  setFilterType,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) {
  const filterChips = [
    { id: "all", label: "All" },
    { id: "folders", label: "Folders" },
    { id: "documents", label: "Documents" },
    { id: "spreadsheets", label: "Sheets" },
    { id: "images", label: "Images" },
    { id: "pdfs", label: "PDFs" },
    { id: "media", label: "Media" },
  ];

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-2.5 sm:px-6">
      {/* Left: Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
        {filterChips.map((chip) => {
          const isSelected = filterType === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilterType(chip.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                isSelected
                  ? "bg-blue-100 text-blue-800"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Right: Sort & View Controls */}
      <div className="flex items-center gap-2">
        {/* Sort selector */}
        <div className="flex items-center rounded-lg border border-gray-200 bg-white text-xs">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-l-lg border-0 bg-transparent py-1.5 pl-2.5 pr-1 text-xs font-medium text-gray-700 outline-none focus:ring-0"
          >
            <option value="name">Name</option>
            <option value="updatedAt">Last modified</option>
            <option value="size">Size</option>
          </select>

          <button
            type="button"
            onClick={toggleSortOrder}
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
            className="flex items-center px-1.5 text-gray-500 hover:text-gray-900"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            title="List view"
            className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
              viewMode === "list"
                ? "bg-gray-100 text-blue-600"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <List className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setViewMode("grid")}
            title="Grid view"
            className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
              viewMode === "grid"
                ? "bg-gray-100 text-blue-600"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
