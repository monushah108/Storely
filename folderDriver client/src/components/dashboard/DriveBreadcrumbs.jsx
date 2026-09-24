import React from "react";
import { ChevronRight, ArrowLeft, HardDrive, Folder } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function DriveBreadcrumbs({ currentFolder, isRoot }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (!currentFolder?.parentDirId) {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard/dirItem/${currentFolder.parentDirId}`);
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm overflow-x-auto no-scrollbar py-0.5 max-w-full">
      {!isRoot && (
        <button
          type="button"
          onClick={handleBack}
          title="Go back"
          aria-label="Go back"
          className="mr-0.5 flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      )}

      {/* Root "My Drive" */}
      <Link
        to="/dashboard"
        className={`flex shrink-0 items-center gap-1 sm:gap-1.5 rounded-lg px-1.5 py-1 font-semibold transition ${
          isRoot
            ? "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        }`}
      >
        <HardDrive className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-xs sm:text-sm md:text-base">My Drive</span>
      </Link>

      {/* Subfolder */}
      {!isRoot && currentFolder?.name && (
        <>
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-gray-400 dark:text-slate-500" />
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 rounded-lg bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 font-medium text-gray-800 dark:bg-slate-800 dark:text-slate-200">
            <Folder className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-blue-500 dark:text-blue-400" />
            <span className="max-w-[120px] xs:max-w-[160px] truncate sm:max-w-xs md:max-w-md">
              {currentFolder.name}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
