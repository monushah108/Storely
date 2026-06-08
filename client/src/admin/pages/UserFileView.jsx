import React from "react";

export default function UserFileView() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {message && (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-red-700">
            {message}
          </div>
        )}

        {DriveData.length > 0 ? (
          <DirectoryList
            DriveData={DriveData}
            RenameData={RenameData}
            deleteData={deleteData}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No files or directories found.
          </div>
        )}
      </main>
    </div>
  );
}
