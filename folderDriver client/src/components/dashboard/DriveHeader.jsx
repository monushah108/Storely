import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cloud, Menu, Search, X, RefreshCw, Info, ArrowLeft } from "lucide-react";
import Profile from "../ui/profile";
import ThemeToggle from "../common/ThemeToggle";

export default function DriveHeader({
  searchQuery,
  setSearchQuery,
  onToggleSidebar,
  onRefresh,
  isRefreshing,
  showDetails,
  onToggleDetails,
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileInputRef = useRef(null);

  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full shrink-0 items-center justify-between border-b border-gray-200 bg-white px-2.5 sm:px-4 md:px-6 dark:border-slate-800 dark:bg-slate-900 transition-colors">
      {/* Mobile Search Active Mode */}
      {mobileSearchOpen ? (
        <div className="flex w-full items-center gap-2 sm:hidden animate-in fade-in duration-150">
          <button
            type="button"
            onClick={() => setMobileSearchOpen(false)}
            aria-label="Close search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="relative flex flex-1 items-center">
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in Drive..."
              className="w-full rounded-full border border-gray-200 bg-[#edf2fc] py-2 pl-3.5 pr-9 text-sm text-gray-800 placeholder:text-gray-500 focus:border-blue-400 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
                aria-label="Clear search text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Left: Brand & Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-4 md:w-64">
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Toggle navigation menu"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 outline-none transition hover:opacity-90"
            >
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Cloud className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-800 dark:text-white">
                  Storely
                </span>
                <span className="hidden text-xs sm:text-sm font-medium text-gray-500 sm:inline dark:text-slate-400">
                  Drive
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop/Tablet Search Bar */}
          <div className="mx-2 hidden max-w-2xl flex-1 items-center sm:flex md:mx-4">
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500 dark:text-slate-400">
                <Search className="h-4 w-4" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in Drive"
                className="w-full rounded-full border border-transparent bg-[#edf2fc] py-2.5 pl-10 pr-10 text-sm text-gray-800 transition-all placeholder:text-gray-500 hover:bg-[#e4ebf8] focus:border-gray-200 focus:bg-white focus:shadow-md focus:outline-none dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:bg-slate-750 dark:focus:bg-slate-800 dark:focus:border-slate-700"
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
            {/* Mobile Search Icon Button */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Search"
              className={`relative flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 sm:hidden ${
                searchQuery ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <Search className="h-4 w-4" />
              {searchQuery && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
              )}
            </button>

            {/* Desktop Refresh Button */}
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

            {/* Details Drawer Toggle */}
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

            {/* Theme Toggle */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>

            {/* Profile Dropdown */}
            <div className="ml-0.5 sm:ml-1">
              <Profile />
            </div>
          </div>
        </>
      )}
    </header>
  );
}
