import React, { useState, useRef, useEffect } from "react";
import {
  HardDrive,
  Users,
  Clock,
  Star,
  Trash2,
  Plus,
  FolderPlus,
  Upload,
  Cloud,
  X,
} from "lucide-react";

export default function DriveSidebar({
  activeTab,
  setActiveTab,
  onOpenCreateFolder,
  onTriggerFileUpload,
  userData,
  mobileOpen,
  onCloseMobile,
}) {
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const newMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (newMenuRef.current && !newMenuRef.current.contains(e.target)) {
        setNewMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    );
    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  };

  const storagePercentage = Math.min(
    userData?.storage?.percentage || 0,
    100,
  );

  const navItems = [
    { id: "my-drive", label: "My Drive", icon: HardDrive },
    { id: "shared", label: "Shared with me", icon: Users },
    { id: "recent", label: "Recent", icon: Clock },
    { id: "starred", label: "Starred", icon: Star },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 sm:w-72 max-w-[85vw] flex-col justify-between overflow-y-auto border-r border-gray-200 bg-[#f8fafd] p-3 sm:p-3.5 shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:w-64 lg:max-w-none lg:shadow-none lg:translate-x-0 dark:border-slate-800 dark:bg-slate-950 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-4">
          {/* Mobile Header with Close */}
          <div className="flex items-center justify-between px-2 pt-1 lg:hidden">
            <span className="text-base font-bold text-gray-800 dark:text-white">Navigation</span>
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Google Drive "+ New" Button */}
          <div className="relative px-1 pt-1" ref={newMenuRef}>
            <button
              type="button"
              onClick={() => setNewMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:shadow-md active:scale-98 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-850 cursor-pointer"
            >
              <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>New</span>
            </button>

            {/* "+ New" Dropdown */}
            {newMenuOpen && (
              <div className="absolute left-1 top-full z-50 mt-2 w-52 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    setNewMenuOpen(false);
                    onOpenCreateFolder();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400 cursor-pointer"
                >
                  <FolderPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>New folder</span>
                </button>

                <div className="my-1 border-t border-gray-100 dark:border-slate-800" />

                <button
                  type="button"
                  onClick={() => {
                    setNewMenuOpen(false);
                    onTriggerFileUpload();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400 cursor-pointer"
                >
                  <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>File upload</span>
                </button>
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex w-full items-center gap-3.5 rounded-full px-4 py-2.5 text-left text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? "bg-[#c2e7ff] text-[#001d35] font-semibold dark:bg-blue-600/20 dark:text-blue-400"
                      : "text-gray-700 hover:bg-gray-200/70 dark:text-slate-300 dark:hover:bg-slate-800/70"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-blue-800 dark:text-blue-400" : "text-gray-500 dark:text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Storage Widget */}
        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
          <div className="mb-2 flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-800 dark:text-slate-200">Storage</span>
            </div>
            <span className="font-semibold text-gray-700 dark:text-slate-300">
              {storagePercentage.toFixed(0)}%
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                storagePercentage >= 90
                  ? "bg-red-500"
                  : storagePercentage >= 70
                    ? "bg-amber-500"
                    : "bg-blue-600"
              }`}
              style={{ width: `${storagePercentage}%` }}
            />
          </div>

          <div className="mt-2 text-[11px] text-gray-500 dark:text-slate-400">
            {userData?.storage
              ? `${formatBytes(userData.storage.used)} of ${formatBytes(
                  userData.storage.limit,
                )} used`
              : "0 MB of 1 GB used"}
          </div>
        </div>
      </aside>
    </>
  );
}
