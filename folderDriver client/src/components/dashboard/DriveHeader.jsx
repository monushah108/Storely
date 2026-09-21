import React from "react";
import { Link } from "react-router-dom";
import { Cloud, Menu, Search, X, RefreshCw, Info } from "lucide-react";
import Profile from "../ui/profile";

export default function DriveHeader({
  searchQuery,
  setSearchQuery,
  onToggleSidebar,
  onRefresh,
  isRefreshing,
  showDetails,
  onToggleDetails,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-4 md:px-6">
      {/* Left: Brand & Mobile Menu */}
      <div className="flex items-center gap-2 sm:gap-4 md:w-64">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 outline-none transition hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <Cloud className="h-5 w-5" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold tracking-tight text-gray-800">
              Storely
            </span>
            <span className="hidden text-sm font-medium text-gray-500 sm:inline">
              Drive
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Google Drive Search Bar */}
      <div className="mx-2 flex max-w-2xl flex-1 items-center">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
            <Search className="h-4 w-4" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in Drive"
            className="w-full rounded-full border border-transparent bg-[#edf2fc] py-2.5 pl-10 pr-10 text-sm text-gray-800 transition-all placeholder:text-gray-500 hover:bg-[#e4ebf8] focus:border-gray-200 focus:bg-white focus:shadow-md focus:outline-none"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Quick actions & Profile */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={onRefresh}
          title="Refresh"
          className="hidden h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 sm:flex"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin text-blue-600" : ""}`}
          />
        </button>

        <button
          type="button"
          onClick={onToggleDetails}
          title={showDetails ? "Hide details" : "View details"}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
            showDetails
              ? "bg-blue-100 text-blue-700"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          }`}
        >
          <Info className="h-4 w-4" />
        </button>

        <div className="ml-1">
          <Profile />
        </div>
      </div>
    </header>
  );
}
