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
    <div className="flex items-center gap-2 text-sm">
      {!isRoot && (
        <button
          type="button"
          onClick={handleBack}
          title="Go back"
          className="mr-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}

      {/* Root "My Drive" */}
      <Link
        to="/dashboard"
        className={`flex items-center gap-1.5 rounded-lg px-2 py-1 font-semibold transition ${
          isRoot
            ? "text-gray-900 hover:bg-gray-100"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        }`}
      >
        <HardDrive className="h-4 w-4 text-blue-600" />
        <span className="text-base">My Drive</span>
      </Link>

      {/* Subfolder */}
      {!isRoot && currentFolder?.name && (
        <>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 font-medium text-gray-800">
            <Folder className="h-4 w-4 text-blue-500" />
            <span className="max-w-[180px] truncate sm:max-w-xs md:max-w-md">
              {currentFolder.name}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
